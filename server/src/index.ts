import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ServerToClientEvents, ClientToServerEvents, GameAction } from './types';
import { gameRoomManager } from './gameRooms';

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

    socket.on('createRoom', (playerName, callback) => {
        const playerId = socket.id;
        const roomId = gameRoomManager.createRoom(playerId, socket.id, playerName);

        socket.join(roomId);
        callback(roomId);

        console.log(`Room created: ${roomId} by ${playerName}`);
    });

    socket.on('joinRoom', (roomId, playerName, callback) => {
        const room = gameRoomManager.joinRoom(roomId, socket.id, socket.id, playerName);

        if (!room) {
            callback(false);
            socket.emit('error', 'Room not found or full');
            return;
        }

        socket.join(roomId);
        callback(true, room);

        // Notify other players
        socket.to(roomId).emit('playerJoined', room.players[room.players.length - 1]);

        console.log(`${playerName} joined room: ${roomId}`);
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
