# Status Effects System Guide

## Overview

Status effects in Gridlock are data-driven, event-based modifiers that can alter unit behavior, stats, and capabilities. The system is designed to be flexible and extensible.

## StatusDefinition Structure

Every status effect is defined using the `StatusDefinition` interface:

```typescript
interface StatusDefinition {
    // Identity
    id: string;
    name: string;
    type: 'buff' | 'debuff' | 'control' | 'aura';
    
    // Stacking Rules
    isStackable: boolean;
    maxStacks?: number;
    isDurationStackable?: boolean;
    
    // Exclusivity
    isExclusiveWith?: string[];
    
    // Aura Properties
    isAura?: boolean;
    auraRadius?: number;
    isPersistent?: boolean;
    
    // Event Hooks
    onApply?: (unit: Unit, instance: StatusInstance) => void;
    onTick?: (unit: Unit, instance: StatusInstance) => void;
    onRemove?: (unit: Unit, instance: StatusInstance) => void;
    onHit?: (unit: Unit, instance: StatusInstance, target: Unit) => void;
    onMove?: (unit: Unit, instance: StatusInstance) => void;
    onTurnStart?: (unit: Unit, instance: StatusInstance) => void;
    onTurnEnd?: (unit: Unit, instance: StatusInstance) => void;
    
    // Stat Modifiers
    statModifiers?: Partial<BaseStats>;
    resistanceModifiers?: Partial<ElementalResistances>;
    initiativeModifier?: number;
}
```

---

## Status Types

### Buff
Positive effects that enhance unit capabilities.

**Examples:**
- Haste (increased initiative)
- Attack buff
- Shield/barrier

### Debuff  
Negative effects that reduce unit effectiveness.

**Examples:**
- Slow (reduced initiative)
- Attack reduction
- Defense reduction

### Control
Effects that limit unit actions.

**Examples:**
- Stun (cannot act)
- Silence (cannot use skills)
- Root (cannot move)
- Freeze (immobilized + vulnerability)

### Aura
Effects that radiate to nearby units.

**Examples:**
- Healing aura
- Damage aura
- Stat boost aura

---

## Creating Status Effects

### Step-by-Step Process

1. **Define the Status**
   ```typescript
   // In StatusRegistry.ts
   export const STATUS_DEFINITIONS: Record<string, StatusDefinition> = {
       my_status: {
           id: 'my_status',
           name: 'My Status',
           type: 'buff',
           isStackable: false
       }
   };
   ```

2. **Add Event Hooks**
   ```typescript
   my_status: {
       // ... base properties
       onApply: (unit, instance) => {
           console.log(`${unit.id} gained My Status!`);
       },
       onTick: (unit, instance) => {
           // Happens every turn
       }
   }
   ```

3. **Reference in Skills**
   ```typescript
   // In SkillRegistry.ts
   my_skill: {
       // ... other properties
       ops: [
           {
               type: 'applyStatus',
               statusId: 'my_status',
               duration: 3,
               stacks: 1
           }
       ]
   }
   ```

---

## Stacking Mechanics

### Non-Stackable (Default)
Only one instance can exist. New applications refresh duration.

```typescript
{
    id: 'shield',
    isStackable: false
}
```

**Behavior:**
- Unit has Shield (3 turns remaining)
- Apply Shield again → Shield (3 turns remaining) [refreshed]

### Stackable
Multiple instances accumulate.

```typescript
{
    id: 'burn',
    isStackable: true,
    maxStacks: 5
}
```

**Behavior:**
- Unit has Burn x2
- Apply Burn → Burn x3
- Damage = baseDamage × stacks

### Duration Stackable
Each application extends duration.

```typescript
{
    id: 'poison',
    isStackable: false,
    isDurationStackable: true
}
```

**Behavior:**
- Unit has Poison (2 turns)
- Apply Poison (3 turns) → Poison (5 turns)

---

## Event Hooks

### onApply
Triggered when status is first applied.

```typescript
onApply: (unit, instance) => {
    // Initial setup
    unit.stats.def += 20;
    
    // Visual effects
    showBuffAnimation(unit);
    
    // Logging
    logEvent(`${unit.id} gained ${instance.statusId}`);
}
```

### onTick
Triggered every turn the status is active.

```typescript
onTick: (unit, instance) => {
    // Damage over time
    const damage = instance.value || 10;
    unit.stats.hp -= damage * instance.stacks;
}
```

### onRemove
Triggered when status expires or is cleansed.

```typescript
onRemove: (unit, instance) => {
    // Cleanup
    unit.stats.def -= 20;
    
    // Visual effects
    hideBuffAnimation(unit);
}
```

### onTurnStart
Triggered at the start of unit's turn.

```typescript
onTurnStart: (unit, instance) => {
    // Regeneration
    const heal = unit.stats.maxHp * 0.05;
    unit.stats.hp = Math.min(unit.stats.hp + heal, unit.stats.maxHp);
}
```

### onTurnEnd
Triggered at the end of unit's turn.

```typescript
onTurnEnd: (unit, instance) => {
    // End-of-turn effects
    instance.duration--;
}
```

### onHit
Triggered when unit lands an attack.

```typescript
onHit: (unit, instance, target) => {
    // Apply debuff on hit
    target.statuses.push({
        statusId: 'slow',
        duration: 1,
        stacks: 1
    });
}
```

### onMove
Triggered when unit moves.

```typescript
onMove: (unit, instance) => {
    // Take damage when moving
    unit.stats.hp -= 5;
}
```

---

## Stat Modifiers

Status effects can directly modify stats.

### Flat Modifiers
```typescript
statModifiers: {
    atk: 50,      // +50 attack
    def: -20,     // -20 defense
    spd: 30       // +30 speed
}
```

### Percentage Modifiers
Use `onApply` and `onRemove` for percentage changes:

```typescript
onApply: (unit, instance) => {
    unit.stats.atk *= 1.5;  // +50% attack
},
onRemove: (unit, instance) => {
    unit.stats.atk /= 1.5;  // Remove bonus
}
```

### Resistance Modifiers
```typescript
resistanceModifiers: {
    fire: 0.5,      // +50% fire resistance
    frost: -0.25    // -25% frost resistance
}
```

### Initiative Modifier
```typescript
initiativeModifier: 20  // +20 initiative speed
```

---

## Built-in Status Effects

### Control Effects

#### Stun
```typescript
stun: {
    id: 'stun',
    name: 'Stunned',
    type: 'control',
    isStackable: false,
    onApply: (unit) => {
        unit.runtime.isStunned = true;
        unit.runtime.initiative = 0;  // Stop initiative timer
    },
    onRemove: (unit) => {
        unit.runtime.isStunned = false;
    }
}
```

#### Freeze
```typescript
freeze: {
    id: 'freeze',
    name: 'Frozen',
    type: 'control',
    isStackable: false,
    onApply: (unit) => {
        unit.runtime.isFrozen = true;
        unit.runtime.initiative = 0;
    },
    onRemove: (unit) => {
        unit.runtime.isFrozen = false;
    },
    resistanceModifiers: {
        physical: -0.5  // Takes 50% more physical damage
    }
}
```

#### Silence
```typescript
silence: {
    id: 'silence',
    name: 'Silenced',
    type: 'control',
    isStackable: false,
    onApply: (unit) => {
        unit.runtime.isSilenced = true;
    },
    onRemove: (unit) => {
        unit.runtime.isSilenced = false;
    }
}
```

#### Root
```typescript
root: {
    id: 'root',
    name: 'Rooted',
    type: 'control',
    isStackable: false,
    onApply: (unit) => {
        unit.runtime.isRooted = true;
    },
    onRemove: (unit) => {
        unit.runtime.isRooted = false;
    }
}
```

---

### Damage Over Time (DoT)

#### Burn
```typescript
burn: {
    id: 'burn',
    name: 'Burning',
    type: 'debuff',
    isStackable: true,
    maxStacks: 5,
    onTick: (unit, instance) => {
        const damage = instance.value || 10;
        unit.stats.hp -= damage * instance.stacks;
    }
}
```

#### Poison
```typescript
poison: {
    id: 'poison',
    name: 'Poisoned',
    type: 'debuff',
    isStackable: true,
    onTick: (unit, instance) => {
        const damage = instance.value || 5;
        unit.stats.hp -= damage * instance.stacks;
    }
}
```

---

### Buffs

#### Haste
```typescript
haste: {
    id: 'haste',
    name: 'Haste',
    type: 'buff',
    isStackable: false,
    initiativeModifier: 50  // +50% initiative speed
}
```

#### Attack Boost
```typescript
attack_boost: {
    id: 'attack_boost',
    name: 'Attack Boost',
    type: 'buff',
    isStackable: true,
    maxStacks: 3,
    statModifiers: {
        atk: 20  // +20 attack per stack
    }
}
```

---

### Defensive Effects

#### Shield
```typescript
shield: {
    id: 'shield',
    name: 'Shield',
    type: 'buff',
    isStackable: false,
    onApply: (unit, instance) => {
        unit.stats.shield = instance.value || 100;
    },
    onRemove: (unit) => {
        unit.stats.shield = 0;
    }
}
```

#### Barrier (Magic Shield)
```typescript
barrier: {
    id: 'barrier',
    name: 'Barrier',
    type: 'buff',
    isStackable: false,
    onApply: (unit, instance) => {
        unit.stats.barrier = instance.value || 100;
    },
    onRemove: (unit) => {
        unit.stats.barrier = 0;
    }
}
```

---

## Aura Effects

Auras radiate to nearby units automatically.

```typescript
healing_aura: {
    id: 'healing_aura',
    name: 'Healing Aura',
    type: 'aura',
    isAura: true,
    auraRadius: 2,
    isPersistent: true,  // Doesn't expire naturally
    
    // Applied to nearby allies each turn
    onTurnStart: (unit, instance) => {
        // Find allies in radius
        const nearbyAllies = findUnitsInRadius(unit.pos, 2, 'ally');
        
        // Heal each
        nearbyAllies.forEach(ally => {
            const heal = ally.stats.maxHp * 0.05;  // 5% max HP
            ally.stats.hp = Math.min(ally.stats.hp + heal, ally.stats.maxHp);
        });
    }
}
```

---

## Exclusivity Rules

Some statuses cannot coexist:

```typescript
freeze: {
    id: 'freeze',
    isExclusiveWith: ['burn']  // Cannot be frozen and burning
}
```

**Behavior:**
- Unit is Frozen
- Apply Burn → Burn replaces Freeze

---

## Advanced Patterns

### Conditional Status
Apply status only if condition met:

```typescript
// In skill
ops: [
    {
        type: 'conditional',
        condition: 'low_hp',
        ops: [
            { 
                type: 'applyStatus', 
                statusId: 'execute_vulnerable', 
                duration: 1 
            }
        ]
    }
]
```

### Stacking Damage
Damage scales with stacks:

```typescript
onTick: (unit, instance) => {
    const baseDamage = instance.value || 10;
    const stackMultiplier = instance.stacks;
    const totalDamage = baseDamage * stackMultiplier;
    
    unit.stats.hp -= totalDamage;
}
```

### Transfer Status
Move status from one unit to another:

```typescript
// In SkillRegistry.ts
ops: [
    {
        type: 'transfer',
        statusId: 'poison',
        from: 'self',
        to: 'target'
    }
]
```

### Convert Status
Transform one status into another:

```typescript
ops: [
    {
        type: 'convert',
        fromType: 'debuff',
        toType: 'buff'
    }
]
```

---

## Testing Status Effects

### Manual Testing Checklist

1. ✅ **Application** - Status applies correctly
2. ✅ **Duration** - Counts down each turn
3. ✅ **Stacking** - Stacks behave as configured
4. ✅ **Effects** - onTick/onApply work
5. ✅ **Removal** - onRemove cleans up
6. ✅ **Visuals** - UI shows status icon
7. ✅ **Interactions** - Exclusivity rules work

### Common Issues

**Status Not Applying**
- Check statusId matches definition
- Verify StatusRegistry has the status
- Confirm duration > 0

**Wrong Stacking Behavior**
- Review `isStackable` setting
- Check `maxStacks` limit
- Verify `isDurationStackable`

**Tick Not Firing**
- Ensure `onTick` is defined
- Verify turn is advancing
- Check initiative system

---

## Best Practices

### Naming
- **ID**: `snake_case` (e.g., `attack_boost`)
- **Name**: Title Case (e.g., `Attack Boost`)

### Performance
- Keep `onTick` logic lightweight
- Avoid complex calculations every tick
- Cache values when possible

### Balancing
- DoT: 5-15 damage per tick
- Buffs: 10-50% stat increase
- Debuffs: 10-30% stat decrease
- Control: 1-3 turn duration

### Documentation
- Document status in code comments
- Explain expected behavior
- Note interactions with other systems

---

## Related Documentation

- [Skill Creation Guide](./SKILL_CREATION_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
