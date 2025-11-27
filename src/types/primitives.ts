export type Position = {
    x: number;
    y: number;
};

export type UnitType =
    // Basic Units
    | 'Guardian' | 'Scout' | 'Striker' | 'Arcanist' | 'Vanguard'
    | 'Sentinel' | 'Mechanist' | 'Monk' | 'FrostAdept' | 'WarImp'
    | 'Coreframe' | 'Phantom' | 'Fabricator' | 'Bastion' | 'Weaver'
    | 'Spectre' | 'Ronin' | 'Juggernaut' | 'Medic' | 'Sniper'
    | 'Engineer' | 'Summoner' | 'Assassin' | 'Templar' | 'Dragoon'
    | 'Valkyrie' | 'Overlord' | 'Titan' | 'Bomber'
    // Unique Units
    | 'ChronoKnight' | 'StormTitan' | 'ShadowDancer' | 'SolarPriest' | 'VoidWalker'
    | 'IronColossus' | 'ArcaneArcher' | 'BoneReaper' | 'EmberWitch' | 'AstralSentinel'
    // Summoned Units
    | 'Turret';

export type Player = 'player' | 'opponent';

export type SkillCategory = 'Offense' | 'Mobility' | 'Control' | 'Support';
export type NodeType = 'Active' | 'Passive' | 'GridEffect' | 'Ultimate';

export interface SkillNode {
    id: string;
    name: string;
    description: string;
    type?: NodeType;
    category: SkillCategory;
    cooldown: number;
    damage?: number;
    tier: number;
    prerequisites: string[];
    effectId?: string;
}

export type Skill = SkillNode;

export type SkillSequence = SkillNode[];
