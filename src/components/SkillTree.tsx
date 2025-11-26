import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressionStore } from '../store/progressionStore';
import { SKILLS, SKILL_POSITIONS } from '../data/skills';
import { Zap, ArrowLeft, Lock, Check, Swords, Move, Activity, Anchor, Heart, Flame, Snowflake, Ghost, Skull, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { soundManager } from '../utils/SoundManager';

interface SkillTreeProps {
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

const SkillTree: React.FC<SkillTreeProps> = ({ onBack }) => {
    const { unlockedSkills, playerStats, unlockSkill, spendSkillPoint } = useProgressionStore();
    const [selectedUnit, setSelectedUnit] = useState<string>('Vanguard');
    const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showScrollBottom, setShowScrollBottom] = useState(true);
    const selectedUnitRef = useRef<HTMLButtonElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check scroll position to show/hide indicators
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            setShowScrollTop(scrollTop > 10);
            setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 10);
        }
    };

    // Auto-scroll selected unit into view
    useEffect(() => {
        if (selectedUnitRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = selectedUnitRef.current;

            // Calculate positions
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Calculate the offset from the top of the container
            const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
            const relativeBottom = relativeTop + elementRect.height;

            // Scroll if element is not fully visible
            const containerHeight = container.clientHeight;
            const scrollTop = container.scrollTop;

            if (relativeTop < scrollTop) {
                // Element is above viewport, scroll up
                container.scrollTo({ top: relativeTop - 20, behavior: 'smooth' });
            } else if (relativeBottom > scrollTop + containerHeight - 60) {
                // Element is below viewport (accounting for gradient mask), scroll down
                container.scrollTo({ top: relativeBottom - containerHeight + 80, behavior: 'smooth' });
            }
        }
    }, [selectedUnit]);

    // Check scroll on mount
    useEffect(() => {
        handleScroll();
    }, []);

    const unitSkills = unlockedSkills[selectedUnit] || [];

    const isSkillUnlocked = (skillId: string) => unitSkills.includes(skillId);

    const canUnlockSkill = (skillId: string) => {
        const skill = SKILLS[skillId];
        if (!skill || isSkillUnlocked(skillId)) return false;
        return skill.prerequisites.every(prereqId => isSkillUnlocked(prereqId));
    };

    const handleUnlockSkill = (skillId: string) => {
        if (canUnlockSkill(skillId) && spendSkillPoint()) {
            unlockSkill(selectedUnit, skillId);
            soundManager.playSkillExecute();
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

    const getIcon = (skill: any) => {
        const name = skill.name.toLowerCase();
        if (name.includes('turret')) return <Anchor size={24} />;
        if (name.includes('repair') || name.includes('heal')) return <Heart size={24} />;
        if (name.includes('fire')) return <Flame size={24} />;
        if (name.includes('frost') || name.includes('ice')) return <Snowflake size={24} />;
        if (name.includes('ghost') || name.includes('shadow')) return <Ghost size={24} />;
        if (name.includes('death') || name.includes('soul')) return <Skull size={24} />;

        switch (skill.category) {
            case 'Mobility': return <Move size={24} />;
            case 'Control': return <Activity size={24} />;
            case 'Support': return <Heart size={24} />;
            case 'Ultimate': return <Star size={24} />;
            default: return <Swords size={24} />;
        }
    };

    const visibleSkills = Object.keys(SKILL_POSITIONS).map(id => SKILLS[id]).filter(Boolean);

    return (
        <div className="h-screen w-full flex flex-col bg-system-background relative overflow-hidden">
            {/* Background Ambient Glow - Enhanced */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-blue/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-accent-red/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }} />

            {/* Top Bar */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 bg-system-material-regular backdrop-blur-xl border border-white/10 rounded-full text-white shadow-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Hub</span>
                </motion.button>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight drop-shadow-lg">Skill Tree</h1>
                    <p className="text-xs text-accent-blue uppercase tracking-[0.2em] font-bold mt-1">{selectedUnit}</p>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 px-5 py-2.5 bg-system-material-regular backdrop-blur-xl border border-white/10 rounded-full shadow-lg"
                >
                    <div className="w-8 h-8 rounded-full bg-accent-yellow/20 flex items-center justify-center border border-accent-yellow/30 shadow-[0_0_10px_rgba(255,214,10,0.3)]">
                        <Zap size={16} className="text-accent-yellow fill-accent-yellow" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-bold text-white">{playerStats.skillPoints}</span>
                        <span className="text-[10px] text-system-gray2 font-medium uppercase">Points</span>
                    </div>
                </motion.div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Unit Selector Sidebar */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-80 h-full p-6 flex flex-col gap-4 z-40"
                >
                    <div className="flex-1 bg-system-material-thin backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl p-4 overflow-hidden relative flex flex-col">
                        <h3 className="text-xs font-bold text-system-gray4 uppercase tracking-wider mb-4 px-2">Units</h3>

                        {/* Top Scroll Indicator */}
                        <AnimatePresence>
                            {showScrollTop && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-14 left-0 right-0 h-8 bg-gradient-to-b from-system-material-thin via-system-material-thin/50 to-transparent pointer-events-none z-10 flex items-start justify-center"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 animate-bounce">
                                        <ArrowLeft size={12} className="text-white/60 rotate-90" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Scrollable List with no-scrollbar */}
                        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-4">
                            {unitTypes.map((unit) => (
                                <motion.button
                                    key={unit}
                                    ref={selectedUnit === unit ? selectedUnitRef : null}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedUnit(unit)}
                                    className={clsx(
                                        "w-full p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group",
                                        selectedUnit === unit
                                            ? "bg-accent-blue/20 border-accent-blue/50 shadow-[0_0_20px_rgba(10,132,255,0.2)]"
                                            : "bg-white/5 text-system-gray2 border-white/5 hover:bg-white/10 hover:border-white/10"
                                    )}
                                >
                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className={clsx("font-bold transition-colors", selectedUnit === unit ? "text-white" : "text-system-gray2 group-hover:text-white")}>{unit}</span>
                                        {selectedUnit === unit && <Check size={16} className="text-accent-blue drop-shadow-[0_0_5px_rgba(10,132,255,0.8)]" />}
                                    </div>
                                    <div className="relative z-10 text-xs mt-1 opacity-80 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-current rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, ((unlockedSkills[unit] || []).length / visibleSkills.length) * 100)}%` }}
                                            />
                                        </div>
                                        <span>{(unlockedSkills[unit] || []).length}/{visibleSkills.length}</span>
                                    </div>

                                    {/* Selection Glow */}
                                    {selectedUnit === unit && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-transparent opacity-50" />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Bottom Gradient Mask with Scroll Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-system-material-thick via-system-material-thin/80 to-transparent pointer-events-none rounded-b-[32px]">
                            <AnimatePresence>
                                {showScrollBottom && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center animate-bounce"
                                    >
                                        <ArrowLeft size={12} className="text-white/60 -rotate-90" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Skill Tree Canvas */}
                <div className="flex-1 relative overflow-auto cursor-grab active:cursor-grabbing no-scrollbar">
                    <div className="min-w-[1000px] min-h-[800px] p-20 relative">
                        {/* Connection Lines (SVG Layer) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {visibleSkills.map(skill => {
                                return skill.prerequisites.map(prereqId => {
                                    const start = SKILL_POSITIONS[prereqId];
                                    const end = SKILL_POSITIONS[skill.id];
                                    if (!start || !end) return null;

                                    const isUnlocked = isSkillUnlocked(skill.id);
                                    const isPrereqUnlocked = isSkillUnlocked(prereqId);
                                    const isActive = isUnlocked && isPrereqUnlocked;

                                    const midY = (start.y + end.y) / 2;
                                    const path = `M ${start.x + 40} ${start.y + 80} C ${start.x + 40} ${midY}, ${end.x + 40} ${midY}, ${end.x + 40} ${end.y}`;

                                    return (
                                        <g key={`${prereqId}-${skill.id}`}>
                                            <path
                                                d={path}
                                                fill="none"
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="6"
                                                strokeLinecap="round"
                                            />
                                            {isPrereqUnlocked && (
                                                <motion.path
                                                    d={path}
                                                    fill="none"
                                                    stroke={isActive ? "url(#activeGradient)" : "rgba(255,255,255,0.2)"}
                                                    strokeWidth={isActive ? 3 : 2}
                                                    strokeLinecap="round"
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{ pathLength: 1, opacity: 1 }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    style={{ filter: isActive ? "drop-shadow(0 0 5px rgba(191, 90, 242, 0.5))" : "none" }}
                                                />
                                            )}
                                        </g>
                                    );
                                });
                            })}
                            <defs>
                                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#0A84FF" />
                                    <stop offset="50%" stopColor="#BF5AF2" />
                                    <stop offset="100%" stopColor="#FF375F" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Skill Nodes */}
                        {visibleSkills.map(skill => {
                            const pos = SKILL_POSITIONS[skill.id];
                            if (!pos) return null;

                            const unlocked = isSkillUnlocked(skill.id);
                            const canUnlock = canUnlockSkill(skill.id);
                            const colorClass = getCategoryColor(skill.category);

                            return (
                                <div
                                    key={skill.id}
                                    className="absolute"
                                    style={{ left: pos.x, top: pos.y }}
                                >
                                    <div className="relative group">
                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleUnlockSkill(skill.id)}
                                            onMouseEnter={() => {
                                                setHoveredSkillId(skill.id);
                                                soundManager.playHover();
                                            }}
                                            onMouseLeave={() => setHoveredSkillId(null)}
                                            className={clsx(
                                                "relative w-20 h-20 rounded-[24px] flex items-center justify-center transition-all duration-500",
                                                unlocked
                                                    ? "bg-system-material-thick backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/10"
                                                    : canUnlock
                                                        ? "bg-system-material-regular backdrop-blur-lg border border-accent-yellow/50 shadow-[0_0_20px_rgba(255,214,10,0.3)] animate-pulse-slow"
                                                        : "bg-system-material-thin backdrop-blur-sm border border-white/5 opacity-40 grayscale"
                                            )}
                                        >
                                            {unlocked && (
                                                <div className={clsx(
                                                    "absolute inset-0 rounded-[24px] opacity-30",
                                                    skill.category === 'Offense' && "bg-accent-red blur-xl",
                                                    skill.category === 'Mobility' && "bg-accent-blue blur-xl",
                                                    skill.category === 'Control' && "bg-accent-purple blur-xl",
                                                    skill.category === 'Support' && "bg-accent-green blur-xl"
                                                )} />
                                            )}

                                            <div className={clsx(
                                                "relative z-10 transition-colors duration-300",
                                                unlocked ? colorClass : canUnlock ? "text-accent-yellow" : "text-system-gray4"
                                            )}>
                                                {getIcon(skill)}
                                            </div>

                                            <div className="absolute -top-2 -right-2 z-20">
                                                {unlocked ? (
                                                    <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center shadow-lg border border-white/20 ring-2 ring-black/50">
                                                        <Check size={12} className="text-white stroke-[3]" />
                                                    </div>
                                                ) : canUnlock ? (
                                                    <div className="w-6 h-6 rounded-full bg-accent-yellow flex items-center justify-center shadow-lg border border-white/20 ring-2 ring-black/50">
                                                        <Lock size={12} className="text-black" />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {hoveredSkillId === skill.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: -16, scale: 1 }}
                                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-72 p-6 bg-system-material-thick backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl z-50 pointer-events-none"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={clsx("font-bold text-xl", colorClass)}>{skill.name}</span>
                                                        <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold px-2.5 py-1 bg-white/10 rounded-full border border-white/5">{skill.category}</span>
                                                    </div>

                                                    <p className="text-sm text-system-gray4 leading-relaxed mb-5 font-medium">{skill.description}</p>

                                                    <div className="grid grid-cols-2 gap-3 text-[11px] font-medium">
                                                        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center gap-1 border border-white/5">
                                                            <span className="text-system-gray4 uppercase text-[9px] tracking-wider">Cooldown</span>
                                                            <span className="text-white font-bold text-sm">{skill.cooldown} Turns</span>
                                                        </div>
                                                        {skill.damage && (
                                                            <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center gap-1 border border-white/5">
                                                                <span className="text-system-gray4 uppercase text-[9px] tracking-wider">Damage</span>
                                                                <span className="text-white font-bold text-sm">{skill.damage}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {!unlocked && (
                                                        <div className={clsx(
                                                            "mt-5 py-3 rounded-xl text-center text-xs font-bold border transition-colors",
                                                            canUnlock
                                                                ? "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20 shadow-[0_0_15px_rgba(255,214,10,0.1)]"
                                                                : "bg-white/5 text-system-gray4 border-white/5"
                                                        )}>
                                                            {canUnlock ? "Click to Unlock (1 SP)" : "Prerequisites Locked"}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-center w-32 pointer-events-none">
                                        <p className={clsx(
                                            "text-xs font-bold transition-colors duration-300 tracking-wide",
                                            unlocked ? "text-white drop-shadow-md" : "text-system-gray4"
                                        )}>
                                            {skill.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillTree;
