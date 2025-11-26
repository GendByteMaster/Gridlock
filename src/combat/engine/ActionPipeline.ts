import { Unit, Skill, CombatLogEvent, CellPos } from '../types';
import { executeSkill, SkillExecutionContext, SkillExecutionResult } from '../skills/SkillResolver';
import { processHitEffects } from '../effects/TurnEffects';
import { recalculateUnit } from '../units/UnitCalc';
import { resetInitiative, applyActionDelay } from './Initiative';

/**
 * Enhanced Action Pipeline
 * 
 * Orchestrates the execution of actions with pre/post triggers,
 * chain reactions, and comprehensive logging.
 */

export interface ActionPipelineContext {
    source: Unit;
    target?: Unit;
    position?: CellPos;
    skill: Skill;
    grid: any[][];
    allUnits: Unit[];

    // Pipeline state
    logs: CombatLogEvent[];
    chainDepth: number;
    maxChainDepth: number;
}

export interface ActionPipelineResult {
    success: boolean;
    logs: CombatLogEvent[];
    affectedUnits: Unit[];
    triggeredActions: ActionPipelineContext[];
    error?: string;
}

/**
 * Execute an action through the complete pipeline
 * 
 * @param context - Action context
 * @returns Pipeline result
 */
export const executeActionPipeline = (context: ActionPipelineContext): ActionPipelineResult => {
    const { source, target, skill, allUnits, logs, chainDepth, maxChainDepth } = context;
    const affectedUnits: Set<Unit> = new Set([source]);
    const triggeredActions: ActionPipelineContext[] = [];

    // Prevent infinite chain reactions
    if (chainDepth >= maxChainDepth) {
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `Chain depth limit reached (${maxChainDepth})`
        });
        return {
            success: false,
            logs,
            affectedUnits: Array.from(affectedUnits),
            triggeredActions,
            error: 'Chain depth limit reached'
        };
    }

    // ========================================================================
    // PHASE 1: PRE-ACTION TRIGGERS
    // ========================================================================

    const preActionResult = executePreActionTriggers(context);
    logs.push(...preActionResult.logs);

    // Check if action was cancelled by pre-action trigger
    if (preActionResult.cancelled) {
        return {
            success: false,
            logs,
            affectedUnits: Array.from(affectedUnits),
            triggeredActions,
            error: 'Action cancelled by pre-action trigger'
        };
    }

    // ========================================================================
    // PHASE 2: EXECUTE SKILL
    // ========================================================================

    const skillContext: SkillExecutionContext = {
        source,
        target,
        position: context.position,
        skill,
        grid: context.grid,
        allUnits
    };

    const skillResult = executeSkill(skillContext);
    logs.push(...skillResult.logs);

    if (!skillResult.success) {
        return {
            success: false,
            logs,
            affectedUnits: Array.from(affectedUnits),
            triggeredActions,
            error: skillResult.error
        };
    }

    // Track affected units
    skillResult.affectedUnits.forEach(u => affectedUnits.add(u));

    // ========================================================================
    // PHASE 3: ON-HIT TRIGGERS
    // ========================================================================

    if (target && skill.tags?.includes('offensive')) {
        const hitResult = processHitEffects(source, target);
        logs.push(...hitResult.logs);
        affectedUnits.add(hitResult.attacker);
        affectedUnits.add(hitResult.target);
    }

    // ========================================================================
    // PHASE 4: POST-ACTION TRIGGERS
    // ========================================================================

    const postActionResult = executePostActionTriggers(context, skillResult);
    logs.push(...postActionResult.logs);
    postActionResult.affectedUnits.forEach(u => affectedUnits.add(u));

    // ========================================================================
    // PHASE 5: CHAIN REACTIONS
    // ========================================================================

    const chainResult = processChainReactions(context, skillResult);
    logs.push(...chainResult.logs);
    chainResult.triggeredActions.forEach(action => triggeredActions.push(action));

    // Execute triggered actions recursively
    chainResult.triggeredActions.forEach(triggeredAction => {
        const chainContext: ActionPipelineContext = {
            ...triggeredAction,
            chainDepth: chainDepth + 1,
            maxChainDepth,
            logs: []
        };

        const chainPipelineResult = executeActionPipeline(chainContext);
        logs.push(...chainPipelineResult.logs);
        chainPipelineResult.affectedUnits.forEach(u => affectedUnits.add(u));
    });

    // ========================================================================
    // PHASE 6: RECALCULATE STATS
    // ========================================================================

    affectedUnits.forEach(unit => {
        const recalculated = recalculateUnit(unit);
        Object.assign(unit, recalculated);
    });

    // ========================================================================
    // PHASE 7: UPDATE INITIATIVE
    // ========================================================================

    if (skill.actionDelay) {
        applyActionDelay(source, skill.actionDelay);
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `${skill.name} added ${skill.actionDelay} initiative delay`
        });
    } else {
        resetInitiative(source);
    }

    return {
        success: true,
        logs,
        affectedUnits: Array.from(affectedUnits),
        triggeredActions
    };
};

/**
 * Execute pre-action triggers
 * These run before the action executes and can cancel the action
 * 
 * @param context - Action context
 * @returns Trigger result
 */
const executePreActionTriggers = (context: ActionPipelineContext): {
    logs: CombatLogEvent[];
    cancelled: boolean;
} => {
    const { source, skill } = context;
    const logs: CombatLogEvent[] = [];
    let cancelled = false;

    // Check for silence (prevents skill use)
    if (source.runtime.isSilenced && skill.tags?.includes('offensive')) {
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `${source.id} is silenced and cannot use ${skill.name}`
        });
        cancelled = true;
        return { logs, cancelled };
    }

    // Process onBeforeAction status triggers
    source.statuses.forEach(status => {
        // Example: Status that prevents actions
        if (status.statusId === 'paralyzed') {
            logs.push({
                type: 'skill_use',
                timestamp: Date.now(),
                sourceId: source.id,
                text: `${source.id} is paralyzed and cannot act`
            });
            cancelled = true;
        }
    });

    // Process module pre-action effects
    source.modules?.forEach(module => {
        if (module.passiveEffect) {
            // Modules can modify the action before it executes
            module.passiveEffect(source);
        }
    });

    logs.push({
        type: 'skill_use',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `Pre-action triggers processed for ${skill.name}`
    });

    return { logs, cancelled };
};

/**
 * Execute post-action triggers
 * These run after the action executes
 * 
 * @param context - Action context
 * @param skillResult - Result of skill execution
 * @returns Trigger result
 */
const executePostActionTriggers = (
    context: ActionPipelineContext,
    skillResult: SkillExecutionResult
): {
    logs: CombatLogEvent[];
    affectedUnits: Unit[];
} => {
    const { source, skill } = context;
    const logs: CombatLogEvent[] = [];
    const affectedUnits: Unit[] = [source];

    // Process onAfterAction status triggers
    source.statuses.forEach(status => {
        // Example: Status that triggers after actions
        if (status.statusId === 'adrenaline') {
            // Gain speed after acting
            source.stats.spd += 5;
            logs.push({
                type: 'status_apply',
                timestamp: Date.now(),
                sourceId: source.id,
                text: `Adrenaline increased ${source.id}'s speed`
            });
        }
    });

    // Increment combo counter if offensive skill
    if (skill.tags?.includes('offensive')) {
        source.runtime.comboCount++;
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `Combo count: ${source.runtime.comboCount}`
        });
    } else {
        // Reset combo if non-offensive action
        source.runtime.comboCount = 0;
    }

    // Process lifesteal
    if ((source.stats.lifesteal ?? 0) > 0 && skill.tags?.includes('offensive')) {
        const totalDamage = skillResult.logs
            .filter(log => log.type === 'damage' && log.sourceId === source.id)
            .reduce((sum, log) => sum + (log.value || 0), 0);

        const healAmount = Math.floor(totalDamage * (source.stats.lifesteal ?? 0));
        if (healAmount > 0) {
            source.stats.hp = Math.min(source.base.maxHp, source.stats.hp + healAmount);
            logs.push({
                type: 'heal',
                timestamp: Date.now(),
                sourceId: source.id,
                targetId: source.id,
                value: healAmount,
                text: `Lifesteal healed ${source.id} for ${healAmount} HP`
            });
        }
    }

    logs.push({
        type: 'skill_use',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `Post-action triggers processed for ${skill.name}`
    });

    return { logs, affectedUnits };
};

/**
 * Process chain reactions
 * Determines if the action triggers any follow-up actions
 * 
 * @param context - Action context
 * @param skillResult - Result of skill execution
 * @returns Chain reaction result
 */
const processChainReactions = (
    context: ActionPipelineContext,
    skillResult: SkillExecutionResult
): {
    logs: CombatLogEvent[];
    triggeredActions: ActionPipelineContext[];
} => {
    const { source, skill: _skill, allUnits, grid: _grid } = context;
    const logs: CombatLogEvent[] = [];
    const triggeredActions: ActionPipelineContext[] = [];

    // Check for kill triggers (execute on kill)
    const killLogs = skillResult.logs.filter(log => log.type === 'kill');
    if (killLogs.length > 0) {
        // Example: Reset cooldowns on kill
        source.statuses.forEach(status => {
            if (status.statusId === 'hunter') {
                Object.keys(source.runtime.cooldowns).forEach(skillId => {
                    source.runtime.cooldowns[skillId] = Math.max(0, source.runtime.cooldowns[skillId] - 1);
                });
                logs.push({
                    type: 'skill_use',
                    timestamp: Date.now(),
                    sourceId: source.id,
                    text: `Hunter reduced cooldowns on kill`
                });
            }
        });
    }

    // Check for critical hit triggers
    const critLogs = skillResult.logs.filter(log => log.text?.includes('CRIT'));
    if (critLogs.length > 0) {
        // Example: Trigger bonus action on crit
        source.statuses.forEach(status => {
            if (status.statusId === 'momentum') {
                source.runtime.actionPoints++;
                logs.push({
                    type: 'skill_use',
                    timestamp: Date.now(),
                    sourceId: source.id,
                    text: `Momentum granted bonus action on crit`
                });
            }
        });
    }

    // Check for combo triggers
    if (source.runtime.comboCount >= 3) {
        // Example: Trigger special effect at 3+ combo
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `Combo threshold reached (${source.runtime.comboCount})`
        });
    }

    // Check for reaction triggers from other units
    allUnits.forEach(unit => {
        if (unit.id === source.id) return;

        unit.statuses.forEach(status => {
            // Example: Counter-attack on being hit
            if (status.statusId === 'counter_stance' && skillResult.affectedUnits.includes(unit)) {
                // Would trigger a counter-attack action
                logs.push({
                    type: 'skill_use',
                    timestamp: Date.now(),
                    sourceId: unit.id,
                    text: `${unit.id} triggered counter-attack`
                });

                // Note: Actual counter-attack would be added to triggeredActions
                // For now, just log it
            }
        });
    });

    return { logs, triggeredActions };
};

/**
 * Create a default action pipeline context
 * 
 * @param source - Source unit
 * @param skill - Skill to execute
 * @param target - Target unit (optional)
 * @param position - Target position (optional)
 * @param grid - Game grid
 * @param allUnits - All units in combat
 * @returns Pipeline context
 */
export const createActionContext = (
    source: Unit,
    skill: Skill,
    target: Unit | undefined,
    position: CellPos | undefined,
    grid: any[][],
    allUnits: Unit[]
): ActionPipelineContext => {
    return {
        source,
        target,
        position,
        skill,
        grid,
        allUnits,
        logs: [],
        chainDepth: 0,
        maxChainDepth: 5 // Prevent infinite loops
    };
};
