import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { UNIT_DATA } from '../data/unitData';
import { getUnitIcon } from '../utils/unitUtils';
import { SKILL_REGISTRY } from '../combat/skills/SkillRegistry';

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
                style={{ willChange: 'transform' }}
                className="fixed right-6 top-24 bottom-8 w-80 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl z-40 overflow-y-auto custom-scrollbar ring-1 ring-white/5"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent -mx-6 -mt-6 h-32 z-0" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-xl ring-1 ring-white/5 relative z-10"
                    >
                        {getUnitIcon(selectedUnit.type, 48)}
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-tight relative z-10">{data.name}</h2>
                    <span className="text-xs font-bold tracking-wider text-blue-300 uppercase px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/20 backdrop-blur-md relative z-10">
                        {data.role}
                    </span>
                </div>

                {/* Description */}
                <div className="mb-8 relative">
                    <div className="absolute -left-2 -top-2 text-4xl text-white/10 font-serif">"</div>
                    <p className="text-sm text-white/70 text-center italic leading-relaxed px-4">
                        {data.description}
                    </p>
                    <div className="absolute -right-2 -bottom-4 text-4xl text-white/10 font-serif">"</div>
                </div>

                {/* Stats */}
                <div className="space-y-6 mb-8">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-white/60 mb-2 uppercase tracking-wide px-1">
                            <span>Health Status</span>
                            <span className={hp < maxHp * 0.3 ? 'text-red-400' : 'text-white'}>
                                {hp} / {maxHp}
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden ring-1 ring-white/5 p-[1px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(hp / maxHp) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`h-full rounded-full transition-colors duration-300 ${hp < maxHp * 0.3 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-400 to-emerald-500'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Movement</h3>
                                <p className="text-sm text-white/90 font-medium">{data.movement}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Passive */}
                {data.passive && (
                    <div className="mb-8">
                        <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 px-1">Passive Ability</h3>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden group cursor-help"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />
                            <h4 className="text-purple-300 font-bold text-sm mb-1.5 relative z-10 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                {data.passive.name}
                            </h4>
                            <p className="text-xs text-purple-200/80 leading-relaxed relative z-10">{data.passive.description}</p>
                        </motion.div>
                    </div>
                )}

                {/* Active Skills */}
                <div>
                    <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 px-1">Active Skills</h3>
                    <div className="space-y-3">
                        {selectedUnit.skills.map((skillId, index) => {
                            const skill = SKILL_REGISTRY[skillId];
                            if (!skill) return null;

                            return (
                                <motion.div
                                    key={skill.id}
                                    whileHover={{ x: 4 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 text-[10px] font-bold text-white/60 border border-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-300 group-hover:border-blue-500/20 transition-all">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{skill.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                            {skill.cooldown}T CD
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed pl-9">{skill.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
