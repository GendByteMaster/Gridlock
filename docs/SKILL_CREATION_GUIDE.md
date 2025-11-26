# Skill Creation Guide

## Quick Start

This guide walks you through creating custom skills for Gridlock's combat system.

### 5-Minute Quick Start

```typescript
// 1. Open src/combat/skills/SkillRegistry.ts
// 2. Add your skill to the SKILL_REGISTRY object:

my_awesome_skill: {
    id: 'my_awesome_skill',
    name: 'Awesome Strike',
    description: 'A powerful melee attack',
    cost: 2,
    cooldown: 3,
    targeting: {
        type: 'single',
        range: 1,
        filter: 'enemy'
    },
    ops: [
        { type: 'damage', power: 1.5, damageType: 'physical' }
    ],
    tags: ['offensive', 'melee']
}

// 3. Add skill ID to unit's skill list in gameStore.ts
```

---

## Skill Structure

Every skill follows this structure:

```typescript
interface Skill {
    // Identity
    id: string;                 // Unique identifier (snake_case)
    name: string;               // Display name
    description: string;        // Tooltip text
    
    // Cost & Cooldown
    cost: number;              // Action Points required
    cooldown: number;          // Turns until reusable
    
    // Targeting
    targeting: TargetingInfo;  // Who/what can be targeted
    
    // Effects
    ops: SkillOp[];           // Ordered list of operations
    
    // Optional
    tags?: string[];          // Categories for filtering
    actionDelay?: number;     // Initiative penalty (default: 0)
    quickcast?: boolean;      // Reduced initiative cost
}
```

---

## Targeting Configuration

The `targeting` property determines how skills can be used.

### Targeting Types

#### Single Target
```typescript
targeting: {
    type: 'single',
    range: 3,              // Max distance
    filter: 'enemy',       // Who can be targeted
    requiresLineOfSight?: true
}
```

#### Area of Effect (AoE)
```typescript
targeting: {
    type: 'aoe',
    range: 5,              // Distance to center
    radius: 2,             // AoE radius
    filter: 'any'
}
```

#### Line
```typescript
targeting: {
    type: 'line',
    range: 6,              // Line length
    width: 1,              // Line width
    filter: 'enemy',
    piercing: true         // Hits all in line
}
```

#### Cone
```typescript
targeting: {
    type: 'cone',
    range: 4,
    width: 3,              // Cone width at end
    filter: 'enemy'
}
```

#### Chain (Bouncing)
```typescript
targeting: {
    type: 'chain',
    range: 5,
    maxTargets: 4,         // Max bounces
    filter: 'enemy'
}
```

#### Self
```typescript
targeting: {
    type: 'self',
    range: 0,
    canTargetSelf: true,
    filter: 'ally'
}
```

### Target Filters

| Filter | Description |
|--------|-------------|
| `'any'` | Any unit or tile |
| `'ally'` | Friendly units only |
| `'enemy'` | Hostile units only |
| `'empty'` | Unoccupied tiles |
| `'occupied'` | Tiles with units |

---

## Skill Operations (SkillOp)

Operations are executed in order to create skill effects.

### Damage Operations

#### Basic Damage
```typescript
{
    type: 'damage',
    power: 1.5,                    // Damage multiplier
    damageType: 'physical',        // Damage type
    isFlat: false                  // false = scales with ATK
}
```

#### Damage with Modifiers
```typescript
{
    type: 'damage',
    power: 2.0,
    damageType: 'physical',
    modifiers: [
        {
            condition: 'low_hp',   // Bonus vs low HP enemies
            multiplier: 2.0,       // 2x damage
            threshold: 0.3         // When target < 30% HP
        },
        {
            condition: 'stunned',  // Bonus vs stunned
            multiplier: 1.5
        }
    ]
}
```

**Available Conditions:**
- `'stunned'`, `'frozen'`, `'burning'`, `'poisoned'`
- `'low_hp'`, `'high_hp'` (requires threshold)
- `'close_range'`, `'long_range'` (requires threshold)
- `'flanking'`, `'from_behind'`

**Damage Types:**
- `'physical'` - Reduced by defense
- `'magical'` - Reduced by resistance
- `'true'` - Ignores all reduction
- `'fire'`, `'frost'`, `'lightning'`, `'poison'`, `'arcane'`, `'void'`

---

### Movement Operations

#### Dash
```typescript
{
    type: 'dash',
    distance: 3,              // Max dash distance
    ignoreUnits: false        // Can dash through units?
}
```

#### Teleport
```typescript
{
    type: 'teleport',
    range: 5                  // Teleport range
}
```

#### Leap
```typescript
{
    type: 'leap',
    distance: 4,
    landingDamage: 30,        // Damage on landing
    landingRadius: 1          // AoE radius
}
```

---

### Status Effect Operations

#### Apply Status
```typescript
{
    type: 'applyStatus',
    statusId: 'stun',         // Status to apply
    duration: 2,              // Turns
    stacks: 1,                // Stack count (if stackable)
    value: 10,                // Potency (for DoT, shields)
    target: 'target'          // 'self' or 'target'
}
```

**Common Status IDs:**
- `'stun'` - Cannot act
- `'burn'` - Damage over time
- `'freeze'` - Immobilized, bonus damage taken
- `'slow'` - Reduced initiative speed
- `'haste'` - Increased initiative speed
- `'silence'` - Cannot use skills
- `'shield'` - Damage absorption

#### Cleanse
```typescript
{
    type: 'cleanse',
    statusType: 'debuff',     // 'buff', 'debuff', 'control'
    count: 2                  // Number to remove
}
```

---

### Support Operations

#### Heal
```typescript
{
    type: 'heal',
    amount: 50,               // Heal amount
    isFlat: true,             // true = flat, false = % of max HP
    canOverheal: false        // Excess becomes shield?
}
```

#### Shield
```typescript
{
    type: 'shield',
    amount: 100,              // Shield HP
    duration: 3,              // Turns
    isBarrier: false          // Magic vs physical shield
}
```

#### Revive
```typescript
{
    type: 'revive',
    hpPercent: 0.5            // Revive with 50% HP
}
```

---

### Displacement Operations

#### Push
```typescript
{
    type: 'push',
    distance: 2,              // Push distance
    damageOnCollision: 20     // Damage if hits obstacle
}
```

#### Pull
```typescript
{
    type: 'pull',
    distance: 2               // Pull distance
}
```

#### Swap
```typescript
{
    type: 'swap'              // Swap positions with target
}
```

---

### Area Operations

#### AoE
```typescript
{
    type: 'aoe',
    radius: 2,
    center: 'target'          // 'source' or 'target'
}
```

#### Line
```typescript
{
    type: 'line',
    length: 6,
    width: 1,
    piercing: true            // Hits all in line
}
```

#### Cone
```typescript
{
    type: 'cone',
    length: 4,
    angle: 60                 // Cone angle in degrees
}
```

#### Chain
```typescript
{
    type: 'chain',
    maxBounces: 3,
    damageReduction: 0.2,     // 20% less per bounce
    range: 3                  // Max distance between targets
}
```

---

### Special Operations

#### Summon
```typescript
{
    type: 'summon',
    unitType: 'Turret',       // Must be valid UnitType
    duration: 3,              // Turns (-1 for permanent)
    position: 'adjacent'      // 'adjacent' or 'target'
}
```

---

## Complete Skill Examples

### Example 1: Simple Melee Attack

```typescript
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
}
```

### Example 2: AoE Spell with Status

```typescript
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
        { 
            type: 'applyStatus', 
            statusId: 'burn', 
            duration: 2, 
            stacks: 1, 
            value: 10 
        }
    ],
    tags: ['offensive', 'ranged', 'aoe', 'fire'],
    actionDelay: 10
}
```

### Example 3: Chain Lightning

```typescript
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
        { 
            type: 'chain', 
            maxBounces: 3, 
            damageReduction: 0.2, 
            range: 3 
        },
        { type: 'damage', power: 1.5, damageType: 'lightning' }
    ],
    tags: ['offensive', 'ranged', 'chain', 'lightning']
}
```

### Example 4: Dash with Landing Damage

```typescript
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
        { 
            type: 'leap', 
            distance: 4, 
            landingDamage: 30, 
            landingRadius: 1 
        }
    ],
    tags: ['mobility', 'offensive']
}
```

### Example 5: Support Skill

```typescript
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
        { type: 'heal', amount: 0.3, isFlat: false }  // Heals 30% max HP
    ],
    tags: ['support', 'healing']
}
```

### Example 6: Complex Combo Skill

```typescript
execute: {
    id: 'execute',
    name: 'Execute',
    description: 'Massive damage to low HP enemies',
    cost: 2,
    cooldown: 3,
    targeting: {
        type: 'single',
        range: 1,
        filter: 'enemy'
    },
    ops: [
        {
            type: 'damage',
            power: 2.0,
            damageType: 'physical',
            modifiers: [
                { 
                    condition: 'low_hp', 
                    multiplier: 2.0, 
                    threshold: 0.3   // 2x damage if target < 30% HP
                }
            ]
        }
    ],
    tags: ['offensive', 'melee', 'combo']
}
```

---

## Best Practices

### Naming Conventions

- **Skill IDs**: `snake_case` (e.g., `chain_lightning`)
- **Skill Names**: Title Case (e.g., `Chain Lightning`)
- **Descriptions**: Clear, concise action description

### Balancing Guidelines

1. **Cost vs Power**
   - Basic attacks: 0-1 cost
   - Medium skills: 2-3 cost
   - Powerful skills: 4-5 cost

2. **Cooldown**
   - Spammable: 0-1 turns
   - Standard: 2-3 turns
   - Ultimate: 5+ turns

3. **Initiative Delay**
   - Quick: 0-10
   - Normal: 10-20
   - Heavy: 20-40

4. **Damage Power**
   - Basic: 1.0-1.5
   - Medium: 1.5-2.0
   - High: 2.0-3.0

### Tags

Tag skills appropriately for filtering and categorization:

- **Type**: `offensive`, `defensive`, `support`
- **Range**: `melee`, `ranged`
- **Category**: `mobility`, `control`, `healing`
- **Element**: `fire`, `frost`, `lightning`, `poison`
- **Special**: `aoe`, `chain`, `ultimate`, `quickcast`, `combo`

---

## Testing Your Skill

### Manual Testing Checklist

1. ✅ **Add to Registry** - Skill appears in `SKILL_REGISTRY`
2. ✅ **Assign to Unit** - Add to unit's skill list
3. ✅ **In-Game Test** - Select unit and verify skill appears
4. ✅ **Targeting** - Confirm valid targets highlight correctly
5. ✅ **Execution** - Skill executes as expected
6. ✅ **Effects** - Damage, status, movement work correctly
7. ✅ **Cooldown** - Cooldown applies after use
8. ✅ **Balance** - Feels fair and fun

### Common Issues

**Skill Doesn't Appear**
- Check skill ID matches
- Verify it's in unit's `skills` array
- Ensure no TypeScript errors

**Invalid Target**
- Check `filter` property
- Verify `range` is sufficient
- Confirm `type` matches intent

**Wrong Damage**
- Check `power` value
- Verify `damageType`
- Review modifiers

**Status Not Applied**
- Confirm `statusId` exists in StatusRegistry
- Check `duration` and `stacks`
- Verify `target` property

---

## Advanced Techniques

### Conditional Operations

```typescript
ops: [
    {
        type: 'conditional',
        condition: 'frozen',
        ops: [
            { type: 'damage', power: 3.0, damageType: 'physical' }
        ],
        elseOps: [
            { type: 'damage', power: 1.2, damageType: 'physical' }
        ]
    }
]
```

### Delayed Effects

```typescript
ops: [
    {
        type: 'delayed',
        delay: 2,  // Triggers in 2 turns
        ops: [
            { type: 'damage', power: 2.0, damageType: 'fire' }
        ]
    }
]
```

### Multi-Step Combos

```typescript
ops: [
    { type: 'dash', distance: 3 },
    { type: 'damage', power: 1.5, damageType: 'physical' },
    { type: 'applyStatus', statusId: 'slow', duration: 2 }
]
```

---

## Related Documentation

- [Status Effects Guide](./STATUS_EFFECTS_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
