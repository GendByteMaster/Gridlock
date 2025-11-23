import { Room, Player } from './types';

class GameRoomManager {
    private rooms: Map<string, Room> = new Map();

    createRoom(playerId: string, socketId: string, playerName: string): string {
        const roomId = this.generateRoomId();

        const player: Player = {
            id: playerId,
            socketId,
            name: playerName,
            side: 'player',
            ready: false
        };

        const room: Room = {
            id: roomId,
            players: [player],
            gameState: null,
            status: 'waiting',
            createdAt: Date.now()
        };

        this.rooms.set(roomId, room);
        return roomId;
    }

    joinRoom(roomId: string, playerId: string, socketId: string, playerName: string): Room | null {
        const room = this.rooms.get(roomId);

        if (!room) return null;
        if (room.players.length >= 2) return null;
        if (room.status !== 'waiting') return null;

        const player: Player = {
            id: playerId,
            socketId,
            name: playerName,
            side: 'opponent',
            ready: false
        };

        room.players.push(player);
        return room;
    }

    getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }

    removePlayerFromRoom(socketId: string): { roomId: string; room: Room } | null {
        for (const [roomId, room] of this.rooms.entries()) {
            const playerIndex = room.players.findIndex(p => p.socketId === socketId);

            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);

                // Delete room if empty
                if (room.players.length === 0) {
                    this.rooms.delete(roomId);
                    return null;
                }

                return { roomId, room };
            }
        }
        return null;
    }

    setPlayerReady(socketId: string): Room | null {
        for (const room of this.rooms.values()) {
            const player = room.players.find(p => p.socketId === socketId);
            if (player) {
                player.ready = true;

                // Check if all players are ready
                if (room.players.length === 2 && room.players.every(p => p.ready)) {
                    room.status = 'playing';
                }

                return room;
            }
        }
        return null;
    }

    updateGameState(roomId: string, gameState: any): void {
        const room = this.rooms.get(roomId);
        if (room) {
            room.gameState = gameState;
        }
    }

    private generateRoomId(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Cleanup old rooms (optional)
    cleanupOldRooms(maxAgeMs: number = 3600000): void {
        const now = Date.now();
        for (const [roomId, room] of this.rooms.entries()) {
            if (now - room.createdAt > maxAgeMs) {
                this.rooms.delete(roomId);
            }
        }
    }
}

export const gameRoomManager = new GameRoomManager();
