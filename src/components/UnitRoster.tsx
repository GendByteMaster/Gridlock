import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Zap } from 'lucide-react';
import { UnitType } from '../types';
import { getUnitIcon } from '../utils/unitUtils';
import { SKILLS } from '../data/skills';

interface UnitRosterProps {
    onBack: () => void;
}

interface UnitData {
    type: UnitType;
    hp: number;
    description: string;
    signatureSkillId: string;
}

const UNIT_DATA: UnitData[] = [
    // Core Units
    { type: 'Vanguard', hp: 100, description: 'Balanced frontline fighter.', signatureSkillId: 'slash' },
    { type: 'Sentinel', hp: 120, description: 'Defensive specialist.', signatureSkillId: 'shove' },
    { type: 'Arcanist', hp: 80, description: 'Ranged magic user.', signatureSkillId: 'dash' },
    { type: 'Coreframe', hp: 150, description: 'Heavy tank unit.', signatureSkillId: 'shove' },
    { type: 'Phantom', hp: 70, description: 'Stealthy infiltrator.', signatureSkillId: 'dash' },
    { type: 'Fabricator', hp: 90, description: 'Support and utility.', signatureSkillId: 'shove' },

    // Expansion Units
    { type: 'Striker', hp: 90, description: 'Fast melee attacker.', signatureSkillId: 'double_strike' },
    { type: 'Bastion', hp: 140, description: 'Immovable fortress.', signatureSkillId: 'fortify' },
    { type: 'Weaver', hp: 85, description: 'Control specialist.', signatureSkillId: 'web' },
    { type: 'Spectre', hp: 70, description: 'Ghostly assassin.', signatureSkillId: 'backstab' },
    { type: 'Ronin', hp: 110, description: 'Master swordsman.', signatureSkillId: 'parry' },
    { type: 'Juggernaut', hp: 160, description: 'Unstoppable force.', signatureSkillId: 'charge_unstoppable' },
    { type: 'Medic', hp: 80, description: 'Combat healer.', signatureSkillId: 'heal' },
    { type: 'Sniper', hp: 75, description: 'Long-range elimination.', signatureSkillId: 'headshot' },
    { type: 'Engineer', hp: 95, description: 'Turret deployment.', signatureSkillId: 'deploy_turret' },
    { type: 'Summoner', hp: 85, description: 'Minion commander.', signatureSkillId: 'summon_minion' },
    { type: 'Assassin', hp: 80, description: 'High burst damage.', signatureSkillId: 'backstab' },
    { type: 'Templar', hp: 130, description: 'Holy warrior.', signatureSkillId: 'holy_smite' },
    { type: 'Dragoon', hp: 115, description: 'Aerial striker.', signatureSkillId: 'jump' },
    { type: 'Valkyrie', hp: 100, description: 'Inspiring leader.', signatureSkillId: 'inspire' },
    { type: 'Overlord', hp: 140, description: 'Tactical commander.', signatureSkillId: 'command' },
    { type: 'Titan', hp: 200, description: 'Massive colossus.', signatureSkillId: 'stomp' },
    { type: 'Scout', hp: 70, description: 'Reconnaissance.', signatureSkillId: 'recon' },
    { type: 'Bomber', hp: 90, description: 'Area denial.', signatureSkillId: 'grenade' },
];

const UnitRoster: React.FC<UnitRosterProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-system-gray1 via-system-gray2 to-system-gray1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-system-gray1/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg hover:bg-white/10 text-system-gray4 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-white">Unit Roster</h1>
                    </div>
                    <div className="text-sm text-system-gray4">
                        {UNIT_DATA.length} Units Discovered
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {UNIT_DATA.map((unit, index) => {
                        const skill = SKILLS[unit.signatureSkillId];

                        return (
                            <motion.div
                                key={unit.type}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-blue/50 rounded-2xl p-6 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30 group-hover:scale-110 transition-transform duration-300">
                                        {getUnitIcon(unit.type, 32)}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                                        <Heart size={14} className="text-accent-red" />
                                        <span className="text-sm font-medium text-white">{unit.hp}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{unit.type}</h3>
                                <p className="text-sm text-system-gray4 mb-4">{unit.description}</p>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={14} className="text-accent-yellow" />
                                        <span className="text-xs font-bold text-accent-yellow uppercase tracking-wider">Signature Skill</span>
                                    </div>
                                    <div className="text-sm text-white font-medium">
                                        {skill ? skill.name : 'Unknown Skill'}
                                    </div>
                                    <div className="text-xs text-system-gray4 mt-1">
                                        {skill ? skill.description : 'No description available.'}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UnitRoster;
