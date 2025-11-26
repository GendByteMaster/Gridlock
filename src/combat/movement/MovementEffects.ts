import { Unit } from '../types';
import { Position } from '../../types';

/**
 * Movement effect that can be applied to a unit
 */
export interface ActiveMovementEffect {
    id: string;
    name: string;
    sourceUnitId: string;
    stat: string;           // Which stat is modified
    value: number;          // Modifier value
    duration: number;       // Remaining turns
    type: 'buff' | 'debuff' | 'stance' | 'special';
}

/**
 * Manager for movement-based effects
 */
export class MovementEffectManager {
    private activeEffects: Map<string, ActiveMovementEffect[]> = new Map();

    /**
     * Apply a movement effect to a unit
     */
    applyEffect(unitId: string, effect: ActiveMovementEffect): void {
        if (!this.activeEffects.has(unitId)) {
            this.activeEffects.set(unitId, []);
        }

        const effects = this.activeEffects.get(unitId)!;

        // Remove existing effect with same ID (replace)
        const existingIndex = effects.findIndex(e => e.id === effect.id);
        if (existingIndex >= 0) {
            effects.splice(existingIndex, 1);
        }

        effects.push(effect);
    }

    /**
     * Remove an effect from a unit
     */
    removeEffect(unitId: string, effectId: string): void {
        const effects = this.activeEffects.get(unitId);
        if (!effects) return;

        const index = effects.findIndex(e => e.id === effectId);
        if (index >= 0) {
            effects.splice(index, 1);
        }
    }

    /**
     * Get all active effects for a unit
     */
    getEffects(unitId: string): ActiveMovementEffect[] {
        return this.activeEffects.get(unitId) || [];
    }

    /**
     * Decrease duration of all effects and remove expired ones
     */
    tickEffects(unitId: string): void {
        const effects = this.activeEffects.get(unitId);
        if (!effects) return;

        // Decrease duration
        effects.forEach(effect => {
            effect.duration--;
        });

        // Remove expired effects
        const remaining = effects.filter(e => e.duration > 0);
        this.activeEffects.set(unitId, remaining);
    }

    /**
     * Calculate modified stats for a unit based on active effects
     */
    applyEffectsToStats(unit: Unit): Unit {
        const effects = this.getEffects(unit.id);
        if (effects.length === 0) return unit;

        const modifiedUnit = { ...unit };
        const modifiedStats = { ...unit.stats };

        for (const effect of effects) {
            const statKey = effect.stat as keyof typeof modifiedStats;
            const currentValue = modifiedStats[statKey];

            if (typeof currentValue === 'number') {
                // Apply percentage or flat modifier
                if (effect.value > -1 && effect.value < 1) {
                    // Percentage modifier
                    modifiedStats[statKey] = currentValue * (1 + effect.value) as any;
                } else {
                    // Flat modifier
                    modifiedStats[statKey] = (currentValue + effect.value) as any;
                }
            }
        }

        modifiedUnit.stats = modifiedStats;
        return modifiedUnit;
    }

    /**
     * Clear all effects for a unit
     */
    clearEffects(unitId: string): void {
        this.activeEffects.delete(unitId);
    }

    /**
     * Clear all effects
     */
    clearAll(): void {
        this.activeEffects.clear();
    }
}

/**
 * Check if unit moved this turn
 */
export function didUnitMove(prevPos: Position, currentPos: Position): boolean {
    return prevPos.x !== currentPos.x || prevPos.y !== currentPos.y;
}

/**
 * Check if unit is adjacent to any enemy
 */
export function isAdjacentToEnemy(unit: Unit, allUnits: Unit[]): boolean {
    const enemies = allUnits.filter(u => u.owner !== unit.owner && u.stats.hp > 0);

    for (const enemy of enemies) {
        const dx = Math.abs(unit.pos.x - enemy.pos.x);
        const dy = Math.abs(unit.pos.y - enemy.pos.y);

        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1)) {
            return true;
        }
    }

    return false;
}

/**
 * Check if position is on a capture point (placeholder)
 */
export function isOnCapturePoint(pos: Position, grid: any[][]): boolean {
    // TODO: Implement capture point detection
    // For now, return false
    return false;
}

/**
 * Apply movement effects based on unit type and action
 */
export function applyMovementEffects(
    unit: Unit,
    prevPos: Position,
    allUnits: Unit[],
    grid: any[][],
    effectManager: MovementEffectManager
): void {
    const moved = didUnitMove(prevPos, unit.pos);

    switch (unit.type) {
        case 'Guardian':
            if (!moved) {
                // Стойка Стража: +10% DEF if didn't move
                effectManager.applyEffect(unit.id, {
                    id: 'guardian_stance',
                    name: 'Стойка Стража',
                    sourceUnitId: unit.id,
                    stat: 'def',
                    value: 0.10,
                    duration: 1,
                    type: 'stance'
                });
            } else {
                // Remove stance if moved
                effectManager.removeEffect(unit.id, 'guardian_stance');
            }
            break;

        case 'Striker':
            if (moved) {
                // Агрессия: +10% ATK after moving
                effectManager.applyEffect(unit.id, {
                    id: 'striker_aggression',
                    name: 'Агрессия',
                    sourceUnitId: unit.id,
                    stat: 'atk',
                    value: 0.10,
                    duration: 1,
                    type: 'buff'
                });
            }

            // Check if adjacent to enemy
            if (isAdjacentToEnemy(unit, allUnits)) {
                // Открыт: -1 DEF when next to enemy
                effectManager.applyEffect(unit.id, {
                    id: 'striker_exposed',
                    name: 'Открыт',
                    sourceUnitId: unit.id,
                    stat: 'def',
                    value: -1,
                    duration: 1,
                    type: 'debuff'
                });
            } else {
                effectManager.removeEffect(unit.id, 'striker_exposed');
            }
            break;

        case 'Scout':
            if (moved && isOnCapturePoint(unit.pos, grid)) {
                // Speed boost on capture point
                effectManager.applyEffect(unit.id, {
                    id: 'scout_speed_boost',
                    name: 'Захват Точки',
                    sourceUnitId: unit.id,
                    stat: 'spd',
                    value: 10,
                    duration: 1,
                    type: 'buff'
                });
            }
            break;

        case 'Sentinel':
            if (moved) {
                const dx = unit.pos.x - prevPos.x;
                const dy = unit.pos.y - prevPos.y;

                // Check if moved sideways
                if (Math.abs(dx) > 0 && dy === 0) {
                    // Точность: +5% accuracy when moving sideways
                    effectManager.applyEffect(unit.id, {
                        id: 'sentinel_precision',
                        name: 'Точность',
                        sourceUnitId: unit.id,
                        stat: 'acc',
                        value: 0.05,
                        duration: 1,
                        type: 'buff'
                    });
                }
            }
            break;

        case 'Sniper':
            if (!moved) {
                // Стационарная Позиция: +10% accuracy if didn't move
                effectManager.applyEffect(unit.id, {
                    id: 'sniper_stationary_bonus',
                    name: 'Стационарная Позиция',
                    sourceUnitId: unit.id,
                    stat: 'acc',
                    value: 0.10,
                    duration: 1,
                    type: 'stance'
                });
            } else {
                effectManager.removeEffect(unit.id, 'sniper_stationary_bonus');
            }
            break;

        case 'Arcanist':
            // TODO: Implement enhanced range if no skill used
            // This requires tracking skill usage
            break;
    }
}
