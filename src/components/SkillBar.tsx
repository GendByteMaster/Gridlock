import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { clsx } from 'clsx';
import { Sword, Move, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

const SkillBar: React.FC = () => {
    const { selectedUnitId, units, targetingSkillId, setTargetingMode } = useGameStore();
    const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

    if (!selectedUnitId) return null;

    const unit = units.find(u => u.id === selectedUnitId);
    if (!unit) return null;

    const getIcon = (category: string) => {
        switch (category) {
            case 'Offense': return <Sword size={20} />;
            case 'Mobility': return <Move size={20} />;
            case 'Control': return <Shield size={20} />;
            default: return <Sword size={20} />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Offense': return 'text-accent-red';
            case 'Mobility': return 'text-accent-blue';
            case 'Control': return 'text-accent-purple';
            default: return 'text-white';
        }
    };

    return (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 p-3 bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl z-[100]">
            {unit.equippedSkills.map((skill, index) => {
                const isSelected = targetingSkillId === skill.id;
                const cooldown = unit.cooldowns[skill.id] || 0;
                const isOnCooldown = cooldown > 0;
                const colorClass = getCategoryColor(skill.category);

                return (
                    <div key={skill.id} className="relative group">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (!isOnCooldown) {
                                    setTargetingMode(isSelected ? null : skill.id);
                                    soundManager.playSkillSelect();
                                }
                            }}
                            onMouseEnter={() => {
                                setHoveredSkillId(skill.id);
                                soundManager.playHover();
                            }}
                            onMouseLeave={() => setHoveredSkillId(null)}
                            disabled={isOnCooldown}
                            className={clsx(
                                "relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 border",
                                isSelected
                                    ? "bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue shadow-[0_0_20px_rgba(10,132,255,0.3)]"
                                    : "bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-white/30 hover:bg-white/15",
                                isOnCooldown && "opacity-50 cursor-not-allowed grayscale"
                            )}
                        >
                            <div className={clsx("mb-1 transition-colors", isSelected ? "text-accent-blue" : "text-gray-300 group-hover:text-white")}>
                                {getIcon(skill.category)}
                            </div>
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isSelected ? "text-accent-blue" : "text-gray-400")}>
                                {skill.name}
                            </span>

                            {/* Cooldown Overlay */}
                            {isOnCooldown && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm">
                                    <span className="text-xl font-bold text-white">{cooldown}</span>
                                </div>
                            )}

                            {/* Keyboard Shortcut Badge */}
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-black border border-white/20 rounded-full flex items-center justify-center shadow-lg z-10">
                                <span className="text-[10px] font-bold text-gray-400">{index + 1}</span>
                            </div>
                        </motion.button>

                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredSkillId === skill.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-48 p-3 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl z-50 pointer-events-none"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={clsx("font-bold text-sm", colorClass)}>{skill.name}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">{skill.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-2">{skill.description}</p>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 border-t border-white/5 pt-2">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-300">CD:</span> {skill.cooldown}
                                        </div>
                                        {skill.damage && (
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-gray-300">DMG:</span> {skill.damage}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default SkillBar;
