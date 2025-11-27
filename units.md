# Game Units Documentation

## 🔵 10 Basic Units (Identical for both players)
*Light, understandable, readable. These are "classic" roles.*

### 1. Guardian (Страж) — Tank Unit
* **Icon**: Large shield with metal rim
* **Role**: Frontline, soaking damage
* **Movement**: 1 tile straight (forward, backward, left, right)

**Movement Logic:**
*   Cannot pass through allies.
*   Can occupy trap tiles without triggering them (thick armor).
*   **Guardian Stance**: If not moved during the turn, gains +10% DEF until the end of the round.
    *   *Special*: Stance bonus is lost if moved involuntarily (push/pull).

**Active Abilities:**
*   **Shield Bash** (CD 2): Pushes enemy back 1 tile.
*   **Fortify** (CD 3): Gains +50% armor for 1 turn.

**Passive:**
*   **Bulwark**: Reduces incoming damage by 20%.

### 2. Scout (Разведчик) — Mobility Unit
* **Icon**: Boot with forward arrow
* **Role**: Mobile point capture
* **Movement**: 2 tiles in any direction (straight or diagonal)

**Movement Logic:**
*   Cannot pass through occupied tiles.
*   **Capture Momentum**: If ending turn on a capture point, speed increases by +1 tile next turn.
*   **Light Step**: Does not trigger traps during movement.
*   *Special*: If **Dash** was used, can ignore 1 unit of height/obstacle (if mechanics allow).

**Active Abilities:**
*   **Dash** (CD 2): Jump over 1 tile.
*   **Spot**: Highlights an enemy for 1 turn.

### 3. Striker (Ударник) — Melee DPS
* **Icon**: Sword with slash effect
* **Movement**: 1 tile in any direction (including diagonal)

**Movement Logic:**
*   **Aggression**: After moving, the next attack deals +10% damage if performed in the same turn.
*   *Special*: If ending turn **adjacent to an enemy**, receives -1 DEF (too aggressive/open).

**Active Abilities:**
*   **Slash**: Strike adjacent tile.
*   **Lunge** (CD 2): Attack 2 tiles straight ahead.

**Passive:**
*   **Keen Edge**: +15% damage.

### 4. Arcanist (Арканист) — Support Mage
* **Icon**: Round magic rune
* **Movement**: 1 tile diagonally

**Movement Logic:**
*   Cannot move straight.
*   **Adaptive Movement**: If the target diagonal tile is blocked, can "slide" to an adjacent diagonal tile (if in the same diagonal group).
*   *Special*: If **NO ability** was used, movement is empowered: can move **2 tiles diagonally**, but only in one direction.

**Active Abilities:**
*   **Mana Burst** (CD 3): Deals light AoE damage around.
*   **Empower Ally**: Buffs ally with +25% damage.

**Passive:**
*   **Arcane Flow**: Reduces CD of all own abilities by 1.

### 5. Vanguard (Авангард) — Bruiser
* **Icon**: Spartan helmet
* **Movement**: 1 or 2 tiles strictly forward

**Movement Logic:**
*   Direction is determined at start and cannot change during the move.
*   Cannot move 2 tiles if an ally is directly in front.
*   **Momentum**: If moved 2 tiles, activates passive Momentum.
*   *Special*: If moving 2 tiles, cannot perform rotations/turns this round.

**Active Abilities:**
*   **Charge** (CD 3): Dash 2 tiles, knocks back enemy.
*   **War Cry**: Reduces attack of surrounding enemies.

**Passive:**
*   **Momentum**: If moved 2 tiles — +20% damage.

### 6. Sentinel Bow (Лучевой страж) — Ranged Unit
* **Icon**: Bow with shining arrow
* **Movement**: 1 tile backward or sideways (NEVER forward)

**Movement Logic:**
*   **Retreat**: If an enemy is within 1 tile, can take an additional step backward (if free).
*   *Special*: If moved sideways (left/right), gains **+5% Accuracy** until end of turn.

**Active Abilities:**
*   **Arrow Shot**: Ranged attack at 3 tiles.
*   **Volley** (CD 3): Attacks a line.

**Passive:**
*   **Precision**: +10% accuracy.

### 7. Mechanist (Механист) — Engineer
* **Icon**: Wrench
* **Movement**: 1 tile in any direction

**Movement Logic:**
*   **Turret Haul**: If adjacent to a turret, can "stick" to it and move together 1 tile (requires 2 free tiles in direction).
*   *Special*: If **NOT moved**, gains **Overclock Charge**: next turret placed has +1 Attack Range.

**Active Abilities:**
*   **Deploy Turret** (CD 4): Places a turret on a tile.
*   **Repair**: Heals ally by 15%.

**Passive:**
*   **Overclock**: Turret attacks twice upon placement.

### 8. Monk (Монах) — Control Unit
* **Icon**: Two crossed hands
* **Movement**: 1 tile in any direction

**Movement Logic:**
*   **Straight Move**: Gains **Balance** (next attack more accurate).
*   **Diagonal Move**: Gains **Evasion** (+10% until end of turn).
*   *Special*: Can pass through allies (cannot end turn on same tile). Cannot pass through enemies.

**Active Abilities:**
*   **Palm Strike** (CD 3): Stuns for 1 turn.
*   **Meditate**: Heals self for 10% HP.

**Passive:**
*   **Inner Balance**: Immune to slow.

### 9. Frost Adept (Ледяной адепт) — CC Mage
* **Icon**: Sharp-edged snowflake
* **Movement**: 1 tile diagonally

**Movement Logic:**
*   Cannot move straight.
*   **Ice Momentum**: If moving diagonally through a frozen tile, next ability requires no Line of Sight.
*   *Special*: If ending turn adjacent to an enemy, automatically applies **Slow** (1 turn) via Chill Aura.

**Active Abilities:**
*   **Frostbolt** (CD 2): Slows enemy.
*   **Ice Nova** (CD 3): Freezes tile for 1 turn.

**Passive:**
*   **Chill Aura**: Enemies nearby move 1 tile less.

### 10. War Imp (Боевой бес) — Kamikaze Unit
* **Icon**: Small skull with horns
* **Movement**: 2 tiles in any direction

**Movement Logic:**
*   **Zigzag**: Can move 1 tile -> turn -> 1 tile.
*   **Overheat**: If ending turn adjacent to 2+ enemies, passive explosion deals +25% damage.
*   *Special*: Can jump over allies and enemies. If jumping over an enemy, applies **-5% RES** (Chaos Element). Cannot end on occupied tile.

**Active Abilities:**
*   **Explosive Leap** (CD 3): Jump and AoE damage upon landing.

**Passive:**
*   **Deathburst**: Explodes on death.

---

## 🔴 10 Unique Units (Hero-like)
*Each is completely distinct in style.*

### 11. Chrono Knight (Хроно-рыцарь)
* **Icon**: Hourglass + Sword
* **Role**: Tempo-control
* **Movement**: Officer + Knight (Diagonal + Jump maneuvers).
    *   Can make a **Double Move** if the second move is *backward* or *sideways*.
*   **Attack**: Attacks only at the end of the chain.
    *   **Time Rewind**: If killing an enemy, can move back 1 tile.
*   **Special**: Can "freeze" an adjacent enemy for 1 round (Stasis).

**Active Abilities:**
*   **Time Slash** (CD 2): Deals damage and slows.
*   **Rewind** (CD 4): Rewinds self to previous tile.

**Passive:**
*   **Temporal Echo**: First hit in the match is repeated by a ghostly duplicate.

### 12. Storm Titan (Штормовой титан)
* **Icon**: Lightning inside circle
* **Movement**: 1 tile in any direction (Slow).
    *   Generates an **Electric Pulse** after moving.
*   **Attack**: Straight attack (1 tile).
    *   **Chain Lightning**: Hits up to 2 additional targets within 1 tile radius (reduced damage).
*   **Special**: Immune to push/displacement effects.

**Active Abilities:**
*   **Thunder Step** (CD 3): Step causes AoE lightning.
*   **Stormwall**: Absorbs the first attack.

**Passive:**
*   **Static Field**: Enemies nearby take damage every turn.

### 13. Shadow Dancer (Танцор тени)
* **Icon**: Silhouette jumping
* **Movement**: Jump 2 tiles in any direction (can jump over units).
    *   **Shadow Swap**: Can swap positions with a nearby ally (radius 2) at end of turn.
*   **Attack**: Diagonal and Forward.
    *   Bonus damage if attacking from a jump.
*   **Special**: 30% chance to completely evade an attack.

**Active Abilities:**
*   **Shadow Strike** (CD 2): Attack from invisibility.
*   **Vanish** (CD 3): Enters shadow for 1 turn.

**Passive:**
*   **Backstab**: +50% damage to enemies from front/back (flanking).

### 14. Solar Priest (Солнечный жрец)
* **Icon**: Shining circle with cross
* **Movement**: 1-2 tiles straight (Controlled).
*   **Attack**: **Radiant Beam** (Line attack).
    *   Hits all enemies in the line of movement up to a block.
*   **Support**: Can Heal (radius 2) or Cleanse instead of attacking.

**Active Abilities:**
*   **Radiant Beam** (CD 3): Beam in a straight line.
*   **Sanctify**: Creates a healing zone.

**Passive:**
*   **Holy Light**: Allies nearby get +5% regen.

### 15. Void Walker (Странник пустоты)
* **Icon**: Black hole
* **Movement**: Teleport to any free tile within radius 3.
    *   **Long Jump**: Every 3 turns, can teleport up to 6 tiles.
*   **Attack**: Targets only units with free space around them ("Void" requirement).
    *   **Pull**: Pulls target 1 tile closer before striking.
*   **Special**: **Unstable Zone** (Radius 1) - Enemies get accuracy/defense penalty.

**Active Abilities:**
*   **Void Pulse** (CD 2): Ranged attack through walls.
*   **Singularity**: Pulls enemies 1 tile closer.

**Passive:**
*   **Phase Out**: 20% evasion chance.

### 16. Iron Colossus (Колосс)
* **Icon**: Huge metal fist
* **Movement**: 1 tile orthogonal (Heavy).
    *   **Bulldoze**: Pushes units 1 tile if in path (deals damage to enemies).
*   **Attack**: Forward and Side only.
    *   **Trample**: If killing an enemy, takes an extra step forward with a hit.
*   **Special**: **Unstoppable** - Immune to push/control abilities.

**Active Abilities:**
*   **Earth Slam** (CD 3): Stuns in a small area.
*   **Iron Skin**: Invulnerability for 1 turn.

**Passive:**
*   **Heavy Armor**: Cannot be pushed.

### 17. Arcane Archer (Аркан-лучник)
* **Icon**: Magic arrow
* **Movement**: 2 tiles straight or diagonal.
*   **Attack**: Range 3-5 tiles.
    *   Can shoot **through allies** (but not walls).
    *   **Piercing Shot**: Every 3 turns, hits a line.
*   **Special**: If **NOT moved**, gains +Accuracy and +Range.

**Active Abilities:**
*   **Piercing Shot** (CD 3): Shoots through everyone.
*   **Arcane Trap**: Places a magic trap.

**Passive:**
*   **Focus**: +20% ability charge speed.

### 18. Bone Reaper (Костяной жнец)
* **Icon**: Skeleton scythe
* **Movement**: 1-2 tiles in any direction.
    *   **Ghost Walk**: Can pass through dead bodies/remains.
*   **Attack**: **Scythe Sweep** (Arc).
    *   Hits 2 tiles left and right of direction.
    *   **Reap**: If killing a target, makes a finishing step 1 tile forward.
*   **Special**: **Soul Stack** - +1 Damage (stackable) for every kill until end of game.

**Active Abilities:**
*   **Soul Harvest**: Finishes enemy, heals self.
*   **Bone Prison** (CD 3): Blocks a tile.

**Passive:**
*   **Requiem**: At low HP gets +30% damage.

### 19. Ember Witch (Пепельная ведьма)
* **Icon**: Orange flame
* **Movement**: 2 tiles diagonal or 1 tile straight.
*   **Attack**: **Fireball** (Radius 1 AoE).
    *   Leaves **Burning Tile**: Deals damage to anyone entering.
*   **Special**: **Ash Curse** - If a unit dies from her fire, the tile becomes a trap for 2 turns.

**Active Abilities:**
*   **Fireball** (CD 3): Ranged AoE attack.
*   **Burning Ground**: Tile burns for 2 turns.

**Passive:**
*   **Ignite**: Attacks apply burn.

### 20. Astral Sentinel (Астральный страж)
* **Icon**: Star with orbits
* **Movement**: 2 tiles straight or 1 diagonal.
    *   **Star Swap**: Can swap position with nearest Star Mark (set during move).
*   **Attack**: **Energy Pulse** (2 tiles straight).
    *   Bonus damage if target is in "Orbit" (Radius 1).
*   **Special**: **Anti-Portal Zone** - Enemy teleports forbidden within radius 2.

**Active Abilities:**
*   **Astral Shield**: Absorbs magic damage.
*   **Warp Step** (CD 2): Teleport 1 tile.

**Passive:**
*   **Cosmic Insight**: Sees hidden enemies.

---

## ⚖ Balance Principles

*   **Basic 10 Units** → Low power, high utility.
*   **Unique 10 Units** → High power, but long cooldowns.
*   Each unique unit dominates its role but has a counter-role.
*   No unit should be able to do everything.
*   No ability should kill in 1 hit (except Imp/combo).
*   Movement is limited to ensure players read threats.
