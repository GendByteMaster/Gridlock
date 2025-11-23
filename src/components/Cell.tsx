import React from 'react';
import { Cell as CellType } from '../types';
import { clsx } from 'clsx';

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
                "relative w-full h-full flex items-center justify-center transition-all duration-300",
                isDark ? "bg-white/[0.03]" : "bg-transparent",
                isValidMove && "cursor-pointer",
                !isValidMove && "hover:bg-white/[0.02]",
                isCursor && "ring-2 ring-inset ring-white/50 z-10"
            )}
            onClick={onClick}
        >
            {/* Coordinate Label */}
            <span className={clsx(
                "absolute bottom-0.5 right-1 text-[8px] font-medium select-none transition-opacity duration-300",
                isDark ? "text-white/10" : "text-white/5",
                isValidMove ? "opacity-0" : "opacity-100"
            )}>
                {String.fromCharCode(65 + cell.position.x)}{10 - cell.position.y}
            </span>

            {isValidMove && (
                <div className="absolute w-3 h-3 bg-accent-green rounded-full shadow-[0_0_8px_rgba(48,209,88,0.6)] animate-pulse" />
            )}

            {isCursor && (
                <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white rounded-tl-sm" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white rounded-tr-sm" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white rounded-bl-sm" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white rounded-br-sm" />
                </>
            )}

            {children}
        </div>
    );
};

export default Cell;
