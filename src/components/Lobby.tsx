import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import { useProgressionStore } from '../store/progressionStore';
import { clsx } from 'clsx';
import { Users, Copy, Check, Wifi, ArrowLeft, Play, Globe, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

        const { userId, unlockedSkills } = useProgressionStore.getState();

        socketService.createRoom(playerName, userId || undefined, unlockedSkills, (newRoomId) => {
            setRoomId(newRoomId);
            setIsHost(true);
            setView('waiting');
        });
    };

    const handleJoinRoom = () => {
        if (!playerName.trim() || !joinRoomInput.trim()) return;

        const { userId, unlockedSkills } = useProgressionStore.getState();

        socketService.joinRoom(joinRoomInput.toUpperCase(), playerName, userId || undefined, unlockedSkills, (success, room) => {
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

    return (
        <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <AnimatePresence mode="wait">
                {view === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-4xl z-10"
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Multiplayer</h1>
                            <p className="text-system-gray4 text-lg">Challenge opponents worldwide in tactical combat.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <button
                                onClick={() => setView('create')}
                                className="group relative p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-blue/50 rounded-3xl text-left transition-all duration-300 hover:shadow-2xl hover:shadow-accent-blue/10"
                            >
                                <div className="absolute top-6 right-6 p-3 bg-accent-blue/10 rounded-xl text-accent-blue group-hover:scale-110 transition-transform">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Create Room</h3>
                                <p className="text-system-gray4">Host a new game and invite a friend to join via code.</p>
                            </button>

                            <button
                                onClick={() => setView('join')}
                                className="group relative p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-purple/50 rounded-3xl text-left transition-all duration-300 hover:shadow-2xl hover:shadow-accent-purple/10"
                            >
                                <div className="absolute top-6 right-6 p-3 bg-accent-purple/10 rounded-xl text-accent-purple group-hover:scale-110 transition-transform">
                                    <Globe size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Join Room</h3>
                                <p className="text-system-gray4">Enter an existing room code to join the battle.</p>
                            </button>
                        </div>

                        <div className="mt-12 text-center">
                            <button
                                onClick={onBack}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-system-gray4 hover:text-white rounded-xl transition-colors font-medium"
                            >
                                Back to Menu
                            </button>
                        </div>
                    </motion.div>
                )}

                {(view === 'create' || view === 'join') && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-system-gray1/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl z-10"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => setView('menu')}
                                className="p-2 rounded-lg hover:bg-white/10 text-system-gray4 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-white">
                                {view === 'create' ? 'Create Room' : 'Join Room'}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-system-gray4 mb-2">Your Name</label>
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
                                    <label className="block text-sm font-medium text-system-gray4 mb-2">Room Code</label>
                                    <input
                                        type="text"
                                        value={joinRoomInput}
                                        onChange={(e) => setJoinRoomInput(e.target.value.toUpperCase())}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-system-gray4 font-mono tracking-wider focus:outline-none focus:border-accent-blue transition-colors uppercase"
                                    />
                                </div>
                            )}

                            <button
                                onClick={view === 'create' ? handleCreateRoom : handleJoinRoom}
                                disabled={!playerName.trim() || (view === 'join' && !joinRoomInput.trim())}
                                className="w-full py-4 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-system-gray4/20 disabled:text-system-gray4 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20 disabled:shadow-none mt-4"
                            >
                                {view === 'create' ? 'Create Lobby' : 'Join Lobby'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {view === 'waiting' && (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-system-gray1/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl z-10"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Lobby</h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 rounded-full border border-accent-green/20">
                                <Wifi size={14} className="text-accent-green animate-pulse" />
                                <span className="text-xs font-medium text-accent-green">Connected</span>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="text-xs font-medium text-system-gray4 mb-2 uppercase tracking-widest">Room Code</div>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl font-mono font-bold text-white tracking-widest">{roomId}</span>
                                <button
                                    onClick={copyRoomCode}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-system-gray4 hover:text-white"
                                    title="Copy Code"
                                >
                                    {copied ? <Check size={20} className="text-accent-green" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-sm text-system-gray4 px-1">
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>Players ({currentRoom?.players?.length || 0}/2)</span>
                                </div>
                                {currentRoom?.players?.length < 2 && (
                                    <span className="animate-pulse">Waiting for opponent...</span>
                                )}
                            </div>

                            <div className="grid gap-3">
                                {currentRoom?.players?.map((player: any, index: number) => (
                                    <motion.div
                                        key={player.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-lg">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{player.name}</div>
                                                <div className="text-xs text-system-gray4">{index === 0 ? 'Host' : 'Challenger'}</div>
                                            </div>
                                        </div>
                                        <span className={clsx(
                                            "text-xs px-3 py-1.5 rounded-full font-medium border",
                                            player.ready
                                                ? "bg-accent-green/10 text-accent-green border-accent-green/20"
                                                : "bg-system-gray4/10 text-system-gray4 border-system-gray4/20"
                                        )}>
                                            {player.ready ? 'Ready' : 'Not Ready'}
                                        </span>
                                    </motion.div>
                                ))}

                                {/* Empty Slot Placeholder */}
                                {(!currentRoom?.players || currentRoom.players.length < 2) && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 border-dashed flex items-center gap-3 opacity-50">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Users size={20} className="text-white/50" />
                                        </div>
                                        <span className="text-system-gray4 italic">Empty Slot</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {currentRoom?.players?.length === 2 ? (
                            <button
                                onClick={handleReady}
                                className="w-full py-4 bg-accent-blue hover:bg-accent-blue/80 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20 flex items-center justify-center gap-2"
                            >
                                <Play size={20} fill="currentColor" />
                                <span>Ready to Battle</span>
                            </button>
                        ) : (
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="loading-dots text-system-gray4">Waiting for another player to join</div>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setView('menu')}
                                className="text-sm text-system-gray4 hover:text-white transition-colors"
                            >
                                Leave Lobby
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lobby;
