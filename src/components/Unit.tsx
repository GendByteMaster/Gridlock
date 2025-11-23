import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit as UnitType } from '../types';
import { getUnitIcon } from '../utils/unitUtils';
import { clsx } from 'clsx';

interface UnitProps {
    unit: UnitType;
    isSelected: boolean;
    onClick: () => void;
}

const Unit: React.FC<UnitProps> = ({ unit, isSelected, onClick }) => {
    const isPlayer = unit.owner === 'player';
    const [prevHp, setPrevHp] = useState(unit.hp);
    const [damagePopup, setDamagePopup] = useState<{ value: number, id: number } | null>(null);

    useEffect(() => {
        if (unit.hp < prevHp) {
            const damage = prevHp - unit.hp;
            setDamagePopup({ value: damage, id: Date.now() });
        }
        setPrevHp(unit.hp);
    }, [unit.hp]);



    const hpPercentage = (unit.hp / unit.maxHp) * 100;

    return (
        <motion.div
            layoutId={`unit-${unit.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isSelected ? 1.1 : 1,
                opacity: 1,
                y: isSelected ? -5 : 0,
                x: damagePopup ? [0, -5, 5, -5, 5, 0] : 0, // Shake effect
            }}
            exit={{ scale: 0, opacity: 0, filter: 'brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(96%) contrast(113%)' }} // Red flash on death
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full h-full flex items-center justify-center z-10 pointer-events-auto"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* Selection Ring */}
            {isSelected && (
                <motion.div
                    layoutId="selection-ring"
                    className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    transition={{ duration: 0.2 }}
                />
            )}

            {/* Unit Body */}
            <div
                className={clsx(
                    "w-4/5 h-4/5 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md border transition-colors duration-300",
                    isPlayer
                        ? "bg-accent-blue/20 border-accent-blue/50 text-accent-blue"
                        : "bg-accent-red/20 border-accent-red/50 text-accent-red",
                    isSelected && "bg-opacity-40"
                )}
            >
                {getUnitIcon(unit.type)}
            </div>

            {/* Damage Popup */}
            <AnimatePresence>
                {damagePopup && (
                    <motion.div
                        key={damagePopup.id}
                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -30, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        onAnimationComplete={() => setDamagePopup(null)}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-xl z-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    >
                        -{damagePopup.value}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Health Bar */}
            <div className="absolute -bottom-2 w-full px-1">
                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm relative">
                    {/* Ghost Bar (Delayed) */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    />
                    {/* Main Bar */}
                    <motion.div
                        className={clsx(
                            "absolute top-0 left-0 h-full rounded-full z-10",
                            isPlayer ? "bg-accent-blue" : "bg-accent-red"
                        )}
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

        </motion.div>
    );
};

export default Unit;
