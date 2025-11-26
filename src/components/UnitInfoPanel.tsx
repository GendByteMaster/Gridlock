import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { UNIT_DATA } from '../data/unitData';
import { getUnitIcon } from '../utils/unitUtils';
import { SKILL_REGISTRY } from '../combat/skills/SkillRegistry';
import { Card } from './ui/Card';
import { toEngineUnit } from '../combat/adapter/CombatStateAdapter';

export const UnitInfoPanel: React.FC = () => {
    const { selectedUnitId, units } = useGameStore();
    const rawUnit = units.find(u => u.id === selectedUnitId);

    if (!rawUnit) return null;

    // Adapt to engine unit format
    const selectedUnit = toEngineUnit(rawUnit as any);

    if (!selectedUnit) return null;

    const data = UNIT_DATA[selectedUnit.type];
    if (!data) return null;

    const { hp, maxHp } = selectedUnit.stats;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-6 top-24 bottom-8 w-80 z-40"
            >
                <Card variant="glass" padding="none" className="h-full flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 to-transparent -mx-6 -mt-6 h-32 z-0" />

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-24 h-24 bg-system-fill-secondary rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-xl relative z-10"
                            >
                                {getUnitIcon(selectedUnit.type, 48)}
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-tight relative z-10">{data.name}</h2>
                            <span className="text-xs font-bold tracking-wider text-accent-blue uppercase px-3 py-1 bg-accent-blue/10 rounded-full border border-accent-blue/20 backdrop-blur-md relative z-10">
                                {data.role}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-8 relative bg-system-fill-quaternary p-4 rounded-xl">
                            <p className="text-sm text-system-label-secondary text-center italic leading-relaxed">
                                {data.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="space-y-6 mb-8">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-system-label-secondary mb-2 uppercase tracking-wide px-1">
                                    <span>Health Status</span>
                                    <span className={hp < maxHp * 0.3 ? 'text-accent-red' : 'text-white'}>
                                        {hp} / {maxHp}
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-system-fill-tertiary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className={`h-full rounded-full transition-colors duration-300 ${hp < maxHp * 0.3 ? 'bg-accent-red' : 'bg-accent-green'}`}
                                    />
                                </div>
                            </div>

                            <div className="bg-system-fill-tertiary rounded-xl p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-system-label-tertiary uppercase tracking-widest mb-0.5">Movement</h3>
                                    <p className="text-sm text-system-label-primary font-medium">{data.movement}</p>
                                </div>
                            </div>
                        </div>

                        {/* Passive */}
                        {data.passive && (
                            <div className="mb-8">
                                <h3 className="text-[11px] font-semibold text-system-label-tertiary uppercase tracking-widest mb-3 px-1">Passive Ability</h3>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-accent-purple/5 border border-accent-purple/20 rounded-2xl p-5 relative overflow-hidden group cursor-help"
                                >
                                    <h4 className="text-accent-purple font-bold text-sm mb-1.5 relative z-10 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                                        {data.passive.name}
                                    </h4>
                                    <p className="text-xs text-system-label-secondary leading-relaxed relative z-10">{data.passive.description}</p>
                                </motion.div>
                            </div>
                        )}

                        {/* Active Skills */}
                        <div>
                            <h3 className="text-[11px] font-semibold text-system-label-tertiary uppercase tracking-widest mb-3 px-1">Active Skills</h3>
                            <div className="space-y-3">
                                {selectedUnit.skills.map((skillId, index) => {
                                    const skill = SKILL_REGISTRY[skillId];
                                    if (!skill) return null;

                                    return (
                                        <motion.div
                                            key={skill.id}
                                            whileHover={{ x: 4 }}
                                            className="bg-system-fill-tertiary border border-white/5 rounded-2xl p-4 hover:bg-system-fill-secondary transition-colors group cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 text-[10px] font-bold text-system-label-secondary border border-white/5 group-hover:bg-accent-blue/20 group-hover:text-accent-blue group-hover:border-accent-blue/20 transition-all">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-sm font-bold text-system-label-primary group-hover:text-accent-blue transition-colors">{skill.name}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-system-label-tertiary bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                                    {skill.cooldown}T CD
                                                </span>
                                            </div>
                                            <p className="text-xs text-system-label-secondary leading-relaxed pl-9">{skill.description}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};
