import { create } from 'zustand';
import { SkillNode, SkillSequence } from '../types';
import { SKILLS } from '../data/skills';

interface SkillState {
    availableSkills: Record<string, SkillNode>;
    unlockedSkills: string[]; // List of skill IDs

    // Actions
    unlockSkill: (skillId: string) => void;
    getSkill: (skillId: string) => SkillNode | undefined;
}

export const useSkillStore = create<SkillState>((set, get) => ({
    availableSkills: SKILLS,
    unlockedSkills: ['slash', 'dash', 'shove'], // Start with basic skills unlocked

    unlockSkill: (skillId: string) => {
        set((state) => ({
            unlockedSkills: [...state.unlockedSkills, skillId]
        }));
    },

    getSkill: (skillId: string) => {
        return get().availableSkills[skillId];
    }
}));
