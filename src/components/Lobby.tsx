import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import { clsx } from 'clsx';
import { Users, Copy, Check, Wifi } from 'lucide-react';

interface LobbyProps {
    onGameStart: (isHost: boolean) => void;
    onBack: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ onGameStart, onBack }) => {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [currentRoom, setCurrentRoom] = useState<any>(null);
    const [isHost, setIsHost] = useState(false);
    const [copied, setCopied] = useState(false);
    const [joinRoomInput, setJoinRoomInput] = useState('');
    const [view, setView] = useState<'menu' | 'create' | 'join' | 'waiting'>('menu');

    useEffect(() => {
        socketService.connect();

        socketService.onRoomJoined((room) => {
            setCurrentRoom(room);
            setView('waiting');
        });

        socketService.onPlayerJoined((player) => {
            setCurrentRoom((prev: any) => ({
                ...prev,
                players: [...(prev?.players || []), player]
            }));
        });

        socketService.onGameStarted(() => {
            onGameStart(isHost);
        });

        return () => {
            socketService.removeAllListeners();
        };
    }, [isHost, onGameStart]);

    const handleCreateRoom = () => {
        if (!playerName.trim()) return;

        socketService.createRoom(playerName, (newRoomId) => {
            setRoomId(newRoomId);
            setIsHost(true);
            setView('waiting');
        });
    };

    const handleJoinRoom = () => {
        if (!playerName.trim() || !joinRoomInput.trim()) return;

        socketService.joinRoom(joinRoomInput.toUpperCase(), playerName, (success, room) => {
            if (success && room) {
                setRoomId(joinRoomInput.toUpperCase());
                setCurrentRoom(room);
                setIsHost(false);
            } else {
                alert('Room not found or full!');
            }
        });
    };

    const handleReady = () => {
        socketService.setPlayerReady();
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (view === 'waiting') {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-system-gray1 via-system-gray2 to-system-gray1">
                <div className="w-full max-w-md bg-system-gray1/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Lobby</h2>
                        <div className="flex items-center gap-2 text-accent-green text-sm">
                            <Wifi size={16} />
                            <span>Connected</span>
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-xs text-system-gray4 mb-2">Room Code</div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-mono font-bold text-white tracking-wider">{roomId}</span>
                            <button
                                onClick={copyRoomCode}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {copied ? <Check size={20} className="text-accent-green" /> : <Copy size={20} className="text-system-gray4" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-system-gray4 mb-3">
                            <Users size={16} />
                            <span>Players ({currentRoom?.players?.length || 0}/2)</span>
                        </div>
                        <div className="space-y-2">
                            {currentRoom?.players?.map((player: any, _index: number) => (
                                <div key={player.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-medium">{player.name}</span>
                                        <span className={clsx(
                                            "text-xs px-2 py-1 rounded-full",
                                            player.ready ? "bg-accent-green/20 text-accent-green" : "bg-system-gray4/20 text-system-gray4"
                                        )}>
                                            {player.ready ? 'Ready' : 'Not Ready'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {currentRoom?.players?.length === 2 ? (
                        <button
                            onClick={handleReady}
                            className="w-full py-3 bg-accent-blue hover:bg-accent-blue/80 text-white font-medium rounded-xl transition-colors"
                        >
                            Ready
                        </button>
                    ) : (
                        <div className="text-center text-sm text-system-gray4">
                            Waiting for another player...
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (view === 'create' || view === 'join') {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-system-gray1 via-system-gray2 to-system-gray1">
                <div className="w-full max-w-md bg-system-gray1/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {view === 'create' ? 'Create Room' : 'Join Room'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-system-gray4 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-system-gray4 focus:outline-none focus:border-accent-blue transition-colors"
                            />
                        </div>

                        {view === 'join' && (
                            <div>
                                <label className="block text-sm text-system-gray4 mb-2">Room Code</label>
                                <input
                                    type="text"
                                    value={joinRoomInput}
                                    onChange={(e) => setJoinRoomInput(e.target.value.toUpperCase())}
                                    placeholder="Enter room code"
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-system-gray4 font-mono tracking-wider focus:outline-none focus:border-accent-blue transition-colors"
                                />
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onBack}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={view === 'create' ? handleCreateRoom : handleJoinRoom}
                                disabled={!playerName.trim() || (view === 'join' && !joinRoomInput.trim())}
                                className="flex-1 py-3 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-system-gray4/20 disabled:text-system-gray4 text-white font-medium rounded-xl transition-colors"
                            >
                                {view === 'create' ? 'Create' : 'Join'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-system-gray1 via-system-gray2 to-system-gray1">
            <div className="w-full max-w-md bg-system-gray1/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">GRIDLOCK</h1>
                <p className="text-system-gray4 text-center mb-8">Multiplayer Mode</p>

                <div className="space-y-3">
                    <button
                        onClick={() => setView('create')}
                        className="w-full py-4 bg-accent-blue hover:bg-accent-blue/80 text-white font-medium rounded-xl transition-colors"
                    >
                        Create Room
                    </button>
                    <button
                        onClick={() => setView('join')}
                        className="w-full py-4 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-xl transition-colors"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
