import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressionStore } from '../store/progressionStore';
import { SKILLS } from '../data/skills';
import { ArrowLeft, Lock, Check, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface EnhancedSkillTreeProps {
    onBack: () => void;
}

const unitTypes = [
    'Guardian', 'Scout', 'Striker', 'Arcanist', 'Vanguard',
    'Sentinel', 'Mechanist', 'Monk', 'FrostAdept', 'WarImp',
    'Coreframe', 'Phantom', 'Fabricator', 'Bastion', 'Weaver',
    'Spectre', 'Ronin', 'Juggernaut', 'Medic', 'Sniper',
    'Engineer', 'Summoner', 'Assassin', 'Templar', 'Dragoon',
    'Valkyrie', 'Overlord', 'Titan', 'Bomber',
    'ChronoKnight', 'StormTitan', 'ShadowDancer', 'SolarPriest', 'VoidWalker',
    'IronColossus', 'ArcaneArcher', 'BoneReaper', 'EmberWitch', 'AstralSentinel'
];

const EnhancedSkillTree: React.FC<EnhancedSkillTreeProps> = ({ onBack }) => {
    const { unlockedSkills, playerStats, unlockSkill } = useProgressionStore();
    const [selectedUnit, setSelectedUnit] = useState<string>('Vanguard');

    const allSkills = Object.values(SKILLS);

    const isSkillUnlocked = (skillId: string) => {
        const unitSkills = unlockedSkills[selectedUnit] || [];
        return unitSkills.includes(skillId);
    };

    const canUnlockSkill = (skillId: string) => {
        const skill = SKILLS[skillId];
        if (!skill) return false;
        if (isSkillUnlocked(skillId)) return false;
        return skill.prerequisites.every(prereqId => isSkillUnlocked(prereqId));
    };

    const handleUnlockSkill = async (skillId: string) => {
        if (canUnlockSkill(skillId) && playerStats.skillPoints > 0) {
            await unlockSkill(selectedUnit, skillId);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Offense': return 'accent-red';
            case 'Mobility': return 'accent-blue';
            case 'Control': return 'accent-purple';
            default: return 'system-gray4';
        }
    };

    return (
        <div className="h-screen w-full flex flex-col p-4 bg-gradient-to-br from-system-gray1 via-system-gray2 to-system-gray1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Skill Tree</h1>
                    <p className="text-sm text-system-gray4">Customize your units</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-accent-yellow/20 backdrop-blur-xl border border-accent-yellow/30 rounded-xl">
                    <Zap size={20} className="text-accent-yellow" />
                    <span className="text-white font-bold">{playerStats.skillPoints}</span>
                    <span className="text-system-gray4 text-sm">SP</span>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Unit Selector */}
                <div className="w-64 space-y-2 overflow-y-auto">
                    <h3 className="text-sm font-medium text-system-gray4 uppercase tracking-wider mb-3">Select Unit</h3>
                    {unitTypes.map((unit) => (
                        <motion.button
                            key={unit}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedUnit(unit)}
                            className={clsx(
                                "w-full p-4 rounded-xl border transition-all duration-200 text-left",
                                selectedUnit === unit
                                    ? "bg-accent-blue/20 border-accent-blue text-white"
                                    : "bg-white/5 border-white/10 text-system-gray4 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <div className="font-bold">{unit}</div>
                            <div className="text-xs mt-1">
                                {(unlockedSkills[unit] || []).length} skills unlocked
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-white mb-1">{selectedUnit}</h2>
                        <p className="text-sm text-system-gray4">
                            Unlock and customize skills for this unit
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {allSkills.map((skill) => {
                            const unlocked = isSkillUnlocked(skill.id);
                            const colorClass = getCategoryColor(skill.category);

                            return (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: unlocked ? 1 : 1.05 }}
                                    className={clsx(
                                        "relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-200",
                                        unlocked
                                            ? `bg-${colorClass}/10 border-${colorClass}/30`
                                            : "bg-white/5 border-white/10 opacity-60"
                                    )}
                                >
                                    {/* Unlock Status */}
                                    <div className="absolute top-3 right-3">
                                        {unlocked ? (
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                `bg-${colorClass}/20 text-${colorClass}`
                                            )}>
                                                <Check size={16} />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-system-gray4">
                                                <Lock size={16} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Skill Info */}
                                    <div className="mb-4">
                                        <div className={clsx(
                                            "text-xs font-medium uppercase tracking-wider mb-2",
                                            unlocked ? `text-${colorClass}` : "text-system-gray4"
                                        )}>
                                            {skill.category}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
                                        <p className="text-sm text-system-gray4 line-clamp-2">{skill.description}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-1 mb-4 text-xs">
                                        {skill.damage && (
                                            <div className="flex justify-between text-system-gray4">
                                                <span>Damage:</span>
                                                <span className="text-white font-medium">{skill.damage}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-system-gray4">
                                            <span>Cooldown:</span>
                                            <span className="text-white font-medium">{skill.cooldown} turns</span>
                                        </div>
                                    </div>

                                    {/* Unlock Button */}
                                    {!unlocked && (
                                        <button
                                            onClick={() => handleUnlockSkill(skill.id)}
                                            disabled={playerStats.skillPoints === 0}
                                            className={clsx(
                                                "w-full py-2 rounded-lg font-medium text-sm transition-colors",
                                                playerStats.skillPoints > 0
                                                    ? "bg-accent-yellow/20 hover:bg-accent-yellow/30 text-accent-yellow border border-accent-yellow/30"
                                                    : "bg-white/5 text-system-gray4 border border-white/10 cursor-not-allowed"
                                            )}
                                        >
                                            {playerStats.skillPoints > 0 ? 'Unlock (1 SP)' : 'No Skill Points'}
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedSkillTree;
