import { Unit } from '../types';

const BASE_THRESHOLD = 100;

/**
 * FFT-Style Initiative System
 * 
 * Units have an initiative timer that counts down based on their speed.
 * When a unit's timer reaches 0 or below, they get to act.
 * After acting, their timer is reset to BASE_THRESHOLD.
 */

/**
 * Tick initiative for all units and return the next unit ready to act
 * 
 * @param units - Array of all units in combat
 * @returns The unit ready to act, or null if none ready
 */
export const tickInitiative = (units: Unit[]): Unit | null => {
    // 1. Check if any unit is already ready
    const readyUnits = units.filter(u => u.runtime.initiative <= 0);
    if (readyUnits.length > 0) {
        // Sort by overflow (most negative goes first) and then SPD
        readyUnits.sort((a, b) => {
            const initiativeDiff = a.runtime.initiative - b.runtime.initiative;
            if (initiativeDiff !== 0) return initiativeDiff;
            return b.stats.spd - a.stats.spd; // Higher speed breaks ties
        });
        return readyUnits[0];
    }

    // 2. Find the smallest time delta needed for someone to reach 0
    let minTicks = Infinity;

    units.forEach(u => {
        // Skip units that can't act
        if (u.runtime.isStunned || u.runtime.isFrozen || u.runtime.isSleeping) {
            return;
        }

        // Get effective speed (with modifiers)
        const effectiveSpeed = getEffectiveSpeed(u);

        if (effectiveSpeed > 0) {
            const ticksNeeded = u.runtime.initiative / effectiveSpeed;
            if (ticksNeeded < minTicks) minTicks = ticksNeeded;
        }
    });

    if (minTicks === Infinity) return null; // Everyone stunned or 0 speed

    // 3. Advance time for all units
    units.forEach(u => {
        // Only tick initiative for units that can act
        if (!u.runtime.isStunned && !u.runtime.isFrozen && !u.runtime.isSleeping) {
            const effectiveSpeed = getEffectiveSpeed(u);
            u.runtime.initiative -= effectiveSpeed * minTicks;
        }
    });

    // 4. Return the unit that crossed the threshold
    const nextReady = units.filter(u => u.runtime.initiative <= 0.001);
    if (nextReady.length > 0) {
        nextReady.sort((a, b) => a.runtime.initiative - b.runtime.initiative);
        return nextReady[0];
    }

    return null;
};

/**
 * Reset initiative after a unit acts
 * 
 * @param unit - Unit that just acted
 * @param actionDelay - Additional delay from the action (slow skills)
 */
export const resetInitiative = (unit: Unit, actionDelay: number = 0): void => {
    unit.runtime.initiative += BASE_THRESHOLD + actionDelay;
};

/**
 * Apply action delay (for slow skills)
 * Increases the initiative timer, making the unit act later
 * 
 * @param unit - Unit to apply delay to
 * @param delay - Amount of delay to add
 */
export const applyActionDelay = (unit: Unit, delay: number): void => {
    unit.runtime.initiative += delay;
};

/**
 * Apply quickcast (for fast skills)
 * Reduces the initiative timer, making the unit act sooner
 * 
 * @param unit - Unit to apply quickcast to
 * @param reduction - Amount to reduce initiative by
 */
export const applyQuickcast = (unit: Unit, reduction: number): void => {
    unit.runtime.initiative = Math.max(0, unit.runtime.initiative - reduction);
};

/**
 * Manipulate initiative directly
 * Used for abilities that push units forward or back in turn order
 * 
 * @param unit - Unit to manipulate
 * @param delta - Positive = delay, Negative = advance
 */
export const manipulateInitiative = (unit: Unit, delta: number): void => {
    unit.runtime.initiative += delta;
};

/**
 * Get effective speed with all modifiers applied
 * 
 * @param unit - Unit to calculate speed for
 * @returns Effective speed value
 */
export const getEffectiveSpeed = (unit: Unit): number => {
    let speed = unit.stats.spd;

    // Apply status modifiers
    unit.statuses.forEach(status => {
        // Status definitions would have initiativeModifier
        // For now, we'll check for common status IDs
        if (status.statusId === 'haste') {
            speed *= 1.5; // 50% faster
        } else if (status.statusId === 'slow') {
            speed *= 0.5; // 50% slower
        }
    });

    // Global speed modifiers could be added here
    // e.g., from auras, terrain effects, etc.

    return Math.max(0, speed);
};

/**
 * Get global speed modifier from auras and environment
 * 
 * @param unit - Unit to check modifiers for
 * @param allUnits - All units (for aura checks)
 * @returns Speed multiplier
 */
export const getGlobalSpeedModifier = (unit: Unit, allUnits: Unit[]): number => {
    let modifier = 1.0;

    // Check for aura effects from nearby units
    allUnits.forEach(other => {
        if (other.id === unit.id) return;

        other.statuses.forEach(status => {
            // Check if status is an aura
            if (status.statusId === 'speed_aura') {
                // Calculate distance
                const distance = Math.abs(unit.pos.x - other.pos.x) + Math.abs(unit.pos.y - other.pos.y);
                const auraRadius = 3; // Could come from status definition

                if (distance <= auraRadius) {
                    // Apply aura effect
                    if (unit.owner === other.owner) {
                        modifier *= 1.2; // Allies get speed boost
                    }
                }
            }
        });
    });

    return modifier;
};

/**
 * Get turn order prediction
 * Simulates future turns without mutating state
 * 
 * @param units - Array of all units
 * @param count - Number of turns to predict
 * @returns Array of unit IDs in turn order
 */
export const getTurnOrder = (units: Unit[], count: number = 10): string[] => {
    // Deep clone to avoid mutating actual state during simulation
    const simUnits = JSON.parse(JSON.stringify(units)) as Unit[];
    const order: string[] = [];

    for (let i = 0; i < count; i++) {
        const nextUnit = tickInitiative(simUnits);
        if (nextUnit) {
            order.push(nextUnit.id);
            resetInitiative(nextUnit);
        } else {
            break; // Should not happen unless all units are stunned/0 speed
        }
    }

    return order;
};

/**
 * Initialize initiative for a new unit entering combat
 * 
 * @param unit - Unit to initialize
 * @param immediate - If true, unit acts immediately
 */
export const initializeInitiative = (unit: Unit, immediate: boolean = false): void => {
    if (immediate) {
        unit.runtime.initiative = 0;
    } else {
        // Random initial initiative between 0 and BASE_THRESHOLD
        // This prevents all units from acting at once at combat start
        unit.runtime.initiative = Math.random() * BASE_THRESHOLD;
    }
};

/**
 * Check if a unit can act (not stunned/frozen/sleeping)
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
 * Get time until unit's next turn
 * 
 * @param unit - Unit to check
 * @returns Estimated ticks until next turn
 */
export const getTimeUntilTurn = (unit: Unit): number => {
    if (unit.runtime.initiative <= 0) return 0;

    const effectiveSpeed = getEffectiveSpeed(unit);
    if (effectiveSpeed <= 0) return Infinity;

    return unit.runtime.initiative / effectiveSpeed;
};

