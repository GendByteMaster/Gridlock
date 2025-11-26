import { StatusDefinition, Unit, StatusInstance } from '../types';

/**
 * Comprehensive Status Registry
 * 
 * Defines all status effects in the game including buffs, debuffs, control effects, and auras.
 * Each status has triggers (onApply, onTick, onRemove, etc.) and modifiers.
 */

export const STATUS_REGISTRY: Record<string, StatusDefinition> = {
    // ========================================================================
    // BUFFS
    // ========================================================================

    fortify: {
        id: 'fortify',
        name: 'Fortify',
        type: 'buff',
        isStackable: false,
        statModifiers: {
            def: 20,
            res: 10
        },
        onApply: () => {
            // Recalculate stats when applied
        },
        onRemove: () => {
            // Recalculate stats when removed
        }
    },

    empower: {
        id: 'empower',
        name: 'Empower',
        type: 'buff',
        isStackable: true,
        maxStacks: 3,
        statModifiers: {
            atk: 15
        }
    },

    haste: {
        id: 'haste',
        name: 'Haste',
        type: 'buff',
        isStackable: false,
        isExclusiveWith: ['slow'],
        initiativeModifier: 50, // Acts faster
        onApply: () => {
            // Speed buff applied via initiativeModifier
        }
    },

    regeneration: {
        id: 'regeneration',
        name: 'Regeneration',
        type: 'buff',
        isStackable: true,
        maxStacks: 5,
        onTick: (unit: Unit, instance: StatusInstance) => {
            const healAmount = (instance.value || 5) * instance.stacks;
            unit.stats.hp = Math.min(unit.base.maxHp, unit.stats.hp + healAmount);
        }
    },

    shield_buff: {
        id: 'shield_buff',
        name: 'Shield',
        type: 'buff',
        isStackable: false,
        onApply: (unit: Unit, instance: StatusInstance) => {
            unit.stats.shield += instance.value || 50;
        },
        onRemove: () => {
            // Shield decays naturally
        }
    },

    barrier: {
        id: 'barrier',
        name: 'Barrier',
        type: 'buff',
        isStackable: false,
        onApply: (unit: Unit, instance: StatusInstance) => {
            unit.stats.barrier += instance.value || 50;
        }
    },

    berserk: {
        id: 'berserk',
        name: 'Berserk',
        type: 'buff',
        isStackable: false,
        statModifiers: {
            atk: 30,
            def: -15
        }
    },

    focus: {
        id: 'focus',
        name: 'Focus',
        type: 'buff',
        isStackable: true,
        maxStacks: 3,
        statModifiers: {
            crit: 0.1, // +10% crit per stack
            critDmg: 0.2 // +20% crit damage per stack
        }
    },

    evasion: {
        id: 'evasion',
        name: 'Evasion',
        type: 'buff',
        isStackable: false,
        statModifiers: {
            eva: 0.3 // +30% evasion
        }
    },

    // ========================================================================
    // DEBUFFS
    // ========================================================================

    burn: {
        id: 'burn',
        name: 'Burn',
        type: 'debuff',
        isStackable: true,
        maxStacks: 5,
        onTick: (unit: Unit, instance: StatusInstance) => {
            const damage = (instance.value || 10) * instance.stacks;
            unit.stats.hp = Math.max(0, unit.stats.hp - damage);
        },
        resistanceModifiers: {
            fire: -0.2 // 20% more vulnerable to fire
        }
    },

    poison: {
        id: 'poison',
        name: 'Poison',
        type: 'debuff',
        isStackable: true,
        maxStacks: 10,
        onTick: (unit: Unit, instance: StatusInstance) => {
            // Poison deals % of max HP
            const damage = Math.floor(unit.base.maxHp * 0.03 * instance.stacks);
            unit.stats.hp = Math.max(0, unit.stats.hp - damage);
        }
    },

    bleed: {
        id: 'bleed',
        name: 'Bleed',
        type: 'debuff',
        isStackable: true,
        maxStacks: 5,
        onTick: (unit: Unit, instance: StatusInstance) => {
            const damage = (instance.value || 8) * instance.stacks;
            unit.stats.hp = Math.max(0, unit.stats.hp - damage);
        },
        onMove: (unit: Unit, instance: StatusInstance) => {
            // Bleed worsens on movement
            const damage = (instance.value || 8) * instance.stacks * 2;
            unit.stats.hp = Math.max(0, unit.stats.hp - damage);
        }
    },

    slow: {
        id: 'slow',
        name: 'Slow',
        type: 'debuff',
        isStackable: false,
        isExclusiveWith: ['haste'],
        initiativeModifier: -50, // Acts slower
        statModifiers: {
            eva: -0.2 // Harder to dodge
        }
    },

    weaken: {
        id: 'weaken',
        name: 'Weaken',
        type: 'debuff',
        isStackable: true,
        maxStacks: 3,
        statModifiers: {
            atk: -20
        }
    },

    vulnerable: {
        id: 'vulnerable',
        name: 'Vulnerable',
        type: 'debuff',
        isStackable: false,
        statModifiers: {
            def: -30,
            res: -30
        }
    },

    curse: {
        id: 'curse',
        name: 'Curse',
        type: 'debuff',
        isStackable: false,
        statModifiers: {
            atk: -10,
            def: -10,
            spd: -10
        },
        onTick: (unit: Unit) => {
            // Curse also deals damage
            const damage = 5;
            unit.stats.hp = Math.max(0, unit.stats.hp - damage);
        }
    },

    // ========================================================================
    // CONTROL EFFECTS
    // ========================================================================

    stun: {
        id: 'stun',
        name: 'Stun',
        type: 'control',
        isStackable: false,
        isDurationStackable: true, // Applying again extends duration
        onApply: (unit: Unit) => {
            unit.runtime.isStunned = true;
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isStunned = false;
        }
    },

    freeze: {
        id: 'freeze',
        name: 'Freeze',
        type: 'control',
        isStackable: false,
        onApply: (unit: Unit) => {
            unit.runtime.isFrozen = true;
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isFrozen = false;
        },
        onHit: () => {
            // Frozen units shatter when hit, taking extra damage
            // This would be handled in damage calculation
        },
        statModifiers: {
            def: -20 // Frozen units are more vulnerable
        }
    },

    silence: {
        id: 'silence',
        name: 'Silence',
        type: 'control',
        isStackable: false,
        onApply: (unit: Unit) => {
            unit.runtime.isSilenced = true;
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isSilenced = false;
        }
    },

    root: {
        id: 'root',
        name: 'Root',
        type: 'control',
        isStackable: false,
        onApply: (unit: Unit) => {
            unit.runtime.isRooted = true;
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isRooted = false;
        }
    },

    sleep: {
        id: 'sleep',
        name: 'Sleep',
        type: 'control',
        isStackable: false,
        onApply: (unit: Unit) => {
            unit.runtime.isSleeping = true;
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isSleeping = false;
        },
        onHit: (unit: Unit) => {
            // Sleep breaks when hit
            unit.runtime.isSleeping = false;
            // Remove the status (would need status removal logic)
        }
    },

    charm: {
        id: 'charm',
        name: 'Charm',
        type: 'control',
        isStackable: false,
        onApply: (unit: Unit) => {
            unit.runtime.isCharmed = true;
            // Charmed units act for the enemy
        },
        onRemove: (unit: Unit) => {
            unit.runtime.isCharmed = false;
        }
    },

    // ========================================================================
    // AURAS
    // ========================================================================

    leadership_aura: {
        id: 'leadership_aura',
        name: 'Leadership Aura',
        type: 'aura',
        isStackable: false,
        isAura: true,
        auraRadius: 3,
        isPersistent: true,
        statModifiers: {
            atk: 10,
            def: 10
        }
    },

    intimidation_aura: {
        id: 'intimidation_aura',
        name: 'Intimidation Aura',
        type: 'aura',
        isStackable: false,
        isAura: true,
        auraRadius: 3,
        isPersistent: true,
        statModifiers: {
            atk: -15 // Enemies get attack penalty
        }
    },

    regeneration_field: {
        id: 'regeneration_field',
        name: 'Regeneration Field',
        type: 'aura',
        isStackable: false,
        isAura: true,
        auraRadius: 2,
        isPersistent: true,
        onTick: (unit: Unit) => {
            // Heal allies in range
            const healAmount = 10;
            unit.stats.hp = Math.min(unit.base.maxHp, unit.stats.hp + healAmount);
        }
    },

    speed_aura: {
        id: 'speed_aura',
        name: 'Speed Aura',
        type: 'aura',
        isStackable: false,
        isAura: true,
        auraRadius: 3,
        isPersistent: true,
        initiativeModifier: 20
    }
};

/**
 * Get status definition by ID
 */
export const getStatusDefinition = (id: string): StatusDefinition | undefined => {
    return STATUS_REGISTRY[id];
};

/**
 * Get all status definitions of a specific type
 */
export const getStatusesByType = (type: 'buff' | 'debuff' | 'control' | 'aura'): StatusDefinition[] => {
    return Object.values(STATUS_REGISTRY).filter(s => s.type === type);
};

/**
 * Check if two statuses are exclusive
 */
export const areStatusesExclusive = (statusId1: string, statusId2: string): boolean => {
    const status1 = getStatusDefinition(statusId1);
    if (!status1) return false;

    return status1.isExclusiveWith?.includes(statusId2) || false;
};
