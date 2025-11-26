# API Reference

## Combat Engine

### CombatEngine

Main combat controller that manages all combat logic.

#### Constructor

```typescript
constructor(config?: CombatConfig)
```

#### Methods

##### initializeCombat()
```typescript
initializeCombat(units: Unit[]): CombatState
```

Initializes a new combat encounter with the provided units.

**Parameters:**
- `units` - Array of units participating in combat

**Returns:**
- `CombatState` - Initial combat state

**Example:**
```typescript
const engine = new CombatEngine();
const state = engine.initializeCombat([unit1, unit2, unit3]);
```

---

##### executeAction()
```typescript
executeAction(action: CombatAction): CombatResult
```

Executes a combat action (skill use, movement, etc.).

**Parameters:**
- `action` - The action to execute

**Returns:**
- `CombatResult` - Result including success, events, and state changes

**Example:**
```typescript
const result = engine.executeAction({
    type: 'skill',
    sourceId: 'p1',
    skillId: 'fireball',
    targetPos: { x: 5, y: 5 }
});
```

---

##### advanceTurn()
```typescript
advanceTurn(): void
```

Advances initiative timers and determines next active unit.

**Example:**
```typescript
engine.advanceTurn();
```

---

##### getState()
```typescript
getState(): CombatSnapshot
```

Returns current combat state snapshot.

**Returns:**
- `CombatSnapshot` - Complete combat state

---

## Skill Registry

### SkillRegistry

Repository of all skill definitions.

#### getSkillDefinition()
```typescript
getSkillDefinition(id: string): Skill | undefined
```

Retrieves a skill definition by ID.

**Parameters:**
- `id` - Skill identifier

**Returns:**
- `Skill` if found, `undefined` otherwise

**Example:**
```typescript
const fireball = getSkillDefinition('fireball');
```

---

#### getSkillsByTag()
```typescript
getSkillsByTag(tag: string): Skill[]
```

Returns all skills with a specific tag.

**Parameters:**
- `tag` - Tag to filter by

**Returns:**
- Array of matching skills

**Example:**
```typescript
const offensiveSkills = getSkillsByTag('offensive');
```

---

#### getSkillsByCategory()
```typescript
getSkillsByCategory(
    category: 'basic' | 'mobility' | 'offensive' | 'control' | 'support' | 'ultimate'
): Skill[]
```

Returns all skills in a category.

**Parameters:**
- `category` - Category to filter by

**Returns:**
- Array of matching skills

---

#### isSkillOnCooldown()
```typescript
isSkillOnCooldown(
    skillId: string, 
    cooldowns: Record<string, number>
): boolean
```

Checks if a skill is currently on cooldown.

**Parameters:**
- `skillId` - Skill to check
- `cooldowns` - Unit's cooldown state

**Returns:**
- `true` if on cooldown, `false` otherwise

**Example:**
```typescript
if (isSkillOnCooldown('fireball', unit.runtime.cooldowns)) {
    console.log('Fireball is on cooldown');
}
```

---

#### getRemainingCooldown()
```typescript
getRemainingCooldown(
    skillId: string, 
    cooldowns: Record<string, number>
): number
```

Gets remaining cooldown turns for a skill.

**Parameters:**
- `skillId` - Skill to check
- `cooldowns` - Unit's cooldown state

**Returns:**
- Number of turns remaining (0 if ready)

---

## Combat State Adapter

### toEngineUnit()
```typescript
toEngineUnit(rawUnit: any): Unit
```

Converts legacy UI unit format to engine format.

**Parameters:**
- `rawUnit` - Unit in legacy format

**Returns:**
- `Unit` in engine format

**Transformation:**
```typescript
// Legacy format
{
    id: 'p1',
    hp: 100,
    maxHp: 100,
    equippedSkills: [...]
}

// Engine format
{
    id: 'p1',
    stats: {
        hp: 100,
        maxHp: 100,
        atk: 50,
        def: 30,
        // ... other stats
    },
    skills: ['skill_id1', 'skill_id2'],
    runtime: {
        initiative: 0,
        cooldowns: {},
        // ... runtime state
    }
}
```

---

### toLegacyUnit()
```typescript
toLegacyUnit(engineUnit: Unit): any
```

Converts engine unit back to legacy UI format.

**Parameters:**
- `engineUnit` - Unit in engine format

**Returns:**
- Unit in legacy format

---

### adaptCombatState()
```typescript
adaptCombatState(state: any): CombatState
```

Converts full combat state between formats.

**Parameters:**
- `state` - State in any format

**Returns:**
- `CombatState` - Normalized combat state

---

## Movement System

### MovementPatterns

Provides chess-like movement pattern generation.

**Note:** All pattern functions support both `pos` and `position` properties for backward compatibility.

---

#### getKnightPattern()
```typescript
getKnightPattern(unit: Unit, grid: Cell[][]): Position[]
```

Returns valid knight (L-shape) moves.

**Parameters:**
- `unit` - Unit to generate moves for
- `grid` - Current board state

**Returns:**
- Array of valid positions

**Pattern:**
```
  .   .
.   U   .
  .   .
```

---

#### getBishopPattern()
```typescript
getBishopPattern(unit: Unit, grid: Cell[][]): Position[]
```

Returns diagonal line moves.

**Pattern:**
```
.     .
  .  .
    U
  .  .
.     .
```

---

#### getRookPattern()
```typescript
getRookPattern(unit: Unit, grid: Cell[][]): Position[]
```

Returns straight line moves (horizontal/vertical).

**Pattern:**
```
    .
    .
. . U . .
    .
    .
```

---

#### getQueenPattern()
```typescript
getQueenPattern(unit: Unit, grid: Cell[][]): Position[]
```

Returns bishop + rook combined (8 directions).

---

#### getKingPattern()
```typescript
getKingPattern(unit: Unit, grid: Cell[][]): Position[]
```

Returns 1-tile moves in any direction.

**Pattern:**
```
. . .
. U .
. . .
```

---

## Damage Calculator

### calculateDamage()
```typescript
calculateDamage(
    attacker: Unit,
    defender: Unit,
    skill: Skill,
    context: ActionContext
): number
```

Calculates final damage for an attack.

**Parameters:**
- `attacker` - Attacking unit
- `defender` - Defending unit
- `skill` - Skill being used
- `context` - Additional context (distance, conditions, etc.)

**Returns:**
- Final damage value

**Formula:**
```
baseDamage = skill.power × attacker.stats.atk
defense = defender.stats.def / (defender.stats.def + 100)
resistance = defender.resistances[skill.damageType]
critical = random() < attacker.stats.crit ? attacker.stats.critDmg : 1.0

finalDamage = baseDamage 
    × (1 - defense)
    × (1 - resistance)
    × critical
    × conditionalModifiers
```

---

### calculateHealing()
```typescript
calculateHealing(
    healer: Unit,
    target: Unit,
    healOp: HealOp
): number
```

Calculates heal amount.

**Parameters:**
- `healer` - Unit performing heal
- `target` - Unit being healed
- `healOp` - Heal operation details

**Returns:**
- Heal amount

---

## Type Definitions

### Core Types

#### Unit
```typescript
interface Unit {
    id: string;
    owner: 'player' | 'opponent';
    type: UnitType;
    level: number;
    
    // Stats
    base: BaseStats;
    stats: CurrentStats;
    resistances: ElementalResistances;
    
    // Position
    pos: CellPos;
    
    // State
    statuses: StatusInstance[];
    skills: SkillId[];
    modules: UnitModule[];
    runtime: UnitRuntime;
}
```

---

#### BaseStats
```typescript
interface BaseStats {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    res: number;
    spd: number;
    crit: number;
    critDmg: number;
    acc: number;
    eva: number;
    penetration?: number;
    lifesteal?: number;
}
```

---

#### UnitRuntime
```typescript
interface UnitRuntime {
    initiative: number;
    cooldowns: Record<SkillId, number>;
    isStunned: boolean;
    isFrozen: boolean;
    isSilenced: boolean;
    isRooted: boolean;
    isSleeping: boolean;
    isCharmed: boolean;
    actionPoints: number;
    movePoints: number;
    comboCount: number;
    hasActed: boolean;
    hasMoved: boolean;
    isReacting: boolean;
    lastActionTimestamp: number;
}
```

---

#### Skill
```typescript
interface Skill {
    id: SkillId;
    name: string;
    description: string;
    cost: number;
    cooldown: number;
    targeting: TargetingInfo;
    ops: SkillOp[];
    tags?: string[];
    actionDelay?: number;
    quickcast?: boolean;
}
```

---

#### TargetingInfo
```typescript
interface TargetingInfo {
    type: TargetingType;
    range: number;
    radius?: number;
    width?: number;
    maxTargets?: number;
    requiresLineOfSight?: boolean;
    canTargetSelf?: boolean;
    filter: TargetFilter;
}
```

---

#### StatusInstance
```typescript
interface StatusInstance {
    id: string;
    statusId: StatusId;
    duration: number;
    stacks: number;
    sourceId: UnitId;
    value?: number;
}
```

---

### Enums

#### UnitType
```typescript
type UnitType =
    // Basic Units
    | 'Guardian' | 'Scout' | 'Striker' | 'Arcanist' | 'Vanguard'
    | 'Sentinel' | 'Mechanist' | 'Monk' | 'FrostAdept' | 'WarImp'
    // ... many more
    // Summoned Units
    | 'Turret';
```

---

#### DamageType
```typescript
type DamageType =
    | 'physical'
    | 'magical'
    | 'true'
    | 'fire'
    | 'frost'
    | 'lightning'
    | 'poison'
    | 'arcane'
    | 'void';
```

---

#### TargetingType
```typescript
type TargetingType = 
    | 'single' 
    | 'aoe' 
    | 'line' 
    | 'cone' 
    | 'chain' 
    | 'self';
```

---

#### TargetFilter
```typescript
type TargetFilter = 
    | 'any' 
    | 'ally' 
    | 'enemy' 
    | 'empty' 
    | 'occupied';
```

---

## Game Store (Zustand)

### State
```typescript
interface ExtendedGameState {
    // Board
    grid: Cell[][];
    
    // Units
    units: Unit[];
    selectedUnitId: string | null;
    
    // Turn
    turn: Player;
    turnOrder: string[];
    activeUnitId: string | null;
    
    // Targeting
    targetingSkillId: string | null;
    validMoves: Position[];
    
    // History
    moveHistory: Move[];
}
```

### Actions

#### selectUnit()
```typescript
selectUnit: (unitId: string) => void
```

Selects a unit and calculates valid moves.

---

#### moveUnit()
```typescript
moveUnit: (unitId: string, targetPos: Position) => void
```

Moves a unit to the target position.

---

#### setTargetingMode()
```typescript
setTargetingMode: (skillId: string | null) => void
```

Enters or exits skill targeting mode.

---

#### endTurn()
```typescript
endTurn: () => void
```

Ends the current player's turn.

---

## Usage Examples

### Execute a Skill

```typescript
import { useGameStore } from './store/gameStore';
import { SKILL_REGISTRY } from './combat/skills/SkillRegistry';

const { units, selectedUnitId, setTargetingMode } = useGameStore();

// Get selected unit
const unit = units.find(u => u.id === selectedUnitId);

// Get skill
const skill = SKILL_REGISTRY['fireball'];

// Enter targeting mode
setTargetingMode('fireball');

// User clicks target
const targetPos = { x: 5, y: 5 };

// Execute skill (simplified)
engine.executeAction({
    type: 'skill',
    sourceId: unit.id,
    skillId: skill.id,
    targetPos
});
```

---

### Calculate Damage

```typescript
import { calculateDamage } from './combat/math/DamageCalculator';

const damage = calculateDamage(
    attacker,
    defender,
    SKILL_REGISTRY['slash'],
    {
        distance: 1,
        isCrit: false,
        isFlank: true
    }
);
```

---

### Check Movement

```typescript
import { getKnightPattern } from './combat/movement/MovementPatterns';

const validMoves = getKnightPattern(unit, grid);
console.log(`Unit can move to ${validMoves.length} positions`);
```

---

## Error Handling

### Common Errors

#### SkillNotFound
```typescript
try {
    const skill = SKILL_REGISTRY[skillId];
    if (!skill) {
        throw new Error(`Skill ${skillId} not found`);
    }
} catch (error) {
    console.error(error);
}
```

#### InvalidTarget
```typescript
if (!isValidTarget(target, skill.targeting)) {
    throw new Error('Invalid target for skill');
}
```

#### InsufficientResources
```typescript
if (unit.runtime.actionPoints < skill.cost) {
    throw new Error('Not enough AP');
}
```

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Skill Creation Guide](./SKILL_CREATION_GUIDE.md)
- [Status Effects Guide](./STATUS_EFFECTS_GUIDE.md)
- [Developer Setup](./DEVELOPER_SETUP.md)
