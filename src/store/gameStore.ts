import { create } from 'zustand';
import { GameState, Cell, Unit, Position, UnitType, Move } from '../types';
import { SKILLS } from '../data/skills';
import { executeAITurn as executeAITurnLogic } from '../ai/opponentAI';
import { calculateUnitMoves } from '../combat/movement/UnitMovementRegistry';
import { socketService } from '../services/socket';

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
    // Helper to create a base unit
    const createUnit = (
        id: string,
        type: UnitType,
        x: number,
        y: number,
        owner: 'player' | 'opponent'
    ): Unit => {
        const baseStats = {
            hp: 100, maxHp: 100, atk: 10, def: 5, res: 5, spd: 5,
            crit: 0.05, critDmg: 1.5, acc: 1.0, eva: 0.05
        };

        // Apply type-specific base stats override
        switch (type) {
            case 'Guardian': baseStats.maxHp = 120; baseStats.def = 15; break;
            case 'Scout': baseStats.maxHp = 80; baseStats.spd = 8; break;
            case 'Striker': baseStats.atk = 15; break;
            case 'Arcanist': baseStats.res = 15; baseStats.atk = 12; break;
            case 'Vanguard': baseStats.maxHp = 110; baseStats.atk = 12; break;
            case 'Sentinel': baseStats.acc = 1.1; baseStats.atk = 12; break;
            case 'Mechanist': baseStats.maxHp = 95; break;
            case 'Monk': baseStats.eva = 0.15; break;
            case 'FrostAdept': baseStats.res = 12; break;
            case 'WarImp': baseStats.maxHp = 60; baseStats.spd = 7; break;
            case 'IronColossus': baseStats.maxHp = 150; baseStats.def = 20; break;
            case 'StormTitan': baseStats.maxHp = 130; baseStats.atk = 18; break;
        }
        baseStats.hp = baseStats.maxHp;

        return {
            id,
            type,
            owner,
            level: 1,
            pos: { x, y },
            base: baseStats,
            stats: { ...baseStats, shield: 0, barrier: 0 },
            resistances: { fire: 0, frost: 0, lightning: 0, poison: 0, arcane: 0, void: 0 },
            statuses: [],
            skills: [],
            modules: [],
            runtime: {
                initiative: 0,
                cooldowns: {},
                isStunned: false,
                isFrozen: false,
                isSilenced: false,
                isRooted: false,
                isSleeping: false,
                isCharmed: false,
                actionPoints: 1,
                movePoints: 1,
                comboCount: 0,
                hasActed: false,
                hasMoved: false,
                isReacting: false,
                lastActionTimestamp: 0
            },
            // Compatibility fields
            position: { x, y },
            hp: baseStats.maxHp,
            maxHp: baseStats.maxHp,
            equippedSkills: [],
            cooldowns: {}
        } as any;
    };

    const units: Unit[] = [];

    // Player Row 8
    units.push(createUnit('p1', 'Guardian', 0, 8, 'player'));
    units.push(createUnit('p2', 'Scout', 1, 8, 'player'));
    units.push(createUnit('p3', 'Striker', 2, 8, 'player'));
    units.push(createUnit('p4', 'Arcanist', 3, 8, 'player'));
    units.push(createUnit('p5', 'Vanguard', 4, 8, 'player'));
    units.push(createUnit('p6', 'Sentinel', 5, 8, 'player'));
    units.push(createUnit('p7', 'Mechanist', 6, 8, 'player'));
    units.push(createUnit('p8', 'Monk', 7, 8, 'player'));
    units.push(createUnit('p9', 'FrostAdept', 8, 8, 'player'));
    units.push(createUnit('p10', 'WarImp', 9, 8, 'player'));

    // Player Row 9 (Heroes)
    units.push(createUnit('p11', 'ChronoKnight', 0, 9, 'player'));
    units.push(createUnit('p12', 'StormTitan', 1, 9, 'player'));
    units.push(createUnit('p13', 'ShadowDancer', 2, 9, 'player'));
    units.push(createUnit('p14', 'SolarPriest', 3, 9, 'player'));
    units.push(createUnit('p15', 'VoidWalker', 4, 9, 'player'));
    units.push(createUnit('p16', 'IronColossus', 5, 9, 'player'));
    units.push(createUnit('p17', 'ArcaneArcher', 6, 9, 'player'));
    units.push(createUnit('p18', 'BoneReaper', 7, 9, 'player'));
    units.push(createUnit('p19', 'EmberWitch', 8, 9, 'player'));
    units.push(createUnit('p20', 'AstralSentinel', 9, 9, 'player'));

    // Opponent Row 1
    units.push(createUnit('e1', 'Guardian', 0, 1, 'opponent'));
    units.push(createUnit('e2', 'Scout', 1, 1, 'opponent'));
    units.push(createUnit('e3', 'Striker', 2, 1, 'opponent'));
    units.push(createUnit('e4', 'Arcanist', 3, 1, 'opponent'));
    units.push(createUnit('e5', 'Vanguard', 4, 1, 'opponent'));
    units.push(createUnit('e6', 'Sentinel', 5, 1, 'opponent'));
    units.push(createUnit('e7', 'Mechanist', 6, 1, 'opponent'));
    units.push(createUnit('e8', 'Monk', 7, 1, 'opponent'));
    units.push(createUnit('e9', 'FrostAdept', 8, 1, 'opponent'));
    units.push(createUnit('e10', 'WarImp', 9, 1, 'opponent'));

    // Opponent Row 0 (Heroes)
    units.push(createUnit('e11', 'ChronoKnight', 0, 0, 'opponent'));
    units.push(createUnit('e12', 'StormTitan', 1, 0, 'opponent'));
    units.push(createUnit('e13', 'ShadowDancer', 2, 0, 'opponent'));
    units.push(createUnit('e14', 'SolarPriest', 3, 0, 'opponent'));
    units.push(createUnit('e15', 'VoidWalker', 4, 0, 'opponent'));
    units.push(createUnit('e16', 'IronColossus', 5, 0, 'opponent'));
    units.push(createUnit('e17', 'ArcaneArcher', 6, 0, 'opponent'));
    units.push(createUnit('e18', 'BoneReaper', 7, 0, 'opponent'));
    units.push(createUnit('e19', 'EmberWitch', 8, 0, 'opponent'));
    units.push(createUnit('e20', 'AstralSentinel', 9, 0, 'opponent'));

    return units;
};

interface GameStats {
    turns: number;
    playerUnitsLost: number;
    opponentUnitsLost: number;
    playerKills: UnitType[];
    opponentKills: UnitType[];
}

interface CombatLog {
    type: string;
    text: string;
    timestamp: number;
}

interface ExtendedGameState extends GameState {
    // Core game state
    grid: Cell[][];
    units: Unit[];
    turn: 'player' | 'opponent';
    selectedUnitId: string | null;
    validMoves: Position[];
    moveHistory: Move[];

    // UI state
    cursor: Position;
    targetingSkillId: string | null;

    // Game status
    gameStatus: 'playing' | 'player_won' | 'opponent_won';
    gameStats: GameStats;

    // Multiplayer
    isMultiplayer: boolean;
    localPlayer: 'player' | 'opponent';
    turnTimeRemaining: number;
    turnTimeLimit: number;
    turnOrder: string[];
    activeUnitId: string | null;

    // Combat logs
    combatLogs: CombatLog[];

    // Actions
    initializeGame: () => void;
    moveCursor: (dx: number, dy: number) => void;
    setCursor: (pos: Position) => void;
    selectUnit: (unitId: string) => void;
    moveUnit: (unitId: string, target: Position) => void;
    executeSkill: (unitId: string, skillId: string, target: Position) => void;
    setTargetingMode: (skillId: string | null) => void;
    executeAITurn: () => void;
    endTurn: () => void;
    checkGameOver: () => void;
    resetGame: () => void;
    setMultiplayerMode: (isMultiplayer: boolean, localPlayer: 'player' | 'opponent') => void;
    syncGameState: (state: Partial<GameState>) => void;
    addCombatLog: (type: string, text: string) => void;
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
    turnOrder: [],
    activeUnitId: null,
    moveHistory: [],
    combatLogs: [],

    addCombatLog: (type: string, text: string) => {
        const { combatLogs } = get();
        set({ combatLogs: [...combatLogs, { type, text, timestamp: Date.now() }] });
    },

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
            turnOrder: [],
            activeUnitId: null,
        });

        const { units, grid } = get();
        const newGrid = [...grid];
        units.forEach(unit => {
            newGrid[unit.position.y][unit.position.x].isOccupied = true;
            newGrid[unit.position.y][unit.position.x].unitId = unit.id;
        });
        set({ grid: newGrid, combatLogs: [] });
        get().addCombatLog('system', '⚔️ Battle begins!');
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

            // Generic targeting based on skill category/range
            // This is a simplification. Ideally use TargetingInfo from SkillRegistry
            const range = skill.id === 'arrow_shot' || skill.id === 'arcane_shot' || skill.id === 'solar_beam' ? 5 :
                skill.id === 'dash' || skill.id === 'blink' || skill.id === 'void_warp' ? 4 : 1;

            if (skill.category === 'Mobility') {
                for (let dy = -range; dy <= range; dy++) {
                    for (let dx = -range; dx <= range; dx++) {
                        if (Math.abs(dx) + Math.abs(dy) > range) continue;
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
            } else if (skill.category === 'Support') {
                // Support targeting (Allies)
                for (let dy = -range; dy <= range; dy++) {
                    for (let dx = -range; dx <= range; dx++) {
                        if (Math.abs(dx) + Math.abs(dy) > range) continue;
                        if (dx === 0 && dy === 0 && skill.id !== 'meditate') continue; // Allow self-target for meditate
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                            const targetCell = grid[ny][nx];
                            if (targetCell.isOccupied && targetCell.unitId) {
                                const targetUnit = units.find(u => u.id === targetCell.unitId);
                                if (targetUnit && targetUnit.owner === unit.owner) {
                                    validTargets.push({ x: nx, y: ny });
                                }
                            }
                        }
                    }
                }
            } else {
                // Offensive/Control targeting (Enemies)
                for (let dy = -range; dy <= range; dy++) {
                    for (let dx = -range; dx <= range; dx++) {
                        if (Math.abs(dx) + Math.abs(dy) > range) continue;
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                            const targetCell = grid[ny][nx];
                            if (targetCell.isOccupied && targetCell.unitId) {
                                const targetUnit = units.find(u => u.id === targetCell.unitId);
                                if (targetUnit && targetUnit.owner !== unit.owner) {
                                    validTargets.push({ x: nx, y: ny });
                                }
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

        const { units, turn, grid } = get();
        const unit = units.find(u => u.id === unitId);

        if (!unit || unit.owner !== turn) {
            set({ selectedUnitId: null, validMoves: [] });
            return;
        }

        // Use new movement system with unit-specific patterns
        const validMoves = calculateUnitMoves(unit, units, grid);

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

        const playerLabel = turn === 'player' ? 'Player' : 'Opponent';
        get().addCombatLog('move', `${playerLabel} ${unit.type} moved to (${target.x}, ${target.y})`);
    },

    executeSkill: (unitId: string, skillId: string, target: Position) => {
        let { units, grid, gameStats } = get();
        const unitIndex = units.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;
        const unit = units[unitIndex];
        const skill = SKILLS[skillId];

        if (!skill) return;

        // Generic Mobility Handler
        if (skill.category === 'Mobility' || skillId === 'dash' || skillId === 'void_warp' || skillId === 'blink' || skillId === 'rewind') {
            get().moveUnit(unitId, target);
            return;
        }

        // Generic Damage/Control Handler
        const targetCell = grid[target.y][target.x];
        if (targetCell.unitId) {
            const targetUnitIndex = units.findIndex(u => u.id === targetCell.unitId);
            if (targetUnitIndex !== -1) {
                const targetUnit = units[targetUnitIndex];

                // Calculate damage
                let damage = skill.damage || 0;

                // Apply specific skill logic (simplified)
                if (skillId === 'shove' || skillId === 'shield_bash' || skillId === 'colossus_smash') {
                    // Push logic (simplified: just damage for now, or implement push if possible)
                    // Implementing push requires checking target cell behind
                    const dx = target.x - unit.position.x;
                    const dy = target.y - unit.position.y;
                    const pushX = target.x + dx;
                    const pushY = target.y + dy;

                    if (pushX >= 0 && pushX < BOARD_SIZE && pushY >= 0 && pushY < BOARD_SIZE) {
                        const pushCell = grid[pushY][pushX];
                        if (!pushCell.isOccupied && pushCell.type !== 'obstacle') {
                            // Move target
                            const newGrid = [...grid];
                            newGrid[target.y][target.x].isOccupied = false;
                            newGrid[target.y][target.x].unitId = undefined;
                            newGrid[pushY][pushX].isOccupied = true;
                            newGrid[pushY][pushX].unitId = targetUnit.id;

                            let newUnits = [...units];
                            newUnits[targetUnitIndex] = { ...targetUnit, position: { x: pushX, y: pushY } };
                            units = newUnits;
                            grid = newGrid;
                            damage = 0; // Push successful, maybe minor damage?
                        } else {
                            damage += 15; // Collision damage
                        }
                    }
                }

                // Apply Damage
                if (damage > 0) {
                    const newHp = Math.max(0, targetUnit.hp - damage);
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
        } else if (skillId === 'deploy_turret') {
            // Summon logic
            // Check if target is empty (already checked by setTargetingMode usually)
            if (!targetCell.isOccupied && targetCell.type !== 'obstacle') {
                const newGrid = [...grid];
                const turretId = `turret_${Date.now()}`;
                newGrid[target.y][target.x].isOccupied = true;
                newGrid[target.y][target.x].unitId = turretId;

                const turretUnit: Unit = {
                    id: turretId,
                    type: 'Turret',
                    owner: unit.owner,
                    level: 1,
                    pos: target,
                    base: { hp: 50, maxHp: 50, atk: 10, def: 5, res: 5, spd: 0, crit: 0, critDmg: 1.5, acc: 1.0, eva: 0 },
                    stats: { hp: 50, maxHp: 50, atk: 10, def: 5, res: 5, spd: 0, crit: 0, critDmg: 1.5, acc: 1.0, eva: 0, shield: 0, barrier: 0 },
                    resistances: { fire: 0, frost: 0, lightning: 0, poison: 0, arcane: 0, void: 0 },
                    statuses: [],
                    skills: [],
                    modules: [],
                    runtime: {
                        initiative: 0,
                        cooldowns: {},
                        isStunned: false,
                        isFrozen: false,
                        isSilenced: false,
                        isRooted: true,
                        isSleeping: false,
                        isCharmed: false,
                        actionPoints: 1,
                        movePoints: 0,
                        comboCount: 0,
                        hasActed: false,
                        hasMoved: false,
                        isReacting: false,
                        lastActionTimestamp: 0
                    },
                    // Compatibility
                    position: target,
                    hp: 50,
                    maxHp: 50,
                    equippedSkills: [],
                    cooldowns: {}
                };

                set({
                    grid: newGrid,
                    units: [...units, turretUnit]
                });
            }
        }

        const updatedUnitIndex = units.findIndex(u => u.id === unitId);
        if (updatedUnitIndex !== -1) {
            const updatedUnit = units[updatedUnitIndex];
            // Update cooldown
            updatedUnit.cooldowns = {
                ...updatedUnit.cooldowns,
                [skillId]: skill.cooldown
            };
            units[updatedUnitIndex] = updatedUnit;
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

        const playerLabel = unit.owner === 'player' ? 'Player' : 'Opponent';
        get().addCombatLog('skill', `${playerLabel} ${unit.type} used ${skill.name}`);

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
        const { units, gameStatus, isMultiplayer, localPlayer } = get();

        if (gameStatus !== 'playing') return;

        const playerUnits = units.filter(u => u.owner === 'player');
        const opponentUnits = units.filter(u => u.owner === 'opponent');

        let winner: 'player' | 'opponent' | null = null;

        if (playerUnits.length === 0) {
            winner = 'opponent';
            set({ gameStatus: 'opponent_won' });
        } else if (opponentUnits.length === 0) {
            winner = 'player';
            set({ gameStatus: 'player_won' });
        }

        if (winner && isMultiplayer) {
            // Only the winner needs to report, or both can report and server handles it.
            // But we need to know who won.
            // If I am the winner, I report it.
            if (winner === localPlayer) {
                // We need to send the socket ID of the winner.
                // Since we don't have easy access to our own socket ID here without storing it,
                // we can just emit "gameEnded" and let the server figure out who sent it.
                // But the server expects winnerSocketId.
                // Let's change the server event to just "I won" or "I lost" or just "Game Over" and server checks state.
                // But wait, the server doesn't track unit deaths fully authoritatively yet (it trusts clients).
                // So the client needs to say "I won".

                // Actually, the server implementation I wrote expects `winnerSocketId`.
                // `socket.on('gameEnded', (winnerSocketId: string) => { ... })`
                // So I should send the winner's socket ID.
                // But I don't know the socket IDs here easily.

                // Alternative: The server knows the sender's socket ID.
                // If I send "gameEnded", the server knows *I* sent it.
                // If I won, I should send "gameEnded" with MY socket ID? Or just "gameEnded" and server assumes sender is winner?
                // The current server code: `const winner = room.players.find(p => p.socketId === winnerSocketId);`
                // So I need to send the correct socket ID.

                // Let's assume for now that we don't have the socket ID in the store.
                // I should probably update `socketService` to store the socket ID or expose it.
                // Or I can update the server to accept a simpler message.

                // Let's update the server to not require an argument, and assume the sender is the winner?
                // No, what if the loser disconnects?

                // Let's update `socketService` to expose `socket.id`.
                // But `socketService` is a class instance.

                // For now, let's just emit the event. `socketService` can handle getting the ID if needed, 
                // or we can change the server to use `socket.id` if the payload is empty.

                // Let's look at `socketService.ts` again. It has `this.socket.id`.
                // I can add a getter for `socketId`.

                socketService.sendGameEnded(socketService.socketId || '');
            }
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
