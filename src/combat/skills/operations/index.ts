import {
    Unit, SkillOp, CombatLogEvent, CellPos,
    DamageOp, AoEOp, LineOp, ConeOp, ChainOp,
    ApplyStatusOp, CleanseOp, TransferOp, ConvertOp,
    HealOp, ShieldOp, ReviveOp,
    PushOp, PullOp, SwapOp,
    MoveOp, DashOp, TeleportOp, LeapOp,
    SummonOp, TransformOp,
    TriggerOp, DelayedOp, ConditionalOp,
    DamageCondition
} from '../../types';
import { calculateDamage } from '../../math/damage';
import { applyStatus, removeStatus } from '../../effects/StatusResolver';
import { calculateDistance } from '../engine/ActionContext';

/**
 * Operation Context
 * Contains all information needed to execute a skill operation
 */
export interface OpContext {
    source: Unit;
    target?: Unit;
    targets?: Unit[];
    position?: CellPos;
    grid: any[][];
    allUnits: Unit[];
    log: (event: CombatLogEvent) => void;
}

/**
 * Execute a single SkillOp
 */
export const executeOp = (op: SkillOp, context: OpContext): void => {
    switch (op.type) {
        // Movement Ops
        case 'move':
            executeMoveOp(op, context);
            break;
        case 'dash':
            executeDashOp(op, context);
            break;
        case 'teleport':
            executeTeleportOp(op, context);
            break;
        case 'leap':
            executeLeapOp(op, context);
            break;

        // Damage Ops
        case 'damage':
            executeDamageOp(op, context);
            break;
        case 'aoe':
            executeAoEOp(op, context);
            break;
        case 'line':
            executeLineOp(op, context);
            break;
        case 'cone':
            executeConeOp(op, context);
            break;
        case 'chain':
            executeChainOp(op, context);
            break;

        // Status Ops
        case 'applyStatus':
            executeApplyStatusOp(op, context);
            break;
        case 'cleanse':
            executeCleanseOp(op, context);
            break;
        case 'transfer':
            executeTransferOp(op, context);
            break;
        case 'convert':
            executeConvertOp(op, context);
            break;

        // Support Ops
        case 'heal':
            executeHealOp(op, context);
            break;
        case 'shield':
            executeShieldOp(op, context);
            break;
        case 'revive':
            executeReviveOp(op, context);
            break;

        // Displacement Ops
        case 'push':
            executePushOp(op, context);
            break;
        case 'pull':
            executePullOp(op, context);
            break;
        case 'swap':
            executeSwapOp(op, context);
            break;

        // Summon Ops
        case 'summon':
            executeSummonOp(op, context);
            break;
        case 'transform':
            executeTransformOp(op, context);
            break;

        // Trigger Ops
        case 'trigger':
            executeTriggerOp(op, context);
            break;
        case 'delayed':
            executeDelayedOp(op, context);
            break;
        case 'conditional':
            executeConditionalOp(op, context);
            break;
    }
};

// ============================================================================
// MOVEMENT OPS
// ============================================================================

const executeMoveOp = (op: MoveOp, context: OpContext): void => {
    const { source, position, log } = context;
    if (!position) return;

    const oldPos = { ...source.pos };
    source.pos = position;

    log({
        type: 'move',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `${source.id} moved from (${oldPos.x},${oldPos.y}) to (${position.x},${position.y})`
    });
};

const executeDashOp = (op: DashOp, context: OpContext): void => {
    const { source, position, log } = context;
    if (!position) return;

    const oldPos = { ...source.pos };
    source.pos = position;

    log({
        type: 'move',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `${source.id} dashed from (${oldPos.x},${oldPos.y}) to (${position.x},${position.y})`
    });
};

const executeTeleportOp = (op: TeleportOp, context: OpContext): void => {
    const { source, position, log } = context;
    if (!position) return;

    const oldPos = { ...source.pos };
    source.pos = position;

    log({
        type: 'teleport',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `${source.id} teleported from (${oldPos.x},${oldPos.y}) to (${position.x},${position.y})`
    });
};

const executeLeapOp = (op: LeapOp, context: OpContext): void => {
    const { source, position, log, allUnits } = context;
    if (!position) return;

    const oldPos = { ...source.pos };
    source.pos = position;

    log({
        type: 'move',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `${source.id} leaped from (${oldPos.x},${oldPos.y}) to (${position.x},${position.y})`
    });

    // Landing damage
    if (op.landingDamage && op.landingRadius) {
        const nearbyUnits = allUnits.filter(u => {
            if (u.id === source.id) return false;
            const dist = calculateDistance(u.pos, position);
            return dist <= (op.landingRadius || 0);
        });

        nearbyUnits.forEach(target => {
            const result = calculateDamage(source, target, op.landingDamage || 0, 'physical', true);
            target.stats.hp = Math.max(0, target.stats.hp - result.finalDamage);

            log({
                type: 'damage',
                timestamp: Date.now(),
                sourceId: source.id,
                targetId: target.id,
                value: result.finalDamage,
                text: `Landing damage: ${result.finalDamage}`
            });
        });
    }
};

// ============================================================================
// DAMAGE OPS
// ============================================================================

const executeDamageOp = (op: DamageOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    const distance = calculateDistance(source.pos, target.pos);
    const result = calculateDamage(
        source,
        target,
        op.power,
        op.damageType,
        op.isFlat,
        undefined,
        distance,
        op.modifiers || []
    );

    target.stats.hp = Math.max(0, target.stats.hp - result.finalDamage);

    log({
        type: 'damage',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        value: result.finalDamage,
        text: `${source.id} dealt ${result.finalDamage} damage to ${target.id}${result.isCrit ? ' (CRIT!)' : ''}`
    });

    if (target.stats.hp === 0) {
        log({
            type: 'kill',
            timestamp: Date.now(),
            sourceId: source.id,
            targetId: target.id,
            text: `${target.id} was defeated!`
        });
    }
};

const executeAoEOp = (op: AoEOp, context: OpContext): void => {
    // AoE ops modify the targets list for subsequent ops
    const { source, position, target, allUnits } = context;
    const center = op.center === 'source' ? source.pos : (position || target?.pos);
    if (!center) return;

    const affectedUnits = allUnits.filter(u => {
        const dist = calculateDistance(u.pos, center);
        return dist <= op.radius;
    });

    context.targets = affectedUnits;
};

const executeLineOp = (op: LineOp, context: OpContext): void => {
    const { source, position, target, allUnits } = context;
    const targetPos = position || target?.pos;
    if (!targetPos) return;

    // Get direction
    const dx = targetPos.x - source.pos.x;
    const dy = targetPos.y - source.pos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / length;
    const dirY = dy / length;

    // Find units in line
    const affectedUnits = allUnits.filter(u => {
        // Calculate if unit is in the line
        const toUnitX = u.pos.x - source.pos.x;
        const toUnitY = u.pos.y - source.pos.y;

        // Project onto direction vector
        const projection = toUnitX * dirX + toUnitY * dirY;
        if (projection < 0 || projection > op.length) return false;

        // Check perpendicular distance
        const perpDist = Math.abs(toUnitX * dirY - toUnitY * dirX);
        return perpDist <= (op.width || 0.5);
    });

    context.targets = affectedUnits;
};

const executeConeOp = (op: ConeOp, context: OpContext): void => {
    const { source, position, target, allUnits } = context;
    const targetPos = position || target?.pos;
    if (!targetPos) return;

    // Similar to line but with angle spread
    const dx = targetPos.x - source.pos.x;
    const dy = targetPos.y - source.pos.y;
    const targetAngle = Math.atan2(dy, dx);

    const affectedUnits = allUnits.filter(u => {
        const toUnitX = u.pos.x - source.pos.x;
        const toUnitY = u.pos.y - source.pos.y;
        const dist = Math.sqrt(toUnitX * toUnitX + toUnitY * toUnitY);

        if (dist > op.length) return false;

        const unitAngle = Math.atan2(toUnitY, toUnitX);
        const angleDiff = Math.abs(unitAngle - targetAngle);

        return angleDiff <= (op.angle / 2) * (Math.PI / 180);
    });

    context.targets = affectedUnits;
};

const executeChainOp = (op: ChainOp, context: OpContext): void => {
    const { source, target, allUnits, log } = context;
    if (!target) return;

    const chained: Unit[] = [target];
    let currentTarget = target;

    for (let i = 0; i < op.maxBounces; i++) {
        // Find nearest unchained target
        const candidates = allUnits.filter(u =>
            !chained.includes(u) &&
            u.id !== source.id &&
            calculateDistance(currentTarget.pos, u.pos) <= op.range
        );

        if (candidates.length === 0) break;

        // Sort by distance
        candidates.sort((a, b) => {
            const distA = calculateDistance(currentTarget.pos, a.pos);
            const distB = calculateDistance(currentTarget.pos, b.pos);
            return distA - distB;
        });

        currentTarget = candidates[0];
        chained.push(currentTarget);
    }

    context.targets = chained;

    log({
        type: 'damage',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `Chain lightning bounced ${chained.length} times`
    });
};

// ============================================================================
// STATUS OPS
// ============================================================================

const executeApplyStatusOp = (op: ApplyStatusOp, context: OpContext): void => {
    const { source, target, log } = context;
    const statusTarget = op.target === 'self' ? source : target;
    if (!statusTarget) return;

    const updatedUnit = applyStatus(
        statusTarget,
        op.statusId,
        op.duration,
        source.id,
        op.value,
        op.stacks
    );
    Object.assign(statusTarget, updatedUnit);

    log({
        type: 'status_apply',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: statusTarget.id,
        text: `Applied ${op.statusId} to ${statusTarget.id}`
    });
};

const executeCleanseOp = (op: CleanseOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    const statusesToRemove = target.statuses.filter(s => {
        if (!op.statusType) return true; // Remove all
        // Would need status definitions to check type
        return false; // Placeholder
    });

    const count = op.count || statusesToRemove.length;
    const removed = statusesToRemove.slice(0, count);

    removed.forEach(status => {
        removeStatus(target, status.id);
    });

    log({
        type: 'status_remove',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        text: `Cleansed ${removed.length} status(es) from ${target.id}`
    });
};

const executeTransferOp = (op: TransferOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    const fromUnit = op.from === 'self' ? source : target;
    const toUnit = op.to === 'self' ? source : target;

    const status = fromUnit.statuses.find(s => s.statusId === op.statusId);
    if (status) {
        removeStatus(fromUnit, status.id);
        const updatedTo = applyStatus(toUnit, status.statusId, status.duration, source.id, status.value);
        Object.assign(toUnit, updatedTo);

        log({
            type: 'status_apply',
            timestamp: Date.now(),
            sourceId: source.id,
            text: `Transferred ${op.statusId} from ${fromUnit.id} to ${toUnit.id}`
        });
    }
};

const executeConvertOp = (op: ConvertOp, context: OpContext): void => {
    const { target, log } = context;
    if (!target) return;

    // Placeholder - would need status type checking
    log({
        type: 'status_apply',
        timestamp: Date.now(),
        targetId: target.id,
        text: `Converted ${op.fromType} to ${op.toType}`
    });
};

// ============================================================================
// SUPPORT OPS
// ============================================================================

const executeHealOp = (op: HealOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    let healAmount: number;
    if (op.isFlat) {
        healAmount = op.amount;
    } else {
        healAmount = target.base.maxHp * op.amount;
    }

    const oldHp = target.stats.hp;
    target.stats.hp = Math.min(target.base.maxHp, target.stats.hp + healAmount);
    const actualHeal = target.stats.hp - oldHp;

    // Overheal creates shield
    if (op.canOverheal && healAmount > actualHeal) {
        const overheal = healAmount - actualHeal;
        target.stats.shield += overheal;
    }

    log({
        type: 'heal',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        value: actualHeal,
        text: `${source.id} healed ${target.id} for ${actualHeal} HP`
    });
};

const executeShieldOp = (op: ShieldOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    if (op.isBarrier) {
        target.stats.barrier += op.amount;
    } else {
        target.stats.shield += op.amount;
    }

    log({
        type: 'shield',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        value: op.amount,
        text: `${source.id} granted ${op.amount} ${op.isBarrier ? 'barrier' : 'shield'} to ${target.id}`
    });
};

const executeReviveOp = (op: ReviveOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    if (target.stats.hp === 0) {
        target.stats.hp = Math.floor(target.base.maxHp * op.hpPercent);

        log({
            type: 'revive',
            timestamp: Date.now(),
            sourceId: source.id,
            targetId: target.id,
            text: `${source.id} revived ${target.id} with ${target.stats.hp} HP`
        });
    }
};

// ============================================================================
// DISPLACEMENT OPS
// ============================================================================

const executePushOp = (op: PushOp, context: OpContext): void => {
    const { source, target, grid, log } = context;
    if (!target) return;

    // Calculate push direction
    const dx = target.pos.x - source.pos.x;
    const dy = target.pos.y - source.pos.y;
    const dirX = dx === 0 ? 0 : dx / Math.abs(dx);
    const dirY = dy === 0 ? 0 : dy / Math.abs(dy);

    // Calculate new position
    const newX = target.pos.x + dirX * op.distance;
    const newY = target.pos.y + dirY * op.distance;

    // Check if valid (simplified - would need proper grid checking)
    const oldPos = { ...target.pos };
    target.pos = { x: newX, y: newY };

    log({
        type: 'push',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        text: `Pushed ${target.id} from (${oldPos.x},${oldPos.y}) to (${newX},${newY})`
    });
};

const executePullOp = (op: PullOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    // Calculate pull direction (opposite of push)
    const dx = source.pos.x - target.pos.x;
    const dy = source.pos.y - target.pos.y;
    const dirX = dx === 0 ? 0 : dx / Math.abs(dx);
    const dirY = dy === 0 ? 0 : dy / Math.abs(dy);

    const oldPos = { ...target.pos };
    const newX = target.pos.x + dirX * op.distance;
    const newY = target.pos.y + dirY * op.distance;

    target.pos = { x: newX, y: newY };

    log({
        type: 'pull',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        text: `Pulled ${target.id} from (${oldPos.x},${oldPos.y}) to (${newX},${newY})`
    });
};

const executeSwapOp = (op: SwapOp, context: OpContext): void => {
    const { source, target, log } = context;
    if (!target) return;

    const tempPos = { ...source.pos };
    source.pos = { ...target.pos };
    target.pos = tempPos;

    log({
        type: 'move',
        timestamp: Date.now(),
        sourceId: source.id,
        targetId: target.id,
        text: `${source.id} swapped positions with ${target.id}`
    });
};

// ============================================================================
// SUMMON OPS
// ============================================================================

const executeSummonOp = (op: SummonOp, context: OpContext): void => {
    const { source, log } = context;

    // Placeholder - would need unit creation logic
    log({
        type: 'summon',
        timestamp: Date.now(),
        sourceId: source.id,
        text: `${source.id} summoned a ${op.unitType}`
    });
};

const executeTransformOp = (op: TransformOp, context: OpContext): void => {
    const { target, log } = context;
    if (!target) return;

    const oldType = target.type;
    target.type = op.targetUnitType;

    log({
        type: 'move',
        timestamp: Date.now(),
        targetId: target.id,
        text: `${target.id} transformed from ${oldType} to ${op.targetUnitType}`
    });
};

// ============================================================================
// TRIGGER OPS
// ============================================================================

const executeTriggerOp = (op: TriggerOp, context: OpContext): void => {
    const { log } = context;

    // Placeholder for trigger system
    log({
        type: 'skill_use',
        timestamp: Date.now(),
        text: `Triggered ${op.triggerId}`
    });
};

const executeDelayedOp = (op: DelayedOp, context: OpContext): void => {
    const { log } = context;

    // Placeholder - would need delayed action queue
    log({
        type: 'skill_use',
        timestamp: Date.now(),
        text: `Queued delayed action (${op.delay} turns)`
    });
};

const executeConditionalOp = (op: ConditionalOp, context: OpContext): void => {
    const { target } = context;
    if (!target) return;

    const conditionMet = checkCondition(op.condition, target);

    const opsToExecute = conditionMet ? op.ops : (op.elseOps || []);
    opsToExecute.forEach(subOp => executeOp(subOp, context));
};

// ============================================================================
// HELPERS
// ============================================================================

const checkCondition = (condition: DamageCondition, target: Unit): boolean => {
    switch (condition) {
        case 'stunned':
            return target.runtime.isStunned;
        case 'frozen':
            return target.runtime.isFrozen;
        case 'burning':
            return target.statuses.some(s => s.statusId === 'burn');
        case 'poisoned':
            return target.statuses.some(s => s.statusId === 'poison');
        case 'low_hp':
            return (target.stats.hp / target.base.maxHp) < 0.3;
        case 'high_hp':
            return (target.stats.hp / target.base.maxHp) > 0.7;
        default:
            return false;
    }
};
