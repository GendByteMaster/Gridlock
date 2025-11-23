import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

const TurnTimer: React.FC = () => {
    const { turnTimeRemaining, turnTimeLimit, turn, localPlayer, decrementTurnTime, isMultiplayer } = useGameStore();

    // Only show timer in multiplayer mode
    if (!isMultiplayer) return null;

    const isMyTurn = turn === localPlayer;
    const percentage = (turnTimeRemaining / turnTimeLimit) * 100;
    const isLowTime = turnTimeRemaining <= 10;

    useEffect(() => {
        if (!isMyTurn) return;

        const interval = setInterval(() => {
            decrementTurnTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [isMyTurn, decrementTurnTime]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "px-4 py-2 backdrop-blur-xl rounded-xl border shadow-lg transition-all duration-200",
                isMyTurn
                    ? isLowTime
                        ? "bg-accent-red/20 border-accent-red/30"
                        : "bg-accent-blue/20 border-accent-blue/30"
                    : "bg-white/5 border-white/10"
            )}
        >
            <div className="flex items-center gap-3">
                <Clock
                    size={20}
                    className={clsx(
                        "transition-colors",
                        isMyTurn
                            ? isLowTime
                                ? "text-accent-red"
                                : "text-accent-blue"
                            : "text-system-gray4"
                    )}
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-system-gray4 uppercase tracking-wider">
                            {isMyTurn ? 'Your Turn' : 'Opponent Turn'}
                        </span>
                        <span className={clsx(
                            "text-lg font-bold tabular-nums",
                            isMyTurn
                                ? isLowTime
                                    ? "text-accent-red"
                                    : "text-white"
                                : "text-system-gray4"
                        )}>
                            {turnTimeRemaining}s
                        </span>
                    </div>
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.3 }}
                            className={clsx(
                                "h-full rounded-full",
                                isMyTurn
                                    ? isLowTime
                                        ? "bg-accent-red"
                                        : "bg-accent-blue"
                                    : "bg-system-gray4"
                            )}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TurnTimer;
