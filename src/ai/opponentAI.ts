import { Unit, Position, GameState } from '../types';

const BOARD_SIZE = 10;

// Calculate Manhattan distance between two positions
const distance = (a: Position, b: Position): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Find the closest enemy to a given unit
const findClosestEnemy = (unit: Unit, enemies: Unit[]): Unit | null => {
    if (enemies.length === 0) return null;

    let closest = enemies[0];
    let minDist = distance(unit.position, closest.position);

    for (const enemy of enemies) {
        const dist = distance(unit.position, enemy.position);
        if (dist < minDist) {
            minDist = dist;
            closest = enemy;
        }
    }

    return closest;
};

// Get valid adjacent positions for movement
const getAdjacentPositions = (pos: Position, grid: any[][]): Position[] => {
    const directions = [
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
    ];

    const adjacent: Position[] = [];

    for (const { dx, dy } of directions) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
            const cell = grid[ny][nx];
            if (!cell.isOccupied) {
                adjacent.push({ x: nx, y: ny });
            }
        }
    }

    return adjacent;
};

// Check if an enemy is adjacent (in attack range)
const isAdjacent = (a: Position, b: Position): boolean => {
    return distance(a, b) === 1;
};

// Main AI decision function
export const executeAITurn = (gameState: GameState): {
    action: 'move' | 'skill' | 'none';
    unitId?: string;
    target?: Position;
    skillId?: string;
} => {
    const { units, grid } = gameState;

    // Get AI units and player units
    const aiUnits = units.filter(u => u.owner === 'opponent');
    const playerUnits = units.filter(u => u.owner === 'player');

    if (aiUnits.length === 0 || playerUnits.length === 0) {
        return { action: 'none' };
    }

    // Select first AI unit (simple strategy)
    const selectedUnit = aiUnits[0];
    const closestEnemy = findClosestEnemy(selectedUnit, playerUnits);

    if (!closestEnemy) {
        return { action: 'none' };
    }

    // Check if enemy is adjacent (can attack)
    if (isAdjacent(selectedUnit.position, closestEnemy.position)) {
        // Use Slash skill
        const slashSkill = selectedUnit.equippedSkills.find(s => s.id === 'slash');
        const cooldown = selectedUnit.cooldowns['slash'] || 0;

        if (slashSkill && cooldown === 0) {
            return {
                action: 'skill',
                unitId: selectedUnit.id,
                skillId: 'slash',
                target: closestEnemy.position
            };
        }
    }

    // Try to move closer to enemy
    const adjacentPositions = getAdjacentPositions(selectedUnit.position, grid);

    if (adjacentPositions.length > 0) {
        // Find position that gets us closer to the enemy
        let bestPos = adjacentPositions[0];
        let minDist = distance(bestPos, closestEnemy.position);

        for (const pos of adjacentPositions) {
            const dist = distance(pos, closestEnemy.position);
            if (dist < minDist) {
                minDist = dist;
                bestPos = pos;
            }
        }

        return {
            action: 'move',
            unitId: selectedUnit.id,
            target: bestPos
        };
    }

    // No valid action
    return { action: 'none' };
};
