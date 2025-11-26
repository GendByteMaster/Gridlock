import { Unit, CurrentStats, BaseStats, ElementalResistances } from '../types';
import { getStatusDefinition } from '../effects/StatusRegistry';

/**
 * Unit Stat Calculation
 * 
 * Calculates effective stats for units by combining base stats,
 * module bonuses, status modifiers, and equipment bonuses.
 */

/**
 * Calculate effective stats for a unit
 * Combines base stats, modules, statuses, and equipment
 * 
 * @param unit - Unit to calculate stats for
 * @returns Effective current stats
 */
export const calculateEffectiveStats = (unit: Unit): CurrentStats => {
    // Start with base stats
    let stats: CurrentStats = {
        hp: unit.stats.hp, // Preserve current HP
        maxHp: unit.base.maxHp,
        atk: unit.base.atk,
        def: unit.base.def,
        res: unit.base.res,
        spd: unit.base.spd,
        crit: unit.base.crit,
        critDmg: unit.base.critDmg,
        acc: unit.base.acc,
        eva: unit.base.eva || 0,
        shield: unit.stats.shield || 0,
        barrier: unit.stats.barrier || 0,
        penetration: unit.base.penetration || 0,
        lifesteal: unit.base.lifesteal || 0
    };

    // Apply module bonuses
    unit.modules?.forEach(module => {
        if (module.stats) {
            stats = applyStatModifiers(stats, module.stats);
        }
    });

    // Apply status modifiers
    unit.statuses.forEach(status => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.statModifiers) {
            stats = applyStatModifiers(stats, statusDef.statModifiers);
        }
    });

    // Ensure stats don't go below minimums
    stats = clampStats(stats);

    return stats;
};

/**
 * Apply stat modifiers to current stats
 * 
 * @param stats - Current stats
 * @param modifiers - Modifiers to apply
 * @returns Updated stats
 */
export const applyStatModifiers = (stats: CurrentStats, modifiers: Partial<BaseStats>): CurrentStats => {
    return {
        ...stats,
        maxHp: stats.maxHp + (modifiers.maxHp || 0),
        atk: stats.atk + (modifiers.atk || 0),
        def: stats.def + (modifiers.def || 0),
        res: stats.res + (modifiers.res || 0),
        spd: stats.spd + (modifiers.spd || 0),
        crit: stats.crit + (modifiers.crit || 0),
        critDmg: stats.critDmg + (modifiers.critDmg || 0),
        eva: stats.eva + (modifiers.eva || 0),
        penetration: (stats.penetration ?? 0) + (modifiers.penetration || 0),
        lifesteal: (stats.lifesteal ?? 0) + (modifiers.lifesteal || 0)
    };
};

/**
 * Clamp stats to valid ranges
 * 
 * @param stats - Stats to clamp
 * @returns Clamped stats
 */
export const clampStats = (stats: CurrentStats): CurrentStats => {
    return {
        ...stats,
        hp: Math.max(0, Math.min(stats.hp, stats.maxHp)),
        maxHp: Math.max(1, stats.maxHp),
        atk: Math.max(0, stats.atk),
        def: Math.max(0, stats.def),
        res: Math.max(0, stats.res),
        spd: Math.max(1, stats.spd),
        crit: Math.max(0, Math.min(1, stats.crit)), // 0-100%
        critDmg: Math.max(1, stats.critDmg), // Minimum 1x
        eva: Math.max(0, Math.min(1, stats.eva)), // 0-100%
        shield: Math.max(0, stats.shield),
        barrier: Math.max(0, stats.barrier),
        penetration: Math.max(0, Math.min(1, stats.penetration ?? 0)), // 0-100%
        lifesteal: Math.max(0, Math.min(1, stats.lifesteal ?? 0)) // 0-100%
    };
};

/**
 * Calculate effective resistances for a unit
 * Combines base resistances with status modifiers
 * 
 * @param unit - Unit to calculate resistances for
 * @returns Effective resistances
 */
export const calculateEffectiveResistances = (unit: Unit): ElementalResistances => {
    let resistances: ElementalResistances = { ...unit.resistances };

    // Apply status resistance modifiers
    unit.statuses.forEach(status => {
        const statusDef = getStatusDefinition(status.statusId);
        if (statusDef?.resistanceModifiers) {
            Object.keys(statusDef.resistanceModifiers).forEach(element => {
                const key = element as keyof ElementalResistances;
                resistances[key] = (resistances[key] || 0) + (statusDef.resistanceModifiers![key] || 0);
            });
        }
    });

    // Clamp resistances to valid range (-1 to 1)
    // -1 = 100% weakness, 0 = neutral, 1 = 100% immunity
    Object.keys(resistances).forEach(element => {
        const key = element as keyof ElementalResistances;
        resistances[key] = Math.max(-1, Math.min(1, resistances[key]));
    });

    return resistances;
};

/**
 * Calculate power level of a unit
 * Used for matchmaking, difficulty scaling, etc.
 * 
 * @param unit - Unit to calculate power for
 * @returns Power level (approximate)
 */
export const calculatePowerLevel = (unit: Unit): number => {
    const stats = calculateEffectiveStats(unit);

    // Weighted sum of stats
    const power =
        stats.maxHp * 0.5 +
        stats.atk * 2.0 +
        stats.def * 1.5 +
        stats.res * 1.5 +
        stats.spd * 1.0 +
        stats.crit * 100 +
        stats.critDmg * 50;

    return Math.floor(power);
};

/**
 * Check if unit is alive
 * 
 * @param unit - Unit to check
 * @returns True if alive
 */
export const isAlive = (unit: Unit): boolean => {
    return unit.stats.hp > 0;
};

/**
 * Check if unit is at full health
 * 
 * @param unit - Unit to check
 * @returns True if at full HP
 */
export const isFullHealth = (unit: Unit): boolean => {
    return unit.stats.hp >= unit.stats.maxHp;
};

/**
 * Get HP percentage
 * 
 * @param unit - Unit to check
 * @returns HP percentage (0-1)
 */
export const getHpPercent = (unit: Unit): number => {
    return unit.stats.hp / unit.stats.maxHp;
};

/**
 * Check if unit is low HP
 * 
 * @param unit - Unit to check
 * @param threshold - HP threshold (default 0.3 = 30%)
 * @returns True if below threshold
 */
export const isLowHp = (unit: Unit, threshold: number = 0.3): boolean => {
    return getHpPercent(unit) < threshold;
};

/**
 * Check if unit is high HP
 * 
 * @param unit - Unit to check
 * @param threshold - HP threshold (default 0.7 = 70%)
 * @returns True if above threshold
 */
export const isHighHp = (unit: Unit, threshold: number = 0.7): boolean => {
    return getHpPercent(unit) > threshold;
};

/**
 * Recalculate all stats for a unit
 * Should be called when base stats, modules, or statuses change
 * 
 * @param unit - Unit to recalculate
 * @returns Updated unit
 */
export const recalculateUnit = (unit: Unit): Unit => {
    const effectiveStats = calculateEffectiveStats(unit);
    const effectiveResistances = calculateEffectiveResistances(unit);

    return {
        ...unit,
        stats: effectiveStats,
        resistances: effectiveResistances
    };
};

/**
 * Get stat difference between two units
 * Useful for comparing units or showing stat changes
 * 
 * @param unit1 - First unit
 * @param unit2 - Second unit
 * @returns Stat differences
 */
export const getStatDifference = (unit1: Unit, unit2: Unit): Partial<CurrentStats> => {
    const stats1 = calculateEffectiveStats(unit1);
    const stats2 = calculateEffectiveStats(unit2);

    return {
        maxHp: stats2.maxHp - stats1.maxHp,
        atk: stats2.atk - stats1.atk,
        def: stats2.def - stats1.def,
        res: stats2.res - stats1.res,
        spd: stats2.spd - stats1.spd,
        crit: stats2.crit - stats1.crit,
        critDmg: stats2.critDmg - stats1.critDmg,
        eva: stats2.eva - stats1.eva
    };
};
