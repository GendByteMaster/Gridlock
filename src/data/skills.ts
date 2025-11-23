import { Skill } from '../types';

export const SKILLS: Record<string, Skill> = {
    // Tier 1 - Starting Skills
    'slash': {
        id: 'slash',
        name: 'Slash',
        description: 'Deal 25 damage to an adjacent enemy',
        category: 'Offense',
        cooldown: 2,
        damage: 25,
        tier: 1,
        prerequisites: []
    },
    'dash': {
        id: 'dash',
        name: 'Dash',
        description: 'Move up to 2 tiles away',
        category: 'Mobility',
        cooldown: 3,
        tier: 1,
        prerequisites: []
    },
    'shove': {
        id: 'shove',
        name: 'Shove',
        description: 'Push an adjacent enemy. Deal 15 damage if blocked',
        category: 'Control',
        cooldown: 2,
        damage: 15,
        tier: 1,
        prerequisites: []
    },

    // Tier 2 - Offense Branch
    'heavy_strike': {
        id: 'heavy_strike',
        name: 'Heavy Strike',
        description: 'Deal 40 damage to an adjacent enemy',
        category: 'Offense',
        cooldown: 4,
        damage: 40,
        tier: 2,
        prerequisites: ['slash']
    },
    'cleave': {
        id: 'cleave',
        name: 'Cleave',
        description: 'Deal 20 damage to all adjacent enemies',
        category: 'Offense',
        cooldown: 5,
        damage: 20,
        tier: 2,
        prerequisites: ['slash']
    },

    // Tier 2 - Mobility Branch
    'blink': {
        id: 'blink',
        name: 'Blink',
        description: 'Teleport up to 3 tiles away',
        category: 'Mobility',
        cooldown: 4,
        tier: 2,
        prerequisites: ['dash']
    },
    'sprint': {
        id: 'sprint',
        name: 'Sprint',
        description: 'Move up to 4 tiles in a straight line',
        category: 'Mobility',
        cooldown: 3,
        tier: 2,
        prerequisites: ['dash']
    },

    // Tier 2 - Control Branch
    'stun': {
        id: 'stun',
        name: 'Stun',
        description: 'Stun an adjacent enemy for 1 turn',
        category: 'Control',
        cooldown: 5,
        tier: 2,
        prerequisites: ['shove']
    },
    'pull': {
        id: 'pull',
        name: 'Pull',
        description: 'Pull an enemy 2 tiles toward you',
        category: 'Control',
        cooldown: 4,
        tier: 2,
        prerequisites: ['shove']
    },

    // Tier 3 - Advanced Skills
    'execute': {
        id: 'execute',
        name: 'Execute',
        description: 'Deal 60 damage to enemies below 30% HP',
        category: 'Offense',
        cooldown: 6,
        damage: 60,
        tier: 3,
        prerequisites: ['heavy_strike', 'cleave']
    },
    'phase_shift': {
        id: 'phase_shift',
        name: 'Phase Shift',
        description: 'Teleport anywhere on the board',
        category: 'Mobility',
        cooldown: 7,
        tier: 3,
        prerequisites: ['blink', 'sprint']
    },
    'lockdown': {
        id: 'lockdown',
        name: 'Lockdown',
        description: 'Prevent all enemy movement for 2 turns',
        category: 'Control',
        cooldown: 8,
        tier: 3,
        prerequisites: ['stun', 'pull']
    },

    // Hybrid Skills
    'charge': {
        id: 'charge',
        name: 'Charge',
        description: 'Dash to enemy and deal 30 damage',
        category: 'Offense',
        cooldown: 4,
        damage: 30,
        tier: 2,
        prerequisites: ['slash', 'dash']
    },
    'knockback': {
        id: 'knockback',
        name: 'Knockback',
        description: 'Deal 25 damage and push enemy 2 tiles',
        category: 'Control',
        cooldown: 4,
        damage: 25,
        tier: 2,
        prerequisites: ['slash', 'shove']
    },
    'evasion': {
        id: 'evasion',
        name: 'Evasion',
        description: 'Dash away and avoid next attack',
        category: 'Mobility',
        cooldown: 5,
        tier: 2,
        prerequisites: ['dash', 'shove']
    },
    // New Skills for Expanded Roster
    'double_strike': { id: 'double_strike', name: 'Double Strike', description: 'Attack twice for 20 damage each', category: 'Offense', cooldown: 3, damage: 40, tier: 2, prerequisites: ['slash'] },
    'fortify': { id: 'fortify', name: 'Fortify', description: 'Gain 50 temporary HP', category: 'Control', cooldown: 5, tier: 2, prerequisites: ['shove'] },
    'web': { id: 'web', name: 'Web', description: 'Root enemy for 2 turns', category: 'Control', cooldown: 4, tier: 2, prerequisites: ['shove'] },
    'backstab': { id: 'backstab', name: 'Backstab', description: 'Deal 80 damage from behind', category: 'Offense', cooldown: 5, damage: 80, tier: 3, prerequisites: ['slash'] },
    'parry': { id: 'parry', name: 'Parry', description: 'Block next attack and counter for 30 damage', category: 'Control', cooldown: 3, damage: 30, tier: 2, prerequisites: ['slash'] },
    'charge_unstoppable': { id: 'charge_unstoppable', name: 'Unstoppable Charge', description: 'Charge through obstacles dealing 40 damage', category: 'Offense', cooldown: 5, damage: 40, tier: 3, prerequisites: ['charge'] },
    'heal': { id: 'heal', name: 'Heal', description: 'Restore 40 HP to ally', category: 'Control', cooldown: 3, tier: 2, prerequisites: ['shove'] },
    'headshot': { id: 'headshot', name: 'Headshot', description: 'Deal 100 damage at long range', category: 'Offense', cooldown: 6, damage: 100, tier: 3, prerequisites: ['heavy_strike'] },
    'deploy_turret': { id: 'deploy_turret', name: 'Deploy Turret', description: 'Create a stationary turret', category: 'Control', cooldown: 6, tier: 3, prerequisites: ['shove'] },
    'summon_minion': { id: 'summon_minion', name: 'Summon Minion', description: 'Summon a weak ally', category: 'Control', cooldown: 5, tier: 3, prerequisites: ['shove'] },
    'shadow_step': { id: 'shadow_step', name: 'Shadow Step', description: 'Teleport behind enemy', category: 'Mobility', cooldown: 4, tier: 2, prerequisites: ['blink'] },
    'holy_smite': { id: 'holy_smite', name: 'Holy Smite', description: 'Deal 50 damage and heal self for 20', category: 'Offense', cooldown: 4, damage: 50, tier: 2, prerequisites: ['slash'] },
    'jump': { id: 'jump', name: 'Jump', description: 'Jump to target location dealing 30 AoE damage', category: 'Mobility', cooldown: 4, damage: 30, tier: 2, prerequisites: ['dash'] },
    'inspire': { id: 'inspire', name: 'Inspire', description: 'Grant +10 damage to allies', category: 'Control', cooldown: 5, tier: 2, prerequisites: ['shove'] },
    'command': { id: 'command', name: 'Command', description: 'Ally attacks immediately', category: 'Control', cooldown: 6, tier: 3, prerequisites: ['shove'] },
    'stomp': { id: 'stomp', name: 'Stomp', description: 'Stun all adjacent enemies', category: 'Control', cooldown: 5, tier: 3, prerequisites: ['shove'] },
    'recon': { id: 'recon', name: 'Recon', description: 'Reveal area and mark enemies', category: 'Mobility', cooldown: 3, tier: 1, prerequisites: [] },
    'grenade': { id: 'grenade', name: 'Grenade', description: 'Deal 30 damage in 3x3 area', category: 'Offense', cooldown: 4, damage: 30, tier: 2, prerequisites: ['slash'] },

    // Requested Skills
    'shield_bash': { id: 'shield_bash', name: 'Shield Bash', description: 'Push enemy 1 tile', category: 'Control', cooldown: 2, tier: 1, prerequisites: [] },
    'spot': { id: 'spot', name: 'Spot', description: 'Highlight enemy for 1 turn', category: 'Mobility', cooldown: 0, tier: 1, prerequisites: [] },
    'lunge': { id: 'lunge', name: 'Lunge', description: 'Attack 2 tiles straight', category: 'Offense', cooldown: 2, damage: 30, tier: 1, prerequisites: [] },
    'mana_burst': { id: 'mana_burst', name: 'Mana Burst', description: 'Light AoE damage around unit', category: 'Offense', cooldown: 3, damage: 20, tier: 1, prerequisites: [] },
    'empower_ally': { id: 'empower_ally', name: 'Empower Ally', description: '+25% damage to ally', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'war_cry': { id: 'war_cry', name: 'War Cry', description: 'Reduce nearby enemies attack', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'arrow_shot': { id: 'arrow_shot', name: 'Arrow Shot', description: 'Ranged attack 3 tiles', category: 'Offense', cooldown: 0, damage: 20, tier: 1, prerequisites: [] },
    'volley': { id: 'volley', name: 'Volley', description: 'Attack a line', category: 'Offense', cooldown: 3, damage: 25, tier: 1, prerequisites: [] },
    'repair': { id: 'repair', name: 'Repair', description: 'Heal ally 15%', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'palm_strike': { id: 'palm_strike', name: 'Palm Strike', description: 'Stun for 1 turn', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'meditate': { id: 'meditate', name: 'Meditate', description: 'Heal self 10%', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'frostbolt': { id: 'frostbolt', name: 'Frostbolt', description: 'Slow enemy', category: 'Control', cooldown: 2, damage: 15, tier: 1, prerequisites: [] },
    'ice_nova': { id: 'ice_nova', name: 'Ice Nova', description: 'Freeze tile for 1 turn', category: 'Control', cooldown: 3, tier: 1, prerequisites: [] },
    'explosive_leap': { id: 'explosive_leap', name: 'Explosive Leap', description: 'Jump and deal AoE damage', category: 'Offense', cooldown: 3, damage: 40, tier: 1, prerequisites: [] },
    'time_slash': { id: 'time_slash', name: 'Time Slash', description: 'Damage and slow', category: 'Offense', cooldown: 2, damage: 30, tier: 2, prerequisites: [] },
    'rewind': { id: 'rewind', name: 'Rewind', description: 'Return to previous tile', category: 'Mobility', cooldown: 4, tier: 2, prerequisites: [] },
    'thunder_step': { id: 'thunder_step', name: 'Thunder Step', description: 'Step causes AoE lightning', category: 'Offense', cooldown: 3, damage: 35, tier: 2, prerequisites: [] },
    'stormwall': { id: 'stormwall', name: 'Stormwall', description: 'Absorb first attack', category: 'Control', cooldown: 4, tier: 2, prerequisites: [] },
    'shadow_strike': { id: 'shadow_strike', name: 'Shadow Strike', description: 'Attack from stealth', category: 'Offense', cooldown: 2, damage: 50, tier: 2, prerequisites: [] },
    'vanish': { id: 'vanish', name: 'Vanish', description: 'Become invisible for 1 turn', category: 'Mobility', cooldown: 3, tier: 2, prerequisites: [] },
    'radiant_beam': { id: 'radiant_beam', name: 'Radiant Beam', description: 'Beam in straight line', category: 'Offense', cooldown: 3, damage: 30, tier: 2, prerequisites: [] },
    'sanctify': { id: 'sanctify', name: 'Sanctify', description: 'Create healing zone', category: 'Control', cooldown: 4, tier: 2, prerequisites: [] },
    'void_pulse': { id: 'void_pulse', name: 'Void Pulse', description: 'Attack through walls', category: 'Offense', cooldown: 2, damage: 25, tier: 2, prerequisites: [] },
    'singularity': { id: 'singularity', name: 'Singularity', description: 'Pull enemies 1 tile', category: 'Control', cooldown: 4, tier: 2, prerequisites: [] },
    'earth_slam': { id: 'earth_slam', name: 'Earth Slam', description: 'Stun in small area', category: 'Control', cooldown: 3, tier: 2, prerequisites: [] },
    'iron_skin': { id: 'iron_skin', name: 'Iron Skin', description: 'Invulnerable for 1 turn', category: 'Control', cooldown: 5, tier: 2, prerequisites: [] },
    'piercing_shot': { id: 'piercing_shot', name: 'Piercing Shot', description: 'Shoot through all units', category: 'Offense', cooldown: 3, damage: 35, tier: 2, prerequisites: [] },
    'arcane_trap': { id: 'arcane_trap', name: 'Arcane Trap', description: 'Place magic trap', category: 'Control', cooldown: 3, tier: 2, prerequisites: [] },
    'soul_harvest': { id: 'soul_harvest', name: 'Soul Harvest', description: 'Execute and heal self', category: 'Offense', cooldown: 4, damage: 50, tier: 2, prerequisites: [] },
    'bone_prison': { id: 'bone_prison', name: 'Bone Prison', description: 'Block a tile', category: 'Control', cooldown: 3, tier: 2, prerequisites: [] },
    'fireball': { id: 'fireball', name: 'Fireball', description: 'AoE ranged attack', category: 'Offense', cooldown: 3, damage: 40, tier: 2, prerequisites: [] },
    'burning_ground': { id: 'burning_ground', name: 'Burning Ground', description: 'Tile burns for 2 turns', category: 'Control', cooldown: 3, tier: 2, prerequisites: [] },
    'astral_shield': { id: 'astral_shield', name: 'Astral Shield', description: 'Absorb magic damage', category: 'Control', cooldown: 3, tier: 2, prerequisites: [] },
    'warp_step': { id: 'warp_step', name: 'Warp Step', description: 'Teleport 1 tile', category: 'Mobility', cooldown: 2, tier: 2, prerequisites: [] }
};

// Skill tree layout positions for React Flow
export const SKILL_POSITIONS: Record<string, { x: number; y: number }> = {
    // Tier 1
    'slash': { x: 100, y: 200 },
    'dash': { x: 400, y: 200 },
    'shove': { x: 700, y: 200 },

    // Tier 2 - Offense
    'heavy_strike': { x: 50, y: 350 },
    'cleave': { x: 150, y: 350 },

    // Tier 2 - Mobility
    'blink': { x: 350, y: 350 },
    'sprint': { x: 450, y: 350 },

    // Tier 2 - Control
    'stun': { x: 650, y: 350 },
    'pull': { x: 750, y: 350 },

    // Hybrid
    'charge': { x: 250, y: 350 },
    'knockback': { x: 550, y: 350 },
    'evasion': { x: 550, y: 200 },

    // Tier 3
    'execute': { x: 100, y: 500 },
    'phase_shift': { x: 400, y: 500 },
    'lockdown': { x: 700, y: 500 },

    // New Skills Positions (Placeholder)
    'double_strike': { x: 100, y: 650 },
    'fortify': { x: 200, y: 650 },
    'web': { x: 300, y: 650 },
    'backstab': { x: 400, y: 650 },
    'parry': { x: 500, y: 650 },
    'charge_unstoppable': { x: 600, y: 650 },
    'heal': { x: 700, y: 650 },
    'headshot': { x: 800, y: 650 },
    'deploy_turret': { x: 100, y: 800 },
    'summon_minion': { x: 200, y: 800 },
    'shadow_step': { x: 300, y: 800 },
    'holy_smite': { x: 400, y: 800 },
    'jump': { x: 500, y: 800 },
    'inspire': { x: 600, y: 800 },
    'command': { x: 700, y: 800 },
    'stomp': { x: 800, y: 800 },
    'recon': { x: 900, y: 800 },
    'grenade': { x: 1000, y: 800 }
};
