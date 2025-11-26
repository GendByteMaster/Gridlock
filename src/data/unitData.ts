import { UnitType } from '../types';

interface UnitStaticData {
    name: string;
    role: string;
    description: string;
    movement: string;
    passive?: {
        name: string;
        description: string;
    };
}

export const UNIT_DATA: Record<UnitType, UnitStaticData> = {
    // Basic Units
    Guardian: {
        name: 'Guardian',
        role: 'Tank Unit',
        description: 'Frontline defender capable of soaking massive damage.',
        movement: '1 tile straight',
        passive: {
            name: 'Bulwark',
            description: 'Reduces incoming damage by 20%.'
        }
    },
    Scout: {
        name: 'Scout',
        role: 'Mobility Unit',
        description: 'Fast unit for capturing points and reconnaissance.',
        movement: '2 tiles any direction',
        passive: {
            name: 'Light Step',
            description: 'Does not trigger traps.'
        }
    },
    Striker: {
        name: 'Striker',
        role: 'Melee DPS',
        description: 'Versatile melee fighter with balanced offense.',
        movement: '1 tile any direction',
        passive: {
            name: 'Keen Edge',
            description: '+15% damage dealt.'
        }
    },
    Arcanist: {
        name: 'Arcanist',
        role: 'Support Mage',
        description: 'Magic user who buffs allies and deals AoE damage.',
        movement: '1 tile diagonal',
        passive: {
            name: 'Arcane Flow',
            description: 'Reduces cooldowns of all skills by 1.'
        }
    },
    Vanguard: {
        name: 'Vanguard',
        role: 'Bruiser',
        description: 'Aggressive fighter that excels in charging enemies.',
        movement: '1-2 tiles straight forward',
        passive: {
            name: 'Momentum',
            description: '+20% damage if moved 2 tiles.'
        }
    },
    Sentinel: {
        name: 'Sentinel',
        role: 'Ranged Unit',
        description: 'Archer with high precision and range.',
        movement: '1 tile backward/sideways',
        passive: {
            name: 'Precision',
            description: '+10% accuracy.'
        }
    },
    Mechanist: {
        name: 'Mechanist',
        role: 'Engineer',
        description: 'Tactical unit that deploys turrets and repairs allies.',
        movement: '1 tile',
        passive: {
            name: 'Overclock',
            description: 'Turrets attack twice on the turn they are deployed.'
        }
    },
    Monk: {
        name: 'Monk',
        role: 'Control Unit',
        description: 'Martial artist who controls the battlefield.',
        movement: '1 tile any direction',
        passive: {
            name: 'Inner Balance',
            description: 'Immune to slows.'
        }
    },
    FrostAdept: {
        name: 'Frost Adept',
        role: 'CC Mage',
        description: 'Mage specializing in freezing and slowing enemies.',
        movement: '1 tile diagonal',
        passive: {
            name: 'Chill Aura',
            description: 'Adjacent enemies move 1 less tile.'
        }
    },
    WarImp: {
        name: 'War Imp',
        role: 'Kamikaze Unit',
        description: 'Small unit that explodes on death.',
        movement: '2 tiles any direction',
        passive: {
            name: 'Deathburst',
            description: 'Explodes on death dealing AoE damage.'
        }
    },

    // Unique Units
    ChronoKnight: {
        name: 'Chrono Knight',
        role: 'Tempo Control',
        description: 'Warrior who manipulates time to gain advantages.',
        movement: '1 tile',
        passive: {
            name: 'Temporal Echo',
            description: 'First attack of the match is repeated by a phantom.'
        }
    },
    StormTitan: {
        name: 'Storm Titan',
        role: 'Area Denial',
        description: 'Massive unit that controls space with lightning.',
        movement: '1 tile',
        passive: {
            name: 'Static Field',
            description: 'Adjacent enemies take damage every turn.'
        }
    },
    ShadowDancer: {
        name: 'Shadow Dancer',
        role: 'Assassin',
        description: 'Stealthy unit that strikes from the shadows.',
        movement: 'Teleport 2 tiles',
        passive: {
            name: 'Backstab',
            description: '+50% damage when attacking from behind.'
        }
    },
    SolarPriest: {
        name: 'Solar Priest',
        role: 'Healer',
        description: 'Holy caster who heals and protects allies.',
        movement: '1 tile',
        passive: {
            name: 'Holy Light',
            description: 'Adjacent allies gain +5% HP regen.'
        }
    },
    VoidWalker: {
        name: 'Void Walker',
        role: 'Elusive',
        description: 'Entity that phases through reality.',
        movement: 'Jump to any tile in radius 3',
        passive: {
            name: 'Phase Out',
            description: '20% chance to dodge attacks.'
        }
    },
    IronColossus: {
        name: 'Iron Colossus',
        role: 'Super Tank',
        description: 'Unstoppable metal giant.',
        movement: '1 tile',
        passive: {
            name: 'Heavy Armor',
            description: 'Immune to knockback effects.'
        }
    },
    ArcaneArcher: {
        name: 'Arcane Archer',
        role: 'Magic Sniper',
        description: 'Archer who infuses arrows with magic.',
        movement: '1 tile backward/sideways',
        passive: {
            name: 'Focus',
            description: '+20% skill charge speed.'
        }
    },
    BoneReaper: {
        name: 'Bone Reaper',
        role: 'Executioner',
        description: 'Undead harvester who grows stronger near death.',
        movement: '1 tile',
        passive: {
            name: 'Requiem',
            description: '+30% damage when HP is low.'
        }
    },
    EmberWitch: {
        name: 'Ember Witch',
        role: 'Pyromancer',
        description: 'Witch who sets the battlefield on fire.',
        movement: '1 tile',
        passive: {
            name: 'Ignite',
            description: 'Attacks apply a burning effect.'
        }
    },
    AstralSentinel: {
        name: 'Astral Sentinel',
        role: 'Anti-Mage',
        description: 'Cosmic guardian who absorbs magic.',
        movement: '1 tile',
        passive: {
            name: 'Cosmic Insight',
            description: 'Can see hidden/stealthed enemies.'
        }
    },

    // Additional Basic Units
    Coreframe: {
        name: 'Coreframe',
        role: 'Mech Unit',
        description: 'Mechanical unit with modular capabilities.',
        movement: '1 tile'
    },
    Phantom: {
        name: 'Phantom',
        role: 'Stealth Unit',
        description: 'Elusive unit that can become invisible.',
        movement: '1 tile'
    },
    Fabricator: {
        name: 'Fabricator',
        role: 'Builder',
        description: 'Creates structures and fortifications.',
        movement: '1 tile'
    },
    Bastion: {
        name: 'Bastion',
        role: 'Defender',
        description: 'Immovable defensive unit.',
        movement: '1 tile'
    },
    Weaver: {
        name: 'Weaver',
        role: 'Mage',
        description: 'Manipulates the battlefield with magic.',
        movement: '1 tile'
    },
    Spectre: {
        name: 'Spectre',
        role: 'Ghost',
        description: 'Ethereal unit that phases through enemies.',
        movement: '1 tile'
    },
    Ronin: {
        name: 'Ronin',
        role: 'Swordsman',
        description: 'Masterless warrior with deadly precision.',
        movement: '1 tile'
    },
    Juggernaut: {
        name: 'Juggernaut',
        role: 'Heavy',
        description: 'Unstoppable force that crushes enemies.',
        movement: '1 tile'
    },
    Medic: {
        name: 'Medic',
        role: 'Healer',
        description: 'Supports allies with healing and buffs.',
        movement: '1 tile'
    },
    Sniper: {
        name: 'Sniper',
        role: 'Marksman',
        description: 'Long-range specialist with deadly accuracy.',
        movement: '1 tile'
    },
    Engineer: {
        name: 'Engineer',
        role: 'Support',
        description: 'Builds defenses and repairs units.',
        movement: '1 tile'
    },
    Summoner: {
        name: 'Summoner',
        role: 'Conjurer',
        description: 'Summons minions to fight.',
        movement: '1 tile'
    },
    Assassin: {
        name: 'Assassin',
        role: 'Killer',
        description: 'Eliminates high-value targets.',
        movement: '1 tile'
    },
    Templar: {
        name: 'Templar',
        role: 'Holy Warrior',
        description: 'Divine protector with healing powers.',
        movement: '1 tile'
    },
    Dragoon: {
        name: 'Dragoon',
        role: 'Lancer',
        description: 'Mounted warrior with powerful charges.',
        movement: '1 tile'
    },
    Valkyrie: {
        name: 'Valkyrie',
        role: 'Battle Maiden',
        description: 'Warrior who buffs allies in combat.',
        movement: '1 tile'
    },
    Overlord: {
        name: 'Overlord',
        role: 'Commander',
        description: 'Commands units and provides tactical bonuses.',
        movement: '1 tile'
    },
    Titan: {
        name: 'Titan',
        role: 'Colossus',
        description: 'Massive unit with devastating power.',
        movement: '1 tile'
    },
    Bomber: {
        name: 'Bomber',
        role: 'Demolition',
        description: 'Explosive specialist that deals AoE damage.',
        movement: '1 tile'
    },
    Turret: {
        name: 'Turret',
        role: 'Structure',
        description: 'Stationary defensive structure.',
        movement: '0 tiles'
    }
};
