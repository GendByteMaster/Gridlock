import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Zap, Search, Shield, Sword, Crosshair, Activity } from 'lucide-react';
import { UnitType } from '../types';
import { getUnitIcon } from '../utils/unitUtils';
import { SKILLS } from '../data/skills';
import { clsx } from 'clsx';

interface UnitRosterProps {
    onBack: () => void;
}

type UnitRole = 'Tank' | 'Damage' | 'Support' | 'Control';

interface UnitData {
    type: UnitType;
    hp: number;
    description: string;
    signatureSkillId: string;
    role: UnitRole;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const UNIT_DATA: UnitData[] = [
    // Core Units
    { type: 'Vanguard', hp: 100, description: 'Balanced frontline fighter.', signatureSkillId: 'slash', role: 'Damage', difficulty: 'Easy' },
    { type: 'Sentinel', hp: 120, description: 'Defensive specialist.', signatureSkillId: 'shove', role: 'Tank', difficulty: 'Easy' },
    { type: 'Arcanist', hp: 80, description: 'Ranged magic user.', signatureSkillId: 'dash', role: 'Damage', difficulty: 'Medium' },
    { type: 'Coreframe', hp: 150, description: 'Heavy tank unit.', signatureSkillId: 'shove', role: 'Tank', difficulty: 'Easy' },
    { type: 'Phantom', hp: 70, description: 'Stealthy infiltrator.', signatureSkillId: 'dash', role: 'Damage', difficulty: 'Hard' },
    { type: 'Fabricator', hp: 90, description: 'Support and utility.', signatureSkillId: 'shove', role: 'Support', difficulty: 'Medium' },

    // Expansion Units
    { type: 'Striker', hp: 90, description: 'Fast melee attacker.', signatureSkillId: 'double_strike', role: 'Damage', difficulty: 'Easy' },
    { type: 'Bastion', hp: 140, description: 'Immovable fortress.', signatureSkillId: 'fortify', role: 'Tank', difficulty: 'Easy' },
    { type: 'Weaver', hp: 85, description: 'Control specialist.', signatureSkillId: 'web', role: 'Control', difficulty: 'Hard' },
    { type: 'Spectre', hp: 70, description: 'Ghostly assassin.', signatureSkillId: 'backstab', role: 'Damage', difficulty: 'Hard' },
    { type: 'Ronin', hp: 110, description: 'Master swordsman.', signatureSkillId: 'parry', role: 'Damage', difficulty: 'Medium' },
    { type: 'Juggernaut', hp: 160, description: 'Unstoppable force.', signatureSkillId: 'charge_unstoppable', role: 'Tank', difficulty: 'Medium' },
    { type: 'Medic', hp: 80, description: 'Combat healer.', signatureSkillId: 'heal', role: 'Support', difficulty: 'Easy' },
    { type: 'Sniper', hp: 75, description: 'Long-range elimination.', signatureSkillId: 'headshot', role: 'Damage', difficulty: 'Medium' },
    { type: 'Engineer', hp: 95, description: 'Turret deployment.', signatureSkillId: 'deploy_turret', role: 'Control', difficulty: 'Medium' },
    { type: 'Summoner', hp: 85, description: 'Minion commander.', signatureSkillId: 'summon_minion', role: 'Support', difficulty: 'Hard' },
    { type: 'Assassin', hp: 80, description: 'High burst damage.', signatureSkillId: 'backstab', role: 'Damage', difficulty: 'Medium' },
    { type: 'Templar', hp: 130, description: 'Holy warrior.', signatureSkillId: 'holy_smite', role: 'Tank', difficulty: 'Medium' },
    { type: 'Dragoon', hp: 115, description: 'Aerial striker.', signatureSkillId: 'jump', role: 'Damage', difficulty: 'Medium' },
    { type: 'Valkyrie', hp: 100, description: 'Inspiring leader.', signatureSkillId: 'inspire', role: 'Support', difficulty: 'Medium' },
    { type: 'Overlord', hp: 140, description: 'Tactical commander.', signatureSkillId: 'command', role: 'Support', difficulty: 'Hard' },
    { type: 'Titan', hp: 200, description: 'Massive colossus.', signatureSkillId: 'stomp', role: 'Tank', difficulty: 'Hard' },
    { type: 'Scout', hp: 70, description: 'Reconnaissance.', signatureSkillId: 'recon', role: 'Support', difficulty: 'Easy' },
    { type: 'Bomber', hp: 90, description: 'Area denial.', signatureSkillId: 'grenade', role: 'Damage', difficulty: 'Medium' },
];

const UnitRoster: React.FC<UnitRosterProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<UnitRole | 'All'>('All');

    const filteredUnits = useMemo(() => {
        return UNIT_DATA.filter(unit => {
            const matchesSearch = unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = selectedRole === 'All' || unit.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [searchQuery, selectedRole]);

    const getRoleIcon = (role: UnitRole) => {
        switch (role) {
            case 'Tank': return <Shield size={14} />;
            case 'Damage': return <Sword size={14} />;
            case 'Support': return <Activity size={14} />;
            case 'Control': return <Crosshair size={14} />;
        }
    };

    const getRoleColor = (role: UnitRole) => {
        switch (role) {
            case 'Tank': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Damage': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'Support': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Control': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        }
    };

    return (
        <div className="min-h-screen w-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-system-gray1/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 rounded-lg hover:bg-white/10 text-system-gray4 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white">Unit Roster</h1>
                                <p className="text-xs text-system-gray4">{filteredUnits.length} Units Found</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-system-gray4" />
                                <input
                                    type="text"
                                    placeholder="Search units..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-system-gray4 focus:outline-none focus:border-accent-blue transition-colors"
                                />
                            </div>

                            {/* Role Filter */}
                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                                {(['All', 'Tank', 'Damage', 'Support', 'Control'] as const).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                            selectedRole === role
                                                ? "bg-white/10 text-white shadow-sm"
                                                : "text-system-gray4 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredUnits.map((unit) => {
                            const skill = SKILLS[unit.signatureSkillId];

                            return (
                                <motion.div
                                    layout
                                    key={unit.type}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-blue/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                            {getUnitIcon(unit.type, 32)}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", getRoleColor(unit.role))}>
                                                {getRoleIcon(unit.role)}
                                                <span>{unit.role}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                                                <Heart size={12} className="text-accent-red" />
                                                <span className="text-xs font-medium text-white">{unit.hp}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-lg font-bold text-white">{unit.type}</h3>
                                            <span className={clsx(
                                                "text-[10px] uppercase tracking-wider font-bold",
                                                unit.difficulty === 'Easy' ? "text-accent-green" :
                                                    unit.difficulty === 'Medium' ? "text-accent-yellow" : "text-accent-red"
                                            )}>
                                                {unit.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-system-gray4 leading-relaxed">{unit.description}</p>
                                    </div>

                                    {/* Skill */}
                                    <div className="pt-4 border-t border-white/10 bg-white/5 -mx-6 -mb-6 p-4 rounded-b-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap size={14} className="text-accent-yellow" />
                                            <span className="text-xs font-bold text-accent-yellow uppercase tracking-wider">Signature Skill</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm text-white font-medium">
                                                {skill ? skill.name : 'Unknown Skill'}
                                            </div>
                                            {skill && (
                                                <div className="text-[10px] text-system-gray4 bg-white/10 px-1.5 py-0.5 rounded">
                                                    CD: {skill.cooldown}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-system-gray4">
                                            {skill ? skill.description : 'No description available.'}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredUnits.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-system-gray4" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No units found</h3>
                        <p className="text-system-gray4">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnitRoster;
