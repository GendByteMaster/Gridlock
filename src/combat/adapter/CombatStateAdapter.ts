import { Unit as EngineUnit, UnitRuntime, ElementalResistances } from '../types';
import { Unit as UIUnit } from '../../types';

/**
 * Combat State Adapter
 * 
 * Converts between CombatEngine's internal Unit format and the UI's Unit format.
 * Handles serialization/deserialization for save/load functionality.
 */

/**
 * Convert UI Unit to Engine Unit
 * Adds runtime state, modules, and other combat-specific properties
 * 
 * @param uiUnit - Unit from UI/gameStore
 * @returns Engine-compatible unit
 */
export const toEngineUnit = (uiUnit: UIUnit): EngineUnit => {
    // Create default runtime state
    const runtime: UnitRuntime = {
        initiative: Math.random() * 100,
        cooldowns: {},
        isStunned: false,
        isFrozen: false,
        isSilenced: false,
        isRooted: false,
        isSleeping: false,
        isCharmed: false,
        actionPoints: 1,
        movePoints: 1,
        comboCount: 0,
        hasActed: false,
        hasMoved: false,
        isReacting: false,
        lastActionTimestamp: 0
    };

    // Create default resistances if not present
    const resistances: ElementalResistances = {
        fire: 0,
        frost: 0,
        lightning: 0,
        poison: 0,
        arcane: 0,
        void: 0
    };

    // Convert to engine unit
    // Legacy UIUnit has hp/maxHp at root, not in stats object
    const hp = uiUnit.hp;
    const maxHp = uiUnit.maxHp;

    const engineUnit: EngineUnit = {
        id: uiUnit.id,
        owner: uiUnit.owner,
        type: uiUnit.type,
        level: 1, // Default level

        // Base stats (derived from UI unit + defaults)
        base: {
            maxHp: maxHp,
            hp: hp,
            atk: 10, // Default
            def: 5,  // Default
            res: 5,  // Default
            spd: 10, // Default
            crit: 0.05,
            critDmg: 1.5,
            acc: 1.0,
            eva: 0,
            penetration: 0,
            lifesteal: 0
        },

        // Current stats (derived from UI unit + defaults)
        stats: {
            hp: hp,
            maxHp: maxHp,
            atk: 10, // Default
            def: 5,  // Default
            res: 5,  // Default
            spd: 10, // Default
            crit: 0.05,
            critDmg: 1.5,
            acc: 1.0,
            eva: 0,
            shield: 0,
            barrier: 0,
            penetration: 0,
            lifesteal: 0
        },

        resistances,

        // Position
        pos: uiUnit.position, // UIUnit uses 'position', Engine uses 'pos'

        // Skills (convert from UI skill objects to IDs)
        skills: uiUnit.equippedSkills ? uiUnit.equippedSkills.map(s => s.id) : [],

        // Statuses (empty by default)
        statuses: [],

        // Modules (empty by default)
        modules: [],

        // Runtime state
        runtime
    };

    return engineUnit;
};

/**
 * Convert Engine Unit to UI Unit
 * Strips combat-specific properties for UI consumption
 * 
 * @param engineUnit - Unit from CombatEngine
 * @returns UI-compatible unit
 */
export const toUIUnit = (engineUnit: EngineUnit): UIUnit => {
    const uiUnit: UIUnit = {
        id: engineUnit.id,
        owner: engineUnit.owner,
        type: engineUnit.type,

        // Position
        position: engineUnit.pos,

        // Stats (simplified for UI)
        hp: engineUnit.stats.hp,
        maxHp: engineUnit.stats.maxHp,

        // Skills
        equippedSkills: [], // We'd need to map IDs back to SkillNodes, but for now empty or placeholder
        cooldowns: engineUnit.runtime.cooldowns
    };

    return uiUnit;
};

/**
 * Serialize combat state to JSON
 * For save/load functionality
 * 
 * @param units - Engine units
 * @param grid - Game grid
 * @param turn - Current turn
 * @returns JSON string
 */
export const serializeCombatState = (
    units: EngineUnit[],
    grid: any[][],
    turn: number
): string => {
    const state = {
        version: '3.0',
        timestamp: Date.now(),
        turn,
        units: units.map(u => ({
            id: u.id,
            owner: u.owner,
            type: u.type,
            level: u.level,
            pos: u.pos,
            stats: u.stats,
            base: u.base,
            resistances: u.resistances,
            skills: u.skills,
            statuses: u.statuses,
            modules: u.modules?.map(m => m.id) || [],
            runtime: u.runtime
        })),
        grid: grid.map(row => row.map(cell => ({
            terrain: cell.terrain || 'normal',
            isOccupied: cell.isOccupied || false
        })))
    };

    return JSON.stringify(state, null, 2);
};

/**
 * Deserialize combat state from JSON
 * For save/load functionality
 * 
 * @param json - JSON string
 * @returns Deserialized state or null if invalid
 */
export const deserializeCombatState = (json: string): {
    units: EngineUnit[];
    grid: any[][];
    turn: number;
} | null => {
    try {
        const state = JSON.parse(json);

        // Validate version
        if (state.version !== '3.0') {
            console.warn('Incompatible save version:', state.version);
            return null;
        }

        // Reconstruct units
        const units: EngineUnit[] = state.units.map((u: any) => ({
            id: u.id,
            owner: u.owner,
            type: u.type,
            level: u.level || 1,
            pos: u.pos,
            stats: u.stats,
            base: u.base,
            resistances: u.resistances,
            skills: u.skills,
            statuses: u.statuses || [],
            modules: [], // Modules would need to be reconstructed from registry
            runtime: u.runtime
        }));

        return {
            units,
            grid: state.grid,
            turn: state.turn
        };
    } catch (error) {
        console.error('Failed to deserialize combat state:', error);
        return null;
    }
};

/**
 * Sync engine state to UI state
 * Updates only the necessary UI properties
 * 
 * @param engineUnits - Units from CombatEngine
 * @param uiUnits - Units in gameStore
 * @returns Updated UI units
 */
export const syncEngineToUI = (
    engineUnits: EngineUnit[],
    uiUnits: UIUnit[]
): UIUnit[] => {
    return engineUnits.map(engineUnit => {
        // Find corresponding UI unit
        const existingUIUnit = uiUnits.find(u => u.id === engineUnit.id);

        if (existingUIUnit) {
            // Update existing UI unit
            return {
                ...existingUIUnit,
                position: engineUnit.pos,
                hp: engineUnit.stats.hp,
                maxHp: engineUnit.stats.maxHp,
                cooldowns: engineUnit.runtime.cooldowns
            };
        } else {
            // Create new UI unit
            return toUIUnit(engineUnit);
        }
    });
};

/**
 * Create a minimal UI state update
 * Only includes changed properties for efficient updates
 * 
 * @param oldUnit - Previous UI unit
 * @param newUnit - New engine unit
 * @returns Partial UI unit with only changes
 */
export const createDeltaUpdate = (
    oldUnit: UIUnit,
    newUnit: EngineUnit
): Partial<UIUnit> => {
    const delta: Partial<UIUnit> = {};

    // Check position
    if (oldUnit.position.x !== newUnit.pos.x || oldUnit.position.y !== newUnit.pos.y) {
        delta.position = newUnit.pos;
    }

    // Check stats
    if (oldUnit.hp !== newUnit.stats.hp) {
        delta.hp = newUnit.stats.hp;
    }
    if (oldUnit.maxHp !== newUnit.stats.maxHp) {
        delta.maxHp = newUnit.stats.maxHp;
    }

    // Check cooldowns (simplified check)
    if (JSON.stringify(oldUnit.cooldowns) !== JSON.stringify(newUnit.runtime.cooldowns)) {
        delta.cooldowns = newUnit.runtime.cooldowns;
    }

    return delta;
};

/**
 * Batch convert UI units to engine units
 * 
 * @param uiUnits - Array of UI units
 * @returns Array of engine units
 */
export const batchToEngineUnits = (uiUnits: UIUnit[]): EngineUnit[] => {
    return uiUnits.map(toEngineUnit);
};

/**
 * Batch convert engine units to UI units
 * 
 * @param engineUnits - Array of engine units
 * @returns Array of UI units
 */
export const batchToUIUnits = (engineUnits: EngineUnit[]): UIUnit[] => {
    return engineUnits.map(toUIUnit);
};

/**
 * Validate combat state
 * Ensures state is valid before loading
 * 
 * @param state - Combat state to validate
 * @returns True if valid
 */
export const validateCombatState = (state: any): boolean => {
    if (!state || typeof state !== 'object') return false;
    if (!state.version || !state.units || !state.grid) return false;
    if (!Array.isArray(state.units) || !Array.isArray(state.grid)) return false;

    // Validate units
    for (const unit of state.units) {
        if (!unit.id || !unit.owner || !unit.type) return false;
        if (!unit.pos || typeof unit.pos.x !== 'number' || typeof unit.pos.y !== 'number') return false;
        if (!unit.stats || !unit.base) return false;
    }

    return true;
};

/**
 * Create a snapshot of UI state
 * For undo/redo in UI
 * 
 * @param uiUnits - UI units
 * @param grid - Game grid
 * @returns Snapshot object
 */
export const createUISnapshot = (uiUnits: UIUnit[], grid: any[][]): {
    units: UIUnit[];
    grid: any[][];
    timestamp: number;
} => {
    return {
        units: JSON.parse(JSON.stringify(uiUnits)),
        grid: JSON.parse(JSON.stringify(grid)),
        timestamp: Date.now()
    };
};

/**
 * Restore UI state from snapshot
 * 
 * @param snapshot - UI snapshot
 * @returns Restored units and grid
 */
export const restoreUISnapshot = (snapshot: {
    units: UIUnit[];
    grid: any[][];
    timestamp: number;
}): {
    units: UIUnit[];
    grid: any[][];
} => {
    return {
        units: JSON.parse(JSON.stringify(snapshot.units)),
        grid: JSON.parse(JSON.stringify(snapshot.grid))
    };
};
