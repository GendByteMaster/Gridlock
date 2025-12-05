import { Unit, CombatLogEvent } from '../types';
import { getStatusDefinition } from './StatusRegistry';
import { tickStatusDurations } from './StatusResolver';

/**
 * Turn Effects System
 * 
 * Processes all status effects at various trigger points:
 * - onTurnStart: Beginning of unit's turn
 * - onTick: During turn processing (DOT/HOT)
 * - onTurnEnd: End of unit's turn
 * - onMove: When unit moves
 * - onHit: When unit hits another unit
 */

export interface TurnEffectResult {
    unit: Unit;
    logs: CombatLogEvent[];
}

/**
 * Process effects at the start of a unit's turn
 * 
 * @param unit - Unit starting their turn
 * @returns Updated unit and logs
 */
export const processTurnStartEffects = (unit: Unit): TurnEffectResult => {
    const logs: CombatLogEvent[] = [];

    // Process onTurnStart triggers
    unit.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.onTurnStart) {
            statusDef.onTurnStart(unit, status);
        }
    });

    logs.push({
        type: 'turn_start',
        timestamp: Date.now(),
        sourceId: unit.id,
        text: `${unit.id}'s turn started`
    });

    return { unit, logs };
};

/**
 * Process DOT/HOT and other tick effects
 * Called during turn processing
 * 
 * @param unit - Unit to process effects for
 * @returns Updated unit and logs
 */
export const processTickEffects = (unit: Unit): TurnEffectResult => {
    const logs: CombatLogEvent[] = [];

    // Process each status
    unit.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (!statusDef) return;

        // Call onTick trigger
        if (statusDef.onTick) {
            const oldHp = unit.stats.hp;
            statusDef.onTick(unit, status);
            const hpChange = unit.stats.hp - oldHp;

            if (hpChange !== 0) {
                logs.push({
                    type: hpChange > 0 ? 'heal' : 'damage',
                    timestamp: Date.now(),
                    sourceId: status.sourceId,
                    targetId: unit.id,
                    value: Math.abs(hpChange),
                    text: `${status.statusId} ${hpChange > 0 ? 'healed' : 'damaged'} ${unit.id} for ${Math.abs(hpChange)}`
                });
            }
        }
    });

    return { unit, logs };
};

/**
 * Process effects at the end of a unit's turn
 * Decrements durations and removes expired statuses
 * 
 * @param unit - Unit ending their turn
 * @returns Updated unit and logs
 */
export const processTurnEndEffects = (unit: Unit): TurnEffectResult => {
    const logs: CombatLogEvent[] = [];

    // Process onTurnEnd triggers
    unit.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.onTurnEnd) {
            statusDef.onTurnEnd(unit, status);
        }
    });

    // Get statuses before ticking
    const statusesBefore = unit.statuses.map((s: any) => ({ id: s.id, statusId: s.statusId }));

    // Tick durations and remove expired
    tickStatusDurations(unit);

    // Log removed statuses
    statusesBefore.forEach((before: any) => {
        if (!unit.statuses.find((s: any) => s.id === before.id)) {
            logs.push({
                type: 'status_remove',
                timestamp: Date.now(),
                targetId: unit.id,
                text: `${before.statusId} expired on ${unit.id}`
            });
        }
    });

    logs.push({
        type: 'turn_end',
        timestamp: Date.now(),
        sourceId: unit.id,
        text: `${unit.id}'s turn ended`
    });

    return { unit, logs };
};

/**
 * Process effects when a unit moves
 * 
 * @param unit - Unit that moved
 * @returns Updated unit and logs
 */
export const processMoveEffects = (unit: Unit): TurnEffectResult => {
    const logs: CombatLogEvent[] = [];

    // Process onMove triggers
    unit.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.onMove) {
            const oldHp = unit.stats.hp;
            statusDef.onMove(unit, status);
            const hpChange = unit.stats.hp - oldHp;

            if (hpChange !== 0) {
                logs.push({
                    type: 'damage',
                    timestamp: Date.now(),
                    targetId: unit.id,
                    value: Math.abs(hpChange),
                    text: `${status.statusId} dealt ${Math.abs(hpChange)} damage on movement`
                });
            }
        }
    });

    return { unit, logs };
};

/**
 * Process effects when a unit hits another unit
 * 
 * @param attacker - Unit that hit
 * @param target - Unit that was hit
 * @returns Updated units and logs
 */
export const processHitEffects = (
    attacker: Unit,
    target: Unit
): { attacker: Unit; target: Unit; logs: CombatLogEvent[] } => {
    const logs: CombatLogEvent[] = [];

    // Process attacker's onHit triggers
    attacker.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.onHit) {
            statusDef.onHit(attacker, status, target);
        }
    });

    // Process target's onHit triggers (e.g., thorns, counter)
    target.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.onHit) {
            const oldHp = attacker.stats.hp;
            statusDef.onHit(target, status, attacker);
            const hpChange = attacker.stats.hp - oldHp;

            if (hpChange !== 0) {
                logs.push({
                    type: 'damage',
                    timestamp: Date.now(),
                    sourceId: target.id,
                    targetId: attacker.id,
                    value: Math.abs(hpChange),
                    text: `${status.statusId} reflected ${Math.abs(hpChange)} damage`
                });
            }
        }
    });

    return { attacker, target, logs };
};

/**
 * Process all turn effects in sequence
 * Convenience function that calls all effect processors
 * 
 * @param unit - Unit to process
 * @returns Updated unit and all logs
 */
export const processAllTurnEffects = (unit: Unit): TurnEffectResult => {
    const allLogs: CombatLogEvent[] = [];

    // Turn start
    const startResult = processTurnStartEffects(unit);
    allLogs.push(...startResult.logs);

    // Tick effects (DOT/HOT)
    const tickResult = processTickEffects(unit);
    allLogs.push(...tickResult.logs);

    // Turn end
    const endResult = processTurnEndEffects(unit);
    allLogs.push(...endResult.logs);

    return { unit, logs: allLogs };
};

/**
 * Check if unit died from status effects
 * 
 * @param unit - Unit to check
 * @returns True if unit died
 */
export const didUnitDieFromEffects = (unit: Unit): boolean => {
    return unit.stats.hp <= 0;
};

/**
 * Get total damage/healing from status effects this turn
 * 
 * @param unit - Unit to calculate for
 * @returns Object with total damage and healing
 */
export const calculateStatusEffectTotals = (unit: Unit): { damage: number; healing: number } => {
    let totalDamage = 0;
    let totalHealing = 0;

    unit.statuses.forEach((status: any) => {
        const statusDef = getStatusDefinition(status.statusId);
        if (!statusDef) return;

        // Estimate damage/healing (would need to actually execute onTick)
        if (status.statusId === 'burn' || status.statusId === 'poison' || status.statusId === 'bleed') {
            totalDamage += (status.value || 10) * status.stacks;
        } else if (status.statusId === 'regeneration') {
            totalHealing += (status.value || 5) * status.stacks;
        }
    });

    return { damage: totalDamage, healing: totalHealing };
};
