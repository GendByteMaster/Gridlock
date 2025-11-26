import {
    MovementPattern,
    MovementEffect,
    UnitMovementDef,
    calculateOrthogonalMoves,
    calculateDiagonalMoves,
    calculateAnyDirectionMoves,
    calculateKnightMoves
} from './MovementPatterns';
import { Position, Unit } from '../../types';

/**
 * Movement definitions for all unit types
 */
export const UNIT_MOVEMENT_REGISTRY: Record<string, UnitMovementDef> = {
    // ==========================================
    // BASIC UNITS (10)
    // ==========================================

    // 1. GUARDIAN
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
                name: 'Guardian Stance',
                description: '+10% DEF if didn\'t move this turn',
                trigger: 'on_stay',
                effect: { stat: 'def', value: 0.10, duration: 1, type: 'stance' }
            }
        ],
        specialRules: ['Ignores trap activation', 'Loses stance if moved']
    },

    // 2. SCOUT
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
                id: 'scout_capture_speed',
                name: 'Capture Point Speed',
                description: '+1 movement range next turn if ended on capture point',
                trigger: 'conditional',
                effect: { stat: 'moveRange', value: 1, duration: 1, type: 'buff' }
            }
        ],
        specialRules: ['No trap activation', 'Dash ignores height']
    },

    // 3. STRIKER
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
                name: 'Aggression',
                description: '+10% DMG on next attack this turn after moving',
                trigger: 'on_move',
                effect: { stat: 'atk', value: 0.10, duration: 1, type: 'buff' }
            },
            {
                id: 'striker_exposed',
                name: 'Exposed',
                description: '-1 DEF when ending turn next to enemy',
                trigger: 'conditional',
                effect: { stat: 'def', value: -1, duration: 1, type: 'debuff' }
            }
        ],
        specialRules: ['Aggression buff on move', 'Exposed near enemies']
    },

    // 4. ARCANIST
    'Arcanist': {
        unitType: 'Arcanist',
        pattern: {
            type: 'diagonal',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            customValidator: (from, to) => {
                const dx = Math.abs(to.x - from.x);
                const dy = Math.abs(to.y - from.y);
                return dx === dy && dx > 0;
            }
        },
        effects: [
            {
                id: 'arcanist_enhanced_move',
                name: 'Enhanced Movement',
                description: 'Can move 2 diagonals if no skill used',
                trigger: 'conditional',
                effect: { stat: 'moveRange', value: 1, duration: 1, type: 'buff' }
            }
        ],
        specialRules: ['Adaptive diagonal movement', 'Enhanced move if no skill']
    },

    // 5. VANGUARD
    'Vanguard': {
        unitType: 'Vanguard',
        pattern: {
            type: 'custom',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none',
            // Custom validator handles "strictly forward" logic in calculateUnitMoves
        },
        effects: [
            {
                id: 'vanguard_momentum',
                name: 'Momentum',
                description: 'Momentum activated if moved 2 cells',
                trigger: 'on_move',
                effect: { type: 'buff', description: 'Momentum Active' }
            }
        ],
        specialRules: ['Forward only', 'No turns if moving 2 cells']
    },

    // 6. SENTINEL (Sentinel Bow)
    'Sentinel': {
        unitType: 'Sentinel',
        pattern: {
            type: 'custom',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            // Custom validator handles "backward or sideways"
        },
        effects: [
            {
                id: 'sentinel_retreat',
                name: 'Retreat',
                description: 'Extra backward step if enemy adjacent',
                trigger: 'conditional',
                effect: { type: 'special', description: 'Retreat Move' }
            },
            {
                id: 'sentinel_precision',
                name: 'Precision',
                description: '+5% accuracy when moving sideways',
                trigger: 'on_move',
                effect: { stat: 'acc', value: 0.05, duration: 1, type: 'buff' }
            }
        ],
        specialRules: ['Never forward', 'Retreat mechanic', 'Sideways accuracy']
    },

    // 7. MECHANIST
    'Mechanist': {
        unitType: 'Mechanist',
        pattern: {
            type: 'any',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'mechanist_overclock',
                name: 'Overclock Charge',
                description: '+1 Turret Range if didn\'t move',
                trigger: 'on_stay',
                effect: { type: 'buff', description: 'Turret Range +1' }
            }
        ],
        specialRules: ['Turret drag mechanic']
    },

    // 8. MONK
    'Monk': {
        unitType: 'Monk',
        pattern: {
            type: 'any',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'allies', // Can pass through allies
            allowDiagonal: true
        },
        effects: [
            {
                id: 'monk_balance',
                name: 'Balance',
                description: 'Accuracy bonus on straight move',
                trigger: 'on_move',
                effect: { stat: 'acc', value: 0.10, duration: 1, type: 'buff' }
            },
            {
                id: 'monk_evasion',
                name: 'Evasion',
                description: '+10% Evasion on diagonal move',
                trigger: 'on_move',
                effect: { stat: 'evasion', value: 0.10, duration: 1, type: 'buff' }
            }
        ],
        specialRules: ['Pass through allies', 'Cannot end on ally']
    },

    // 9. FROST ADEPT
    'FrostAdept': {
        unitType: 'FrostAdept',
        pattern: {
            type: 'diagonal',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none'
        },
        effects: [
            {
                id: 'frost_momentum',
                name: 'Ice Momentum',
                description: 'Skill ignores LOS if moved through frozen tile',
                trigger: 'conditional',
                effect: { type: 'buff', description: 'Ignore LOS' }
            },
            {
                id: 'frost_chill',
                name: 'Chill Aura',
                description: 'Slows adjacent enemies',
                trigger: 'on_end_turn',
                effect: { type: 'debuff', description: 'Slow' }
            }
        ],
        specialRules: ['Diagonal only', 'Chill aura']
    },

    // 10. WAR IMP
    'WarImp': {
        unitType: 'WarImp',
        pattern: {
            type: 'custom', // Zigzag
            range: 2,
            canJumpOver: true, // Jump
            canPassThrough: 'both', // Pass through allies and enemies
            allowDiagonal: true
        },
        effects: [
            {
                id: 'imp_overheat',
                name: 'Overheat',
                description: '+25% explosion damage if near 2+ enemies',
                trigger: 'on_end_turn',
                effect: { type: 'buff', description: 'Explosion Dmg +25%' }
            }
        ],
        specialRules: ['Zigzag move', 'Jump', 'Debuff enemies jumped over']
    },

    // ==========================================
    // UNIQUE HEROES (10)
    // ==========================================

    // 1. CHRONO KNIGHT
    'ChronoKnight': {
        unitType: 'ChronoKnight',
        pattern: {
            type: 'custom', // Officer (Diagonal) + Knight
            range: 2, // Approximate
            canJumpOver: true,
            canPassThrough: 'none'
        },
        effects: [],
        specialRules: ['Diagonal + Knight move', 'Double move (back/side)', 'Time rewind on kill']
    },

    // 2. STORM TITAN
    'StormTitan': {
        unitType: 'StormTitan',
        pattern: {
            type: 'any',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'titan_pulse',
                name: 'Electric Pulse',
                description: 'Generates pulse after move',
                trigger: 'on_move',
                effect: { type: 'special', description: 'Electric Pulse' }
            }
        ],
        specialRules: ['Slow', 'Chain lightning attack', 'Immovable']
    },

    // 3. SHADOW DANCER
    'ShadowDancer': {
        unitType: 'ShadowDancer',
        pattern: {
            type: 'any',
            range: 2,
            canJumpOver: true,
            canPassThrough: 'both',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'dancer_evasion',
                name: 'Evasion',
                description: '30% chance to avoid attack',
                trigger: 'passive',
                effect: { stat: 'evasion', value: 0.30, duration: 99, type: 'buff' }
            }
        ],
        specialRules: ['Jump 2 cells', 'Shadow Swap', 'Jump attack bonus']
    },

    // 4. SOLAR PRIEST
    'SolarPriest': {
        unitType: 'SolarPriest',
        pattern: {
            type: 'orthogonal',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none'
        },
        effects: [],
        specialRules: ['Linear beam attack', 'Heal/Cleanse support']
    },

    // 5. VOID WALKER
    'VoidWalker': {
        unitType: 'VoidWalker',
        pattern: {
            type: 'custom', // Teleport
            range: 3,
            canJumpOver: true,
            canPassThrough: 'both'
        },
        effects: [
            {
                id: 'void_instability',
                name: 'Instability',
                description: 'Debuff aura radius 1',
                trigger: 'passive',
                effect: { type: 'debuff', description: 'Accuracy/Def penalty' }
            }
        ],
        specialRules: ['Teleport move', 'Long jump (CD 3)', 'Pull attack']
    },

    // 6. IRON COLOSSUS
    'IronColossus': {
        unitType: 'IronColossus',
        pattern: {
            type: 'orthogonal',
            range: 1,
            canJumpOver: false,
            canPassThrough: 'none'
        },
        effects: [
            {
                id: 'colossus_unstoppable',
                name: 'Unstoppable',
                description: 'Immune to push/control',
                trigger: 'passive',
                effect: { type: 'buff', description: 'Immunity' }
            }
        ],
        specialRules: ['Push on move', 'Step forward on kill']
    },

    // 7. ARCANE ARCHER
    'ArcaneArcher': {
        unitType: 'ArcaneArcher',
        pattern: {
            type: 'any',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none',
            allowDiagonal: true
        },
        effects: [
            {
                id: 'archer_focus',
                name: 'Focus',
                description: '+Acc/Range if stationary',
                trigger: 'on_stay',
                effect: { stat: 'acc', value: 0.10, duration: 1, type: 'buff' }
            }
        ],
        specialRules: ['Shoot through allies', 'Piercing shot']
    },

    // 8. BONE REAPER
    'BoneReaper': {
        unitType: 'BoneReaper',
        pattern: {
            type: 'any',
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none', // "Pass through dead" - handled by game logic usually
            allowDiagonal: true
        },
        effects: [
            {
                id: 'reaper_harvest',
                name: 'Soul Harvest',
                description: '+1 Dmg on kill (stackable)',
                trigger: 'on_kill',
                effect: { stat: 'dmg', value: 1, duration: 99, type: 'buff' }
            }
        ],
        specialRules: ['Pass through dead', 'Cleave attack', 'Step on kill']
    },

    // 9. EMBER WITCH
    'EmberWitch': {
        unitType: 'EmberWitch',
        pattern: {
            type: 'custom', // 2 diag or 1 straight
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none'
        },
        effects: [],
        specialRules: ['Fireball AoE', 'Burning ground', 'Ash trap']
    },

    // 10. ASTRAL SENTINEL
    'AstralSentinel': {
        unitType: 'AstralSentinel',
        pattern: {
            type: 'custom', // 2 straight or 1 diag
            range: 2,
            canJumpOver: false,
            canPassThrough: 'none'
        },
        effects: [
            {
                id: 'astral_anti_portal',
                name: 'Anti-Portal',
                description: 'No teleports radius 2',
                trigger: 'passive',
                effect: { type: 'debuff', description: 'Block Teleport' }
            }
        ],
        specialRules: ['Swap with mark', 'Orbit damage bonus']
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
    unit: Unit,
    units: any[],
    grid: any[][]
): Position[] {
    const moveDef = getUnitMovementDef(unit.type);
    if (!moveDef) {
        // Fallback to simple movement
        return calculateAnyDirectionMoves(unit.position, 2, units, grid);
    }

    const { pattern } = moveDef;
    const from = unit.position;
    const isPlayer = unit.owner === 'player';
    const forwardDy = isPlayer ? -1 : 1; // Player moves UP (-y), Opponent moves DOWN (+y)

    // Helper to filter out-of-bounds
    const filterBounds = (moves: Position[]) => moves.filter(p => p.x >= 0 && p.x < 10 && p.y >= 0 && p.y < 10);

    switch (unit.type) {
        case 'Vanguard':
            // 1 or 2 cells strictly forward
            const moves: Position[] = [];
            // Forward 1
            const f1 = { x: from.x, y: from.y + forwardDy };
            if (isValidMove(f1, units, grid)) {
                moves.push(f1);
                // Forward 2 (only if 1 is valid and not blocked by ally - actually Vanguard rule says "if ally in front, cannot move 2")
                // Standard check: if f1 is occupied, cannot go to f2 (unless jump, which Vanguard is not)
                // Specific rule: "if ally in front, cannot move 2".
                // If f1 is empty, can he move 2? Yes.
                // If f1 is enemy? Standard collision (blocked).
                const f1Unit = getUnitAt(f1, units);
                if (!f1Unit) {
                    const f2 = { x: from.x, y: from.y + forwardDy * 2 };
                    if (isValidMove(f2, units, grid)) {
                        moves.push(f2);
                    }
                }
            }
            return filterBounds(moves);

        case 'Sentinel':
            // Backward or sideways (not forward)
            const sentinelMoves = calculateAnyDirectionMoves(from, 1, units, grid, pattern.canPassThrough);
            return sentinelMoves.filter(p => {
                const dy = p.y - from.y;
                // Prevent forward movement
                // If player (forward is -1), prevent dy = -1. So dy must be >= 0.
                // If opponent (forward is 1), prevent dy = 1. So dy must be <= 0.
                if (isPlayer && dy < 0) return false;
                if (!isPlayer && dy > 0) return false;
                return true;
            });

        case 'ChronoKnight':
            // Diagonal (Officer) + Knight
            const diagMoves = calculateDiagonalMoves(from, 2, units, grid, pattern.canPassThrough);
            const knightMoves = calculateKnightMoves(from, units, grid);
            return [...diagMoves, ...knightMoves];

        case 'VoidWalker':
            // Teleport radius 3 (any free cell)
            const teleportMoves: Position[] = [];
            for (let y = from.y - 3; y <= from.y + 3; y++) {
                for (let x = from.x - 3; x <= from.x + 3; x++) {
                    if (Math.abs(x - from.x) + Math.abs(y - from.y) <= 3) {
                        if (x === from.x && y === from.y) continue;
                        const target = { x, y };
                        if (isValidMove(target, units, grid, true)) { // true = ignore path (teleport)
                            teleportMoves.push(target);
                        }
                    }
                }
            }
            return filterBounds(teleportMoves);

        case 'WarImp':
            // Zigzag (any cell within 2 steps, can jump)
            // We can approximate this as "Any direction range 2, can jump"
            // But "Zigzag" implies specific pathing. For "valid moves" destination, it's basically range 2.
            // The prompt says "1 cell -> turn -> 1 cell". This covers all cells at Manhattan distance 2 (and 1).
            // (0,0) -> (0,1) -> (1,1) (Diagonal)
            // (0,0) -> (0,1) -> (0,2) (Straight)
            // (0,0) -> (0,1) -> (-1,1) (Knight-ish but not really)
            // Actually, "1 cell -> turn -> 1 cell" usually means you can't go straight 2?
            // "1 cell -> turn -> 1 cell" implies a change in direction.
            // If I go North, I must turn East, West, or South (back).
            // If I go North then North, that's straight.
            // If "Zigzag" is the ONLY way, then straight 2 is forbidden?
            // "2 cells in any direction" is the base. "Zigzag" is an elaboration.
            // Let's assume it allows straight too, as "2 cells in any direction" is the header.
            // I'll stick to Any Direction Range 2, Jump enabled.
            return calculateAnyDirectionMoves(from, 2, units, grid, pattern.canPassThrough);

        case 'EmberWitch':
            // 2 cells diagonal or 1 cell straight
            const witchDiag = calculateDiagonalMoves(from, 2, units, grid, pattern.canPassThrough);
            const witchStraight = calculateOrthogonalMoves(from, 1, units, grid, pattern.canPassThrough);
            return [...witchDiag, ...witchStraight];

        case 'AstralSentinel':
            // 2 cells straight or 1 diagonal
            const astralStraight = calculateOrthogonalMoves(from, 2, units, grid, pattern.canPassThrough);
            const astralDiag = calculateDiagonalMoves(from, 1, units, grid, pattern.canPassThrough);
            return [...astralStraight, ...astralDiag];

        case 'Arcanist':
            // 1 diagonal. If no skill used -> 2 diagonal.
            // We don't have easy access to "has used skill" here without passing more state.
            // For now, let's assume standard 1 diagonal, and maybe the "Enhanced Movement" is a buff applied at start of turn?
            // Or we check `unit.runtime.hasActed`.
            // If unit hasn't acted, maybe show 2? But moving IS acting usually.
            // "If Arcanist did NOT use ability, movement is enhanced".
            // This implies Move is the second action? Or Move is the only action?
            // If I move first, I haven't used ability. So I can move 2?
            // Yes, "can move 2 tiles diagonal, but only in one direction".
            // So if I haven't attacked yet, I can move 2.
            const arcanistRange = unit.runtime?.hasActed ? 1 : 2;
            // Note: hasActed usually includes movement. If I am selecting movement, I haven't moved yet.
            // But "hasActed" might mean "used skill".
            // Let's assume if I am in movement phase, I haven't used skill yet (unless Quick Cast).
            // We'll use range 2 by default if not acted.
            return calculateDiagonalMoves(from, arcanistRange, units, grid, pattern.canPassThrough);

        default:
            // Standard pattern processing
            switch (pattern.type) {
                case 'orthogonal':
                    return calculateOrthogonalMoves(from, pattern.range, units, grid, pattern.canPassThrough);
                case 'diagonal':
                    return calculateDiagonalMoves(from, pattern.range, units, grid, pattern.canPassThrough);
                case 'any':
                    return calculateAnyDirectionMoves(from, pattern.range, units, grid, pattern.canPassThrough);
                case 'custom':
                    if (pattern.customValidator) {
                        const allMoves = calculateAnyDirectionMoves(from, pattern.range, units, grid, pattern.canPassThrough);
                        return allMoves.filter(to => pattern.customValidator!(from, to, units, grid));
                    }
                    return [];
                default:
                    return [];
            }
    }
}

// Helper to check if a move target is valid (empty or passable)
function isValidMove(target: Position, units: any[], grid: any[][], isTeleport = false): boolean {
    if (target.x < 0 || target.x >= 10 || target.y < 0 || target.y >= 10) return false;
    // Check grid obstacles
    if (grid[target.y][target.x].type === 'obstacle') return false;

    // Check unit collision
    const unitAtTarget = units.find(u => u.position.x === target.x && u.position.y === target.y);
    if (unitAtTarget) return false; // Basic check: cannot end on another unit

    return true;
}

function getUnitAt(pos: Position, units: any[]): any | undefined {
    return units.find(u => u.position.x === pos.x && u.position.y === pos.y);
}
