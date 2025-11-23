export interface Position {
    x: number;
    y: number;
}

export interface Player {
    id: string;
    socketId: string;
    name: string;
    side: 'player' | 'opponent';
    ready: boolean;
}

export interface Room {
    id: string;
    players: Player[];
    gameState: any; // Will sync with client GameState
    status: 'waiting' | 'playing' | 'finished';
    createdAt: number;
}

export interface GameAction {
    type: 'move' | 'skill' | 'endTurn';
    unitId?: string;
    target?: Position;
    skillId?: string;
}

export interface ServerToClientEvents {
    roomCreated: (roomId: string) => void;
    roomJoined: (room: Room) => void;
    playerJoined: (player: Player) => void;
    playerLeft: (playerId: string) => void;
    gameStarted: (gameState: any) => void;
    gameAction: (action: GameAction, playerId: string) => void;
    gameStateUpdate: (gameState: any) => void;
    error: (message: string) => void;
}

export interface ClientToServerEvents {
    createRoom: (playerName: string, callback: (roomId: string) => void) => void;
    joinRoom: (roomId: string, playerName: string, callback: (success: boolean, room?: Room) => void) => void;
    leaveRoom: () => void;
    playerReady: () => void;
    gameAction: (action: GameAction) => void;
}
