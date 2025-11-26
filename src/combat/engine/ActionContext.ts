import { Unit, Skill, ActionMetadata, EnvironmentContext, CellPos } from '../types';

/**
 * Enhanced Action Context for Combat Operations
 * 
 * Provides comprehensive context for skill execution including source/target units,
 * metadata (crit, combo, reaction), environment factors, and chain tracking.
 */

export interface ActionContext {
    source: Unit;
    target?: Unit;
    targets?: Unit[]; // For multi-target skills
    skill?: Skill;
    position?: CellPos; // Target position for movement/AoE

    metadata: ActionMetadata;
    environment: EnvironmentContext;

    // Chain tracking for combo systems
    chainContext?: {
        previousSkillId?: string;
        chainCount: number;
        chainBonus: number;
    };
}

/**
 * Create a basic action context
 */
export const createActionContext = (
    source: Unit,
    target?: Unit,
    skill?: Skill,
    position?: CellPos
): ActionContext => {
    return {
        source,
        target,
        skill,
        position,
        metadata: {
            isCrit: false,
            isCounter: false,
            isReaction: false,
            comboCount: source.runtime.comboCount || 0,
            distance: target ? calculateDistance(source.pos, target.pos) : 0
        },
        environment: {},
        chainContext: {
            chainCount: 0,
            chainBonus: 0
        }
    };
};

/**
 * Create an action context with metadata
 */
export const createActionContextWithMetadata = (
    source: Unit,
    target: Unit | undefined,
    skill: Skill | undefined,
    metadata: Partial<ActionMetadata>,
    environment?: EnvironmentContext
): ActionContext => {
    const context = createActionContext(source, target, skill);
    context.metadata = { ...context.metadata, ...metadata };
    if (environment) {
        context.environment = environment;
    }
    return context;
};

/**
 * Calculate Manhattan distance between two positions
 */
export const calculateDistance = (pos1: CellPos, pos2: CellPos): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

/**
 * Calculate Euclidean distance between two positions
 */
export const calculateEuclideanDistance = (pos1: CellPos, pos2: CellPos): number => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

/**
 * Get direction from source to target
 */
export const getDirection = (from: CellPos, to: CellPos): { dx: number; dy: number } => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Normalize to -1, 0, or 1
    return {
        dx: dx === 0 ? 0 : dx / Math.abs(dx),
        dy: dy === 0 ? 0 : dy / Math.abs(dy)
    };
};

/**
 * Check if target is behind source (for backstab mechanics)
 */
export const isTargetBehind = (source: Unit, target: Unit, sourceFacing: { dx: number; dy: number }): boolean => {
    const direction = getDirection(source.pos, target.pos);
    // Target is behind if direction is opposite to facing
    return direction.dx === -sourceFacing.dx && direction.dy === -sourceFacing.dy;
};

/**
 * Check if target is flanking source
 */
export const isTargetFlanking = (source: Unit, target: Unit, sourceFacing: { dx: number; dy: number }): boolean => {
    const direction = getDirection(source.pos, target.pos);
    // Flanking if perpendicular to facing
    return (direction.dx !== 0 && sourceFacing.dx === 0) || (direction.dy !== 0 && sourceFacing.dy === 0);
};

/**
 * Update chain context for combo tracking
 */
export const updateChainContext = (context: ActionContext, previousSkillId?: string): void => {
    if (!context.chainContext) {
        context.chainContext = { chainCount: 0, chainBonus: 0 };
    }

    if (previousSkillId && context.skill) {
        // Check if this is a valid chain
        const isValidChain = context.skill.tags?.includes('combo') || false;

        if (isValidChain) {
            context.chainContext.previousSkillId = previousSkillId;
            context.chainContext.chainCount++;
            context.chainContext.chainBonus = context.chainContext.chainCount * 0.1; // 10% per chain
        } else {
            // Reset chain
            context.chainContext.chainCount = 0;
            context.chainContext.chainBonus = 0;
        }
    }
};

