import { Unit, StatusInstance, StatusId, UnitId } from '../types';
import { getStatusDefinition, areStatusesExclusive } from './StatusRegistry';

/**
 * Status Resolver
 * 
 * Handles applying, removing, and managing status effects on units.
 * Supports stacking, exclusive statuses, auras, and persistent effects.
 */

/**
 * Apply a status effect to a unit
 * 
 * @param unit - Unit to apply status to
 * @param statusId - ID of the status to apply
 * @param duration - Duration in turns (-1 for permanent)
 * @param sourceId - ID of the unit that applied the status
 * @param value - Optional value (for shields, DOT damage, etc.)
 * @param stacks - Number of stacks to apply (default 1)
 * @returns Updated unit
 */
export const applyStatus = (
    unit: Unit,
    statusId: StatusId,
    duration: number,
    sourceId: UnitId,
    value?: number,
    stacks: number = 1
): Unit => {
    const statusDef = getStatusDefinition(statusId);
    if (!statusDef) {
        console.warn(`Status ${statusId} not found in registry`);
        return unit;
    }

    // Check for exclusive statuses
    const exclusiveStatus = unit.statuses.find(s =>
        areStatusesExclusive(statusId, s.statusId)
    );
    if (exclusiveStatus) {
        // Remove the exclusive status first
        removeStatus(unit, exclusiveStatus.id);
    }

    // Check if status already exists
    const existingStatus = unit.statuses.find(s => s.statusId === statusId);

    if (existingStatus) {
        if (statusDef.isStackable) {
            // Add stacks
            const maxStacks = statusDef.maxStacks || Infinity;
            existingStatus.stacks = Math.min(maxStacks, existingStatus.stacks + stacks);
        } else if (statusDef.isDurationStackable) {
            // Add duration
            existingStatus.duration += duration;
        } else {
            // Refresh duration
            existingStatus.duration = Math.max(existingStatus.duration, duration);
        }
    } else {
        // Create new status instance
        const newStatus: StatusInstance = {
            id: `${statusId}_${Date.now()}_${Math.random()}`, // Unique instance ID
            statusId,
            duration,
            stacks,
            sourceId,
            value
        };

        unit.statuses.push(newStatus);

        // Call onApply trigger
        if (statusDef.onApply) {
            statusDef.onApply(unit, newStatus);
        }
    }

    return unit;
};

/**
 * Remove a specific status instance from a unit
 * 
 * @param unit - Unit to remove status from
 * @param instanceId - Unique instance ID of the status
 * @returns Updated unit
 */
export const removeStatus = (unit: Unit, instanceId: string): Unit => {
    const statusIndex = unit.statuses.findIndex(s => s.id === instanceId);
    if (statusIndex === -1) return unit;

    const status = unit.statuses[statusIndex];
    const statusDef = getStatusDefinition(status.statusId);

    // Call onRemove trigger
    if (statusDef?.onRemove) {
        statusDef.onRemove(unit, status);
    }

    // Remove from array
    unit.statuses.splice(statusIndex, 1);

    return unit;
};

/**
 * Remove all statuses of a specific type from a unit
 * 
 * @param unit - Unit to remove statuses from
 * @param statusType - Type of statuses to remove ('buff', 'debuff', 'control')
 * @param count - Maximum number to remove (default: all)
 * @returns Updated unit
 */
export const removeStatusesByType = (
    unit: Unit,
    statusType: 'buff' | 'debuff' | 'control' | 'aura',
    count?: number
): Unit => {
    const statusesToRemove = unit.statuses.filter(s => {
        const def = getStatusDefinition(s.statusId);
        return def?.type === statusType;
    });

    const toRemove = count ? statusesToRemove.slice(0, count) : statusesToRemove;

    toRemove.forEach(status => {
        removeStatus(unit, status.id);
    });

    return unit;
};

/**
 * Remove all statuses from a unit
 * 
 * @param unit - Unit to cleanse
 * @returns Updated unit
 */
export const cleanse = (unit: Unit): Unit => {
    const statusesToRemove = [...unit.statuses];

    statusesToRemove.forEach(status => {
        removeStatus(unit, status.id);
    });

    return unit;
};

/**
 * Reduce status duration by 1 and remove expired statuses
 * Called at the end of each turn
 * 
 * @param unit - Unit to tick statuses for
 * @returns Updated unit
 */
export const tickStatusDurations = (unit: Unit): Unit => {
    const statusesToRemove: string[] = [];

    unit.statuses.forEach(status => {
        const statusDef = getStatusDefinition(status.statusId);

        // Skip persistent statuses
        if (statusDef?.isPersistent) return;

        // Skip permanent statuses (-1 duration)
        if (status.duration === -1) return;

        // Decrement duration
        status.duration--;

        // Mark for removal if expired
        if (status.duration <= 0) {
            statusesToRemove.push(status.id);
        }
    });

    // Remove expired statuses
    statusesToRemove.forEach(id => {
        removeStatus(unit, id);
    });

    return unit;
};

/**
 * Check if unit has a specific status
 * 
 * @param unit - Unit to check
 * @param statusId - Status ID to check for
 * @returns True if unit has the status
 */
export const hasStatus = (unit: Unit, statusId: StatusId): boolean => {
    return unit.statuses.some(s => s.statusId === statusId);
};

/**
 * Get total stacks of a status on a unit
 * 
 * @param unit - Unit to check
 * @param statusId - Status ID to check
 * @returns Total number of stacks
 */
export const getStatusStacks = (unit: Unit, statusId: StatusId): number => {
    const status = unit.statuses.find(s => s.statusId === statusId);
    return status?.stacks || 0;
};

/**
 * Get all statuses of a specific type on a unit
 * 
 * @param unit - Unit to check
 * @param statusType - Type to filter by
 * @returns Array of status instances
 */
export const getStatusesByType = (
    unit: Unit,
    statusType: 'buff' | 'debuff' | 'control' | 'aura'
): StatusInstance[] => {
    return unit.statuses.filter(s => {
        const def = getStatusDefinition(s.statusId);
        return def?.type === statusType;
    });
};

/**
 * Transfer a status from one unit to another
 * 
 * @param fromUnit - Unit to transfer from
 * @param toUnit - Unit to transfer to
 * @param statusId - Status to transfer
 * @returns Updated units
 */
export const transferStatus = (
    fromUnit: Unit,
    toUnit: Unit,
    statusId: StatusId
): { fromUnit: Unit; toUnit: Unit } => {
    const status = fromUnit.statuses.find(s => s.statusId === statusId);
    if (!status) return { fromUnit, toUnit };

    // Remove from source
    removeStatus(fromUnit, status.id);

    // Apply to target
    applyStatus(toUnit, statusId, status.duration, status.sourceId, status.value, status.stacks);

    return { fromUnit, toUnit };
};

/**
 * Convert all statuses of one type to another
 * E.g., convert all debuffs to buffs
 * 
 * @param unit - Unit to convert statuses on
 * @param fromType - Type to convert from
 * @param toType - Type to convert to
 * @returns Updated unit
 */
export const convertStatusType = (
    unit: Unit,
    fromType: 'buff' | 'debuff' | 'control',
    _toType: 'buff' | 'debuff' | 'control'
): Unit => {
    // This is a placeholder - actual implementation would need
    // a mapping of debuff -> buff equivalents
    // For now, just remove the statuses
    const statusesToConvert = getStatusesByType(unit, fromType);

    statusesToConvert.forEach(status => {
        removeStatus(unit, status.id);
        // Would apply equivalent status of toType
    });

    return unit;
};

/**
 * Apply aura effects from nearby units
 * 
 * @param unit - Unit to apply auras to
 * @param allUnits - All units in combat (to check for aura sources)
 * @returns Updated unit
 */
export const applyAuraEffects = (unit: Unit, allUnits: Unit[]): Unit => {
    allUnits.forEach(other => {
        if (other.id === unit.id) return;

        other.statuses.forEach(status => {
            const statusDef = getStatusDefinition(status.statusId);
            if (!statusDef?.isAura) return;

            // Calculate distance
            const distance = Math.abs(unit.pos.x - other.pos.x) + Math.abs(unit.pos.y - other.pos.y);
            const auraRadius = statusDef.auraRadius || 0;

            if (distance <= auraRadius) {
                // Check if aura should affect this unit (ally/enemy)
                const shouldApply = unit.owner === other.owner; // Auras affect allies by default

                if (shouldApply) {
                    // Apply aura effect (temporary, doesn't add to statuses list)
                    // This would be handled in stat calculation
                }
            }
        });
    });

    return unit;
};
