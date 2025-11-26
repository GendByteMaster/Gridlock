import { Unit, DamageType } from '../types';

export interface ResistanceResult {
    finalDamage: number;
    resistedAmount: number;
}

/**
 * Calculate elemental resistance
 * Applies elemental resistance modifiers to damage
 * 
 * @param damage - Damage before resistance
 * @param damageType - Type of damage
 * @param defender - Defending unit
 */
export const calculateResistance = (
    damage: number,
    damageType: DamageType,
    defender: Unit
): ResistanceResult => {
    // True damage ignores resistance
    if (damageType === 'true') {
        return {
            finalDamage: damage,
            resistedAmount: 0
        };
    }

    // Physical and magical don't have elemental resistance
    if (damageType === 'physical' || damageType === 'magical') {
        return {
            finalDamage: damage,
            resistedAmount: 0
        };
    }

    // Get elemental resistance
    const resistance = defender.resistances[damageType as keyof typeof defender.resistances] || 0;

    // Positive resistance reduces damage, negative increases it (weakness)
    // resistance of 0.5 = 50% reduction
    // resistance of -0.5 = 50% increase
    const multiplier = 1.0 - resistance;
    const finalDamage = damage * multiplier;
    const resistedAmount = damage - finalDamage;

    return {
        finalDamage: Math.max(0, finalDamage),
        resistedAmount
    };
};

/**
 * Calculate resistance penetration
 * Reduces effective resistance before damage calculation
 */
export const calculateResistancePenetration = (
    baseResistance: number,
    penetration: number
): number => {
    return Math.max(-1.0, baseResistance - penetration);
};

/**
 * Check if unit is immune to damage type
 */
export const isImmune = (unit: Unit, damageType: DamageType): boolean => {
    if (damageType === 'physical' || damageType === 'magical' || damageType === 'true') {
        return false;
    }

    const resistance = unit.resistances[damageType as keyof typeof unit.resistances] || 0;
    return resistance >= 1.0; // 100% or more resistance = immunity
};
