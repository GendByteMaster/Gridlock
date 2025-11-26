import { Skill } from '../types';

/**
 * Comprehensive Skill Registry
 * 
 * Contains all skills in the game organized by category:
 * - Basic skills (available to all units)
 * - Unit-specific skills
 * - Advanced combo skills
 * - Ultimate abilities
 */

export const SKILL_REGISTRY: Record<string, Skill> = {
    // ========================================================================
    // BASIC SKILLS
    // ========================================================================

    basic_attack: {
        id: 'basic_attack',
        name: 'Basic Attack',
        description: 'A simple melee attack',
        cost: 0,
        cooldown: 0,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.0, damageType: 'physical' }
        ],
        tags: ['basic', 'melee']
    },

    // ========================================================================
    // MOVEMENT SKILLS
    // ========================================================================

    dash: {
        id: 'dash',
        name: 'Dash',
        description: 'Quickly move to a target location',
        cost: 1,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 3,
            filter: 'empty'
        },
        ops: [
            { type: 'dash', distance: 3 }
        ],
        tags: ['mobility', 'quickcast'],
        quickcast: true
    },

    teleport: {
        id: 'teleport',
        name: 'Teleport',
        description: 'Instantly teleport to a location',
        cost: 2,
        cooldown: 4,
        targeting: {
            type: 'single',
            range: 5,
            filter: 'empty'
        },
        ops: [
            { type: 'teleport', range: 5 }
        ],
        tags: ['mobility', 'quickcast']
    },

    leap: {
        id: 'leap',
        name: 'Leap',
        description: 'Leap to a location, damaging enemies on landing',
        cost: 1,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'any'
        },
        ops: [
            { type: 'leap', distance: 4, landingDamage: 30, landingRadius: 1 }
        ],
        tags: ['mobility', 'offensive']
    },

    // ========================================================================
    // DAMAGE SKILLS
    // ========================================================================

    slash: {
        id: 'slash',
        name: 'Slash',
        description: 'A powerful melee strike',
        cost: 1,
        cooldown: 0,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.5, damageType: 'physical' }
        ],
        tags: ['offensive', 'melee']
    },

    fireball: {
        id: 'fireball',
        name: 'Fireball',
        description: 'Launch a ball of fire that explodes on impact',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'aoe',
            range: 5,
            radius: 1,
            filter: 'any'
        },
        ops: [
            { type: 'aoe', radius: 1, center: 'target' },
            { type: 'damage', power: 1.2, damageType: 'fire' },
            { type: 'applyStatus', statusId: 'burn', duration: 2, stacks: 1, value: 10 }
        ],
        tags: ['offensive', 'ranged', 'aoe', 'fire'],
        actionDelay: 10
    },

    lightning_bolt: {
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        description: 'Strike an enemy with lightning',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 6,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.8, damageType: 'lightning' },
            { type: 'applyStatus', statusId: 'stun', duration: 1 }
        ],
        tags: ['offensive', 'ranged', 'lightning']
    },

    chain_lightning: {
        id: 'chain_lightning',
        name: 'Chain Lightning',
        description: 'Lightning that bounces between enemies',
        cost: 3,
        cooldown: 4,
        targeting: {
            type: 'chain',
            range: 5,
            maxTargets: 4,
            filter: 'enemy'
        },
        ops: [
            { type: 'chain', maxBounces: 3, damageReduction: 0.2, range: 3 },
            { type: 'damage', power: 1.5, damageType: 'lightning' }
        ],
        tags: ['offensive', 'ranged', 'chain', 'lightning']
    },

    meteor: {
        id: 'meteor',
        name: 'Meteor',
        description: 'Call down a meteor from the sky',
        cost: 4,
        cooldown: 6,
        targeting: {
            type: 'aoe',
            range: 8,
            radius: 2,
            filter: 'any'
        },
        ops: [
            { type: 'aoe', radius: 2, center: 'target' },
            { type: 'damage', power: 2.5, damageType: 'fire' },
            { type: 'applyStatus', statusId: 'burn', duration: 3, stacks: 2, value: 15 }
        ],
        tags: ['ultimate', 'offensive', 'aoe', 'fire'],
        actionDelay: 20
    },

    // ========================================================================
    // CONTROL SKILLS
    // ========================================================================

    stun_strike: {
        id: 'stun_strike',
        name: 'Stun Strike',
        description: 'Strike an enemy, stunning them',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.0, damageType: 'physical' },
            { type: 'applyStatus', statusId: 'stun', duration: 1 }
        ],
        tags: ['offensive', 'control', 'melee']
    },

    frost_nova: {
        id: 'frost_nova',
        name: 'Frost Nova',
        description: 'Freeze all nearby enemies',
        cost: 3,
        cooldown: 4,
        targeting: {
            type: 'aoe',
            range: 0,
            radius: 2,
            filter: 'enemy',
            canTargetSelf: true
        },
        ops: [
            { type: 'aoe', radius: 2, center: 'source' },
            { type: 'damage', power: 0.8, damageType: 'frost' },
            { type: 'applyStatus', statusId: 'freeze', duration: 2 }
        ],
        tags: ['offensive', 'control', 'aoe', 'frost']
    },

    silence: {
        id: 'silence',
        name: 'Silence',
        description: 'Prevent an enemy from casting spells',
        cost: 2,
        cooldown: 4,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'enemy'
        },
        ops: [
            { type: 'applyStatus', statusId: 'silence', duration: 2 }
        ],
        tags: ['control', 'ranged']
    },

    // ========================================================================
    // SUPPORT SKILLS
    // ========================================================================

    heal: {
        id: 'heal',
        name: 'Heal',
        description: 'Restore health to an ally',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'ally',
            canTargetSelf: true
        },
        ops: [
            { type: 'heal', amount: 0.3, isFlat: false }
        ],
        tags: ['support', 'healing']
    },

    shield: {
        id: 'shield',
        name: 'Shield',
        description: 'Grant a protective shield',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'ally',
            canTargetSelf: true
        },
        ops: [
            { type: 'shield', amount: 50, duration: 3, isBarrier: false }
        ],
        tags: ['support', 'defensive']
    },

    cleanse: {
        id: 'cleanse',
        name: 'Cleanse',
        description: 'Remove debuffs from an ally',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'ally',
            canTargetSelf: true
        },
        ops: [
            { type: 'cleanse', statusType: 'debuff', count: 2 }
        ],
        tags: ['support', 'cleanse']
    },

    revive: {
        id: 'revive',
        name: 'Revive',
        description: 'Bring a fallen ally back to life',
        cost: 4,
        cooldown: 8,
        targeting: {
            type: 'single',
            range: 2,
            filter: 'ally'
        },
        ops: [
            { type: 'revive', hpPercent: 0.5 }
        ],
        tags: ['ultimate', 'support', 'healing']
    },

    // ========================================================================
    // DISPLACEMENT SKILLS
    // ========================================================================

    push: {
        id: 'push',
        name: 'Push',
        description: 'Push an enemy away',
        cost: 1,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'push', distance: 2, damageOnCollision: 20 }
        ],
        tags: ['control', 'displacement']
    },

    pull: {
        id: 'pull',
        name: 'Pull',
        description: 'Pull an enemy closer',
        cost: 1,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 4,
            filter: 'enemy'
        },
        ops: [
            { type: 'pull', distance: 2 }
        ],
        tags: ['control', 'displacement']
    },

    swap: {
        id: 'swap',
        name: 'Swap',
        description: 'Swap positions with target',
        cost: 2,
        cooldown: 4,
        targeting: {
            type: 'single',
            range: 5,
            filter: 'any'
        },
        ops: [
            { type: 'swap' }
        ],
        tags: ['mobility', 'displacement']
    },

    // ========================================================================
    // HERO SKILLS (UNIQUE)
    // ========================================================================

    // 1. CHRONO KNIGHT
    chrono_strike: {
        id: 'chrono_strike',
        name: 'Chrono Strike',
        description: 'Strike and freeze enemy in time for 1 round',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.2, damageType: 'physical' },
            { type: 'applyStatus', statusId: 'freeze', duration: 1 }
        ],
        tags: ['offensive', 'control', 'chrono']
    },

    // 2. STORM TITAN
    titan_strike: {
        id: 'titan_strike',
        name: 'Titan Strike',
        description: 'Melee strike that chains lightning to nearby enemies',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.0, damageType: 'lightning' },
            { type: 'chain', maxBounces: 2, damageReduction: 0.5, range: 2 }
        ],
        tags: ['offensive', 'lightning', 'chain']
    },

    // 3. SHADOW DANCER
    shadow_swap: {
        id: 'shadow_swap',
        name: 'Shadow Swap',
        description: 'Swap places with an ally',
        cost: 1,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 2,
            filter: 'ally'
        },
        ops: [
            { type: 'swap' }
        ],
        tags: ['mobility', 'utility']
    },

    // 4. SOLAR PRIEST
    solar_beam: {
        id: 'solar_beam',
        name: 'Solar Beam',
        description: 'Fire a beam of holy light in a line',
        cost: 3,
        cooldown: 3,
        targeting: {
            type: 'line',
            range: 5,
            width: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'line', length: 5, piercing: true },
            { type: 'damage', power: 1.5, damageType: 'fire' } // Using fire as holy proxy
        ],
        tags: ['offensive', 'line', 'holy']
    },

    // 5. VOID WALKER
    void_warp: {
        id: 'void_warp',
        name: 'Void Warp',
        description: 'Long range teleport',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 6,
            filter: 'empty'
        },
        ops: [
            { type: 'teleport', range: 6 }
        ],
        tags: ['mobility', 'teleport']
    },

    void_strike: {
        id: 'void_strike',
        name: 'Void Strike',
        description: 'Pull enemy closer and strike',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 2,
            filter: 'enemy'
        },
        ops: [
            { type: 'pull', distance: 1 },
            { type: 'damage', power: 1.2, damageType: 'void' }
        ],
        tags: ['offensive', 'control', 'void']
    },

    // 6. IRON COLOSSUS
    colossus_smash: {
        id: 'colossus_smash',
        name: 'Colossus Smash',
        description: 'Heavy strike that pushes enemies',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.5, damageType: 'physical' },
            { type: 'push', distance: 1 }
        ],
        tags: ['offensive', 'control', 'melee']
    },

    // 7. ARCANE ARCHER
    arcane_shot: {
        id: 'arcane_shot',
        name: 'Arcane Shot',
        description: 'Long range magic arrow',
        cost: 2,
        cooldown: 0,
        targeting: {
            type: 'single',
            range: 5,
            filter: 'enemy'
        },
        ops: [
            { type: 'damage', power: 1.0, damageType: 'arcane' }
        ],
        tags: ['offensive', 'ranged', 'arcane']
    },

    piercing_shot: {
        id: 'piercing_shot',
        name: 'Piercing Shot',
        description: 'Arrow that pierces through enemies',
        cost: 3,
        cooldown: 3,
        targeting: {
            type: 'line',
            range: 5,
            width: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'line', length: 5, piercing: true },
            { type: 'damage', power: 1.2, damageType: 'arcane' }
        ],
        tags: ['offensive', 'line', 'arcane']
    },

    // 8. BONE REAPER
    scythe_sweep: {
        id: 'scythe_sweep',
        name: 'Scythe Sweep',
        description: 'Sweep attack hitting multiple enemies',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'cone',
            range: 1,
            angle: 180, // Wide sweep
            filter: 'enemy'
        },
        ops: [
            { type: 'cone', length: 1, angle: 180 },
            { type: 'damage', power: 1.2, damageType: 'physical' }
        ],
        tags: ['offensive', 'aoe', 'melee']
    },

    // 9. EMBER WITCH
    magma_ball: {
        id: 'magma_ball',
        name: 'Magma Ball',
        description: 'Fireball that leaves burning ground',
        cost: 3,
        cooldown: 3,
        targeting: {
            type: 'aoe',
            range: 4,
            radius: 1,
            filter: 'any'
        },
        ops: [
            { type: 'aoe', radius: 1, center: 'target' },
            { type: 'damage', power: 1.2, damageType: 'fire' },
            { type: 'applyStatus', statusId: 'burning_ground', duration: 2 } // Needs status def
        ],
        tags: ['offensive', 'aoe', 'fire']
    },

    // 10. ASTRAL SENTINEL
    astral_pulse: {
        id: 'astral_pulse',
        name: 'Astral Pulse',
        description: 'Energy pulse in a short line',
        cost: 2,
        cooldown: 2,
        targeting: {
            type: 'line',
            range: 2,
            width: 1,
            filter: 'enemy'
        },
        ops: [
            { type: 'line', length: 2, piercing: true },
            { type: 'damage', power: 1.2, damageType: 'arcane' }
        ],
        tags: ['offensive', 'line', 'arcane']
    },

    // ========================================================================
    // MECHANIST SKILLS
    // ========================================================================

    deploy_turret: {
        id: 'deploy_turret',
        name: 'Deploy Turret',
        description: 'Deploy a defensive turret to an adjacent tile',
        cost: 3,
        cooldown: 6,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'empty'
        },
        ops: [
            { type: 'summon', unitType: 'Turret', duration: 3 }
        ],
        tags: ['summon', 'control']
    },

    repair: {
        id: 'repair',
        name: 'Repair',
        description: 'Repair a mechanical unit or structure',
        cost: 2,
        cooldown: 3,
        targeting: {
            type: 'single',
            range: 1,
            filter: 'ally'
        },
        ops: [
            { type: 'heal', amount: 30, isFlat: true }
        ],
        tags: ['support', 'healing']
    }
};

/**
 * Get skill definition by ID
 */
export const getSkillDefinition = (id: string): Skill | undefined => {
    return SKILL_REGISTRY[id];
};

/**
 * Get all skills with a specific tag
 */
export const getSkillsByTag = (tag: string): Skill[] => {
    return Object.values(SKILL_REGISTRY).filter(s => s.tags?.includes(tag));
};

/**
 * Get all skills of a specific category
 */
export const getSkillsByCategory = (category: 'basic' | 'mobility' | 'offensive' | 'control' | 'support' | 'ultimate'): Skill[] => {
    return Object.values(SKILL_REGISTRY).filter(s => s.tags?.includes(category));
};

/**
 * Check if a skill is on cooldown
 */
export const isSkillOnCooldown = (skillId: string, cooldowns: Record<string, number>): boolean => {
    return (cooldowns[skillId] || 0) > 0;
};

/**
 * Get remaining cooldown for a skill
 */
export const getRemainingCooldown = (skillId: string, cooldowns: Record<string, number>): number => {
    return cooldowns[skillId] || 0;
};
