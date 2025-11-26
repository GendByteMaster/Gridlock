import { Unit, Skill } from '../types';

/**
 * Level-based stat scaling
 * Calculates stat values based on unit level
 */
export const calculateLevelScaling = (baseStat: number, level: number, growthRate: number = 0.1): number => {
    // Formula: BaseStat * (1 + (level - 1) * growthRate)
    return baseStat * (1 + (level - 1) * growthRate);
};

/**
 * Tier-based skill scaling
 * Skills scale with tier/rank
 */
export const calculateSkillTierScaling = (basePower: number, tier: number): number => {
    // Each tier adds 20% power
    return basePower * (1 + (tier - 1) * 0.2);
};

/**
 * Exponential scaling for late-game stats
 */
export const calculateExponentialScaling = (baseStat: number, level: number, exponent: number = 1.05): number => {
    return baseStat * Math.pow(exponent, level - 1);
};

/**
 * Linear scaling (simple)
 */
export const calculateLinearScaling = (baseStat: number, level: number, perLevel: number): number => {
    return baseStat + (level - 1) * perLevel;
};

/**
 * Apply all level-based scaling to a unit
 */
export const applyLevelScaling = (unit: Unit): void => {
    const level = unit.level || 1;

    // Scale base stats
    unit.base.maxHp = calculateLevelScaling(unit.base.maxHp, level, 0.15);
    unit.base.atk = calculateLevelScaling(unit.base.atk, level, 0.1);
    unit.base.def = calculateLevelScaling(unit.base.def, level, 0.08);
    unit.base.res = calculateLevelScaling(unit.base.res, level, 0.08);
    unit.base.spd = calculateLevelScaling(unit.base.spd, level, 0.05);

    // Update current stats to match
    unit.stats.maxHp = unit.base.maxHp;
    unit.stats.hp = Math.min(unit.stats.hp, unit.stats.maxHp);
    unit.stats.atk = unit.base.atk;
    unit.stats.def = unit.base.def;
    unit.stats.res = unit.base.res;
    unit.stats.spd = unit.base.spd;
};
