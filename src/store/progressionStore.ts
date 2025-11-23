import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    playerStats: PlayerStats;
    unlockedSkills: UnlockedSkills;
    addXP: (amount: number) => void;
    addWin: () => void;
    addLoss: () => void;
    unlockSkill: (unitType: string, skillId: string) => void;
    spendSkillPoint: () => boolean;
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
            playerStats: initialStats,
            unlockedSkills: initialUnlockedSkills,

            addXP: (amount: number) => {
                const { playerStats } = get();
                let newXP = playerStats.xp + amount;
                let newLevel = playerStats.level;
                let newSkillPoints = playerStats.skillPoints;
                let xpToNext = playerStats.xpToNextLevel;

                // Level up logic
                while (newXP >= xpToNext) {
                    newXP -= xpToNext;
                    newLevel++;
                    newSkillPoints += 2; // Gain 2 skill points per level
                    xpToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1)); // Exponential scaling
                }

                set({
                    playerStats: {
                        ...playerStats,
                        level: newLevel,
                        xp: newXP,
                        xpToNextLevel: xpToNext,
                        skillPoints: newSkillPoints
                    }
                });
            },

            addWin: () => {
                set(state => ({
                    playerStats: {
                        ...state.playerStats,
                        wins: state.playerStats.wins + 1
                    }
                }));
                get().addXP(50); // Award XP for winning
            },

            addLoss: () => {
                set(state => ({
                    playerStats: {
                        ...state.playerStats,
                        losses: state.playerStats.losses + 1
                    }
                }));
                get().addXP(20); // Award some XP even for losing
            },

            unlockSkill: (unitType: string, skillId: string) => {
                const { unlockedSkills } = get();
                const unitSkills = unlockedSkills[unitType] || [];

                if (!unitSkills.includes(skillId)) {
                    set({
                        unlockedSkills: {
                            ...unlockedSkills,
                            [unitType]: [...unitSkills, skillId]
                        }
                    });
                }
            },

            spendSkillPoint: () => {
                const { playerStats } = get();
                if (playerStats.skillPoints > 0) {
                    set({
                        playerStats: {
                            ...playerStats,
                            skillPoints: playerStats.skillPoints - 1
                        }
                    });
                    return true;
                }
                return false;
            },

            resetProgress: () => {
                set({
                    playerStats: initialStats,
                    unlockedSkills: initialUnlockedSkills
                });
            }
        }),
        {
            name: 'gridlock-progression'
        }
    )
);
