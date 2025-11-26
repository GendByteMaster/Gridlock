import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sword, Zap, Target, Move, Grid3X3 } from 'lucide-react';
import { clsx } from 'clsx';
import { GuardianIcon, StrikerIcon, ScoutIcon } from './icons/UnitIcons';

interface HowToPlayProps {
    onBack: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'basics' | 'combat' | 'skills'>('basics');

    return (
        <div className="h-screen w-full bg-[#050510] text-white overflow-hidden flex flex-col font-sans selection:bg-accent-blue/30">
            {/* Header */}
            <div className="px-8 py-6 flex items-center gap-6 border-b border-white/5 bg-[#0a0a15]/80 backdrop-blur-xl z-10">
                <button
                    onClick={onBack}
                    className="p-3 hover:bg-white/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-white/10"
                >
                    <ArrowLeft size={20} className="text-gray-400 group-hover:text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">How to Play</h1>
                    <p className="text-sm text-gray-500">Master the grid and dominate the battlefield</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-72 border-r border-white/5 bg-[#0a0a15]/50 p-6 space-y-3">
                    <TabButton
                        active={activeTab === 'basics'}
                        onClick={() => setActiveTab('basics')}
                        icon={<Grid3X3 size={20} />}
                        label="The Basics"
                        desc="Movement & Objectives"
                    />
                    <TabButton
                        active={activeTab === 'combat'}
                        onClick={() => setActiveTab('combat')}
                        icon={<Sword size={20} />}
                        label="Combat & Roles"
                        desc="Attacking & Classes"
                    />
                    <TabButton
                        active={activeTab === 'skills'}
                        onClick={() => setActiveTab('skills')}
                        icon={<Zap size={20} />}
                        label="Skills & Nodes"
                        desc="Abilities & Overdrive"
                    />
                </div>

                {/* Main View */}
                <div className="flex-1 overflow-y-auto p-12 relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050510] to-[#050510]">
                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'basics' && <BasicsSection key="basics" />}
                            {activeTab === 'combat' && <CombatSection key="combat" />}
                            {activeTab === 'skills' && <SkillsSection key="skills" />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label, desc }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, desc: string }) => (
    <button
        onClick={onClick}
        className={clsx(
            "w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-300 border",
            active
                ? "bg-accent-blue/10 text-white border-accent-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white hover:border-white/5"
        )}
    >
        <div className={clsx(
            "p-2 rounded-lg transition-colors",
            active ? "bg-accent-blue text-white" : "bg-white/5 text-gray-400 group-hover:text-white"
        )}>
            {icon}
        </div>
        <div>
            <div className="font-bold text-sm">{label}</div>
            <div className={clsx("text-xs mt-0.5", active ? "text-accent-blue/80" : "text-gray-500")}>{desc}</div>
        </div>
    </button>
);

// --- Sections ---

const DemoBoard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#0f111a] rounded-2xl border border-white/10 p-8 h-80 flex items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
            {[...Array(36)].map((_, i) => (
                <div key={i} className="border border-white/10 bg-white/[0.02]" />
            ))}
        </div>
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
        {children}
    </div>
);

const BasicsSection = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-16"
    >
        <section>
            <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">
                The Basics
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                Gridlock is a tactical grid RPG where positioning is everything.
                Command your squad of specialized units to outmaneuver and eliminate the enemy team.
            </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-accent-blue mb-2">
                    <Move size={24} />
                    <h3 className="text-2xl font-bold text-white">Movement & Action</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                    Each unit has a unique movement pattern. Select a unit to see its valid moves highlighted in <span className="text-accent-blue font-bold">blue</span>.
                </p>
                <ul className="space-y-4 text-gray-400">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2.5" />
                        <span>Moving consumes your unit's action for the turn.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2.5" />
                        <span>You can move <strong>one unit</strong> per turn.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2.5" />
                        <span>Plan ahead—once you move, you're committed!</span>
                    </li>
                </ul>
            </div>

            {/* Animation Demo: Movement */}
            <div className="relative">
                <DemoBoard>
                    <div className="relative w-64 h-64">
                        {/* Grid Cells (Visual only) */}
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="border border-white/5 rounded-md bg-white/[0.02]" />
                            ))}
                        </div>

                        {/* Path Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                            <motion.path
                                d="M 32 32 L 32 96 L 96 96 L 96 32 Z"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="0 1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 1, 0],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.4, 0.8, 1]
                                }}
                            />
                        </svg>

                        {/* Valid Move Highlights */}
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 pointer-events-none">
                            <motion.div
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                                className="col-start-1 row-start-2 bg-accent-blue/10 rounded-md border border-accent-blue/30"
                            />
                            <motion.div
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                                className="col-start-2 row-start-2 bg-accent-blue/10 rounded-md border border-accent-blue/30"
                            />
                            <motion.div
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                                className="col-start-2 row-start-1 bg-accent-blue/10 rounded-md border border-accent-blue/30"
                            />
                        </div>

                        {/* Ghost / History Trails */}
                        <motion.div
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.2, 0.3, 0.5] }}
                            className="w-14 h-14 absolute top-1 left-1 z-10 opacity-30 grayscale"
                        >
                            <div className="w-full h-full bg-[#0f111a]/50 rounded-lg border border-white/20 flex items-center justify-center">
                                <ScoutIcon size={28} className="text-white/30" />
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.45, 0.55, 0.75] }}
                            className="w-14 h-14 absolute top-[65px] left-1 z-10 opacity-30 grayscale"
                        >
                            <div className="w-full h-full bg-[#0f111a]/50 rounded-lg border border-white/20 flex items-center justify-center">
                                <ScoutIcon size={28} className="text-white/30" />
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.7, 0.8, 1] }}
                            className="w-14 h-14 absolute top-[65px] left-[65px] z-10 opacity-30 grayscale"
                        >
                            <div className="w-full h-full bg-[#0f111a]/50 rounded-lg border border-white/20 flex items-center justify-center">
                                <ScoutIcon size={28} className="text-white/30" />
                            </div>
                        </motion.div>

                        {/* Unit */}
                        <motion.div
                            animate={{
                                x: [0, 0, 64, 64, 0],
                                y: [0, 64, 64, 0, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.25, 0.5, 0.75, 1]
                            }}
                            className="w-14 h-14 absolute top-1 left-1 z-20"
                        >
                            <div className="w-full h-full bg-[#0f111a] rounded-lg border border-accent-blue text-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center">
                                <ScoutIcon size={28} />
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-4 right-6 text-xs text-accent-blue font-mono tracking-widest uppercase opacity-60">Simulation: Movement</div>
                </DemoBoard>

                {/* Move History Log */}
                <div className="absolute -right-24 top-8 w-48 bg-[#0a0a15]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl hidden xl:block">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-white/5 pb-2">Move History</div>
                    <div className="space-y-2 font-mono text-xs">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
                            className="flex items-center gap-2 text-gray-400"
                        >
                            <span className="text-accent-blue">01</span>
                            <span>Start at A1</span>
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.2, 0.3, 0.4] }}
                            className="flex items-center gap-2 text-gray-400"
                        >
                            <span className="text-accent-blue">02</span>
                            <span>Move to A2</span>
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.45, 0.55, 0.65] }}
                            className="flex items-center gap-2 text-gray-400"
                        >
                            <span className="text-accent-blue">03</span>
                            <span>Move to B2</span>
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0.7, 0.8, 0.9] }}
                            className="flex items-center gap-2 text-gray-400"
                        >
                            <span className="text-accent-blue">04</span>
                            <span>Return A1</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    </motion.div>
);

const CombatSection = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-16"
    >
        <section>
            <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">
                Combat & Roles
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                Victory requires a balanced team. Understand your units' roles to exploit enemy weaknesses and protect your own.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard
                title="Tank"
                icon={<Shield className="text-blue-400" />}
                desc="High durability. Use them to block choke points and absorb damage."
                color="blue"
            />
            <RoleCard
                title="Striker"
                icon={<Sword className="text-red-400" />}
                desc="High damage output. Vulnerable but deadly. Keep them protected."
                color="red"
            />
            <RoleCard
                title="Support"
                icon={<Zap className="text-yellow-400" />}
                desc="Utility specialists. They buff allies or disrupt enemies."
                color="yellow"
            />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <DemoBoard>
                <div className="relative flex items-center gap-12">
                    {/* Attacker */}
                    <motion.div
                        animate={{
                            x: [0, 40, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "backIn" }}
                        className="w-16 h-16 bg-[#0f111a] rounded-xl border-2 border-accent-blue text-accent-blue shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center z-20 relative"
                    >
                        <StrikerIcon size={32} />
                        <div className="absolute -bottom-6 text-xs font-bold text-accent-blue tracking-wider">YOU</div>
                    </motion.div>

                    {/* Impact Effect (Slash) */}
                    <motion.svg
                        viewBox="0 0 100 100"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-30 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, times: [0.3, 0.4, 0.6] }}
                    >
                        <motion.path
                            d="M 20 20 L 80 80"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1] }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.3, delay: 0.4 }} // Sync with impact
                        />
                    </motion.svg>

                    {/* Target */}
                    <motion.div
                        animate={{
                            x: [0, 5, -5, 5, -5, 0], // Shake
                            filter: ["brightness(1)", "brightness(2) hue-rotate(90deg)", "brightness(1)"]
                        }}
                        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.1, delay: 0.5 }} // Sync with impact
                        className="w-16 h-16 bg-[#0f111a] rounded-xl border-2 border-accent-red text-accent-red shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center z-10 relative"
                    >
                        <GuardianIcon size={32} />
                        <div className="absolute -bottom-6 text-xs font-bold text-accent-red tracking-wider">ENEMY</div>

                        {/* Damage Number */}
                        <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 1, 0], y: -50, scale: [0.5, 1.5, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.3, delay: 0.5 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-black text-3xl drop-shadow-[0_2px_4px_rgba(220,38,38,0.8)] z-40"
                        >
                            -25
                        </motion.div>
                    </motion.div>
                </div>
                <div className="absolute bottom-4 right-6 text-xs text-accent-red font-mono tracking-widest uppercase opacity-60">Simulation: Attack</div>
            </DemoBoard>

            <div className="space-y-6">
                <div className="flex items-center gap-3 text-accent-red mb-2">
                    <Target size={24} />
                    <h3 className="text-2xl font-bold text-white">Engaging the Enemy</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                    Move adjacent to an enemy to attack. Attacking ends that unit's turn immediately.
                </p>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-red" />
                        Combat Modifiers
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex justify-between">
                            <span>Flanking (Back Attack)</span>
                            <span className="text-accent-green font-mono">+50% DMG</span>
                        </li>
                        <li className="flex justify-between">
                            <span>High Ground</span>
                            <span className="text-accent-green font-mono">+1 Range</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Elemental Advantage</span>
                            <span className="text-accent-green font-mono">+25% DMG</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </motion.div>
);

const RoleCard = ({ title, icon, desc, color }: { title: string, icon: React.ReactNode, desc: string, color: string }) => (
    <div className="group bg-[#0f111a] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
        <div className={clsx(
            "mb-4 p-3 rounded-xl w-fit transition-colors",
            color === 'blue' && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
            color === 'red' && "bg-red-500/10 text-red-400 group-hover:bg-red-500/20",
            color === 'yellow' && "bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20"
        )}>
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const SkillsSection = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-16"
    >
        <section>
            <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">
                Skills & Nodes
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">Node System</span>.
                Chain abilities in the correct sequence to unleash devastating Overdrive effects.
            </p>
        </section>

        <DemoBoard>
            <div className="flex items-center gap-4 md:gap-8">
                {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                borderColor: ["#334155", "#3b82f6", "#334155"],
                                boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 20px rgba(59,130,246,0.3)", "0 0 0 rgba(0,0,0,0)"]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: (step - 1) * 0.6,
                                times: [0, 0.2, 1]
                            }}
                            className="relative w-20 h-20 rounded-2xl border-2 border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center gap-1 z-10"
                        >
                            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">Node {step}</div>
                            <Zap size={24} className={clsx(
                                "transition-colors duration-500",
                                step === 3 ? "text-purple-400" : "text-blue-400"
                            )} />
                            {step === 3 && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                                    className="absolute inset-0 rounded-2xl border-2 border-purple-500"
                                />
                            )}
                        </motion.div>
                        {step < 3 && (
                            <motion.div
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, delay: (step - 1) * 0.6 }}
                                className="w-8 h-0.5 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="absolute bottom-4 right-6 text-xs text-purple-400 font-mono tracking-widest uppercase opacity-60">Simulation: Chain Reaction</div>
        </DemoBoard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0f111a] p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4">The Sequence</h3>
                <p className="text-gray-400 mb-6">
                    Skills must be used in order (1 → 2 → 3). You cannot skip nodes.
                    Plan your turns to ensure you can execute the full chain when it matters most.
                </p>
                <div className="flex gap-3">
                    <div className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">1. OPENER</div>
                    <div className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">2. UTILITY</div>
                    <div className="px-3 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">3. FINISHER</div>
                </div>
            </div>
            <div className="bg-[#0f111a] p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4">Overdrive</h3>
                <p className="text-gray-400 mb-6">
                    Completing a chain triggers <span className="text-purple-400 font-bold">Overdrive</span>.
                    This grants powerful bonuses like reset cooldowns, double damage, or team-wide buffs.
                </p>
            </div>
        </div>
    </motion.div>
);

export default HowToPlay;
