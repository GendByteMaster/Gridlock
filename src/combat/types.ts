import { UnitType, Position } from '../types/primitives';

export type UnitId = string;
export type SkillId = string;
export type StatusId = string;
export type ModuleId = string;

export interface CellPos {
    x: number;
    y: number;
}

export type DamageType =
    | 'physical'
    | 'magical'
    | 'true'
    | 'fire'
    | 'frost'
    | 'lightning'
    | 'poison'
    | 'arcane'
    | 'void';

export interface BaseStats {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    res: number; // Magic Resistance
    spd: number;
    crit: number; // Chance 0-1
    critDmg: number; // Multiplier (e.g., 1.5)
    acc: number; // Accuracy 0-1
    eva: number; // Evasion 0-1
    penetration?: number; // Armor penetration 0-1
    lifesteal?: number; // Lifesteal 0-1
}

export interface CurrentStats extends BaseStats {
    // Calculated stats after buffs/debuffs
    shield: number;
    barrier: number; // Magic shield
}

export interface ElementalResistances {
    fire: number;
    frost: number;
    lightning: number;
    poison: number;
    arcane: number;
    void: number;
}

export interface UnitRuntime {
    initiative: number; // Current initiative timer value
    cooldowns: Record<SkillId, number>;
    isStunned: boolean;
    isFrozen: boolean;
    isSilenced: boolean;
    isRooted: boolean;
    isSleeping: boolean;
    isCharmed: boolean;
    actionPoints: number;
    movePoints: number;
    comboCount: number; // Tracks combo chain
    hasActed: boolean; // Has acted this turn
    hasMoved: boolean; // Has moved this turn
    isReacting: boolean; // Is performing a reaction
    lastActionTimestamp: number;
}

export type ModuleType = 'archetype' | 'specialization' | 'signature' | 'passive' | 'equipment';

export interface UnitModule {
    id: ModuleId;
    type: ModuleType;
    name: string;
    description: string;
    stats?: Partial<BaseStats>;
    passiveEffect?: (unit: Unit) => void;
}

export interface StatusInstance {
    id: string; // Unique instance ID
    statusId: StatusId;
    duration: number; // Turns remaining (-1 for permanent)
    stacks: number;
    sourceId: UnitId;
    value?: number; // e.g., shield amount, dot damage
}

export interface Unit {
    id: UnitId;
    owner: 'player' | 'opponent';
    type: UnitType;
    level: number;

    base: BaseStats;
    stats: CurrentStats;
    resistances: ElementalResistances;

    pos: CellPos;

    statuses: StatusInstance[];
    skills: SkillId[];
    modules: UnitModule[];

    // Compatibility fields
    position: Position; // Alias for pos
    hp: number; // Alias for stats.hp
    maxHp: number; // Alias for base.maxHp
    equippedSkills: any[]; // Legacy
    cooldowns: Record<string, number>; // Alias for runtime.cooldowns

    runtime: UnitRuntime;
}

// --- Targeting System ---

export type TargetingType = 'single' | 'aoe' | 'line' | 'cone' | 'chain' | 'self';
export type TargetFilter = 'any' | 'ally' | 'enemy' | 'empty' | 'occupied';

export interface TargetingInfo {
    type: TargetingType;
    range: number;
    radius?: number; // For AoE
    width?: number; // For line/cone
    angle?: number; // For cone
    maxTargets?: number; // For chain
    requiresLineOfSight?: boolean;
    canTargetSelf?: boolean;
    filter: TargetFilter;
}

// --- Damage Modifiers ---

export type DamageCondition =
    | 'stunned' | 'frozen' | 'burning' | 'poisoned'
    | 'low_hp' | 'high_hp'
    | 'close_range' | 'long_range'
    | 'flanking' | 'from_behind';

export interface DamageModifier {
    condition: DamageCondition;
    multiplier: number;
    threshold?: number; // For hp/distance conditions
}

// --- Skill System (Enhanced) ---

export type SkillOpType =
    | 'move' | 'dash' | 'teleport' | 'leap'
    | 'damage' | 'aoe' | 'line' | 'cone' | 'chain'
    | 'applyStatus' | 'cleanse' | 'transfer' | 'convert'
    | 'heal' | 'shield' | 'revive'
    | 'push' | 'pull' | 'swap'
    | 'summon' | 'transform'
    | 'trigger' | 'delayed' | 'conditional';

// Base SkillOp interface
export interface BaseSkillOp {
    type: SkillOpType;
}

// Movement Ops
export interface MoveOp extends BaseSkillOp {
    type: 'move';
    maxDistance: number;
    ignoreObstacles?: boolean;
}

export interface DashOp extends BaseSkillOp {
    type: 'dash';
    distance: number;
    ignoreUnits?: boolean;
}

export interface TeleportOp extends BaseSkillOp {
    type: 'teleport';
    range: number;
}

export interface LeapOp extends BaseSkillOp {
    type: 'leap';
    distance: number;
    landingDamage?: number;
    landingRadius?: number;
}

// Damage Ops
export interface DamageOp extends BaseSkillOp {
    type: 'damage';
    power: number;
    damageType: DamageType;
    isFlat?: boolean;
    modifiers?: DamageModifier[];
}

export interface AoEOp extends BaseSkillOp {
    type: 'aoe';
    radius: number;
    center?: 'source' | 'target';
}

export interface LineOp extends BaseSkillOp {
    type: 'line';
    length: number;
    width?: number;
    piercing?: boolean;
}

export interface ConeOp extends BaseSkillOp {
    type: 'cone';
    length: number;
    angle: number;
}

export interface ChainOp extends BaseSkillOp {
    type: 'chain';
    maxBounces: number;
    damageReduction?: number; // Per bounce
    range: number; // Max distance between targets
}

// Status Ops
export interface ApplyStatusOp extends BaseSkillOp {
    type: 'applyStatus';
    statusId: StatusId;
    duration: number;
    stacks?: number;
    value?: number;
    target?: 'self' | 'target';
}

export interface CleanseOp extends BaseSkillOp {
    type: 'cleanse';
    statusType?: StatusType; // If undefined, cleanse all
    count?: number; // Number of statuses to remove
}

export interface TransferOp extends BaseSkillOp {
    type: 'transfer';
    statusId: StatusId;
    from: 'self' | 'target';
    to: 'self' | 'target';
}

export interface ConvertOp extends BaseSkillOp {
    type: 'convert';
    fromType: StatusType;
    toType: StatusType;
}

// Support Ops
export interface HealOp extends BaseSkillOp {
    type: 'heal';
    amount: number;
    isFlat?: boolean; // If false, uses % of max HP
    canOverheal?: boolean; // Creates shield with excess
}

export interface ShieldOp extends BaseSkillOp {
    type: 'shield';
    amount: number;
    duration: number;
    isBarrier?: boolean; // Magic shield vs physical shield
}

export interface ReviveOp extends BaseSkillOp {
    type: 'revive';
    hpPercent: number; // % of max HP to revive with
}

// Displacement Ops
export interface PushOp extends BaseSkillOp {
    type: 'push';
    distance: number;
    damageOnCollision?: number;
}

export interface PullOp extends BaseSkillOp {
    type: 'pull';
    distance: number;
}

export interface SwapOp extends BaseSkillOp {
    type: 'swap';
}

// Summon Ops
export interface SummonOp extends BaseSkillOp {
    type: 'summon';
    unitType: UnitType;
    duration?: number; // -1 for permanent
    position?: 'adjacent' | 'target';
}

export interface TransformOp extends BaseSkillOp {
    type: 'transform';
    targetUnitType: UnitType;
    duration?: number;
}

// Trigger Ops
export interface TriggerOp extends BaseSkillOp {
    type: 'trigger';
    triggerId: string;
}

export interface DelayedOp extends BaseSkillOp {
    type: 'delayed';
    delay: number; // Turns
    ops: SkillOp[];
}

export interface ConditionalOp extends BaseSkillOp {
    type: 'conditional';
    condition: DamageCondition;
    ops: SkillOp[];
    elseOps?: SkillOp[];
}

// Union type for all ops
export type SkillOp =
    | MoveOp | DashOp | TeleportOp | LeapOp
    | DamageOp | AoEOp | LineOp | ConeOp | ChainOp
    | ApplyStatusOp | CleanseOp | TransferOp | ConvertOp
    | HealOp | ShieldOp | ReviveOp
    | PushOp | PullOp | SwapOp
    | SummonOp | TransformOp
    | TriggerOp | DelayedOp | ConditionalOp;

export interface Skill {
    id: SkillId;
    name: string;
    description: string;
    cost: number; // AP cost
    cooldown: number;
    targeting: TargetingInfo;
    ops: SkillOp[];
    tags?: string[]; // For categorization (offensive, defensive, mobility, etc.)
    actionDelay?: number; // Initiative delay after using
    quickcast?: boolean; // Reduces initiative delay
}

// --- Status System (Enhanced) ---

export type StatusType = 'buff' | 'debuff' | 'control' | 'aura';
export type StatusTrigger = 'onApply' | 'onTick' | 'onRemove' | 'onHit' | 'onMove' | 'onTurnStart' | 'onTurnEnd';

export interface StatusDefinition {
    id: StatusId;
    name: string;
    type: StatusType;
    isStackable: boolean;
    maxStacks?: number;
    isDurationStackable?: boolean;
    isExclusiveWith?: StatusId[]; // Can't coexist with these
    isAura?: boolean; // Affects nearby units
    auraRadius?: number;
    isPersistent?: boolean; // Doesn't expire naturally

    // Triggers
    onApply?: (unit: Unit, instance: StatusInstance) => void;
    onTick?: (unit: Unit, instance: StatusInstance) => void;
    onRemove?: (unit: Unit, instance: StatusInstance) => void;
    onHit?: (unit: Unit, instance: StatusInstance, target: Unit) => void;
    onMove?: (unit: Unit, instance: StatusInstance) => void;
    onTurnStart?: (unit: Unit, instance: StatusInstance) => void;
    onTurnEnd?: (unit: Unit, instance: StatusInstance) => void;

    // Modifiers
    statModifiers?: Partial<BaseStats>;
    resistanceModifiers?: Partial<ElementalResistances>;
    initiativeModifier?: number;
}

// --- Combat Engine Types ---

export type CombatLogEventType =
    | 'damage' | 'heal' | 'shield'
    | 'status_apply' | 'status_remove' | 'status_tick'
    | 'move' | 'teleport' | 'push' | 'pull'
    | 'kill' | 'revive' | 'summon'
    | 'turn_start' | 'turn_end'
    | 'skill_use' | 'cooldown_ready';

export interface CombatLogEvent {
    type: CombatLogEventType;
    timestamp: number;
    sourceId?: UnitId;
    targetId?: UnitId;
    value?: number;
    text?: string;
    data?: any;
}

// --- Combat Snapshot ---

export interface CombatSnapshot {
    timestamp: number;
    turn: number;
    units: Unit[];
    grid: any[][];
    logs: CombatLogEvent[];
    activeUnitId: string | null;
}

// --- Action Context ---

export interface ActionMetadata {
    isCrit: boolean;
    isCounter: boolean;
    isReaction: boolean;
    comboCount: number;
    distance: number;
}

export interface EnvironmentContext {
    terrain?: string;
    weather?: string;
    timeOfDay?: string;
}
