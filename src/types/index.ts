export * from './primitives';
import { Unit as CombatUnit } from '../combat/types';
import { Position, Player } from './primitives';

// Re-export Unit from combat/types to unify the type system
export type Unit = CombatUnit;

export type CellType = 'normal' | 'charged' | 'inert' | 'corrupted' | 'overclocked' | 'shielded' | 'obstacle' | 'void';

export interface Cell {
    position: Position;
    type: CellType;
    isOccupied: boolean;
    unitId?: string;
}

export interface Move {
    turn: number;
    player: Player;
    unitId: string;
    actionType: 'move' | 'skill';
    skillId?: string;
    from: Position;
    to: Position;
    targetId?: string;
    timestamp: number;
}

export interface GameState {
    setCursor: (pos: Position) => void;
    turnTimeLimit?: number;
    turnOrder?: string[];
    activeUnitId?: string | null;
    combatLogs?: any[]; // Avoiding circular dependency with CombatLog

    // Extended Actions
    executeSkill?: (unitId: string, skillId: string, target: Position) => void;
    setTargetingMode?: (skillId: string | null) => void;
    executeAITurn?: () => void;
    checkGameOver?: () => void;
    resetGame?: () => void;
    setMultiplayerMode?: (isMultiplayer: boolean, localPlayer: 'player' | 'opponent') => void;
    syncGameState?: (state: Partial<GameState>) => void;
    addCombatLog?: (type: string, text: string) => void;
    decrementTurnTime?: () => void;
    resetTurnTimer?: () => void;
}
