import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ServerToClientEvents, ClientToServerEvents, GameAction } from './types';
import { gameRoomManager } from './gameRooms';
import { backendSocket } from './backendSocket';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('createRoom', (playerName, userId, unlockedSkills, callback) => {
        const playerId = socket.id;
        const roomId = gameRoomManager.createRoom(playerId, socket.id, playerName, userId, unlockedSkills);

        socket.join(roomId);
        callback(roomId);

        console.log(`Room created: ${roomId} by ${playerName} (User ID: ${userId})`);
    });

    socket.on('joinRoom', (roomId, playerName, userId, unlockedSkills, callback) => {
        const room = gameRoomManager.joinRoom(roomId, socket.id, socket.id, playerName, userId, unlockedSkills);

        if (!room) {
            callback(false);
            socket.emit('error', 'Room not found or full');
            return;
        }

        socket.join(roomId);
        callback(true, room);

        // Notify other players
        socket.to(roomId).emit('playerJoined', room.players[room.players.length - 1]);

        console.log(`${playerName} joined room: ${roomId} (User ID: ${userId})`);
    });

    socket.on('playerReady', () => {
        const room = gameRoomManager.setPlayerReady(socket.id);

        if (room && room.status === 'playing') {
            // Both players ready, start game
            io.to(room.id).emit('gameStarted', room.gameState);
            console.log(`Game started in room: ${room.id}`);
        }
    });

    socket.on('gameAction', (action: GameAction) => {
        // Find which room this socket is in
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id) {
                const room = gameRoomManager.getRoom(roomId);
                if (room) {
                    // Broadcast action to other players in room
                    socket.to(roomId).emit('gameAction', action, socket.id);
                    console.log(`Game action in room ${roomId}:`, action.type);

                    // Check for game end
                    if (action.type === 'endTurn' && action.unitId === 'game-over') {
                        // This is a special action type we'll use to signal game over from client
                        // In a real authoritative server, the server would calculate this
                        const winnerSocketId = action.target?.x === 1 ? room.players[0].socketId : room.players[1].socketId; // Simplified logic
                        // For now, let's trust the client sending a specific 'gameEnded' event instead
                    }
                }
            }
        }
    });

    socket.on('gameEnded', (winnerSocketId: string) => {
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id) {
                const room = gameRoomManager.getRoom(roomId);
                if (room && room.status === 'playing') {
                    room.status = 'finished';
                    const winner = room.players.find(p => p.socketId === winnerSocketId);
                    const loser = room.players.find(p => p.socketId !== winnerSocketId);

                    if (winner && loser) {
                        console.log(`Game ended in room ${roomId}. Winner: ${winner.name}`);

                        // Send result to Python backend if both players have userIds
                        if (winner.userId && loser.userId) {
                            backendSocket.sendGameResult(winner.userId, loser.userId);
                        }
                    }
                }
            }
        }
    });

    socket.on('leaveRoom', () => {
        handleDisconnect(socket.id);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        handleDisconnect(socket.id);
    });
});

function handleDisconnect(socketId: string) {
    const result = gameRoomManager.removePlayerFromRoom(socketId);

    if (result) {
        const { roomId, room } = result;
        // Notify remaining players
        io.to(roomId).emit('playerLeft', socketId);
        console.log(`Player left room: ${roomId}`);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', rooms: gameRoomManager['rooms'].size });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`🎮 GRIDLOCK Multiplayer Server running on port ${PORT}`);
});

// Cleanup old rooms every hour
setInterval(() => {
    gameRoomManager.cleanupOldRooms();
}, 3600000);
