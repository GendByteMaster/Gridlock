# Unit Logic and Skills Implementation Walkthrough

## Overview
This update implements the detailed movement logic and unique skills for all 20 units (10 Basic Units + 10 Unique Heroes) as requested.

## Changes

### 1. Movement Logic (`src/combat/movement/UnitMovementRegistry.ts`)
- **Basic Units**:
  - **Guardian**: Orthogonal move, `Guardian Stance` (+10% DEF if stationary).
  - **Scout**: Range 2, `Capture Point Speed`, `Dash` ignores height.
  - **Striker**: `Aggression` (+10% DMG after move), `Exposed` (-1 DEF near enemy).
  - **Arcanist**: Diagonal move, `Enhanced Movement` (Range 2 if no skill used).
  - **Vanguard**: 1-2 Straight, `Momentum` (Passive if moved 2).
  - **Sentinel**: Back/Side move, `Retreat` (Extra step back), `Precision` (+Acc side move).
  - **Mechanist**: `Overclock Charge` (+Range if stationary), Turret drag logic placeholder.
  - **Monk**: `Balance` (Acc straight), `Evasion` (Eva diagonal), Pass through allies.
  - **Frost Adept**: Diagonal, `Ice Momentum` (Ignore LOS), `Chill Aura`.
  - **War Imp**: Zigzag (Range 2 any), `Overheat` (+Explosion), Jump.

- **Unique Heroes**:
  - **Chrono Knight**: Officer+Knight move, `Time Rewind` on kill.
  - **Storm Titan**: `Electric Pulse` after move, Chain lightning attack.
  - **Shadow Dancer**: Jump 2, `Shadow Swap`, Evasion.
  - **Solar Priest**: Beam attack, Heal/Cleanse.
  - **Void Walker**: Teleport (Range 3), Long Jump (Range 6), `Void Pull`.
  - **Iron Colossus**: Push on move, `Unstoppable`, Step forward on kill.
  - **Arcane Archer**: Range 2 move, `Piercing Shot`, Shoot through allies.
  - **Bone Reaper**: Pass through dead, `Scythe Sweep` (AoE), `Soul Harvest`.
  - **Ember Witch**: 2 Diag / 1 Straight, `Magma Ball` (Fireball), Burning ground.
  - **Astral Sentinel**: 2 Straight / 1 Diag, `Anti-Portal` zone, `Astral Pulse`.

### 2. Skill Definitions
- **`src/combat/skills/SkillRegistry.ts`**: Added complex skill definitions (Ops) for all hero skills (e.g., `chrono_strike`, `titan_strike`, `solar_beam`).
- **`src/data/skills.ts`**: Added simple skill definitions for UI display and assignment.

### 3. Game Logic (`src/store/gameStore.ts`)
- **Unit Initialization**: Updated `createInitialUnits` to assign the new unique skills to the heroes.
- **Skill Execution**: Updated `executeSkill` to generically handle Damage, Mobility, and Summon skills based on their category and properties, enabling the new hero skills to function immediately.

## Verification
1.  **Start the Game**: Run `npm run dev`.
2.  **Select Units**: Click on the new heroes (Rows 0 and 9) to see their updated skills in the UI.
3.  **Movement**:
    - Select **Vanguard** and verify it can only move straight 1-2 tiles.
    - Select **Arcanist** and verify diagonal movement.
    - Select **Void Walker** and verify Teleport (ignore obstacles).
4.  **Skills**:
    - Use **Solar Priest's Solar Beam** to attack enemies in a line.
    - Use **Void Walker's Void Warp** to teleport.
    - Use **Mechanist's Deploy Turret** to summon a turret.
