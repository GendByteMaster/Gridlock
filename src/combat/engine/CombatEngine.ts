import { Unit, CombatLogEvent } from '../types';
import { tickInitiative, getTurnOrder } from './Initiative';
import { executeActionPipeline, ActionPipelineResult, createActionContext } from './ActionPipeline';
import { getSkillDefinition } from '../skills/SkillRegistry';

export class CombatEngine {
    private units: Unit[];
    private grid: any[][];
    private logs: CombatLogEvent[];

    constructor(initialUnits: Unit[], initialGrid: any[][]) {
        this.units = initialUnits;
        this.grid = initialGrid;
        this.logs = [];
    }

    public nextTurn(): string | null {
        const activeUnit = tickInitiative(this.units);
        if (activeUnit) {
            return activeUnit.id;
        }
        return null;
    }

    public performAction(sourceId: string, skillId: string, targetId: string): ActionPipelineResult {
        const source = this.units.find(u => u.id === sourceId);
        const target = this.units.find(u => u.id === targetId);
        const skill = getSkillDefinition(skillId);

        if (!source || !skill) {
            throw new Error('Invalid source or skill');
        }

        const context = createActionContext(
            source,
            skill,
            target,
            target?.pos,
            this.grid,
            this.units
        );

        const result = executeActionPipeline(context);

        // Update internal state
        this.logs.push(...result.logs);

        return result;
    }

    public performMove(sourceId: string, x: number, y: number): ActionPipelineResult {
        const source = this.units.find(u => u.id === sourceId);
        if (!source) throw new Error('Invalid source unit');

        // Create a move skill context (assuming 'move' skill exists or handling it as special case)
        // For now, we'll assume a generic move operation or skill
        // In the new system, movement is often a skill (MoveOp)

        const moveSkill = getSkillDefinition('move'); // Ensure 'move' skill exists or use a default

        if (!moveSkill) {
            throw new Error('Move skill not defined');
        }

        const context = createActionContext(
            source,
            moveSkill,
            undefined,
            { x, y },
            this.grid,
            this.units
        );

        const result = executeActionPipeline(context);

        this.logs.push(...result.logs);

        return result;
    }

    public performSkillAtLocation(sourceId: string, skillId: string, x: number, y: number): ActionPipelineResult {
        const source = this.units.find(u => u.id === sourceId);
        const skill = getSkillDefinition(skillId);

        if (!source || !skill) {
            throw new Error('Invalid action parameters');
        }

        const context = createActionContext(
            source,
            skill,
            undefined,
            { x, y },
            this.grid,
            this.units
        );

        const result = executeActionPipeline(context);

        this.logs.push(...result.logs);

        return result;
    }

    public getState() {
        return {
            units: this.units,
            grid: this.grid,
            logs: this.logs
        };
    }

    public getTurnOrder(count: number = 10): string[] {
        return getTurnOrder(this.units, count);
    }
}
