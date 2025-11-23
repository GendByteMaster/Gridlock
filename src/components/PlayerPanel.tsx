import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getUnitIcon } from '../utils/unitUtils';
import { motion } from 'framer-motion';

export const PlayerPanel: React.FC = () => {
    const { gameStats, turn } = useGameStore();

    // Safety check for gameStats
    if (!gameStats) return null;

    // Calculate score and level
    const score = (gameStats.opponentUnitsLost || 0) * 100;
    const level = 1 + Math.floor(score / 500);
    const opponentKills = gameStats.opponentKills || [];

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ willChange: 'transform' }}
            className="fixed left-6 top-24 bottom-8 w-72 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl z-40 flex flex-col overflow-hidden ring-1 ring-white/5"
        >
            {/* Player Info */}
            <div className="flex flex-col items-center mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent -mx-6 -mt-6 h-32 z-0" />

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 border-[3px] border-white/10 shadow-xl z-10 relative"
                >
                    <span className="text-3xl font-bold text-white tracking-tight">P1</span>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 border-2 border-gray-900 rounded-full" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white tracking-tight z-10">Player One</h2>

                <div className="flex items-center gap-3 mt-3 z-10">
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/5 backdrop-blur-md">
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Urvin {level}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/20 backdrop-blur-md">
                        <span className="text-xs text-blue-300 font-semibold">{score} PTS</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {/* Kills */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Eliminated Targets</h3>
                        <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{opponentKills.length}</span>
                    </div>

                    {opponentKills.length === 0 ? (
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/5 border-dashed flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors cursor-default">
                            <span className="text-3xl mb-3 opacity-20 grayscale group-hover:grayscale-0 transition-all">⚔️</span>
                            <p className="text-xs text-white/30 font-medium">No eliminations yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            {opponentKills.map((type, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="aspect-square bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl flex items-center justify-center border border-red-500/10 hover:bg-red-500/20 transition-colors group relative cursor-help"
                                    title={`Eliminated: ${type}`}
                                >
                                    <div className="text-red-400/80 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300">
                                        {getUnitIcon(type, 18)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Casualties */}
                <div>
                    <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 px-1">Casualties</h3>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </div>
                            <span className="text-sm font-medium text-white/70">Units Lost</span>
                        </div>
                        <span className="text-xl font-bold text-white">{gameStats.playerUnitsLost}</span>
                    </div>
                </div>
            </div>

            {/* Turn Indicator */}
            <motion.div
                animate={{
                    backgroundColor: turn === 'player' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: turn === 'player' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
                className="mt-6 p-4 rounded-2xl border backdrop-blur-md"
            >
                <div className="flex items-center gap-2.5 mb-1.5">
                    <motion.div
                        animate={{ scale: turn === 'player' ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-2 h-2 rounded-full ${turn === 'player' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-white/20'}`}
                    />
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Status</div>
                </div>
                <div className={`text-base font-bold ${turn === 'player' ? 'text-blue-300' : 'text-white/60'}`}>
                    {turn === 'player' ? 'Your Turn' : 'Opponent Turn'}
                </div>
            </motion.div>
        </motion.div>
    );
};
