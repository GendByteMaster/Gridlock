import { UnitModule, Unit } from '../types';

/**
 * Unit Modules System
 * 
 * Modules represent archetypes, specializations, passives, and equipment.
 * They provide stat bonuses and passive effects.
 */

/**
 * Module Registry
 * Defines all available modules in the game
 */
export const MODULE_REGISTRY: Record<string, UnitModule> = {
    // ========================================================================
    // ARCHETYPES (Primary class modules)
    // ========================================================================

    warrior: {
        id: 'warrior',
        name: 'Warrior',
        description: 'Melee fighter with high HP and defense',
        type: 'archetype',
        stats: {
            maxHp: 50,
            atk: 10,
            def: 15,
            res: 5,
            spd: 0,
            crit: 0,
            critDmg: 0
        }
    },

    mage: {
        id: 'mage',
        name: 'Mage',
        description: 'Spellcaster with high magic damage',
        type: 'archetype',
        stats: {
            maxHp: -20,
            atk: 20,
            def: -5,
            res: 10,
            spd: 0,
            crit: 0.05,
            critDmg: 0.2
        }
    },

    rogue: {
        id: 'rogue',
        name: 'Rogue',
        description: 'Fast attacker with high crit',
        type: 'archetype',
        stats: {
            maxHp: 0,
            atk: 15,
            def: 0,
            res: 0,
            spd: 10,
            crit: 0.15,
            critDmg: 0.5,
            eva: 0.1
        }
    },

    tank: {
        id: 'tank',
        name: 'Tank',
        description: 'Defensive unit with massive HP',
        type: 'archetype',
        stats: {
            maxHp: 100,
            atk: -10,
            def: 25,
            res: 15,
            spd: -5,
            crit: 0,
            critDmg: 0
        }
    },

    support: {
        id: 'support',
        name: 'Support',
        description: 'Healer and buffer',
        type: 'archetype',
        stats: {
            maxHp: 10,
            atk: -5,
            def: 5,
            res: 15,
            spd: 5,
            crit: 0,
            critDmg: 0
        }
    },

    // ========================================================================
    // SPECIALIZATIONS (Secondary modules)
    // ========================================================================

    berserker: {
        id: 'berserker',
        name: 'Berserker',
        description: 'Gains attack but loses defense',
        type: 'specialization',
        stats: {
            atk: 20,
            def: -10,
            crit: 0.1,
            critDmg: 0.3
        },
        passiveEffect: (unit: Unit) => {
            // Passive: Gain attack when low HP
            if (unit.stats.hp / unit.base.maxHp < 0.3) {
                unit.stats.atk += 30;
            }
        }
    },

    duelist: {
        id: 'duelist',
        name: 'Duelist',
        description: 'Excels in 1v1 combat',
        type: 'specialization',
        stats: {
            atk: 10,
            spd: 5,
            crit: 0.1,
            eva: 0.15
        }
    },

    elementalist: {
        id: 'elementalist',
        name: 'Elementalist',
        description: 'Master of elemental magic',
        type: 'specialization',
        stats: {
            atk: 15,
            res: 10
        }
    },

    necromancer: {
        id: 'necromancer',
        name: 'Necromancer',
        description: 'Summons undead minions',
        type: 'specialization',
        stats: {
            atk: 10,
            maxHp: 20
        }
    },

    // ========================================================================
    // PASSIVES (Passive ability modules)
    // ========================================================================

    regeneration_passive: {
        id: 'regeneration_passive',
        name: 'Regeneration',
        description: 'Heal 5% HP at turn start',
        type: 'passive',
        passiveEffect: (unit: Unit) => {
            const healAmount = Math.floor(unit.base.maxHp * 0.05);
            unit.stats.hp = Math.min(unit.base.maxHp, unit.stats.hp + healAmount);
        }
    },

    thorns: {
        id: 'thorns',
        name: 'Thorns',
        description: 'Reflect 20% of damage taken',
        type: 'passive',
        stats: {
            def: 10
        }
        // Reflection logic would be in damage calculation
    },

    evasion_master: {
        id: 'evasion_master',
        name: 'Evasion Master',
        description: 'Increased evasion',
        type: 'passive',
        stats: {
            eva: 0.2,
            spd: 5
        }
    },

    critical_strikes: {
        id: 'critical_strikes',
        name: 'Critical Strikes',
        description: 'Increased crit chance and damage',
        type: 'passive',
        stats: {
            crit: 0.15,
            critDmg: 0.5
        }
    },

    armor_penetration: {
        id: 'armor_penetration',
        name: 'Armor Penetration',
        description: 'Ignore 30% of enemy armor',
        type: 'passive',
        stats: {
            penetration: 0.3
        }
    },

    lifesteal_passive: {
        id: 'lifesteal_passive',
        name: 'Lifesteal',
        description: 'Heal for 20% of damage dealt',
        type: 'passive',
        stats: {
            lifesteal: 0.2
        }
    },

    // ========================================================================
    // EQUIPMENT (Item modules)
    // ========================================================================

    iron_armor: {
        id: 'iron_armor',
        name: 'Iron Armor',
        description: 'Heavy armor providing defense',
        type: 'equipment',
        stats: {
            def: 20,
            spd: -3
        }
    },

    mage_robes: {
        id: 'mage_robes',
        name: 'Mage Robes',
        description: 'Robes enhancing magic resistance',
        type: 'equipment',
        stats: {
            res: 25,
            atk: 10
        }
    },

    speed_boots: {
        id: 'speed_boots',
        name: 'Speed Boots',
        description: 'Boots increasing movement speed',
        type: 'equipment',
        stats: {
            spd: 15,
            eva: 0.1
        }
    },

    power_gauntlets: {
        id: 'power_gauntlets',
        name: 'Power Gauntlets',
        description: 'Gauntlets boosting attack',
        type: 'equipment',
        stats: {
            atk: 25
        }
    },

    vampiric_blade: {
        id: 'vampiric_blade',
        name: 'Vampiric Blade',
        description: 'Weapon with lifesteal',
        type: 'equipment',
        stats: {
            atk: 15,
            lifesteal: 0.25
        }
    }
};

/**
 * Get module definition by ID
 */
export const getModuleDefinition = (id: string): UnitModule | undefined => {
    return MODULE_REGISTRY[id];
};

/**
 * Get all modules of a specific type
 */
export const getModulesByType = (type: 'archetype' | 'specialization' | 'passive' | 'equipment'): UnitModule[] => {
    return Object.values(MODULE_REGISTRY).filter(m => m.type === type);
};

/**
 * Apply a module to a unit
 * 
 * @param unit - Unit to apply module to
 * @param moduleId - Module ID to apply
 * @returns Updated unit
 */
export const applyModule = (unit: Unit, moduleId: string): Unit => {
    const module = getModuleDefinition(moduleId);
    if (!module) return unit;

    // Check if unit already has this module
    if (unit.modules?.some(m => m.id === moduleId)) {
        return unit;
    }

    return {
        ...unit,
        modules: [...(unit.modules || []), module]
    };
};

/**
 * Remove a module from a unit
 * 
 * @param unit - Unit to remove module from
 * @param moduleId - Module ID to remove
 * @returns Updated unit
 */
export const removeModule = (unit: Unit, moduleId: string): Unit => {
    return {
        ...unit,
        modules: unit.modules?.filter(m => m.id !== moduleId) || []
    };
};

/**
 * Execute all passive effects for a unit
 * Should be called at appropriate trigger points
 * 
 * @param unit - Unit to execute passives for
 * @returns Updated unit
 */
export const executePassiveEffects = (unit: Unit): Unit => {
    const updatedUnit = { ...unit };

    updatedUnit.modules?.forEach(module => {
        if (module.passiveEffect) {
            module.passiveEffect(updatedUnit);
        }
    });

    return updatedUnit;
};
