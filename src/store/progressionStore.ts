import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

interface PlayerStats {
    level: number;
    xp: number;
    xpToNextLevel: number;
    skillPoints: number;
    wins: number;
    losses: number;
}

interface UnlockedSkills {
    [unitType: string]: string[]; // unitType -> array of unlocked skill IDs
}

interface ProgressionState {
    userId: string | null;
    playerStats: PlayerStats;
    unlockedSkills: UnlockedSkills;

    initialize: () => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    addWin: () => Promise<void>;
    addLoss: () => Promise<void>;
    unlockSkill: (unitType: string, skillId: string) => Promise<void>;
    resetProgress: () => void;
}

const initialStats: PlayerStats = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    skillPoints: 3,
    wins: 0,
    losses: 0
};

const initialUnlockedSkills: UnlockedSkills = {
    Vanguard: ['slash', 'dash'],
    Coreframe: ['slash', 'dash'],
    Sentinel: ['slash', 'shove'],
    Arcanist: ['slash'],
    Phantom: ['dash'],
    Fabricator: ['shove']
};

export const useProgressionStore = create<ProgressionState>()(
    persist(
        (set, get) => ({
            userId: null,
            playerStats: initialStats,
            unlockedSkills: initialUnlockedSkills,

            initialize: async () => {
                let { userId } = get();
                if (!userId) {
                    const username = `Player_${Math.floor(Math.random() * 10000)}`;
                    try {
                        const user = await apiClient.post('/progression/login', { username });
                        userId = user._id || user.id;
                        set({ userId });
                    } catch (e) {
                        console.error("Login failed", e);
                        return;
                    }
                }

                if (userId) {
                    try {
                        const user = await apiClient.get(`/progression/${userId}`);
                        set({
                            playerStats: {
                                level: user.level,
                                xp: user.xp,
                                xpToNextLevel: user.xp_to_next_level,
                                skillPoints: user.skill_points,
                                wins: user.wins,
                                losses: user.losses
                            },
                            unlockedSkills: user.unlocked_skills
                        });
                    } catch (e) {
                        console.error("Fetch profile failed", e);
                    }
                }
            },

            addXP: async (amount: number) => {
                // Placeholder if needed, currently handled by addWin/addLoss
            },

            addWin: async () => {
                const { userId } = get();
                if (!userId) return;
                try {
                    const user = await apiClient.post(`/progression/${userId}/game-result`, { result: 'win' });
                    set({
                        playerStats: {
                            level: user.level,
                            xp: user.xp,
                            xpToNextLevel: user.xp_to_next_level,
                            skillPoints: user.skill_points,
                            wins: user.wins,
                            losses: user.losses
                        },
                        unlockedSkills: user.unlocked_skills
                    });
                } catch (e) {
                    console.error("addWin failed", e);
                }
            },

            addLoss: async () => {
                const { userId } = get();
                if (!userId) return;
                try {
                    const user = await apiClient.post(`/progression/${userId}/game-result`, { result: 'loss' });
                    set({
                        playerStats: {
                            level: user.level,
                            xp: user.xp,
                            xpToNextLevel: user.xp_to_next_level,
                            skillPoints: user.skill_points,
                            wins: user.wins,
                            losses: user.losses
                        },
                        unlockedSkills: user.unlocked_skills
                    });
                } catch (e) {
                    console.error("addLoss failed", e);
                }
            },

            unlockSkill: async (unitType: string, skillId: string) => {
                const { userId } = get();
                if (!userId) return;
                try {
                    const user = await apiClient.post(`/progression/${userId}/unlock-skill`, { unit_type: unitType, skill_id: skillId });
                    set({
                        playerStats: {
                            level: user.level,
                            xp: user.xp,
                            xpToNextLevel: user.xp_to_next_level,
                            skillPoints: user.skill_points,
                            wins: user.wins,
                            losses: user.losses
                        },
                        unlockedSkills: user.unlocked_skills
                    });
                } catch (e) {
                    console.error("unlockSkill failed", e);
                    throw e; // Re-throw to let component handle error (e.g. not enough points)
                }
            },

            resetProgress: () => {
                set({
                    userId: null,
                    playerStats: initialStats,
                    unlockedSkills: initialUnlockedSkills
                });
            }
        }),
        {
            name: 'gridlock-progression',
            partialize: (state) => ({ userId: state.userId }),
        }
    )
);
