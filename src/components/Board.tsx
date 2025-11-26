import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import Cell from './Cell';
import Unit from './Unit';
import { soundManager } from '../utils/SoundManager';
import { AnimatePresence } from 'framer-motion';

const Board: React.FC = () => {
    const { grid, units, validMoves, selectedUnitId, selectUnit, moveUnit, initializeGame, cursor, moveCursor, setCursor, targetingSkillId, executeSkill, setTargetingMode } = useGameStore();

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleSkillShortcut = (index: number) => {
        if (!selectedUnitId) return;
        const unit = units.find(u => u.id === selectedUnitId);
        if (!unit || !unit.equippedSkills[index]) return;

        const skill = unit.equippedSkills[index];
        const cooldown = unit.cooldowns[skill.id] || 0;

        if (cooldown === 0) {
            const newTargetingMode = targetingSkillId === skill.id ? null : skill.id;
            setTargetingMode(newTargetingMode);
            if (newTargetingMode) {
                soundManager.playSkillSelect();
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    moveCursor(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    moveCursor(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    moveCursor(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    moveCursor(1, 0);
                    break;
                case 'Enter':
                case ' ':
                    handleCellClick(cursor.x, cursor.y);
                    break;
                case 'Escape':
                    if (targetingSkillId) {
                        setTargetingMode(null);
                    } else {
                        selectUnit('');
                    }
                    break;
                case '1':
                    handleSkillShortcut(0);
                    break;
                case '2':
                    handleSkillShortcut(1);
                    break;
                case '3':
                    handleSkillShortcut(2);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cursor, moveCursor, selectedUnitId, validMoves, targetingSkillId, units]);

    const handleCellClick = (x: number, y: number) => {
        if (targetingSkillId && selectedUnitId) {
            // Execute Skill
            const isValidTarget = validMoves.some(m => m.x === x && m.y === y);
            if (isValidTarget) {
                executeSkill(selectedUnitId, targetingSkillId, { x, y });
                soundManager.playSkillExecute();
            }
            return;
        }

        if (selectedUnitId) {
            const isValid = validMoves.some(m => m.x === x && m.y === y);
            if (isValid) {
                moveUnit(selectedUnitId, { x, y });
                soundManager.playMove();
            } else {
                const unit = units.find(u => u.position.x === x && u.position.y === y);
                if (unit) {
                    selectUnit(unit.id);
                    soundManager.playClick();
                } else {
                    selectUnit('');
                }
            }
        } else {
            const unit = units.find(u => u.position.x === x && u.position.y === y);
            if (unit) {
                selectUnit(unit.id);
                soundManager.playClick();
            }
        }
    };

    const handleUnitClick = (unitId: string) => {
        if (targetingSkillId) {
            // Let handleCellClick handle the targeting logic
            const unit = units.find(u => u.id === unitId);
            if (unit) {
                handleCellClick(unit.position.x, unit.position.y);
            }
            return;
        }
        selectUnit(unitId);
    };

    return (
        <div className="relative aspect-square h-[85vh] max-h-[900px] bg-system-material-regular backdrop-blur-2xl p-4 rounded-[32px] shadow-2xl border border-white/10 ring-1 ring-black/50">
            <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden shadow-inner">
                {grid.map((row, y) =>
                    row.map((cell, x) => {
                        const unit = units.find(u => u.position.x === x && u.position.y === y);
                        const isValidMove = validMoves.some(m => m.x === x && m.y === y);
                        const isCursor = cursor.x === x && cursor.y === y;

                        return (
                            <Cell
                                key={`${x}-${y}`}
                                cell={cell}
                                isValidMove={isValidMove}
                                isCursor={isCursor}
                                onClick={() => {
                                    setCursor({ x, y });
                                    handleCellClick(x, y);
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {unit && (() => {
                                        // Adapter: Convert old Unit format to new format
                                        const adaptedUnit = {
                                            ...unit,
                                            pos: unit.position,
                                            base: { hp: unit.maxHp, maxHp: unit.maxHp, atk: 0, def: 0, res: 0, spd: 0, crit: 0, critDmg: 0, acc: 0, eva: 0 },
                                            stats: { hp: unit.hp, maxHp: unit.maxHp, atk: 0, def: 0, res: 0, spd: 0, crit: 0, critDmg: 0, acc: 0, eva: 0, shield: 0 },
                                            statuses: [],
                                            skills: unit.equippedSkills.map(s => s.id),
                                            modules: [],
                                            runtime: { actionsTaken: 0, lastAction: null, hasMoved: false, hasActed: false }
                                        };
                                        return (
                                            <Unit
                                                key={unit.id}
                                                unit={adaptedUnit as any}
                                                isSelected={selectedUnitId === unit.id}
                                                onClick={() => handleUnitClick(unit.id)}
                                            />
                                        );
                                    })()}
                                </AnimatePresence>
                            </Cell>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Board;
