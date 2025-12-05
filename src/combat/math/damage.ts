import { Unit, DamageType, DamageModifier, Skill } from '../types';
import { calculateReduction } from './reduction';
import { calculateCrit } from './crit';
import { calculateResistance } from './resist';

export interface DamageResult {
    finalDamage: number;
    isCrit: boolean;
    mitigated: number; // Amount reduced by armor/res
    resisted: number; // Amount reduced by elemental resistance
    penetrated: number; // Amount of armor ignored
    amplified: number; // Bonus from elemental amplification
    bonusDamage: number; // Conditional bonus damage
}

/**
 * Calculate armor penetration
 * Reduces effective armor/resistance before damage reduction
 */
export const calculatePenetration = (baseDef: number, penetration: number): number => {
    return Math.max(0, baseDef * (1 - penetration));
};

/**
 * Calculate elemental amplification
 * Bonus damage against weak elements
 */
export const calculateElementalAmplification = (damageType: DamageType, target: Unit): number => {
    // Elemental weakness system (to be implemented)
    const baseAmplification = 1.0;

    // If target has low resistance to this element, amplify
    if (damageType in target.resistances) {
        const resistance = target.resistances[damageType as keyof typeof target.resistances];
        if (resistance < -0.2) { // Negative resistance = weakness
            return baseAmplification + Math.abs(resistance);
        }
    }

    return baseAmplification;
};

/**
 * Calculate distance scaling
 * Ranged attacks may scale with distance
 */
export const calculateDistanceScaling = (distance: number, skill: Skill): number => {
    if (!skill.tags?.includes('ranged')) return 1.0;

    // Optimal range is 3-5 tiles
    const optimalMin = 3;
    const optimalMax = 5;

    if (distance >= optimalMin && distance <= optimalMax) {
        return 1.2; // 20% bonus at optimal range
    } else if (distance < optimalMin) {
        return 0.8; // 20% penalty too close
    } else {
        return Math.max(0.6, 1.0 - (distance - optimalMax) * 0.1); // Falloff beyond optimal
    }
};

/**
 * Calculate combo bonus
 * Damage increases with combo count
 */
export const calculateComboBonus = (comboCount: number): number => {
    return 1.0 + (comboCount * 0.15); // 15% per combo
};

/**
 * Calculate conditional bonus damage
 * Based on target status, HP, position, etc.
 */
export const calculateConditionalBonus = (target: Unit, modifiers: DamageModifier[], distance: number): number => {
    let totalBonus = 1.0;

    modifiers.forEach(mod => {
        let conditionMet = false;

        switch (mod.condition) {
            case 'stunned':
                conditionMet = target.runtime.isStunned;
                break;
            case 'frozen':
                conditionMet = target.runtime.isFrozen;
                break;
            case 'burning':
                conditionMet = target.statuses.some(s => s.statusId === 'burn');
                break;
            case 'poisoned':
                conditionMet = target.statuses.some(s => s.statusId === 'poison');
                break;
            case 'low_hp':
                conditionMet = (target.stats.hp / target.base.maxHp) < (mod.threshold || 0.3);
                break;
            case 'high_hp':
                conditionMet = (target.stats.hp / target.base.maxHp) > (mod.threshold || 0.7);
                break;
            case 'close_range':
                conditionMet = distance <= (mod.threshold || 1);
                break;
            case 'long_range':
                conditionMet = distance >= (mod.threshold || 4);
                break;
            case 'flanking':
            case 'from_behind':
                // Would need facing direction - placeholder for now
                conditionMet = false;
                break;
        }

        if (conditionMet) {
            totalBonus *= mod.multiplier;
        }
    });

    return totalBonus;
};

/**
 * Enhanced damage calculation with all modifiers
 */
export const calculateDamage = (
    attacker: Unit,
    defender: Unit,
    skillPower: number,
    damageType: DamageType,
    isFlat: boolean = false,
    skill?: Skill,
    distance: number = 0,
    modifiers: DamageModifier[] = []
): DamageResult => {
    // 1. Base Damage
    let baseDamage = isFlat ? skillPower : attacker.stats.atk * skillPower;

    // 2. Penetration (reduce effective defense)
    const penetration = attacker.stats.penetration || 0;
    const effectiveDef = damageType === 'physical' ? defender.stats.def : defender.stats.res;
    const penetratedDef = calculatePenetration(effectiveDef, penetration);
    const penetratedAmount = effectiveDef - penetratedDef;

    // 3. Defense Reduction (with penetration applied)
    const { reducedDamage, mitigatedAmount } = calculateReduction(
        baseDamage,
        damageType,
        defender,
        penetratedDef
    );

    // 4. Elemental Amplification
    const amplification = calculateElementalAmplification(damageType, defender);
    const amplifiedDamage = reducedDamage * amplification;
    const amplifiedAmount = amplifiedDamage - reducedDamage;

    // 5. Distance Scaling (if skill provided)
    let distanceScaledDamage = amplifiedDamage;
    if (skill) {
        const distanceScaling = calculateDistanceScaling(distance, skill);
        distanceScaledDamage = amplifiedDamage * distanceScaling;
    }

    // 6. Combo Bonus
    const comboBonus = calculateComboBonus(attacker.runtime.comboCount || 0);
    const comboDamage = distanceScaledDamage * comboBonus;

    // 7. Conditional Bonuses
    const conditionalBonus = calculateConditionalBonus(defender, modifiers, distance);
    const bonusDamage = comboDamage * conditionalBonus;

    // 8. Critical Hit
    const { damageAfterCrit, isCrit } = calculateCrit(bonusDamage, attacker);

    // 9. Elemental Resistance
    const { finalDamage, resistedAmount } = calculateResistance(damageAfterCrit, damageType, defender);

    // Clamp to 0
    const actualDamage = Math.max(0, Math.floor(finalDamage));

    return {
        finalDamage: actualDamage,
        isCrit,
        mitigated: mitigatedAmount,
        resisted: resistedAmount,
        penetrated: penetratedAmount,
        amplified: amplifiedAmount,
        bonusDamage: bonusDamage - comboDamage
    };
};
