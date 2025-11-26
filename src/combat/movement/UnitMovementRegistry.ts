import {
    MovementPattern,
    MovementEffect,
    UnitMovementDef,
    calculateOrthogonalMoves,
    calculateDiagonalMoves,
    calculateAnyDirectionMoves
} from './MovementPatterns';
import { Position } from '../../types';

/**
 * Movement definitions for all unit types
 */
export const UNIT_MOVEMENT_REGISTRY: Record<string, UnitMovementDef> = {
    // ===== GUARDIAN =====
    'Guardian': {
        unitType: 'Guardian',
        pattern: {
            type: 'orthogonal',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            restrictions: [
                {
                    type: 'condition',
                    value: 'cannot_pass_allies',
                    description: 'Cannot pass through allied units'
                }
            ]
        },
        effects: [
            {
                id: 'guardian_stance',
                name: 'Стойка Стража',
                description: '+10% DEF if didn\'t move this turn',
                trigger: 'on_stay',
                effect: {
                    stat: 'def',
                    value: 0.10,
                    duration: 1,
                    type: 'stance'
                }
            }
        ],
        specialRules: [
            'Ignores trap activation (heavy armor)',
            'Loses stance bonus if forcibly moved'
        ]
    },

    // ===== STRIKER =====
    'Striker': {
        unitType: 'Striker',
        pattern: {
            type: 'any',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'striker_aggression',
                name: 'Агрессия',
                description: '+10% ATK after moving',
                trigger: 'on_move',
                effect: {
                    stat: 'atk',
                    value: 0.10,
                    duration: 1,
                    type: 'buff'
                }
            },
            {
                id: 'striker_exposed',
                name: 'Открыт',
                description: '-1 DEF when ending turn next to enemy',
                trigger: 'conditional',
                condition: (unit, from, to) => {
                    // Check if ended turn next to enemy (will be implemented in game logic)
                    return false; // Placeholder
                },
                effect: {
                    stat: 'def',
                    value: -1,
                    duration: 1,
                    type: 'debuff'
                }
            }
        ],
        specialRules: [
            'Gains aggression buff after any movement',
            'Vulnerable when adjacent to enemies'
        ]
    },

    // ===== SCOUT =====
    'Scout': {
        unitType: 'Scout',
        pattern: {
            type: 'any',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'scout_speed_boost',
                name: 'Захват Точки',
                description: '+1 movement range next turn if ended on capture point',
                trigger: 'conditional',
                condition: (unit, from, to) => {
                    // Check if on capture point (will be implemented)
                    return false; // Placeholder
                },
                effect: {
                    stat: 'moveRange',
                    value: 1,
                    duration: 1,
                    type: 'buff'
                }
            }
        ],
        specialRules: [
            'Does not trigger traps while moving',
            'Can ignore one height obstacle with Dash skill'
        ]
    },

    // ===== ARCANIST =====
    'Arcanist': {
        unitType: 'Arcanist',
        pattern: {
            type: 'diagonal',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            restrictions: [
                {
                    type: 'direction',
                    value: 'diagonal_only',
                    description: 'Can only move diagonally'
                }
            ],
            customValidator: (from, to, units, grid) => {
                // Adaptive movement: if blocked, try adjacent diagonal
                const dx = Math.abs(to.x - from.x);
                const dy = Math.abs(to.y - from.y);
                return dx === dy && dx > 0; // Must be diagonal
            }
        },
        effects: [
            {
                id: 'arcanist_enhanced_range',
                name: 'Усиленное Движение',
                description: 'Can move 2 diagonals if no skill used',
                trigger: 'conditional',
                condition: (unit, from, to) => {
                    // Check if skill was used (will be implemented)
                    return false; // Placeholder
                },
                effect: {
                    stat: 'moveRange',
                    value: 1,
                    duration: 1,
                    type: 'buff'
                }
            }
        ],
        specialRules: [
            'Cannot move orthogonally',
            'Adaptive diagonal movement if blocked'
        ]
    },

    // ===== SENTINEL =====
    'Sentinel': {
        unitType: 'Sentinel',
        pattern: {
            type: 'custom',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            customValidator: (from, to, units, grid) => {
                const dx = to.x - from.x;
                const dy = to.y - from.y;

                // Can only move backward or sideways (not forward)
                // Assuming "forward" is toward y=0 for opponent, y=9 for player
                // For now, just prevent moving in one direction
                return dy >= 0; // Cannot move up (simplified)
            }
        },
        effects: [
            {
                id: 'sentinel_retreat',
                name: 'Отступление',
                description: 'Extra backward step if enemy is adjacent',
                trigger: 'conditional',
                condition: (unit, from, to) => {
                    // Check if enemy is adjacent (will be implemented)
                    return false; // Placeholder
                },
                effect: {
                    stat: 'moveRange',
                    value: 1,
                    duration: 1,
                    type: 'special'
                }
            },
            {
                id: 'sentinel_precision',
                name: 'Точность',
                description: '+5% accuracy when moving sideways',
                trigger: 'conditional',
                condition: (unit, from, to) => {
                    const dx = Math.abs(to.x - from.x);
                    const dy = Math.abs(to.y - from.y);
                    return dx > 0 && dy === 0; // Sideways movement
                },
                effect: {
                    stat: 'acc',
                    value: 0.05,
                    duration: 1,
                    type: 'buff'
                }
            }
        ],
        specialRules: [
            'Cannot move forward',
            'Extra retreat step when threatened',
            'Accuracy bonus for lateral movement'
        ]
    },

    // ===== SNIPER =====
    'Sniper': {
        unitType: 'Sniper',
        pattern: {
            type: 'any',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'sniper_stationary_bonus',
                name: 'Стационарная Позиция',
                description: '+accuracy and +range if didn\'t move',
                trigger: 'on_stay',
                effect: {
                    stat: 'acc',
                    value: 0.10,
                    duration: 1,
                    type: 'stance'
                }
            }
        ],
        specialRules: [
            'Gains accuracy and range when stationary',
            'Long-range precision attacks'
        ]
    }
};

/**
 * Get movement definition for a unit type
 */
export function getUnitMovementDef(unitType: string): UnitMovementDef | undefined {
    return UNIT_MOVEMENT_REGISTRY[unitType];
}

/**
 * Calculate valid moves for a unit based on its movement pattern
 */
export function calculateUnitMoves(
    unitType: string,
    from: Position,
    units: any[],
    grid: any[][]
): Position[] {
    const moveDef = getUnitMovementDef(unitType);
    if (!moveDef) {
        // Fallback to simple movement
        return calculateAnyDirectionMoves(from, 2, units, grid);
    }

    const { pattern } = moveDef;

    switch (pattern.type) {
        case 'orthogonal':
            return calculateOrthogonalMoves(from, pattern.range, units, grid, pattern.canPassThrough);

        case 'diagonal':
            return calculateDiagonalMoves(from, pattern.range, units, grid, pattern.canPassThrough);

        case 'any':
            return calculateAnyDirectionMoves(from, pattern.range, units, grid, pattern.canPassThrough);

        case 'custom':
            if (pattern.customValidator) {
                // Calculate all possible positions and filter with custom validator
                const allMoves = calculateAnyDirectionMoves(from, pattern.range, units, grid, pattern.canPassThrough);
                return allMoves.filter(to => pattern.customValidator!(from, to, units, grid));
            }
            return [];

        default:
            return [];
    }
}
