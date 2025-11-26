# GRIDLOCK ⚡

> **Chess meets tactical RPG**: Build custom skill sequences through a node-based system and battle on a dynamic grid where every move locks or unlocks strategic possibilities.

![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Tech Stack](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)

> ⚠️ **This game is currently in active development.** Features and gameplay mechanics are subject to change.

---

## 🎮 What is GRIDLOCK?

**GRIDLOCK** is a tactical grid-based RPG that combines the strategic depth of chess with the customization of modern RPGs. Master the battlefield through intelligent positioning, adaptive skill sequences, and dynamic board manipulation.

### Core Fantasy
You are a **master of the grid** — commanding units in tactical combat where every skill activation, every movement, and every tile interaction creates new strategic possibilities.

---

### The Grid
- **Board Size**: 10×10 tactical grid
- **Tile Properties**: 
  - **Normal** - Standard tile
  - **Charged** - Enhanced ability effects
  - **Inert** - Neutral state
  - **Corrupted** - Debuff zone
  - **Void** - Impassable obstacles

### Victory Condition
**Eliminate the enemy Coreframe** (leader unit) while protecting your own.

---

## 🎭 Units & Roles

Each player commands **6 unique units**, each with distinct tactical roles:

| Unit | Role | Archetype | Specialty |
|------|------|-----------|-----------|
| **Vanguard** | Mobility Bruiser | Knight | Chain-dash combos, route patterns |
| **Sentinel** | Tank/Control | Rook | Tile blocking, true "gridlock" playstyle |
| **Arcanist** | Range Damage | Bishop | Creates charged tiles, area control |
| **Phantom** | Assassin | - | Momentum-based sequencing, burst damage |
| **Fabricator** | Support/Engineer | - | Constructs, barriers, team buffs |
| **Coreframe** | Leader | King | Board manipulation, **losing = defeat** |

### Movement
- Based on **traditional chess logic** with RPG enhancements
- Skills can modify movement patterns
- Example: *Vanguard jumps like a knight but can chain-dash after skill activation*

---

## 🔗 Node Skill System

### Skill Paths
Each unit has **3 base skill paths**:
1. **Offense** - Damage and aggression
2. **Mobility** - Movement and positioning
3. **Control** - Crowd control and debuffs

### Combo Routing
Players create **custom skill sequences** by routing nodes in different orders:

```
Examples:
2-1-3  →  Offense → Mobility → Control
3-3-1  →  Control → Control → Offense
1-2-1  →  Offense → Mobility → Offense
2-2-2  →  Offense → Offense → Offense
```

Each route changes:
- ⏱️ Cooldown patterns
- 🎯 Cell effects
- 💪 Ability bonuses

### Node Types
- **Active Skills** - Direct abilities
- **Passive Modifiers** - Stat boosts
- **Grid Effects** - Tile manipulation
- **Chain Connectors** - Enable combo branching
- **Power Nodes** - Ultimate abilities

### Overdrive (Meta-Skill)
Complete a full sequence to activate a **powerful finisher** with board-altering effects!

---

## 🎮 How to Play

### Battle Loop
1. **Choose Sequence** - Select your skill route (e.g., 2-1-3)
2. **Activate Skills** - Execute your node-chain abilities
3. **Move Unit** - Position strategically on the grid
4. **Apply Effects** - Tile properties take effect
5. **Opponent Turn** - Enemy responds
6. **Build Momentum** - Prepare for Overdrive
7. **Repeat** - Adapt and dominate!

### Progression
- 📈 **Earn XP** - Level up your units
- 🔓 **Unlock Nodes** - Expand your skill tree
- 🔀 **New Routes** - Discover powerful combinations
- ⭐ **Rare Nodes** - Find legendary passives
- 🎨 **Visual Styles** - Customize unit appearance

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gridlock.git

# Navigate to project directory
cd gridlock

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **Combat Engine**: Custom TypeScript engine
- **Backend**: Node.js (planned for multiplayer)

---

## 🎨 Visual Style

### Design Keywords
- **Tech Noir** - Dark, futuristic atmosphere
- **Clean Minimalism** - Focused, uncluttered UI
- **Neon Intersections** - Cyan/purple highlights
- **Grid Motif** - Grid as primary visual element

### UI Elements
- Hex-like node maps for skill trees
- Dark background with vibrant accents
- Motion blur transitions
- "Digital static" effects on blocked tiles

---

## 🗺️ Development Roadmap

- [x] **Phase 1**: Core Grid Engine
- [x] **Phase 2**: Combat System v3.0
  - [x] FFT-style initiative system
  - [x] Operation-based skill system
  - [x] Status effect framework
  - [x] Damage calculation system
  - [x] Movement patterns
- [ ] **Phase 3**: UI Polish
- [ ] **Phase 4**: AI Opponent
- [ ] **Phase 5**: Multiplayer
- [ ] **Phase 6**: Balancing + Early Access

---

## 🎯 Target Audience

- ♟️ **Strategy Fans** - Deep tactical gameplay
- 🎲 **Chess Lovers** - Familiar mechanics with new depth
- 🎮 **RPG Players** - Character progression and customization
- 🧠 **Tacticians** - Buildcrafting and optimization

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md) - System design and module structure
- [Skill Creation Guide](./docs/SKILL_CREATION_GUIDE.md) - How to create custom skills
- [Status Effects Guide](./docs/STATUS_EFFECTS_GUIDE.md) - Status effect system documentation
- [API Reference](./docs/API_REFERENCE.md) - Complete API documentation
- [Developer Setup](./docs/DEVELOPER_SETUP.md) - Setup and contribution guide

---

## 🤝 Contributing

Contributions are welcome! Please see our [Developer Setup Guide](./docs/DEVELOPER_SETUP.md) for details.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

Project Link: [https://github.com/GendByteMaster/Gridlock](https://github.com/GendByteMaster/Gridlock)

---

<div align="center">

**⚡ Master the Grid. Control the Battle. ⚡**

*Built with ❤️ using React + TypeScript*

</div>
