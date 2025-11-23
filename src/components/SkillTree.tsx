import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressionStore } from '../store/progressionStore';
import { SKILLS } from '../data/skills';
import { Zap, Swords, Wind, Shield, Lock, Check } from 'lucide-react';
import { clsx } from 'clsx';
import TopBar from './TopBar';

interface SkillTreeProps {
    onBack: () => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ onBack }) => {
    const { unlockedSkills, playerStats, unlockSkill, spendSkillPoint } = useProgressionStore();
    const [selectedUnit] = useState<string>('Vanguard');
    const [showMinimap] = useState(true);

    const unitSkills = unlockedSkills[selectedUnit] || [];

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Offense': return Swords;
            case 'Mobility': return Wind;
            case 'Control': return Shield;
            default: return Zap;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Offense': return { bg: '#ef4444', light: '#fca5a5' };
            case 'Mobility': return { bg: '#3b82f6', light: '#93c5fd' };
            case 'Control': return { bg: '#a855f7', light: '#d8b4fe' };
            default: return { bg: '#6b7280', light: '#9ca3af' };
        }
    };

    const isSkillUnlocked = (skillId: string) => unitSkills.includes(skillId);

    const canUnlockSkill = (skillId: string) => {
        const skill = SKILLS[skillId];
        if (!skill || isSkillUnlocked(skillId)) return false;
        return skill.prerequisites.every(prereqId => isSkillUnlocked(prereqId));
    };

    const handleUnlockSkill = (skillId: string) => {
        if (canUnlockSkill(skillId) && spendSkillPoint()) {
            unlockSkill(selectedUnit, skillId);
        }
    };

    const tier1Skills = Object.values(SKILLS).filter(s => s.tier === 1);
    const tier2Skills = Object.values(SKILLS).filter(s => s.tier === 2);
    const tier3Skills = Object.values(SKILLS).filter(s => s.tier === 3);

    const SkillNode = ({ skill, size = 'large' }: { skill: any; size?: 'large' | 'small' }) => {
        const unlocked = isSkillUnlocked(skill.id);
        const canUnlock = canUnlockSkill(skill.id);
        const colors = getCategoryColor(skill.category);
        const Icon = getCategoryIcon(skill.category);
        const nodeSize = size === 'large' ? 'w-24 h-24' : 'w-16 h-16';
        const iconSize = size === 'large' ? 32 : 24;

        return (
            <div className="relative group">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUnlockSkill(skill.id)}
                    className={clsx(
                        "relative rounded-full border-4 cursor-pointer transition-all duration-300",
                        nodeSize,
                        unlocked ? "border-opacity-100" : canUnlock ? "border-opacity-60" : "border-opacity-30 opacity-50"
                    )}
                    style={{
                        borderColor: unlocked ? colors.bg : '#4b5563',
                        backgroundColor: unlocked ? colors.light : '#1f2937'
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Icon size={iconSize} className={unlocked ? "text-white" : "text-gray-500"} />
                    </div>

                    {/* Status Badge */}
                    <div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ backgroundColor: unlocked ? colors.bg : canUnlock ? '#fbbf24' : '#374151' }}
                    >
                        {unlocked ? (
                            <Check size={12} className="text-white" />
                        ) : canUnlock ? (
                            <Zap size={12} className="text-black" />
                        ) : (
                            <Lock size={12} className="text-gray-500" />
                        )}
                    </div>
                </motion.div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/20">
                    <div className="font-bold">{skill.name}</div>
                    <div className="text-gray-400 text-[10px] max-w-xs whitespace-normal">{skill.description}</div>
                    <div className="text-gray-500 text-[10px] mt-1">
                        CD: {skill.cooldown} {skill.damage && `| DMG: ${skill.damage}`}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
            <TopBar
                onBack={onBack}
                backLabel="Hub"
                rightContent={
                    <div className="px-4 py-1.5 bg-accent-yellow/20 border border-accent-yellow/30 rounded-full flex items-center gap-2">
                        <Zap size={14} className="text-accent-yellow" />
                        <span className="text-accent-yellow font-bold text-sm">{playerStats.skillPoints} SP</span>
                    </div>
                }
            />

            {/* Title Section */}
            <div className="text-center mt-8 mb-4">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight">
                    Skill Tree
                </h1>
            </div>

            {/* Skill Tree Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Tier 1 - Large Nodes */}
                    <div className="flex justify-center gap-6">
                        {tier1Skills.map(skill => (
                            <div key={skill.id} className="bg-white rounded-2xl p-6 shadow-xl">
                                <SkillNode skill={skill} size="large" />
                            </div>
                        ))}
                    </div>

                    {/* Connection Lines */}
                    <div className="flex justify-center">
                        <svg width="600" height="60" className="overflow-visible">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <circle cx="5" cy="5" r="1" fill="#9ca3af" />
                                </pattern>
                            </defs>
                            {/* Dotted lines from tier 1 to tier 2 */}
                            <line x1="150" y1="0" x2="150" y2="60" stroke="url(#dots)" strokeWidth="2" />
                            <line x1="300" y1="0" x2="300" y2="60" stroke="url(#dots)" strokeWidth="2" />
                            <line x1="450" y1="0" x2="450" y2="60" stroke="url(#dots)" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Tier 2 - Small Nodes in Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-center gap-4 flex-wrap">
                            {tier2Skills.slice(0, 6).map(skill => (
                                <SkillNode key={skill.id} skill={skill} size="small" />
                            ))}
                        </div>
                    </div>

                    {/* Connection Lines */}
                    <div className="flex justify-center">
                        <svg width="600" height="60" className="overflow-visible">
                            <line x1="150" y1="0" x2="150" y2="60" stroke="url(#dots)" strokeWidth="2" />
                            <line x1="300" y1="0" x2="300" y2="60" stroke="url(#dots)" strokeWidth="2" />
                            <line x1="450" y1="0" x2="450" y2="60" stroke="url(#dots)" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Tier 3 - Placeholder Cards */}
                    <div className="flex justify-center gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-xl w-40 h-32 flex items-center justify-center">
                                <Lock size={32} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Minimap */}
            {showMinimap && (
                <div className="absolute bottom-6 right-6 w-48 h-32 bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-2">
                    <div className="w-full h-full bg-gradient-to-br from-red-100 via-blue-100 to-purple-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600 font-medium">Minimap</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillTree;
