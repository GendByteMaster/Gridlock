import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getUnitIcon } from '../utils/unitUtils';

export const InitiativeTrack: React.FC = () => {
    const { turnOrder, units, activeUnitId } = useGameStore();

    // Debug logging
    useEffect(() => {
        console.log('InitiativeTrack - turnOrder:', turnOrder);
        console.log('InitiativeTrack - units count:', units?.length);
        console.log('InitiativeTrack - activeUnitId:', activeUnitId);
    }, [turnOrder, units, activeUnitId]);

    // Show placeholder if no turn order yet
    if (!turnOrder || turnOrder.length === 0) {
        return (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    Initializing Turn Order...
                </div>
            </div>
        );
    }

    // Map IDs to unit objects
    const trackUnits = turnOrder.map(id => units.find(u => u.id === id)).filter(Boolean);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mr-2">
                Turn Order
            </div>

            <div className="flex items-center gap-2">
                <AnimatePresence mode='popLayout'>
                    {trackUnits.map((unit, index) => {
                        if (!unit) return null;
                        const isNext = index === 0;

                        return (
                            <motion.div
                                key={`${unit.id}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale: isNext ? 1.2 : 1,
                                    x: 0,
                                    borderColor: unit.owner === 'player' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'
                                }}
                                exit={{ opacity: 0, scale: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`
                                    relative flex items-center justify-center rounded-full border-2 
                                    ${isNext ? 'w-12 h-12 z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'w-8 h-8 opacity-80'}
                                    ${unit.owner === 'player' ? 'bg-blue-900/50 border-blue-500/30' : 'bg-red-900/50 border-red-500/30'}
                                `}
                            >
                                <div className="w-full h-full p-1">
                                    {getUnitIcon(unit.type, isNext ? 24 : 16)}
                                </div>

                                {isNext && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
