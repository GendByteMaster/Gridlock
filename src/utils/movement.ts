import { Position } from '../types';

/**
 * Calculate valid movement positions for a unit
 * Uses Manhattan distance (grid-based movement)
 */
export function calculateValidMoves(
    unitPos: Position,
    moveRange: number,
    grid: any[][],
    units: any[]
): Position[] {
    const validMoves: Position[] = [];
    const gridSize = 10;

    // Check all positions within movement range
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Skip the unit's current position
            if (x === unitPos.x && y === unitPos.y) continue;

            // Calculate Manhattan distance
            const distance = Math.abs(x - unitPos.x) + Math.abs(y - unitPos.y);

            // Check if within range
            if (distance <= moveRange) {
                // Check if cell is not occupied by another unit
                const isOccupied = units.some(u => u.pos.x === x && u.pos.y === y);

                if (!isOccupied) {
                    validMoves.push({ x, y });
                }
            }
        }
    }

    return validMoves;
}

/**
 * Get movement range for a unit type
 * This can be expanded to read from unit stats/modules
 */
export function getUnitMoveRange(unitType: string): number {
    const moveRanges: Record<string, number> = {
        'Guardian': 2,
        'Striker': 3,
        'Arcanist': 2,
        'Scout': 4,
        'Medic': 3,
        'Sniper': 2,
        'Vanguard': 3,
        'Sentinel': 2
    };

    return moveRanges[unitType] || 3; // Default to 3 if not found
}
