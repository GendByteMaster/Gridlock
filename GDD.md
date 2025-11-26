# GDD Structure for GRIDLOCK

## 1. Game Overview
### 1.1. Title
**GRIDLOCK**

### 1.2. Genre
Tactical Grid RPG / Chess-Based Combat / Node Skill Strategy

### 1.3. Core Fantasy
You are a master of the grid — a tactical board where units fight using customizable skill sequences and adaptive strategies.

### 1.4. Elevator Pitch
“Chess meets tactical RPG: build your skill sequences through a node-based system and battle on a dynamic grid where every move locks or unlocks strategic possibilities.”

### 1.5. Target Platform
- Web (React + TS)
- Mobile (PWA)
- Desktop (Electron optional)

### 1.6. Target Audience
- Strategy fans
- Chess lovers
- RPG players
- Tacticians who enjoy buildcrafting

## 2. Core Gameplay
### 2.1. The Grid
- **Board Size**: 10×10 tactical grid
- Cells have properties (normal, charged, corrupted, void)
- Strategic positioning is crucial

### 2.2. Units
Each player controls six key units (like chess but reduced):
- **Vanguard** (Knight archetype)
- **Sentinel** (Rook archetype)
- **Arcanist** (Bishop archetype)
- **Coreframe** (King archetype)
- **Phantom** (Assassin type)
- **Fabricator** (Support type)
    - Mobility
    - Control
- Players choose 3 starting skill paths, one per category.

### 3.2. Node Graph
Skills represented as:
- Nodes
- Edges represent conditional activation flow

### 3.3. Combo Routing
Player can route skills in custom orders:
- 2-1-3 (Offense → Mobility → Control)
- 3-3-1
- 1-2-1
- 2-2-2

Each route changes:
- Cooldown patterns
- Cell effects
- Ability bonuses

### 3.4. Meta-Skill (Overdrive)
Activates when the player finishes a full sequence (e.g. 2-1-3):
- Powerful finisher
- Board-altering effect

### 3.5. Node Types
- Active Skills
- Passive Modifiers
- Grid Effects (tile manipulation)
- Chain Connectors (enable combo branching)
- Power Nodes (ultimates)

## 4. Units and Roles
### 4.1. Vanguard
- Mobility bruiser
- Gains bonus from route patterns like 1-3-1

### 4.2. Sentinel
- Tank/control
- Specializes in tile blocking (true “gridlock” playstyle)

### 4.3. Arcanist
- Range damage
- Skills create charged tiles

### 4.4. Phantom
- Assassin
- Excels in momentum-based sequencing

### 4.5. Fabricator
- Support/engineer
- Places constructs, barriers, boosters

### 4.6. Coreframe
- Leader unit
- Losing it = defeat
- Has defensive and board-manipulation skills

## 5. Game Loop
### 5.1. Battle Loop
1. Choose sequence (e.g., 2-1-3)
2. Activate node-chain skills
3. Move unit
4. Apply tile effects
5. Opponent turn
6. Momentum gain / Overdrive prep
7. Repeat

### 5.2. Progression Loop
- Earn XP
- Unlock new nodes
- Expand routing combinations
- Find rare nodes (legendary passives)
- Unlock visual styles for units

## 6. Visual & UI Style
### 6.1. Style Keywords
- Tech noir
- Clean minimalism
- Neon intersections
- Grid as primary motif

### 6.2. UI Elements
- Hex-like node maps
- Dark background + cyan/purple highlights
- Motion blur transitions
- “Digital static” effects on blocked tiles

## 7. Technical Design
### 7.1. Tech Stack
- React + TypeScript
- Zustand for state
- Optionally React Flow for skill graph
- Canvas / WebGL for grid rendering
- Node.js backend (optional)

### 7.2. Systems
- Skill Engine
- Grid Engine
- Turn System
- Unit State Machine
- Node Graph Parser
- AI Opponent Logic (minimax + ability heuristics)

## 8. Monetization (optional)
- Premium model:
- Cosmetic skins
- Node themes
- Premium campaigns
- No pay-to-win mechanics

## 9. Roadmap
- [x] Phase 1: Core Grid Engine
- [x] Phase 2: Combat System v3.0
  - [x] FFT-style initiative
  - [x] Operation-based skills
  - [x] Status effect system
  - [x] Damage calculations
  - [x] Movement patterns
- [ ] Phase 3: UI Polish
- [ ] Phase 4: AI Opponent
- [ ] Phase 5: Multiplayer
- [ ] Phase 6: Balancing + Early Access

---

## 10. Technical Documentation

For detailed technical information:
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Skill Creation Guide](./docs/SKILL_CREATION_GUIDE.md)
- [Status Effects Guide](./docs/STATUS_EFFECTS_GUIDE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Developer Setup](./docs/DEVELOPER_SETUP.md)
