import { Unit, DamageType } from '../types';

export interface ReductionResult {
    reducedDamage: number;
    mitigatedAmount: number;
}

/**
 * Calculate damage reduction from armor/resistance
 * Formula: Reduction = Damage * (Def / (Def + 100))
 * 
 * @param baseDamage - Base damage before reduction
 * @param damageType - Type of damage
 * @param defender - Defending unit
 * @param overrideDef - Optional override for defense value (used for penetration)
 */
export const calculateReduction = (
    baseDamage: number,
    damageType: DamageType,
    defender: Unit,
    overrideDef?: number
): ReductionResult => {
    // True damage ignores all reduction
    if (damageType === 'true') {
        return {
            reducedDamage: baseDamage,
            mitigatedAmount: 0
        };
    }

    // Determine which defense stat to use
    let defenseValue: number;
    if (overrideDef !== undefined) {
        defenseValue = overrideDef;
    } else {
        defenseValue = damageType === 'physical' ? defender.stats.def : defender.stats.res;
    }

    // Apply reduction formula
    const reductionPercent = defenseValue / (defenseValue + 100);
    const mitigatedAmount = baseDamage * reductionPercent;
    const reducedDamage = baseDamage - mitigatedAmount;

    // Cap reduction at 75% (no more than 75% damage reduction)
    const maxReduction = baseDamage * 0.75;
    const actualMitigated = Math.min(mitigatedAmount, maxReduction);
    const actualReduced = baseDamage - actualMitigated;

    return {
        reducedDamage: Math.max(0, actualReduced),
        mitigatedAmount: actualMitigated
    };
};

/**
 * Apply shield/barrier absorption before HP damage
 * Returns remaining damage after shield absorption
 */
export const applyShieldAbsorption = (
    damage: number,
    defender: Unit,
    damageType: DamageType
): { remainingDamage: number; shieldDamage: number } => {
    let remainingDamage = damage;
    let shieldDamage = 0;

    // Physical shield absorbs physical damage
    if (damageType === 'physical' && defender.stats.shield > 0) {
        const absorbed = Math.min(defender.stats.shield, remainingDamage);
        shieldDamage += absorbed;
        remainingDamage -= absorbed;
        defender.stats.shield -= absorbed;
    }

    // Barrier (magic shield) absorbs magical/elemental damage
    if (damageType !== 'physical' && damageType !== 'true' && defender.stats.barrier > 0) {
        const absorbed = Math.min(defender.stats.barrier, remainingDamage);
        shieldDamage += absorbed;
        remainingDamage -= absorbed;
        defender.stats.barrier -= absorbed;
    }

    return {
        remainingDamage: Math.max(0, remainingDamage),
        shieldDamage
    };
};
