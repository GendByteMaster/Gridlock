import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { clsx } from 'clsx';
import {
    Sword, Move, Zap, Crosshair, Heart, RefreshCw,
    Anchor, Ghost, Flame, Snowflake, Skull, Star, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';
import { SKILL_REGISTRY } from '../combat/skills/SkillRegistry';
import { toEngineUnit } from '../combat/adapter/CombatStateAdapter';

const SkillBar: React.FC = () => {
    const { selectedUnitId, units, targetingSkillId, setTargetingMode } = useGameStore();
    const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

    if (!selectedUnitId) return null;

    const rawUnit = units.find(u => u.id === selectedUnitId);
    if (!rawUnit) return null;

    // Adapt to engine unit format
    const unit = toEngineUnit(rawUnit as any);

    const getCategoryFromTags = (tags: string[] = []): string => {
        if (tags.includes('ultimate')) return 'Ultimate';
        if (tags.includes('mobility')) return 'Mobility';
        if (tags.includes('support') || tags.includes('healing')) return 'Support';
        if (tags.includes('control')) return 'Control';
        if (tags.includes('offensive')) return 'Offense';
        return 'Offense';
    };

    const getIcon = (skill: any) => {
        const tags = skill.tags || [];
        const category = getCategoryFromTags(tags);
        const name = skill.name.toLowerCase();

        if (name.includes('turret')) return <Anchor size={24} />;
        if (name.includes('repair') || name.includes('heal')) return <Heart size={24} />;
        if (name.includes('fire')) return <Flame size={24} />;
        if (name.includes('frost') || name.includes('ice')) return <Snowflake size={24} />;
        if (name.includes('lightning') || name.includes('thunder')) return <Zap size={24} />;
        if (name.includes('shot') || name.includes('arrow')) return <Crosshair size={24} />;
        if (name.includes('ghost') || name.includes('shadow')) return <Ghost size={24} />;
        if (name.includes('death') || name.includes('soul')) return <Skull size={24} />;

        switch (category) {
            case 'Mobility': return <Move size={24} />;
            case 'Control': return <Activity size={24} />;
            case 'Support': return <RefreshCw size={24} />;
            case 'Ultimate': return <Star size={24} />;
            default: return <Sword size={24} />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Offense': return 'text-accent-red';
            case 'Mobility': return 'text-accent-blue';
            case 'Control': return 'text-accent-purple';
            case 'Support': return 'text-accent-green';
            case 'Ultimate': return 'text-accent-gold';
            default: return 'text-white';
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-system-material-thick backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl z-[100] ring-1 ring-black/20"
        >
            {unit.skills.map((skillId, index) => {
                const skill = SKILL_REGISTRY[skillId];
                if (!skill) return null;

                const isSelected = targetingSkillId === skill.id;
                const cooldown = unit.runtime.cooldowns[skill.id] || 0;
                const isOnCooldown = cooldown > 0;
                const category = getCategoryFromTags(skill.tags);
                const colorClass = getCategoryColor(category);

                return (
                    <div key={skill.id} className="relative group">
                        <motion.button
                            whileHover={{ scale: 1.1, y: -4 }}
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
                                "relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                                isSelected
                                    ? "bg-accent-blue text-white shadow-[0_0_20px_rgba(10,132,255,0.5)] ring-2 ring-white/50"
                                    : "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20",
                                isOnCooldown && "opacity-50 cursor-not-allowed grayscale"
                            )}
                        >
                            <div className={clsx("transition-colors", isSelected ? "text-white" : colorClass)}>
                                {getIcon(skill)}
                            </div>

                            {/* Cooldown Overlay */}
                            {isOnCooldown && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-[2px]">
                                    <span className="text-xl font-bold text-white font-mono">{cooldown}</span>
                                </div>
                            )}

                            {/* Keyboard Shortcut Badge */}
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-black/80 border border-white/20 rounded-full flex items-center justify-center shadow-lg z-10 backdrop-blur-md">
                                <span className="text-[10px] font-bold text-gray-300">{index + 1}</span>
                            </div>
                        </motion.button>

                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredSkillId === skill.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: -12, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-56 p-4 bg-system-material-thick backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 pointer-events-none"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={clsx("font-bold text-base", colorClass)}>{skill.name}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium px-2 py-0.5 bg-white/5 rounded-full border border-white/5">{category}</span>
                                    </div>
                                    <p className="text-xs text-system-gray4 leading-relaxed mb-3">{skill.description}</p>
                                    <div className="flex items-center gap-4 text-[11px] text-system-gray2 border-t border-white/5 pt-2 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <RefreshCw size={12} className="text-system-gray3" />
                                            <span>{skill.cooldown} Turns</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={12} className="text-system-gray3" />
                                            <span>{skill.cost} AP</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </motion.div>
    );
};

export default SkillBar;
