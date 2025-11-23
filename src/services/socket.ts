import { io, Socket } from 'socket.io-client';
import { GameAction } from '../../server/src/types';

class SocketService {
    private socket: Socket | null = null;
    private serverUrl: string = 'http://localhost:3001';

    connect(): void {
        if (this.socket?.connected) return;

        this.socket = io(this.serverUrl, {
            transports: ['websocket'],
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to multiplayer server');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        this.socket.on('error', (message: string) => {
            console.error('Server error:', message);
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    createRoom(playerName: string, callback: (roomId: string) => void): void {
        this.socket?.emit('createRoom', playerName, callback);
    }

    joinRoom(roomId: string, playerName: string, callback: (success: boolean, room?: any) => void): void {
        this.socket?.emit('joinRoom', roomId, playerName, callback);
    }

    leaveRoom(): void {
        this.socket?.emit('leaveRoom');
    }

    setPlayerReady(): void {
        this.socket?.emit('playerReady');
    }

    sendGameAction(action: GameAction): void {
        this.socket?.emit('gameAction', action);
    }

    onRoomCreated(callback: (roomId: string) => void): void {
        this.socket?.on('roomCreated', callback);
    }

    onRoomJoined(callback: (room: any) => void): void {
        this.socket?.on('roomJoined', callback);
    }

    onPlayerJoined(callback: (player: any) => void): void {
        this.socket?.on('playerJoined', callback);
    }

    onPlayerLeft(callback: (playerId: string) => void): void {
        this.socket?.on('playerLeft', callback);
    }

    onGameStarted(callback: (gameState: any) => void): void {
        this.socket?.on('gameStarted', callback);
    }

    onGameAction(callback: (action: GameAction, playerId: string) => void): void {
        this.socket?.on('gameAction', callback);
    }

    onGameStateUpdate(callback: (gameState: any) => void): void {
        this.socket?.on('gameStateUpdate', callback);
    }

    sendMove(unitId: string, target: { x: number; y: number }): void {
        this.socket?.emit('playerMove', { unitId, target });
    }

    sendSkill(unitId: string, skillId: string, target: { x: number; y: number }): void {
        this.socket?.emit('playerSkill', { unitId, skillId, target });
    }

    onPlayerMove(callback: (data: { unitId: string; target: { x: number; y: number } }) => void): void {
        this.socket?.on('opponentMove', callback);
    }

    onPlayerSkill(callback: (data: { unitId: string; skillId: string; target: { x: number; y: number } }) => void): void {
        this.socket?.on('opponentSkill', callback);
    }

    onPlayerDisconnected(callback: () => void): void {
        this.socket?.on('playerDisconnected', callback);
    }

    onPlayerReconnected(callback: () => void): void {
        this.socket?.on('playerReconnected', callback);
    }

    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }

    get isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();
