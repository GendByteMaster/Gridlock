import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, RotateCcw, Home } from 'lucide-react';
import { useProgressionStore } from '../store/progressionStore';

interface GameOverModalProps {
    winner: 'player' | 'opponent';
    stats: {
        turns: number;
        playerUnitsLost: number;
        opponentUnitsLost: number;
    };
    onRestart: () => void;
    onReturnToHub: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, stats, onRestart, onReturnToHub }) => {
    const { addWin, addLoss } = useProgressionStore();
    const isVictory = winner === 'player';

    // Award XP on mount
    React.useEffect(() => {
        if (isVictory) {
            addWin();
        } else {
            addLoss();
        }
    }, [isVictory, addWin, addLoss]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg p-8 bg-system-gray1/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${isVictory
                                ? 'bg-accent-green/20 text-accent-green'
                                : 'bg-accent-red/20 text-accent-red'
                            }`}
                    >
                        <Trophy size={48} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        {isVictory ? 'Victory!' : 'Defeat'}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-system-gray4"
                    >
                        {isVictory
                            ? 'You have conquered the battlefield!'
                            : 'Your forces have been overwhelmed.'}
                    </motion.p>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3 mb-8"
                >
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                                <TrendingUp size={20} className="text-accent-blue" />
                            </div>
                            <span className="text-white font-medium">Turns Played</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{stats.turns}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-red/20 flex items-center justify-center">
                                <Users size={20} className="text-accent-red" />
                            </div>
                            <span className="text-white font-medium">Units Lost</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{stats.playerUnitsLost}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                                <Users size={20} className="text-accent-green" />
                            </div>
                            <span className="text-white font-medium">Enemy Units Defeated</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{stats.opponentUnitsLost}</span>
                    </div>
                </motion.div>

                {/* XP Reward */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6 p-4 bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl text-center"
                >
                    <p className="text-accent-yellow font-medium">
                        +{isVictory ? 50 : 20} XP Earned
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-3"
                >
                    <button
                        onClick={onRestart}
                        className="flex-1 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={20} />
                        Play Again
                    </button>
                    <button
                        onClick={onReturnToHub}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Hub
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GameOverModal;
