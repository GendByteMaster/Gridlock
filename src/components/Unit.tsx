import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit as UnitType } from '../combat/types';
import { getUnitIcon } from '../utils/unitUtils';
import { clsx } from 'clsx';
import { useGameStore } from '../store/gameStore';

interface UnitProps {
    unit: UnitType;
    isSelected: boolean;
    onClick: () => void;
}

const Unit: React.FC<UnitProps> = ({ unit, isSelected, onClick }) => {
    const isPlayer = unit.owner === 'player';
    const [prevHp, setPrevHp] = useState(unit.stats.hp);
    const [damagePopup, setDamagePopup] = useState<{ value: number, id: number } | null>(null);
    const { targetingSkillId, validMoves } = useGameStore();

    useEffect(() => {
        if (unit.stats.hp < prevHp) {
            const damage = prevHp - unit.stats.hp;
            setDamagePopup({ value: damage, id: Date.now() });
        }
        setPrevHp(unit.stats.hp);
    }, [unit.stats.hp, prevHp]);

    const hpPercentage = (unit.stats.hp / unit.stats.maxHp) * 100;
    const isTarget = targetingSkillId && validMoves.some(p => p.x === unit.pos.x && p.y === unit.pos.y);

    return (
        <motion.div
            layoutId={`unit-${unit.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isSelected ? 1.15 : 1,
                opacity: 1,
                y: isSelected ? -8 : 0,
                x: damagePopup ? [0, -5, 5, -5, 5, 0] : 0,
                zIndex: isSelected ? 50 : 10,
            }}
            exit={{ scale: 0, opacity: 0, filter: 'brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(96%) contrast(113%)' }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8
            }}
            className="relative w-full h-full flex items-center justify-center pointer-events-auto"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* Selection Glow */}
            {isSelected && (
                <motion.div
                    layoutId="selection-glow"
                    className="absolute inset-0 rounded-[24px] bg-accent-blue/30 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            {/* Target Indicator */}
            {isTarget && (
                <motion.div
                    className="absolute -inset-2 rounded-[32px] border-2 border-accent-red/50"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
            )}

            {/* Unit Body (Glass Token) */}
            <div
                className={clsx(
                    "relative w-[85%] h-[85%] rounded-[24px] flex items-center justify-center overflow-hidden transition-all duration-300",
                    "bg-system-material-regular backdrop-blur-xl border border-white/10 shadow-lg",
                    isSelected && "shadow-2xl ring-1 ring-white/20",
                    isPlayer
                        ? "shadow-accent-blue/10"
                        : "shadow-accent-red/10"
                )}
            >
                {/* Inner Gradient Tint */}
                <div className={clsx(
                    "absolute inset-0 opacity-20 bg-gradient-to-br",
                    isPlayer
                        ? "from-accent-blue to-transparent"
                        : "from-accent-red to-transparent"
                )} />

                {/* Icon */}
                <div className={clsx(
                    "relative z-10 transition-colors duration-300",
                    isPlayer ? "text-accent-blue" : "text-accent-red",
                    isSelected && "scale-110"
                )}>
                    {getUnitIcon(unit.type, 32)}
                </div>

                {/* Health Bar (Slim Bottom Curve) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <motion.div
                        className={clsx(
                            "h-full",
                            isPlayer ? "bg-accent-blue" : "bg-accent-red"
                        )}
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

            {/* Damage Popup */}
            <AnimatePresence>
                {damagePopup && (
                    <motion.div
                        key={damagePopup.id}
                        initial={{ opacity: 0, y: -10, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        onAnimationComplete={() => setDamagePopup(null)}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                    >
                        <span className="text-3xl font-display font-bold text-accent-red drop-shadow-lg stroke-black">
                            -{damagePopup.value}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Unit;
