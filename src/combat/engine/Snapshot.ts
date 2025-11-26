import { Unit, CombatLogEvent, CombatSnapshot } from '../types';

/**
 * Enhanced Snapshot Manager
 * 
 * Manages combat history with:
 * - Snapshot creation and restoration
 * - Undo/redo functionality
 * - Combat replay capability
 * - Debug logging and analysis
 * - History filtering and search
 */
export class SnapshotManager {
    private snapshots: CombatSnapshot[] = [];
    private maxSnapshots: number = 100;
    private currentIndex: number = -1;
    private combatStartTime: number = 0;
    private debugMode: boolean = false;

    constructor(maxSnapshots: number = 100, debugMode: boolean = false) {
        this.maxSnapshots = maxSnapshots;
        this.debugMode = debugMode;
        this.combatStartTime = Date.now();
    }

    /**
     * Create a new snapshot
     */
    public createSnapshot(
        units: Unit[],
        grid: any[][],
        logs: CombatLogEvent[],
        activeUnitId: string | null,
        turn: number
    ): CombatSnapshot {
        const snapshot: CombatSnapshot = {
            timestamp: Date.now(),
            turn,
            units: JSON.parse(JSON.stringify(units)), // Deep clone
            grid: JSON.parse(JSON.stringify(grid)),
            logs: [...logs],
            activeUnitId
        };

        // Remove future snapshots if we're not at the end
        if (this.currentIndex < this.snapshots.length - 1) {
            this.snapshots = this.snapshots.slice(0, this.currentIndex + 1);
        }

        // Add new snapshot
        this.snapshots.push(snapshot);
        this.currentIndex = this.snapshots.length - 1;

        // Enforce max limit
        if (this.snapshots.length > this.maxSnapshots) {
            this.snapshots.shift();
            this.currentIndex--;
        }

        if (this.debugMode) {
            this.logDebug(`Snapshot created: Turn ${turn}, Units: ${units.length}, Logs: ${logs.length}`);
        }

        return snapshot;
    }

    /**
     * Get current snapshot
     */
    public getCurrentSnapshot(): CombatSnapshot | null {
        return this.snapshots[this.currentIndex] || null;
    }

    /**
     * Restore a specific snapshot
     */
    public restoreSnapshot(index: number): CombatSnapshot | null {
        if (index < 0 || index >= this.snapshots.length) return null;

        this.currentIndex = index;
        const snapshot = this.snapshots[index];

        if (this.debugMode) {
            this.logDebug(`Snapshot restored: Turn ${snapshot.turn}, Index ${index}`);
        }

        return snapshot;
    }

    /**
     * Undo to previous snapshot
     */
    public undo(): CombatSnapshot | null {
        if (this.currentIndex <= 0) return null;

        this.currentIndex--;
        const snapshot = this.snapshots[this.currentIndex];

        if (this.debugMode) {
            this.logDebug(`Undo: Turn ${snapshot.turn}`);
        }

        return snapshot;
    }

    /**
     * Redo to next snapshot
     */
    public redo(): CombatSnapshot | null {
        if (this.currentIndex >= this.snapshots.length - 1) return null;

        this.currentIndex++;
        const snapshot = this.snapshots[this.currentIndex];

        if (this.debugMode) {
            this.logDebug(`Redo: Turn ${snapshot.turn}`);
        }

        return snapshot;
    }

    /**
     * Get all snapshots (for history view)
     */
    public getAllSnapshots(): CombatSnapshot[] {
        return [...this.snapshots];
    }

    /**
     * Get snapshots for a specific turn
     */
    public getSnapshotsByTurn(turn: number): CombatSnapshot[] {
        return this.snapshots.filter(s => s.turn === turn);
    }

    /**
     * Get snapshots in a turn range
     */
    public getSnapshotsInRange(startTurn: number, endTurn: number): CombatSnapshot[] {
        return this.snapshots.filter(s => s.turn >= startTurn && s.turn <= endTurn);
    }

    /**
     * Export snapshot to JSON
     */
    public exportSnapshot(snapshot: CombatSnapshot): string {
        return JSON.stringify(snapshot, null, 2);
    }

    /**
     * Import snapshot from JSON
     */
    public importSnapshot(data: string): CombatSnapshot | null {
        try {
            const snapshot = JSON.parse(data) as CombatSnapshot;
            return snapshot;
        } catch (error) {
            console.error('Failed to import snapshot:', error);
            return null;
        }
    }

    /**
     * Clear all snapshots
     */
    public clear(): void {
        this.snapshots = [];
        this.currentIndex = -1;

        if (this.debugMode) {
            this.logDebug('Snapshots cleared');
        }
    }

    /**
     * Get combat history summary
     */
    public getCombatHistory(): {
        totalSnapshots: number;
        currentIndex: number;
        totalTurns: number;
        combatDuration: number;
        averageSnapshotsPerTurn: number;
    } {
        const totalTurns = this.snapshots.length > 0
            ? Math.max(...this.snapshots.map(s => s.turn))
            : 0;

        return {
            totalSnapshots: this.snapshots.length,
            currentIndex: this.currentIndex,
            totalTurns,
            combatDuration: Date.now() - this.combatStartTime,
            averageSnapshotsPerTurn: totalTurns > 0 ? this.snapshots.length / totalTurns : 0
        };
    }

    /**
     * Get replay data for a turn range
     * Returns snapshots with timing information for replay
     */
    public getReplayData(startTurn: number, endTurn: number): {
        snapshots: CombatSnapshot[];
        totalDuration: number;
        averageTimePerTurn: number;
    } {
        const snapshots = this.getSnapshotsInRange(startTurn, endTurn);

        if (snapshots.length === 0) {
            return { snapshots: [], totalDuration: 0, averageTimePerTurn: 0 };
        }

        const totalDuration = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
        const turns = endTurn - startTurn + 1;
        const averageTimePerTurn = turns > 0 ? totalDuration / turns : 0;

        return {
            snapshots,
            totalDuration,
            averageTimePerTurn
        };
    }

    /**
     * Replay combat from a specific snapshot
     * Returns an async generator for step-by-step replay
     */
    public async *replayCombat(
        startIndex: number = 0,
        speed: number = 1000 // ms per snapshot
    ): AsyncGenerator<CombatSnapshot> {
        for (let i = startIndex; i < this.snapshots.length; i++) {
            yield this.snapshots[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    /**
     * Compare two snapshots
     */
    public compareSnapshots(s1: CombatSnapshot, s2: CombatSnapshot): {
        unitChanges: string[];
        gridChanges: string[];
        logDifference: number;
    } {
        const unitChanges: string[] = [];
        const gridChanges: string[] = [];

        // Compare units
        s1.units.forEach((u1) => {
            const u2 = s2.units.find(u => u.id === u1.id);
            if (!u2) {
                unitChanges.push(`Unit ${u1.id} removed`);
                return;
            }

            if (u1.stats.hp !== u2.stats.hp) {
                unitChanges.push(`${u1.id} HP: ${u1.stats.hp} → ${u2.stats.hp}`);
            }
            if (u1.pos.x !== u2.pos.x || u1.pos.y !== u2.pos.y) {
                unitChanges.push(`${u1.id} moved: (${u1.pos.x},${u1.pos.y}) → (${u2.pos.x},${u2.pos.y})`);
            }
            if (u1.statuses.length !== u2.statuses.length) {
                unitChanges.push(`${u1.id} statuses changed: ${u1.statuses.length} → ${u2.statuses.length}`);
            }
        });

        // Check for new units
        s2.units.forEach(u2 => {
            if (!s1.units.find(u => u.id === u2.id)) {
                unitChanges.push(`Unit ${u2.id} added`);
            }
        });

        return {
            unitChanges,
            gridChanges,
            logDifference: s2.logs.length - s1.logs.length
        };
    }

    /**
     * Get debug information
     */
    public getDebugInfo(): {
        snapshotCount: number;
        currentIndex: number;
        memoryUsage: number; // Approximate in bytes
        oldestSnapshot: number;
        newestSnapshot: number;
    } {
        const memoryUsage = JSON.stringify(this.snapshots).length;

        return {
            snapshotCount: this.snapshots.length,
            currentIndex: this.currentIndex,
            memoryUsage,
            oldestSnapshot: this.snapshots[0]?.timestamp || 0,
            newestSnapshot: this.snapshots[this.snapshots.length - 1]?.timestamp || 0
        };
    }

    /**
     * Search snapshots by criteria
     */
    public searchSnapshots(criteria: {
        unitId?: string;
        minTurn?: number;
        maxTurn?: number;
        hasLogs?: boolean;
    }): CombatSnapshot[] {
        return this.snapshots.filter(snapshot => {
            if (criteria.unitId && !snapshot.units.find(u => u.id === criteria.unitId)) {
                return false;
            }
            if (criteria.minTurn !== undefined && snapshot.turn < criteria.minTurn) {
                return false;
            }
            if (criteria.maxTurn !== undefined && snapshot.turn > criteria.maxTurn) {
                return false;
            }
            if (criteria.hasLogs && snapshot.logs.length === 0) {
                return false;
            }
            return true;
        });
    }

    /**
     * Analyze combat statistics from snapshots
     */
    public analyzeCombat(): {
        totalDamageDealt: Record<string, number>;
        totalHealingDone: Record<string, number>;
        killCount: Record<string, number>;
        deathCount: Record<string, number>;
        skillsUsed: Record<string, number>;
    } {
        const stats = {
            totalDamageDealt: {} as Record<string, number>,
            totalHealingDone: {} as Record<string, number>,
            killCount: {} as Record<string, number>,
            deathCount: {} as Record<string, number>,
            skillsUsed: {} as Record<string, number>
        };

        this.snapshots.forEach(snapshot => {
            snapshot.logs.forEach(log => {
                if (log.type === 'damage' && log.sourceId) {
                    stats.totalDamageDealt[log.sourceId] = (stats.totalDamageDealt[log.sourceId] || 0) + (log.value || 0);
                }
                if (log.type === 'heal' && log.sourceId) {
                    stats.totalHealingDone[log.sourceId] = (stats.totalHealingDone[log.sourceId] || 0) + (log.value || 0);
                }
                if (log.type === 'kill' && log.sourceId) {
                    stats.killCount[log.sourceId] = (stats.killCount[log.sourceId] || 0) + 1;
                }
                if (log.type === 'kill' && log.targetId) {
                    stats.deathCount[log.targetId] = (stats.deathCount[log.targetId] || 0) + 1;
                }
                if (log.type === 'skill_use' && log.sourceId) {
                    stats.skillsUsed[log.sourceId] = (stats.skillsUsed[log.sourceId] || 0) + 1;
                }
            });
        });

        return stats;
    }

    /**
     * Debug logging
     */
    private logDebug(message: string): void {
        if (this.debugMode) {
            console.log(`[SnapshotManager] ${message}`);
        }
    }

    /**
     * Enable/disable debug mode
     */
    public setDebugMode(enabled: boolean): void {
        this.debugMode = enabled;
    }
}
