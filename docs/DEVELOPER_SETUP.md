# Developer Setup Guide

## Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Git**
- **Code Editor** (VS Code recommended)

### Recommended VS Code Extensions

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **TypeScript and JavaScript Language Features**
- **Vite** - Vite integration

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GendByteMaster/Gridlock.git
cd Gridlock
```

### 2. Install Dependencies

```bash
npm install
```

This will install all project dependencies including:
- React 18
- TypeScript 5
- Vite 5
- Zustand (state management)
- Framer Motion (animations)
- Lucide React (icons)

### 3. Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

---

## Project Structure

```
Gridlock/
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── SKILL_CREATION_GUIDE.md
│   ├── STATUS_EFFECTS_GUIDE.md
│   ├── API_REFERENCE.md
│   └── DEVELOPER_SETUP.md
├── src/
│   ├── combat/                # Combat system modules
│   │   ├── engine/           # Core combat engine
│   │   │   ├── CombatEngine.ts
│   │   │   └── ActionPipeline.ts
│   │   ├── skills/           # Skill definitions
│   │   │   └── SkillRegistry.ts
│   │   ├── effects/          # Status effects
│   │   │   └── StatusRegistry.ts
│   │   ├── adapter/          # State conversion
│   │   │   └── CombatStateAdapter.ts
│   │   ├── movement/         # Movement patterns
│   │   │   └── MovementPatterns.ts
│   │   ├── math/             # Combat calculations
│   │   │   └── DamageCalculator.ts
│   │   └── types.ts          # Type definitions
│   ├── components/           # React UI components
│   │   ├── Board.tsx         # Game board
│   │   ├── SkillBar.tsx      # Skill interface
│   │   ├── UnitInfoPanel.tsx # Unit information
│   │   ├── InitiativeTrack.tsx # Turn order
│   │   └── ...
│   ├── store/                # State management
│   │   └── gameStore.ts      # Zustand store
│   ├── types/                # Legacy UI types
│   │   └── index.ts
│   ├── styles/               # Global styles
│   ├── utils/                # Utilities
│   ├── data/                 # Game data
│   │   └── skills.ts         # Legacy skill data
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── GDD.md                     # Game Design Document
├── README.md                  # Project overview
├── units.md                   # Unit documentation
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── tailwind.config.js         # Tailwind CSS config
```

### Key Directories

#### `/src/combat/`
Core combat system implementation. All game logic lives here.

**Subdirectories:**
- `engine/` - Combat engine and action pipeline
- `skills/` - Skill registry and definitions
- `effects/` - Status effect system
- `adapter/` - Converts between UI and engine formats
- `movement/` - Movement pattern generation
- `math/` - Damage calculations and formulas

#### `/src/components/`
React UI components for game interface.

**Key Components:**
- `Board.tsx` - Renders game grid and units
- `SkillBar.tsx` - Displays and manages skill selection
- `UnitInfoPanel.tsx` - Shows unit stats and info
- `InitiativeTrack.tsx` - Turn order visualization

#### `/src/store/`
Zustand state management.

- `gameStore.ts` - Central game state

---

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

- Auto-reload on file changes
- TypeScript compilation
- Hot Module Replacement (HMR)

### TypeScript Type Checking

```bash
npx tsc --noEmit --project tsconfig.json
```

Checks for type errors without emitting files.

### Building for Production

```bash
npm run build
```

Creates optimized production build in `/dist`.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally.

---

## Code Style

### TypeScript Conventions

#### Naming
- **Interfaces/Types**: PascalCase (`Unit`, `SkillOp`)
- **Functions**: camelCase (`calculateDamage`, `getKnightPattern`)
- **Constants**: UPPER_SNAKE_CASE (`SKILL_REGISTRY`)
- **Files**: PascalCase for components, camelCase for utilities

#### Types vs Interfaces
- Use `interface` for object shapes
- Use `type` for unions, primitives, complex types

```typescript
// Interface
interface Unit {
    id: string;
    stats: BaseStats;
}

// Type
type DamageType = 'physical' | 'magical' | 'true';
```

### Code Organization

#### Imports
Group imports in this order:
1. React imports
2. Third-party libraries
3. Local imports (types, utils, components)

```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Unit } from '../combat/types';
import { gameStore } from '../store/gameStore';
```

#### Component Structure
```typescript
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props {
    unit: Unit;
}

// 3. Component
const MyComponent: React.FC<Props> = ({ unit }) => {
    // Hooks
    const [state, setState] = useState();
    
    // Event handlers
    const handleClick = () => {};
    
    // Render
    return <div>{/* JSX */}</div>;
};

// 4. Export
export default MyComponent;
```

---

## Adding Features

### Adding a New Skill

1. **Define in SkillRegistry**
   ```typescript
   // src/combat/skills/SkillRegistry.ts
   my_skill: {
       id: 'my_skill',
       name: 'My Skill',
       // ... other properties
   }
   ```

2. **Add to Unit**
   ```typescript
   // src/store/gameStore.ts
   units: [
       {
           id: 'p1',
           skills: ['my_skill']  // Add here
       }
   ]
   ```

3. **Test**
   - Start dev server
   - Select unit
   - Verify skill appears in SkillBar
   - Test functionality

### Adding a New Status Effect

1. **Define in StatusRegistry**
   ```typescript
   // src/combat/effects/StatusRegistry.ts (when it exists)
   my_status: {
       id: 'my_status',
       type: 'buff',
       // ... other properties
   }
   ```

2. **Reference in Skill**
   ```typescript
   ops: [
       {
           type: 'applyStatus',
           statusId: 'my_status',
           duration: 3
       }
   ]
   ```

### Adding a New Unit Type

1. **Add to UnitType enum**
   ```typescript
   // src/types/index.ts
   export type UnitType = 
       | 'Guardian'
       // ... existing types
       | 'MyNewUnit';
   ```

2. **Define in gameStore**
   ```typescript
   {
       id: 'new1',
       type: 'MyNewUnit',
       position: { x: 0, y: 0 },
       // ... other properties
   }
   ```

---

## Testing

### Manual Testing

Currently, Gridlock uses manual testing:

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Navigate to battle screen**

3. **Test features:**
   - Unit selection
   - Movement
   - Skill usage
   - Turn progression
   - Initiative system

### Testing Checklist

- [ ] Unit selection highlights correctly
- [ ] Valid moves display
- [ ] Skills appear in SkillBar
- [ ] Skill targeting works
- [ ] Damage calculations correct
- [ ] Status effects apply/remove
- [ ] Initiative advances properly
- [ ] Turn order correct
- [ ] Cooldowns function
- [ ] UI responsive

---

## Common Tasks

### Verifying TypeScript Compilation

```bash
npx tsc --noEmit
```

Fix any errors before committing.

### Checking for Lint Issues

```bash
npm run lint
```

(If ESLint is configured)

### Clearing Build Cache

```bash
rm -rf node_modules/.vite
npm run dev
```

### Updating Dependencies

```bash
npm update
```

Check for breaking changes before committing.

---

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Sources tab → Navigate to file
3. Set breakpoints
4. Inspect state

### React DevTools

Install React DevTools extension:
- View component hierarchy
- Inspect props/state
- Profile performance

### Console Logging

```typescript
console.log('Current unit:', unit);
console.log('Skill:', SKILL_REGISTRY[skillId]);
```

### Zustand DevTools

View state changes in browser console:

```typescript
useGameStore.subscribe((state) => {
    console.log('State updated:', state);
});
```

---

## Contributing

### Branch Naming

- **Features**: `feature/skill-system-refactor`
- **Bugfixes**: `fix/unit-selection-crash`
- **Documentation**: `docs/api-reference`

### Commit Messages

Follow conventional commits:

```
feat: add chain lightning skill
fix: resolve initiative timer freeze bug
docs: update skill creation guide
refactor: simplify damage calculation
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write code
   - Test thoroughly
   - Update documentation

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: add feature"
   ```

4. **Push**
   ```bash
   git push origin feature/my-feature
   ```

5. **Open Pull Request**
   - Describe changes
   - Reference issues
   - Request review

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or specify different port
npm run dev -- --port 3000
```

### TypeScript Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Module Not Found

```bash
# Verify import path
# Ensure file exists
# Check file extension (.ts vs .tsx)
```

### Hot Reload Not Working

```bash
# Restart dev server
# Clear browser cache
# Check for syntax errors
```

---

## Resources

### Documentation
- [Architecture](./ARCHITECTURE.md)
- [Skill Creation](./SKILL_CREATION_GUIDE.md)
- [Status Effects](./STATUS_EFFECTS_GUIDE.md)
- [API Reference](./API_REFERENCE.md)

### Technologies
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)

### Community
- GitHub Issues
- Discord (if applicable)

---

## Next Steps

After setup, explore:

1. **Read Architecture** - Understand system design
2. **Create a Skill** - Follow skill creation guide
3. **Add a Status** - Implement custom status effect
4. **Experiment** - Modify existing systems
5. **Contribute** - Submit improvements

---

## License

This project is open source under the MIT License.

---

**Happy Coding! ⚡**
