import { create } from 'zustand';
import { GameState, Cell, Unit, Position, SkillSequence, UnitType } from '../types';
import { SKILLS } from '../data/skills';
import { executeAITurn as executeAITurnLogic } from '../ai/opponentAI';

const BOARD_SIZE = 10;

const createInitialGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < BOARD_SIZE; x++) {
            row.push({
                position: { x, y },
                type: 'normal',
                isOccupied: false,
            });
        }
        grid.push(row);
    }
    return grid;
};

const createInitialUnits = (): Unit[] => {
    return [
        // Player Units (Rows 8-9)
        // Row 8 (Basic Units)
        { id: 'p1', type: 'Guardian', position: { x: 0, y: 8 }, owner: 'player', hp: 120, maxHp: 120, equippedSkills: [SKILLS['shield_bash'], SKILLS['fortify']], cooldowns: {} },
        { id: 'p2', type: 'Scout', position: { x: 1, y: 8 }, owner: 'player', hp: 80, maxHp: 80, equippedSkills: [SKILLS['dash'], SKILLS['spot']], cooldowns: {} },
        { id: 'p3', type: 'Striker', position: { x: 2, y: 8 }, owner: 'player', hp: 100, maxHp: 100, equippedSkills: [SKILLS['slash'], SKILLS['lunge']], cooldowns: {} },
        { id: 'p4', type: 'Arcanist', position: { x: 3, y: 8 }, owner: 'player', hp: 90, maxHp: 90, equippedSkills: [SKILLS['mana_burst'], SKILLS['empower_ally']], cooldowns: {} },
        { id: 'p5', type: 'Vanguard', position: { x: 4, y: 8 }, owner: 'player', hp: 110, maxHp: 110, equippedSkills: [SKILLS['charge'], SKILLS['war_cry']], cooldowns: {} },
        { id: 'p6', type: 'Sentinel', position: { x: 5, y: 8 }, owner: 'player', hp: 85, maxHp: 85, equippedSkills: [SKILLS['arrow_shot'], SKILLS['volley']], cooldowns: {} },
        { id: 'p7', type: 'Mechanist', position: { x: 6, y: 8 }, owner: 'player', hp: 95, maxHp: 95, equippedSkills: [SKILLS['deploy_turret'], SKILLS['repair']], cooldowns: {} },
        { id: 'p8', type: 'Monk', position: { x: 7, y: 8 }, owner: 'player', hp: 100, maxHp: 100, equippedSkills: [SKILLS['palm_strike'], SKILLS['meditate']], cooldowns: {} },
        { id: 'p9', type: 'FrostAdept', position: { x: 8, y: 8 }, owner: 'player', hp: 90, maxHp: 90, equippedSkills: [SKILLS['frostbolt'], SKILLS['ice_nova']], cooldowns: {} },
        { id: 'p10', type: 'WarImp', position: { x: 9, y: 8 }, owner: 'player', hp: 60, maxHp: 60, equippedSkills: [SKILLS['explosive_leap']], cooldowns: {} },

        // Row 9 (Unique Units)
        { id: 'p11', type: 'ChronoKnight', position: { x: 0, y: 9 }, owner: 'player', hp: 110, maxHp: 110, equippedSkills: [SKILLS['time_slash'], SKILLS['rewind']], cooldowns: {} },
        { id: 'p12', type: 'StormTitan', position: { x: 1, y: 9 }, owner: 'player', hp: 130, maxHp: 130, equippedSkills: [SKILLS['thunder_step'], SKILLS['stormwall']], cooldowns: {} },
        { id: 'p13', type: 'ShadowDancer', position: { x: 2, y: 9 }, owner: 'player', hp: 85, maxHp: 85, equippedSkills: [SKILLS['shadow_strike'], SKILLS['vanish']], cooldowns: {} },
        { id: 'p14', type: 'SolarPriest', position: { x: 3, y: 9 }, owner: 'player', hp: 90, maxHp: 90, equippedSkills: [SKILLS['radiant_beam'], SKILLS['sanctify']], cooldowns: {} },
        { id: 'p15', type: 'VoidWalker', position: { x: 4, y: 9 }, owner: 'player', hp: 95, maxHp: 95, equippedSkills: [SKILLS['void_pulse'], SKILLS['singularity']], cooldowns: {} },
        { id: 'p16', type: 'IronColossus', position: { x: 5, y: 9 }, owner: 'player', hp: 150, maxHp: 150, equippedSkills: [SKILLS['earth_slam'], SKILLS['iron_skin']], cooldowns: {} },
        { id: 'p17', type: 'ArcaneArcher', position: { x: 6, y: 9 }, owner: 'player', hp: 85, maxHp: 85, equippedSkills: [SKILLS['piercing_shot'], SKILLS['arcane_trap']], cooldowns: {} },
        { id: 'p18', type: 'BoneReaper', position: { x: 7, y: 9 }, owner: 'player', hp: 100, maxHp: 100, equippedSkills: [SKILLS['soul_harvest'], SKILLS['bone_prison']], cooldowns: {} },
        { id: 'p19', type: 'EmberWitch', position: { x: 8, y: 9 }, owner: 'player', hp: 90, maxHp: 90, equippedSkills: [SKILLS['fireball'], SKILLS['burning_ground']], cooldowns: {} },
        { id: 'p20', type: 'AstralSentinel', position: { x: 9, y: 9 }, owner: 'player', hp: 95, maxHp: 95, equippedSkills: [SKILLS['astral_shield'], SKILLS['warp_step']], cooldowns: {} },

        // Opponent Units (Rows 0-1)
        // Row 1 (Basic Units)
        { id: 'e1', type: 'Guardian', position: { x: 0, y: 1 }, owner: 'opponent', hp: 120, maxHp: 120, equippedSkills: [SKILLS['shield_bash'], SKILLS['fortify']], cooldowns: {} },
        { id: 'e2', type: 'Scout', position: { x: 1, y: 1 }, owner: 'opponent', hp: 80, maxHp: 80, equippedSkills: [SKILLS['dash'], SKILLS['spot']], cooldowns: {} },
        { id: 'e3', type: 'Striker', position: { x: 2, y: 1 }, owner: 'opponent', hp: 100, maxHp: 100, equippedSkills: [SKILLS['slash'], SKILLS['lunge']], cooldowns: {} },
        { id: 'e4', type: 'Arcanist', position: { x: 3, y: 1 }, owner: 'opponent', hp: 90, maxHp: 90, equippedSkills: [SKILLS['mana_burst'], SKILLS['empower_ally']], cooldowns: {} },
        { id: 'e5', type: 'Vanguard', position: { x: 4, y: 1 }, owner: 'opponent', hp: 110, maxHp: 110, equippedSkills: [SKILLS['charge'], SKILLS['war_cry']], cooldowns: {} },
        { id: 'e6', type: 'Sentinel', position: { x: 5, y: 1 }, owner: 'opponent', hp: 85, maxHp: 85, equippedSkills: [SKILLS['arrow_shot'], SKILLS['volley']], cooldowns: {} },
        { id: 'e7', type: 'Mechanist', position: { x: 6, y: 1 }, owner: 'opponent', hp: 95, maxHp: 95, equippedSkills: [SKILLS['deploy_turret'], SKILLS['repair']], cooldowns: {} },
        { id: 'e8', type: 'Monk', position: { x: 7, y: 1 }, owner: 'opponent', hp: 100, maxHp: 100, equippedSkills: [SKILLS['palm_strike'], SKILLS['meditate']], cooldowns: {} },
        { id: 'e9', type: 'FrostAdept', position: { x: 8, y: 1 }, owner: 'opponent', hp: 90, maxHp: 90, equippedSkills: [SKILLS['frostbolt'], SKILLS['ice_nova']], cooldowns: {} },
        { id: 'e10', type: 'WarImp', position: { x: 9, y: 1 }, owner: 'opponent', hp: 60, maxHp: 60, equippedSkills: [SKILLS['explosive_leap']], cooldowns: {} },

        // Row 0 (Unique Units)
        { id: 'e11', type: 'ChronoKnight', position: { x: 0, y: 0 }, owner: 'opponent', hp: 110, maxHp: 110, equippedSkills: [SKILLS['time_slash'], SKILLS['rewind']], cooldowns: {} },
        { id: 'e12', type: 'StormTitan', position: { x: 1, y: 0 }, owner: 'opponent', hp: 130, maxHp: 130, equippedSkills: [SKILLS['thunder_step'], SKILLS['stormwall']], cooldowns: {} },
        { id: 'e13', type: 'ShadowDancer', position: { x: 2, y: 0 }, owner: 'opponent', hp: 85, maxHp: 85, equippedSkills: [SKILLS['shadow_strike'], SKILLS['vanish']], cooldowns: {} },
        { id: 'e14', type: 'SolarPriest', position: { x: 3, y: 0 }, owner: 'opponent', hp: 90, maxHp: 90, equippedSkills: [SKILLS['radiant_beam'], SKILLS['sanctify']], cooldowns: {} },
        { id: 'e15', type: 'VoidWalker', position: { x: 4, y: 0 }, owner: 'opponent', hp: 95, maxHp: 95, equippedSkills: [SKILLS['void_pulse'], SKILLS['singularity']], cooldowns: {} },
        { id: 'e16', type: 'IronColossus', position: { x: 5, y: 0 }, owner: 'opponent', hp: 150, maxHp: 150, equippedSkills: [SKILLS['earth_slam'], SKILLS['iron_skin']], cooldowns: {} },
        { id: 'e17', type: 'ArcaneArcher', position: { x: 6, y: 0 }, owner: 'opponent', hp: 85, maxHp: 85, equippedSkills: [SKILLS['piercing_shot'], SKILLS['arcane_trap']], cooldowns: {} },
        { id: 'e18', type: 'BoneReaper', position: { x: 7, y: 0 }, owner: 'opponent', hp: 100, maxHp: 100, equippedSkills: [SKILLS['soul_harvest'], SKILLS['bone_prison']], cooldowns: {} },
        { id: 'e19', type: 'EmberWitch', position: { x: 8, y: 0 }, owner: 'opponent', hp: 90, maxHp: 90, equippedSkills: [SKILLS['fireball'], SKILLS['burning_ground']], cooldowns: {} },
        { id: 'e20', type: 'AstralSentinel', position: { x: 9, y: 0 }, owner: 'opponent', hp: 95, maxHp: 95, equippedSkills: [SKILLS['astral_shield'], SKILLS['warp_step']], cooldowns: {} },
    ];
};

interface GameStats {
    turns: number;
    playerUnitsLost: number;
    opponentUnitsLost: number;
    playerKills: UnitType[];
    opponentKills: UnitType[];
}

interface ExtendedGameState extends GameState {
    cursor: Position;
    gameStatus: 'playing' | 'player_won' | 'opponent_won';
    gameStats: GameStats;
    isMultiplayer: boolean;
    localPlayer: 'player' | 'opponent';
    turnTimeRemaining: number;
    turnTimeLimit: number;
    moveCursor: (dx: number, dy: number) => void;
    setCursor: (pos: Position) => void;
    executeSkill: (unitId: string, skillId: string, target: Position) => void;
    targetingSkillId: string | null;
    setTargetingMode: (skillId: string | null) => void;
    executeAITurn: () => void;
    checkGameOver: () => void;
    resetGame: () => void;
    setMultiplayerMode: (isMultiplayer: boolean, localPlayer: 'player' | 'opponent') => void;
    syncGameState: (state: Partial<GameState>) => void;
    decrementTurnTime: () => void;
    resetTurnTimer: () => void;
}

export const useGameStore = create<ExtendedGameState>((set, get) => ({
    grid: createInitialGrid(),
    units: createInitialUnits(),
    turn: 'player',
    selectedUnitId: null,
    validMoves: [],
    cursor: { x: 4, y: 9 },
    targetingSkillId: null,
    gameStatus: 'playing',
    gameStats: {
        turns: 0,
        playerUnitsLost: 0,
        opponentUnitsLost: 0,
        playerKills: [],
        opponentKills: []
    },
    isMultiplayer: false,
    localPlayer: 'player',
    turnTimeRemaining: 60,
    turnTimeLimit: 60,
    moveHistory: [],

    initializeGame: () => {
        set({
            grid: createInitialGrid(),
            units: createInitialUnits(),
            turn: 'player',
            selectedUnitId: null,
            validMoves: [],
            cursor: { x: 4, y: 9 },
            targetingSkillId: null,
            moveHistory: [],
        });

        const { units, grid } = get();
        const newGrid = [...grid];
        units.forEach(unit => {
            newGrid[unit.position.y][unit.position.x].isOccupied = true;
            newGrid[unit.position.y][unit.position.x].unitId = unit.id;
        });
        set({ grid: newGrid });
    },

    moveCursor: (dx: number, dy: number) => {
        const { cursor } = get();
        const nx = Math.max(0, Math.min(BOARD_SIZE - 1, cursor.x + dx));
        const ny = Math.max(0, Math.min(BOARD_SIZE - 1, cursor.y + dy));
        set({ cursor: { x: nx, y: ny } });
    },

    setCursor: (pos: Position) => {
        set({ cursor: pos });
    },

    setTargetingMode: (skillId: string | null) => {
        set({ targetingSkillId: skillId });
        if (skillId) {
            const { selectedUnitId, units, grid } = get();
            if (!selectedUnitId) return;

            const unit = units.find(u => u.id === selectedUnitId);
            if (!unit) return;

            const skill = unit.equippedSkills.find(s => s.id === skillId);
            if (!skill) return;

            const validTargets: Position[] = [];
            const { x, y } = unit.position;

            if (skill.id === 'slash' || skill.id === 'shove') {
                const directions = [
                    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
                ];
                directions.forEach(({ dx, dy }) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                        const targetCell = grid[ny][nx];
                        if (targetCell.isOccupied && targetCell.unitId) {
                            validTargets.push({ x: nx, y: ny });
                        }
                    }
                });
            } else if (skill.id === 'dash') {
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        if (Math.abs(dx) + Math.abs(dy) > 2) continue;
                        if (dx === 0 && dy === 0) continue;

                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                            const targetCell = grid[ny][nx];
                            if (!targetCell.isOccupied && targetCell.type !== 'obstacle') {
                                validTargets.push({ x: nx, y: ny });
                            }
                        }
                    }
                }
            }

            set({ validMoves: validTargets });
        } else {
            const { selectedUnitId } = get();
            if (selectedUnitId) {
                get().selectUnit(selectedUnitId);
            } else {
                set({ validMoves: [] });
            }
        }
    },

    selectUnit: (unitId: string) => {
        set({ targetingSkillId: null });

        const { units, turn } = get();
        const unit = units.find(u => u.id === unitId);

        if (!unit || unit.owner !== turn) {
            set({ selectedUnitId: null, validMoves: [] });
            return;
        }

        const validMoves: Position[] = [];
        const { x, y } = unit.position;
        const directions = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];

        directions.forEach(({ dx, dy }) => {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                const targetCell = get().grid[ny][nx];
                if (!targetCell.isOccupied) {
                    validMoves.push({ x: nx, y: ny });
                }
            }
        });

        set({ selectedUnitId: unitId, validMoves });
    },

    moveUnit: (unitId: string, target: Position) => {
        const { units, grid, turn } = get();
        const unitIndex = units.findIndex(u => u.id === unitId);

        if (unitIndex === -1) return;

        const unit = units[unitIndex];
        const oldPos = unit.position;

        const newGrid = [...grid];
        newGrid[oldPos.y][oldPos.x].isOccupied = false;
        newGrid[oldPos.y][oldPos.x].unitId = undefined;

        newGrid[target.y][target.x].isOccupied = true;
        newGrid[target.y][target.x].unitId = unitId;

        const newUnits = [...units];
        newUnits[unitIndex] = { ...unit, position: target };

        newUnits.forEach(u => {
            if (u.owner === turn) {
                Object.keys(u.cooldowns).forEach(skillId => {
                    if (u.cooldowns[skillId] > 0) {
                        u.cooldowns[skillId]--;
                    }
                });
            }
        });

        set({
            grid: newGrid,
            units: newUnits,
            selectedUnitId: null,
            validMoves: [],
            turn: turn === 'player' ? 'opponent' : 'player',
            moveHistory: [
                ...get().moveHistory,
                {
                    turn: get().gameStats.turns + 1,
                    player: turn,
                    unitId,
                    actionType: 'move',
                    from: oldPos,
                    to: target,
                    timestamp: Date.now()
                }
            ]
        });
    },

    executeSkill: (unitId: string, skillId: string, target: Position) => {
        let { units, grid, gameStats } = get();
        const unitIndex = units.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;
        const unit = units[unitIndex];

        if (skillId === 'slash') {
            const targetCell = grid[target.y][target.x];
            if (targetCell.unitId) {
                const targetUnitIndex = units.findIndex(u => u.id === targetCell.unitId);
                if (targetUnitIndex !== -1) {
                    const targetUnit = units[targetUnitIndex];
                    const newHp = Math.max(0, targetUnit.hp - 25); // Balanced damage

                    let newUnits = [...units];
                    newUnits[targetUnitIndex] = { ...targetUnit, hp: newHp };

                    if (newHp === 0) {
                        // Track unit death
                        const newStats = { ...gameStats };
                        if (targetUnit.owner === 'player') {
                            newStats.playerUnitsLost++;
                            newStats.opponentKills = [...newStats.opponentKills, targetUnit.type];
                        } else {
                            newStats.opponentUnitsLost++;
                            newStats.playerKills = [...newStats.playerKills, targetUnit.type];
                        }
                        gameStats = newStats;

                        newUnits = newUnits.filter(u => u.id !== targetUnit.id);
                        const newGrid = [...grid];
                        newGrid[target.y][target.x].isOccupied = false;
                        newGrid[target.y][target.x].unitId = undefined;
                        grid = newGrid;
                    }
                    units = newUnits;
                }
            }
        } else if (skillId === 'dash') {
            get().moveUnit(unitId, target);
            return;
        } else if (skillId === 'shove') {
            const targetCell = grid[target.y][target.x];
            if (targetCell.unitId) {
                const targetUnitIndex = units.findIndex(u => u.id === targetCell.unitId);
                if (targetUnitIndex !== -1) {
                    const targetUnit = units[targetUnitIndex];

                    const dx = target.x - unit.position.x;
                    const dy = target.y - unit.position.y;

                    const pushX = target.x + dx;
                    const pushY = target.y + dy;

                    if (pushX >= 0 && pushX < BOARD_SIZE && pushY >= 0 && pushY < BOARD_SIZE) {
                        const pushCell = grid[pushY][pushX];
                        if (!pushCell.isOccupied && pushCell.type !== 'obstacle') {
                            const newGrid = [...grid];
                            newGrid[target.y][target.x].isOccupied = false;
                            newGrid[target.y][target.x].unitId = undefined;

                            newGrid[pushY][pushX].isOccupied = true;
                            newGrid[pushY][pushX].unitId = targetUnit.id;

                            let newUnits = [...units];
                            newUnits[targetUnitIndex] = { ...targetUnit, position: { x: pushX, y: pushY } };
                            units = newUnits;
                            grid = newGrid;
                        } else {
                            const newHp = Math.max(0, targetUnit.hp - 15); // Balanced damage
                            let newUnits = [...units];
                            newUnits[targetUnitIndex] = { ...targetUnit, hp: newHp };
                            units = newUnits;
                        }
                    }
                }
            }
        }

        const updatedUnitIndex = units.findIndex(u => u.id === unitId);
        if (updatedUnitIndex !== -1) {
            const updatedUnit = units[updatedUnitIndex];
            const skill = updatedUnit.equippedSkills.find(s => s.id === skillId);
            if (skill) {
                updatedUnit.cooldowns = {
                    ...updatedUnit.cooldowns,
                    [skillId]: skill.cooldown
                };
                units[updatedUnitIndex] = updatedUnit;
            }
        }

        set({
            units,
            grid,
            gameStats,
            moveHistory: [
                ...get().moveHistory,
                {
                    turn: get().gameStats.turns + 1,
                    player: unit.owner,
                    unitId,
                    actionType: 'skill',
                    skillId,
                    from: unit.position,
                    to: target,
                    targetId: grid[target.y][target.x].unitId,
                    timestamp: Date.now()
                }
            ]
        });
        get().endTurn();
    },

    executeAITurn: () => {
        const state = get();
        const decision = executeAITurnLogic(state);

        if (decision.action === 'none') {
            get().endTurn();
            return;
        }

        if (decision.action === 'move' && decision.unitId && decision.target) {
            get().moveUnit(decision.unitId, decision.target);
        } else if (decision.action === 'skill' && decision.unitId && decision.skillId && decision.target) {
            get().executeSkill(decision.unitId, decision.skillId, decision.target);
        }
    },

    endTurn: () => {
        const { units, turn } = get();

        const newUnits = [...units];
        newUnits.forEach(u => {
            if (u.owner === turn) {
                Object.keys(u.cooldowns).forEach(skillId => {
                    if (u.cooldowns[skillId] > 0) {
                        u.cooldowns[skillId]--;
                    }
                });
            }
        });

        set(state => ({
            units: newUnits,
            turn: state.turn === 'player' ? 'opponent' : 'player',
            selectedUnitId: null,
            validMoves: [],
            targetingSkillId: null,
            gameStats: {
                ...state.gameStats,
                turns: state.gameStats.turns + 1
            }
        }));

        // Check for game over after turn ends
        get().checkGameOver();
    },

    checkGameOver: () => {
        const { units, gameStatus } = get();

        if (gameStatus !== 'playing') return;

        const playerUnits = units.filter(u => u.owner === 'player');
        const opponentUnits = units.filter(u => u.owner === 'opponent');

        if (playerUnits.length === 0) {
            set({ gameStatus: 'opponent_won' });
        } else if (opponentUnits.length === 0) {
            set({ gameStatus: 'player_won' });
        }
    },

    resetGame: () => {
        set({
            grid: createInitialGrid(),
            units: createInitialUnits(),
            turn: 'player',
            selectedUnitId: null,
            validMoves: [],
            cursor: { x: 4, y: 9 },
            targetingSkillId: null,
            gameStatus: 'playing',
            gameStats: {
                turns: 0,
                playerUnitsLost: 0,
                opponentUnitsLost: 0,
                playerKills: [],
                opponentKills: []
            },
            moveHistory: []
        });

        const { units, grid } = get();
        const newGrid = [...grid];
        units.forEach(unit => {
            newGrid[unit.position.y][unit.position.x].isOccupied = true;
            newGrid[unit.position.y][unit.position.x].unitId = unit.id;
        });
        set({ grid: newGrid });
    },

    setMultiplayerMode: (isMultiplayer: boolean, localPlayer: 'player' | 'opponent') => {
        set({ isMultiplayer, localPlayer });
    },

    syncGameState: (state: Partial<GameState>) => {
        set(state);
    },

    decrementTurnTime: () => {
        const { turnTimeRemaining, turn, localPlayer } = get();

        // Only decrement if it's the local player's turn
        if (turn === localPlayer && turnTimeRemaining > 0) {
            const newTime = turnTimeRemaining - 1;
            set({ turnTimeRemaining: newTime });

            // Auto-end turn when time runs out
            if (newTime === 0) {
                get().endTurn();
            }
        }
    },

    resetTurnTimer: () => {
        const { turnTimeLimit } = get();
        set({ turnTimeRemaining: turnTimeLimit });
    },
}));
