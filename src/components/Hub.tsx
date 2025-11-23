import React from 'react';
import { motion } from 'framer-motion';
import { useProgressionStore } from '../store/progressionStore';
import { Swords, Network, Trophy, User, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import TopBar from './TopBar';
import { soundManager } from '../utils/SoundManager';

interface HubProps {
    onNavigate: (destination: 'battle-local' | 'battle-online' | 'skill-tree' | 'roster') => void;
    onBack: () => void;
}

const Hub: React.FC<HubProps> = ({ onNavigate, onBack }) => {
    const { playerStats } = useProgressionStore();

    // Safety check for playerStats
    if (!playerStats) {
        return <div className="h-screen w-full flex items-center justify-center text-white">Loading...</div>;
    }

    const xpPercentage = (playerStats.xp / playerStats.xpToNextLevel) * 100;

    const menuItems = [
        {
            id: 'battle-local',
            title: 'Battle',
            subtitle: 'Fight against AI',
            icon: Swords,
            color: 'accent-blue',
            gradient: 'from-accent-blue/20 to-accent-blue/5'
        },
        {
            id: 'battle-online',
            title: 'Multiplayer',
            subtitle: 'Challenge players',
            icon: Network,
            color: 'accent-purple',
            gradient: 'from-accent-purple/20 to-accent-purple/5'
        },
        {
            id: 'skill-tree',
            title: 'Skill Tree',
            subtitle: 'Customize abilities',
            icon: Zap,
            color: 'accent-yellow',
            gradient: 'from-accent-yellow/20 to-accent-yellow/5'
        },
        {
            id: 'roster',
            title: 'Unit Roster',
            subtitle: 'View your units',
            icon: User,
            color: 'accent-green',
            gradient: 'from-accent-green/20 to-accent-green/5'
        }
    ];

    return (
        <div className="h-screen w-full flex flex-col">
            <TopBar
                onBack={onBack}
                backLabel="Back"
                rightContent={
                    <div className="px-4 py-1.5 bg-white/10 rounded-full flex items-center gap-2 border border-white/10 backdrop-blur-md">
                        <User size={14} className="text-white" />
                        <span className="text-white font-bold text-sm">Level {playerStats.level}</span>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-6xl">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-bold text-white tracking-tighter mb-2 drop-shadow-2xl">
                            HUB
                        </h1>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                    </div>

                    {/* Player Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        style={{ willChange: 'transform' }}
                        className="mb-12 p-8 bg-gray-900/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl ring-1 ring-white/5"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-4xl font-bold text-white tracking-tight">Level {playerStats.level}</h2>
                                    <span className="text-lg text-white/40 font-medium">{playerStats.xp} / {playerStats.xpToNextLevel} XP</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-center group">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <Trophy size={28} />
                                        <span className="text-3xl font-bold">{playerStats.wins}</span>
                                    </div>
                                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Wins</p>
                                </div>
                                <div className="text-center group">
                                    <div className="flex items-center gap-2 text-red-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <Trophy size={28} />
                                        <span className="text-3xl font-bold">{playerStats.losses}</span>
                                    </div>
                                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Losses</p>
                                </div>
                                <div className="text-center group">
                                    <div className="flex items-center gap-2 text-amber-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={28} />
                                        <span className="text-3xl font-bold">{playerStats.skillPoints}</span>
                                    </div>
                                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Skill Points</p>
                                </div>
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercentage}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </motion.div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ willChange: 'transform' }}
                                    onMouseEnter={() => soundManager.playHover()}
                                    onClick={() => {
                                        soundManager.playClick();
                                        onNavigate(item.id as any);
                                    }}
                                    className={clsx(
                                        "relative p-8 rounded-[32px] border border-white/10 backdrop-blur-xl transition-all duration-300 overflow-hidden group text-left h-48",
                                        "bg-gray-900/40 hover:bg-gray-800/60",
                                        "hover:border-white/20 hover:shadow-2xl hover:ring-1 hover:ring-white/10"
                                    )}
                                >
                                    {/* Hover Gradient Background */}
                                    <div className={clsx(
                                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        "bg-gradient-to-br", item.gradient
                                    )} />

                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div className={clsx(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                            `bg-${item.color}/10 text-${item.color} border border-${item.color}/20`
                                        )}>
                                            <Icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{item.title}</h3>
                                            <p className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{item.subtitle}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hub;
