import { Unit } from '../types';

export interface CritResult {
    damageAfterCrit: number;
    isCrit: boolean;
}

/**
 * Calculate critical hit
 * Determines if attack crits and applies crit damage multiplier
 * 
 * @param baseDamage - Damage before crit
 * @param attacker - Attacking unit
 * @param forceCrit - Force a critical hit (for guaranteed crit abilities)
 */
export const calculateCrit = (
    baseDamage: number,
    attacker: Unit,
    forceCrit: boolean = false
): CritResult => {
    // Check for guaranteed crit
    if (forceCrit) {
        return {
            damageAfterCrit: baseDamage * attacker.stats.critDmg,
            isCrit: true
        };
    }

    // Roll for crit
    const critRoll = Math.random();
    const isCrit = critRoll < attacker.stats.crit;

    if (isCrit) {
        return {
            damageAfterCrit: baseDamage * attacker.stats.critDmg,
            isCrit: true
        };
    }

    return {
        damageAfterCrit: baseDamage,
        isCrit: false
    };
};

/**
 * Calculate crit chance with modifiers from buffs/debuffs
 */
export const calculateModifiedCritChance = (baseChance: number, modifiers: number[]): number => {
    let totalChance = baseChance;

    modifiers.forEach(mod => {
        totalChance += mod;
    });

    // Cap crit chance at 100%
    return Math.min(1.0, Math.max(0, totalChance));
};

/**
 * Calculate crit damage with modifiers
 */
export const calculateModifiedCritDamage = (baseCritDmg: number, modifiers: number[]): number => {
    let totalCritDmg = baseCritDmg;

    modifiers.forEach(mod => {
        totalCritDmg += mod;
    });

    // Minimum crit damage is 1.0x (no bonus)
    return Math.max(1.0, totalCritDmg);
};
