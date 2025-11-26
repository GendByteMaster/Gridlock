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

export interface Unit {
    id: string;
    type: UnitType;
    position: Position;
    owner: Player;
    hp: number;
    maxHp: number;
    equippedSkills: SkillSequence;
    cooldowns: Record<string, number>; // skillId -> turns remaining
}

export type CellType = 'normal' | 'charged' | 'inert' | 'corrupted' | 'overclocked' | 'shielded' | 'obstacle' | 'void';

export interface Cell {
    position: Position;
    type: CellType;
    isOccupied: boolean;
    unitId?: string;
}

export interface GameState {
    grid: Cell[][];
    units: Unit[];
    turn: Player;
    selectedUnitId: string | null;
    validMoves: Position[];
    cursor: Position;

    // Actions
    selectUnit: (unitId: string) => void;
    moveUnit: (unitId: string, target: Position) => void;
    endTurn: () => void;
    initializeGame: () => void;
    moveCursor: (dx: number, dy: number) => void;
    setCursor: (pos: Position) => void;
    moveHistory: Move[];
}

export interface Move {
    turn: number;
    player: Player;
    unitId: string;
    actionType: 'move' | 'skill';
    skillId?: string;
    from: Position;
    to: Position;
    targetId?: string;
    timestamp: number;
}
