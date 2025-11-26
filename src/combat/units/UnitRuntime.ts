import { Unit, UnitRuntime, SkillId } from '../types';

/**
 * Unit Runtime Management
 * 
 * Handles runtime state for units including initiative, cooldowns,
 * action/move points, and status flags.
 */

/**
 * Initialize runtime state for a new unit
 * 
 * @param unit - Unit to initialize
 * @param startingInitiative - Starting initiative value (default: random)
 * @returns Unit with initialized runtime
 */
export const initializeUnitRuntime = (unit: Unit, startingInitiative?: number): Unit => {
    const runtime: UnitRuntime = {
        initiative: startingInitiative ?? Math.random() * 100,
        cooldowns: {},
        isStunned: false,
        isFrozen: false,
        isSilenced: false,
        isRooted: false,
        isSleeping: false,
        isCharmed: false,
        actionPoints: 1,
        movePoints: 1,
        comboCount: 0,
        hasActed: false,
        hasMoved: false,
        isReacting: false,
        lastActionTimestamp: 0
    };

    return {
        ...unit,
        runtime
    };
};

/**
 * Reset runtime state at the start of a unit's turn
 * 
 * @param unit - Unit starting their turn
 * @returns Updated unit
 */
export const resetTurnState = (unit: Unit): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            actionPoints: 1,
            movePoints: 1,
            hasActed: false,
            hasMoved: false,
            isReacting: false
        }
    };
};

/**
 * Tick down all cooldowns by 1
 * 
 * @param unit - Unit to tick cooldowns for
 * @returns Updated unit
 */
export const tickCooldowns = (unit: Unit): Unit => {
    const newCooldowns: Record<SkillId, number> = {};

    Object.keys(unit.runtime.cooldowns).forEach(skillId => {
        const remaining = unit.runtime.cooldowns[skillId] - 1;
        if (remaining > 0) {
            newCooldowns[skillId] = remaining;
        }
        // If remaining <= 0, don't add to newCooldowns (effectively removing it)
    });

    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            cooldowns: newCooldowns
        }
    };
};

/**
 * Set cooldown for a specific skill
 * 
 * @param unit - Unit to set cooldown on
 * @param skillId - Skill ID
 * @param cooldown - Cooldown duration
 * @returns Updated unit
 */
export const setCooldown = (unit: Unit, skillId: SkillId, cooldown: number): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            cooldowns: {
                ...unit.runtime.cooldowns,
                [skillId]: cooldown
            }
        }
    };
};

/**
 * Get remaining cooldown for a skill
 * 
 * @param unit - Unit to check
 * @param skillId - Skill ID
 * @returns Remaining cooldown (0 if ready)
 */
export const getRemainingCooldown = (unit: Unit, skillId: SkillId): number => {
    return unit.runtime.cooldowns[skillId] || 0;
};

/**
 * Check if a skill is ready (not on cooldown)
 * 
 * @param unit - Unit to check
 * @param skillId - Skill ID
 * @returns True if skill is ready
 */
export const isSkillReady = (unit: Unit, skillId: SkillId): boolean => {
    return getRemainingCooldown(unit, skillId) === 0;
};

/**
 * Consume action points
 * 
 * @param unit - Unit to consume AP from
 * @param amount - Amount to consume
 * @returns Updated unit
 */
export const consumeActionPoints = (unit: Unit, amount: number): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            actionPoints: Math.max(0, unit.runtime.actionPoints - amount),
            hasActed: true,
            lastActionTimestamp: Date.now()
        }
    };
};

/**
 * Consume move points
 * 
 * @param unit - Unit to consume MP from
 * @param amount - Amount to consume
 * @returns Updated unit
 */
export const consumeMovePoints = (unit: Unit, amount: number): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            movePoints: Math.max(0, unit.runtime.movePoints - amount),
            hasMoved: true
        }
    };
};

/**
 * Increment combo counter
 * 
 * @param unit - Unit to increment combo for
 * @returns Updated unit
 */
export const incrementCombo = (unit: Unit): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            comboCount: unit.runtime.comboCount + 1
        }
    };
};

/**
 * Reset combo counter
 * 
 * @param unit - Unit to reset combo for
 * @returns Updated unit
 */
export const resetCombo = (unit: Unit): Unit => {
    return {
        ...unit,
        runtime: {
            ...unit.runtime,
            comboCount: 0
        }
    };
};

/**
 * Check if unit can act (not disabled by status effects)
 * 
 * @param unit - Unit to check
 * @returns True if unit can act
 */
export const canAct = (unit: Unit): boolean => {
    return !unit.runtime.isStunned
        && !unit.runtime.isFrozen
        && !unit.runtime.isSleeping
        && !unit.runtime.isCharmed;
};

/**
 * Check if unit can move (not rooted or otherwise disabled)
 * 
 * @param unit - Unit to check
 * @returns True if unit can move
 */
export const canMove = (unit: Unit): boolean => {
    return !unit.runtime.isRooted
        && !unit.runtime.isStunned
        && !unit.runtime.isFrozen
        && !unit.runtime.isSleeping
        && unit.runtime.movePoints > 0;
};

/**
 * Check if unit can cast skills (not silenced or otherwise disabled)
 * 
 * @param unit - Unit to check
 * @returns True if unit can cast
 */
export const canCast = (unit: Unit): boolean => {
    return !unit.runtime.isSilenced
        && canAct(unit)
        && unit.runtime.actionPoints > 0;
};

/**
 * Get all skills that are ready to use
 * 
 * @param unit - Unit to check
 * @returns Array of ready skill IDs
 */
export const getReadySkills = (unit: Unit): SkillId[] => {
    return unit.skills.filter(skillId => isSkillReady(unit, skillId));
};

/**
 * Get all skills on cooldown with their remaining time
 * 
 * @param unit - Unit to check
 * @returns Record of skill ID to remaining cooldown
 */
export const getCooldownStatus = (unit: Unit): Record<SkillId, number> => {
    const status: Record<SkillId, number> = {};

    unit.skills.forEach(skillId => {
        const remaining = getRemainingCooldown(unit, skillId);
        if (remaining > 0) {
            status[skillId] = remaining;
        }
    });

    return status;
};

/**
 * Check if unit has any action available
 * 
 * @param unit - Unit to check
 * @returns True if unit can do something
 */
export const hasActionAvailable = (unit: Unit): boolean => {
    return (canMove(unit) && unit.runtime.movePoints > 0)
        || (canCast(unit) && unit.runtime.actionPoints > 0 && getReadySkills(unit).length > 0);
};
