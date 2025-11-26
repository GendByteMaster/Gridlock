import React from 'react';
import { Cell as CellType } from '../types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CellProps {
    cell: CellType;
    isValidMove: boolean;
    isCursor?: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ cell, isValidMove, isCursor, onClick, children }) => {
    const isDark = (cell.position.x + cell.position.y) % 2 === 1;

    return (
        <div
            className={clsx(
                "relative w-full h-full flex items-center justify-center transition-colors duration-200",
                isDark ? "bg-white/[0.02]" : "bg-transparent",
                isValidMove && "cursor-pointer bg-accent-green/10 hover:bg-accent-green/20 box-border border border-accent-green/30 rounded-lg",
            )}
            onClick={onClick}
        >
            {/* Coordinate Label (Subtle) */}
            <span className={clsx(
                "absolute bottom-1 right-1.5 text-[8px] font-medium select-none transition-opacity duration-300 font-mono",
                isDark ? "text-white/5" : "text-white/[0.02]",
                (isValidMove || isCursor) ? "opacity-0" : "opacity-100"
            )}>
                {String.fromCharCode(65 + cell.position.x)}{10 - cell.position.y}
            </span>

            {/* Valid Move Indicator (Pulsing Dot) */}
            {isValidMove && !children && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-4 h-4 rounded-full bg-accent-green shadow-[0_0_15px_rgba(48,209,88,0.8)]"
                >
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-full h-full rounded-full bg-accent-green"
                    />
                </motion.div>
            )}

            {/* Cursor (Soft Glow Box) */}
            {isCursor && (
                <motion.div
                    layoutId="cursor"
                    className="absolute inset-0 border-2 border-white/40 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <div className="absolute inset-0 bg-white/5 rounded-xl" />
                </motion.div>
            )}

            {children}
        </div>
    );
};

export default Cell;
