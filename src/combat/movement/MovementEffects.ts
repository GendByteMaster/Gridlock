import { Unit } from '../types';
import { Position } from '../../types';
import { UNIT_MOVEMENT_REGISTRY } from './UnitMovementRegistry';

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

export type MovementEffectsState = Record<string, ActiveMovementEffect[]>;

/**
 * Apply a movement effect to a unit
 */
export function addMovementEffect(
    state: MovementEffectsState,
    unitId: string,
    effect: ActiveMovementEffect
): MovementEffectsState {
    const newState = { ...state };
    const effects = [...(newState[unitId] || [])];

    // Remove existing effect with same ID (replace)
    const existingIndex = effects.findIndex(e => e.id === effect.id);
    if (existingIndex >= 0) {
        effects.splice(existingIndex, 1);
    }

    effects.push(effect);
    newState[unitId] = effects;
    return newState;
}

/**
 * Remove an effect from a unit
 */
export function removeMovementEffect(
    state: MovementEffectsState,
    unitId: string,
    effectId: string
): MovementEffectsState {
    if (!state[unitId]) return state;

    const newState = { ...state };
    const effects = newState[unitId].filter(e => e.id !== effectId);

    if (effects.length === 0) {
        delete newState[unitId];
    } else {
        newState[unitId] = effects;
    }

    return newState;
}

/**
 * Decrease duration of all effects and remove expired ones
 */
export function tickMovementEffects(state: MovementEffectsState): MovementEffectsState {
    const newState: MovementEffectsState = {};

    Object.keys(state).forEach(unitId => {
        const effects = state[unitId]
            .map(e => ({ ...e, duration: e.duration - 1 }))
            .filter(e => e.duration > 0);

        if (effects.length > 0) {
            newState[unitId] = effects;
        }
    });

    return newState;
}

/**
 * Calculate modified stats for a unit based on active effects
 */
export function applyEffectsToStats(unit: Unit, state: MovementEffectsState): Unit {
    const effects = state[unit.id] || [];
    if (effects.length === 0) return unit;

    const modifiedUnit = { ...unit };
    const modifiedStats: any = { ...unit.base }; // Start from base stats

    // Copy current values for non-base stats
    modifiedStats.shield = unit.stats.shield;
    modifiedStats.barrier = unit.stats.barrier;

    for (const effect of effects) {
        const statKey = effect.stat as keyof typeof modifiedStats;
        const currentValue = modifiedStats[statKey];

        if (typeof currentValue === 'number') {
            // Apply percentage or flat modifier
            if (effect.value > -1 && effect.value < 1 && effect.value !== 0) {
                // Percentage modifier (e.g. 0.10 for +10%)
                modifiedStats[statKey] = (currentValue * (1 + effect.value)) as any;
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
 * Check if unit moved this turn
 */
export function didUnitMove(prevPos: Position, currentPos: Position): boolean {
    return prevPos.x !== currentPos.x || prevPos.y !== currentPos.y;
}

/**
 * Apply movement effects based on unit type and action
 */
export function applyMovementEffects(
    unit: Unit,
    prevPos: Position,
    state: MovementEffectsState
): MovementEffectsState {
    let newState = state;
    const moved = didUnitMove(prevPos, unit.pos);
    const moveDef = UNIT_MOVEMENT_REGISTRY[unit.type];

    if (!moveDef || !moveDef.effects) return newState;

    moveDef.effects.forEach(effectDef => {
        let shouldApply = false;
        let shouldRemove = false;

        // Check triggers
        switch (effectDef.trigger) {
            case 'on_move':
                if (moved) shouldApply = true;
                break;
            case 'on_stay':
                if (!moved) shouldApply = true;
                else shouldRemove = true;
                break;
            case 'conditional':
                if (effectDef.condition) {
                    if (effectDef.condition(unit, prevPos, unit.pos)) {
                        shouldApply = true;
                    }
                }
                break;
            case 'passive':
                shouldApply = true;
                break;
        }

        if (shouldApply) {
            newState = addMovementEffect(newState, unit.id, {
                id: effectDef.id,
                name: effectDef.name,
                sourceUnitId: unit.id,
                stat: effectDef.effect.stat || 'special',
                value: effectDef.effect.value || 0,
                duration: effectDef.effect.duration || 1,
                type: effectDef.effect.type
            });
        } else if (shouldRemove) {
            newState = removeMovementEffect(newState, unit.id, effectDef.id);
        }
    });

    return newState;
}
