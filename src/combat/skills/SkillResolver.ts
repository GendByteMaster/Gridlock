import { Unit, Skill, CombatLogEvent, CellPos } from '../types';
import { executeOp, OpContext } from './operations';
import { getSkillDefinition } from './SkillRegistry';

/**
 * Skill Resolver
 * 
 * Executes skills by processing their operation chains.
 * Handles targeting, validation, and execution of all SkillOps.
 */

export interface SkillExecutionContext {
    source: Unit;
    target?: Unit;
    position?: CellPos;
    skill: Skill;
    grid: any[][];
    allUnits: Unit[];
}

export interface SkillExecutionResult {
    success: boolean;
    logs: CombatLogEvent[];
    affectedUnits: Unit[];
    error?: string;
}

/**
 * Execute a skill
 * 
 * @param context - Execution context with source, target, skill, etc.
 * @returns Execution result with logs and affected units
 */
export const executeSkill = (context: SkillExecutionContext): SkillExecutionResult => {
    const { source, target, position, skill, grid, allUnits } = context;
    const logs: CombatLogEvent[] = [];
    const affectedUnits: Set<Unit> = new Set();

    // Validate skill can be executed
    const validation = validateSkillExecution(context);
    if (!validation.valid) {
        return {
            success: false,
            logs: [],
            affectedUnits: [],
            error: validation.error
        };
    }

    // Log skill use
    logs.push({
        type: 'skill_use',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target?.id,
        text: `${source.id} used ${skill.name}`
    });

    // Create operation context
    const opContext: OpContext = {
        source,
        target,
        position,
        grid,
        allUnits,
        log: (event: CombatLogEvent) => logs.push(event)
    };

    // Execute each operation in sequence
    skill.ops.forEach(op => {
        try {
            executeOp(op, opContext);

            // Track affected units
            if (opContext.target) affectedUnits.add(opContext.target);
            if (opContext.targets) {
                opContext.targets.forEach(u => affectedUnits.add(u));
            }
        } catch (error) {
            logs.push({
                type: 'skill_use',
                timestamp: Date.now(),
                sourceId: source.id,
                text: `Error executing ${op.type}: ${error}`
            });
        }
    });

    // Apply cooldown
    if (skill.cooldown > 0) {
        source.runtime.cooldowns[skill.id] = skill.cooldown;
    }

    // Apply action delay if specified
    if (skill.actionDelay) {
        // This would be handled by the initiative system
        // For now, just log it
        logs.push({
            type: 'skill_use',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `${skill.name} added ${skill.actionDelay} initiative delay`
        });
    }

    return {
        success: true,
        logs,
        affectedUnits: Array.from(affectedUnits)
    };
};

/**
 * Validate that a skill can be executed
 * 
 * @param context - Execution context
 * @returns Validation result
 */
export const validateSkillExecution = (context: SkillExecutionContext): { valid: boolean; error?: string } => {
    const { source, target: _target, position: _position, skill } = context;

    // Check if skill exists
    if (!skill) {
        return { valid: false, error: 'Skill not found' };
    }

    // Check if source can act
    if (source.runtime.isStunned || source.runtime.isFrozen || source.runtime.isSleeping) {
        return { valid: false, error: 'Unit cannot act' };
    }

    // Check if silenced (can't use skills)
    if (source.runtime.isSilenced && skill.tags?.includes('offensive')) {
        return { valid: false, error: 'Unit is silenced' };
    }

    // Check cooldown
    const remainingCooldown = source.runtime.cooldowns[skill.id] || 0;
    if (remainingCooldown > 0) {
        return { valid: false, error: `Skill on cooldown (${remainingCooldown} turns remaining)` };
    }

    // Check action points
    if (source.runtime.actionPoints < skill.cost) {
        return { valid: false, error: 'Not enough action points' };
    }

    // Check targeting
    const targetingValidation = validateTargeting(context);
    if (!targetingValidation.valid) {
        return targetingValidation;
    }

    return { valid: true };
};

/**
 * Validate skill targeting
 * 
 * @param context - Execution context
 * @returns Validation result
 */
export const validateTargeting = (context: SkillExecutionContext): { valid: boolean; error?: string } => {
    const { source, target, position, skill } = context;
    const targeting = skill.targeting;

    // Check if target is required
    if (targeting.type === 'single' && !target && !position) {
        return { valid: false, error: 'Target required' };
    }

    // Check range
    if (target) {
        const distance = Math.abs(source.pos.x - target.pos.x) + Math.abs(source.pos.y - target.pos.y);
        if (distance > targeting.range) {
            return { valid: false, error: `Target out of range (${distance} > ${targeting.range})` };
        }
    } else if (position) {
        const distance = Math.abs(source.pos.x - position.x) + Math.abs(source.pos.y - position.y);
        if (distance > targeting.range) {
            return { valid: false, error: `Position out of range (${distance} > ${targeting.range})` };
        }
    }

    // Check target filter
    if (target) {
        const filterValid = validateTargetFilter(source, target, targeting.filter);
        if (!filterValid) {
            return { valid: false, error: 'Invalid target for this skill' };
        }
    }

    return { valid: true };
};

/**
 * Validate target against filter
 * 
 * @param source - Source unit
 * @param target - Target unit
 * @param filter - Target filter
 * @returns True if target is valid
 */
export const validateTargetFilter = (
    source: Unit,
    target: Unit,
    filter: 'any' | 'ally' | 'enemy' | 'empty' | 'occupied'
): boolean => {
    switch (filter) {
        case 'any':
            return true;
        case 'ally':
            return source.owner === target.owner;
        case 'enemy':
            return source.owner !== target.owner;
        case 'occupied':
            return true; // Target exists, so it's occupied
        case 'empty':
            return false; // Target exists, so it's not empty
        default:
            return false;
    }
};

/**
 * Get valid targets for a skill
 * 
 * @param source - Source unit
 * @param skill - Skill to get targets for
 * @param allUnits - All units in combat
 * @returns Array of valid target units
 */
export const getValidTargets = (source: Unit, skill: Skill, allUnits: Unit[]): Unit[] => {
    const targeting = skill.targeting;
    const validTargets: Unit[] = [];

    allUnits.forEach(unit => {
        // Check range
        const distance = Math.abs(source.pos.x - unit.pos.x) + Math.abs(source.pos.y - unit.pos.y);
        if (distance > targeting.range) return;

        // Check filter
        if (!validateTargetFilter(source, unit, targeting.filter)) return;

        // Check if can target self
        if (unit.id === source.id && !targeting.canTargetSelf) return;

        validTargets.push(unit);
    });

    return validTargets;
};

/**
 * Get valid positions for a skill
 * 
 * @param source - Source unit
 * @param skill - Skill to get positions for
 * @param grid - Game grid
 * @returns Array of valid positions
 */
export const getValidPositions = (source: Unit, skill: Skill, grid: any[][]): CellPos[] => {
    const targeting = skill.targeting;
    const validPositions: CellPos[] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            // Check range
            const distance = Math.abs(source.pos.x - x) + Math.abs(source.pos.y - y);
            if (distance > targeting.range) continue;

            // Check if position is valid based on filter
            const cell = grid[y][x];
            if (targeting.filter === 'empty' && cell.isOccupied) continue;
            if (targeting.filter === 'occupied' && !cell.isOccupied) continue;

            validPositions.push({ x, y });
        }
    }

    return validPositions;
};

/**
 * Resolve a skill by ID
 * Convenience function that looks up the skill and executes it
 * 
 * @param skillId - ID of the skill to execute
 * @param source - Source unit
 * @param target - Target unit (optional)
 * @param position - Target position (optional)
 * @param grid - Game grid
 * @param allUnits - All units in combat
 * @returns Execution result
 */
export const resolveSkillById = (
    skillId: string,
    source: Unit,
    target: Unit | undefined,
    position: CellPos | undefined,
    grid: any[][],
    allUnits: Unit[]
): SkillExecutionResult => {
    const skill = getSkillDefinition(skillId);

    if (!skill) {
        return {
            success: false,
            logs: [],
            affectedUnits: [],
            error: `Skill ${skillId} not found`
        };
    }

    return executeSkill({
        source,
        target,
        position,
        skill,
        grid,
        allUnits
    });
};

/**
 * Check if a unit can use a specific skill
 * 
 * @param unit - Unit to check
 * @param skillId - Skill ID to check
 * @returns True if unit can use the skill
 */
export const canUseSkill = (unit: Unit, skillId: string): boolean => {
    const skill = getSkillDefinition(skillId);
    if (!skill) return false;

    // Check if unit has the skill
    if (!unit.skills.includes(skillId)) return false;

    // Check cooldown
    const remainingCooldown = unit.runtime.cooldowns[skillId] || 0;
    if (remainingCooldown > 0) return false;

    // Check action points
    if (unit.runtime.actionPoints < skill.cost) return false;

    // Check if can act
    if (unit.runtime.isStunned || unit.runtime.isFrozen || unit.runtime.isSleeping) return false;

    // Check if silenced
    if (unit.runtime.isSilenced && skill.tags?.includes('offensive')) return false;

    return true;
};
