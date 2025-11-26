import React from 'react';
import { motion } from 'framer-motion';
import { useProgressionStore } from '../store/progressionStore';
import { Swords, Network, Trophy, User, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import TopBar from './TopBar';
import { soundManager } from '../utils/SoundManager';
import { Card } from './ui/Card';

interface HubProps {
    onNavigate: (destination: 'battle-local' | 'battle-online' | 'skill-tree' | 'roster') => void;
    onBack: () => void;
}

const Hub: React.FC<HubProps> = ({ onNavigate, onBack }) => {
    const { playerStats } = useProgressionStore();

    // Safety check for playerStats
    if (!playerStats) {
        return <div className="h-screen w-full flex items-center justify-center text-system-label-secondary">Loading...</div>;
    }

    const xpPercentage = (playerStats.xp / playerStats.xpToNextLevel) * 100;

    const menuItems = [
        {
            id: 'battle-local',
            title: 'Battle',
            subtitle: 'Fight against AI',
            icon: Swords,
            color: 'text-accent-blue',
            bg: 'bg-accent-blue/10',
            border: 'border-accent-blue/20'
        },
        {
            id: 'battle-online',
            title: 'Multiplayer',
            subtitle: 'Challenge players',
            icon: Network,
            color: 'text-accent-purple',
            bg: 'bg-accent-purple/10',
            border: 'border-accent-purple/20'
        },
        {
            id: 'skill-tree',
            title: 'Skill Tree',
            subtitle: 'Customize abilities',
            icon: Zap,
            color: 'text-accent-yellow',
            bg: 'bg-accent-yellow/10',
            border: 'border-accent-yellow/20'
        },
        {
            id: 'roster',
            title: 'Unit Roster',
            subtitle: 'View your units',
            icon: User,
            color: 'text-accent-green',
            bg: 'bg-accent-green/10',
            border: 'border-accent-green/20'
        }
    ];

    return (
        <div className="h-screen w-full flex flex-col bg-system-background-primary">
            <TopBar
                onBack={onBack}
                backLabel="Back"
                rightContent={
                    <div className="px-3 py-1 bg-system-fill-tertiary rounded-full flex items-center gap-2 border border-white/5 backdrop-blur-md">
                        <User size={14} className="text-system-label-secondary" />
                        <span className="text-system-label-primary font-medium text-sm">Level {playerStats.level}</span>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
                <div className="w-full max-w-5xl">
                    {/* Title Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-display font-bold text-white tracking-tight mb-2">
                            Hub
                        </h1>
                        <p className="text-system-label-secondary text-lg">Select your destination</p>
                    </div>

                    {/* Player Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Card variant="glass" className="mb-8 overflow-visible">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-baseline gap-4">
                                        <h2 className="text-3xl font-bold text-white tracking-tight">Level {playerStats.level}</h2>
                                        <span className="text-base text-system-label-secondary font-medium">{playerStats.xp} / {playerStats.xpToNextLevel} XP</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-accent-green mb-1">
                                            <Trophy size={24} />
                                            <span className="text-2xl font-bold">{playerStats.wins}</span>
                                        </div>
                                        <p className="text-[10px] text-system-label-tertiary uppercase tracking-widest font-bold">Wins</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-accent-red mb-1">
                                            <Trophy size={24} />
                                            <span className="text-2xl font-bold">{playerStats.losses}</span>
                                        </div>
                                        <p className="text-[10px] text-system-label-tertiary uppercase tracking-widest font-bold">Losses</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-accent-yellow mb-1">
                                            <Zap size={24} />
                                            <span className="text-2xl font-bold">{playerStats.skillPoints}</span>
                                        </div>
                                        <p className="text-[10px] text-system-label-tertiary uppercase tracking-widest font-bold">SP</p>
                                    </div>
                                </div>
                            </div>

                            {/* XP Bar */}
                            <div className="w-full h-2 bg-system-fill-tertiary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpPercentage}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full rounded-full bg-accent-blue shadow-[0_0_10px_rgba(10,132,255,0.5)]"
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Card
                                        variant="glass"
                                        className="group cursor-pointer hover:bg-system-material-thick transition-all duration-300 h-40 flex flex-col justify-center relative overflow-hidden"
                                        onClick={() => {
                                            soundManager.playClick();
                                            onNavigate(item.id as any);
                                        }}
                                        onMouseEnter={() => soundManager.playHover()}
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className={clsx(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                                item.bg, item.color, "border border-white/5"
                                            )}>
                                                <Icon size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{item.title}</h3>
                                                <p className="text-sm text-system-label-secondary group-hover:text-white transition-colors">{item.subtitle}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hub;
