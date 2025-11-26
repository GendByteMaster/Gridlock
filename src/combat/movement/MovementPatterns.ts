import { Position } from '../../types';

/**
 * Movement pattern types
 */
export type MovementPatternType =
    | 'orthogonal'      // Straight lines (up, down, left, right)
    | 'diagonal'        // Diagonal lines
    | 'knight'          // L-shape (chess knight)
    | 'any'             // Any direction
    | 'custom';         // Custom pattern

/**
 * What the unit can pass through during movement
 */
export type PassThroughType = 'none' | 'allies' | 'enemies' | 'both';

/**
 * Movement restriction condition
 */
export interface MovementRestriction {
    type: 'direction' | 'distance' | 'condition' | 'terrain';
    value: string | number;
    description: string;
}

/**
 * Movement pattern definition
 */
export interface MovementPattern {
    type: MovementPatternType;
    range: number;                          // Max tiles per move
    minRange?: number;                      // Min tiles (for forced movement)
    canJumpOver: boolean;                   // Can jump over units
    canPassThrough: PassThroughType;        // What can be passed through
    restrictions?: MovementRestriction[];   // Special restrictions
    allowDiagonal?: boolean;                // For 'any' type
    customValidator?: (from: Position, to: Position, units: any[], grid: any[][]) => boolean;
}

/**
 * Movement effect triggered by moving
 */
export interface MovementEffect {
    id: string;
    name: string;
    description: string;
    trigger: 'on_move' | 'on_stay' | 'on_end_turn' | 'conditional';
    condition?: (unit: any, from: Position, to: Position) => boolean;
    effect: {
        stat?: string;          // Which stat to modify
        value?: number;         // Modifier value
        duration?: number;      // How many turns
        type: 'buff' | 'debuff' | 'stance' | 'special';
    };
}

/**
 * Complete unit movement definition
 */
export interface UnitMovementDef {
    unitType: string;
    pattern: MovementPattern;
    effects: MovementEffect[];
    specialRules?: string[];
}

/**
 * Calculate orthogonal (straight line) moves
 */
export function calculateOrthogonalMoves(
    from: Position,
    range: number,
    units: any[],
    grid: any[][],
    canPassThrough: PassThroughType = 'none'
): Position[] {
    const moves: Position[] = [];
    const directions = [
        { dx: 0, dy: -1 },  // Up
        { dx: 0, dy: 1 },   // Down
        { dx: -1, dy: 0 },  // Left
        { dx: 1, dy: 0 }    // Right
    ];

    for (const dir of directions) {
        for (let dist = 1; dist <= range; dist++) {
            const x = from.x + dir.dx * dist;
            const y = from.y + dir.dy * dist;

            if (x < 0 || x >= 10 || y < 0 || y >= 10) break;

            const isOccupied = units.some(u => {
                const pos = u.pos || u.position;
                return pos && pos.x === x && pos.y === y;
            });

            if (isOccupied && canPassThrough === 'none') break;
            if (!isOccupied) moves.push({ x, y });
            if (isOccupied && canPassThrough !== 'both') break;
        }
    }

    return moves;
}

/**
 * Calculate diagonal moves
 */
export function calculateDiagonalMoves(
    from: Position,
    range: number,
    units: any[],
    grid: any[][],
    canPassThrough: PassThroughType = 'none'
): Position[] {
    const moves: Position[] = [];
    const directions = [
        { dx: 1, dy: 1 },   // Down-right
        { dx: 1, dy: -1 },  // Up-right
        { dx: -1, dy: 1 },  // Down-left
        { dx: -1, dy: -1 }  // Up-left
    ];

    for (const dir of directions) {
        for (let dist = 1; dist <= range; dist++) {
            const x = from.x + dir.dx * dist;
            const y = from.y + dir.dy * dist;

            if (x < 0 || x >= 10 || y < 0 || y >= 10) break;

            const isOccupied = units.some(u => {
                const pos = u.pos || u.position;
                return pos && pos.x === x && pos.y === y;
            });

            if (isOccupied && canPassThrough === 'none') break;
            if (!isOccupied) moves.push({ x, y });
            if (isOccupied && canPassThrough !== 'both') break;
        }
    }

    return moves;
}

/**
 * Calculate knight moves (L-shape)
 */
export function calculateKnightMoves(
    from: Position,
    units: any[],
    grid: any[][]
): Position[] {
    const moves: Position[] = [];
    const offsets = [
        { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
        { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
        { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
        { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
    ];

    for (const offset of offsets) {
        const x = from.x + offset.dx;
        const y = from.y + offset.dy;

        if (x < 0 || x >= 10 || y < 0 || y >= 10) continue;

        const isOccupied = units.some(u => {
            const pos = u.pos || u.position;
            return pos && pos.x === x && pos.y === y;
        });
        if (!isOccupied) moves.push({ x, y });
    }

    return moves;
}

/**
 * Calculate any direction moves (orthogonal + diagonal)
 */
export function calculateAnyDirectionMoves(
    from: Position,
    range: number,
    units: any[],
    grid: any[][],
    canPassThrough: PassThroughType = 'none'
): Position[] {
    const orthogonal = calculateOrthogonalMoves(from, range, units, grid, canPassThrough);
    const diagonal = calculateDiagonalMoves(from, range, units, grid, canPassThrough);

    return [...orthogonal, ...diagonal];
}
