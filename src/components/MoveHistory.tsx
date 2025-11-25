import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Move, Target, Sword, Zap, ArrowRight } from 'lucide-react';

export const MoveHistory: React.FC = () => {
    const { moveHistory, units } = useGameStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moveHistory]);

    const getUnitName = (unitId: string) => {
        const unit = units.find(u => u.id === unitId);
        return unit ? unit.type : 'Unknown Unit';
    };

    const formatCoordinate = (pos: { x: number, y: number }) => {
        const col = String.fromCharCode(65 + pos.x); // A, B, C...
        const row = pos.y + 1; // 1, 2, 3...
        return `${col}${row}`;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Combat Log</h3>
                <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{moveHistory.length}</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2"
            >
                <AnimatePresence initial={false}>
                    {moveHistory.length === 0 ? (
                        <div className="text-center py-8 opacity-30">
                            <div className="text-2xl mb-2">📜</div>
                            <div className="text-xs">No actions recorded</div>
                        </div>
                    ) : (
                        moveHistory.map((move, index) => (
                            <motion.div
                                key={`${move.timestamp}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-xl border backdrop-blur-sm text-xs ${move.player === 'player'
                                        ? 'bg-blue-500/5 border-blue-500/10'
                                        : 'bg-red-500/5 border-red-500/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1.5 opacity-60">
                                    <span className="font-mono text-[10px] uppercase tracking-wider">Turn {move.turn}</span>
                                    <span className="text-[10px]">{new Date(move.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <div className={`mt-0.5 p-1 rounded-md ${move.actionType === 'move' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                                        }`}>
                                        {move.actionType === 'move' ? <Move size={12} /> : <Zap size={12} />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-bold text-white/90 mb-0.5">
                                            {getUnitName(move.unitId)}
                                        </div>

                                        <div className="text-white/60 flex items-center gap-1.5 flex-wrap">
                                            {move.actionType === 'move' ? (
                                                <>
                                                    <span>Moved</span>
                                                    <span className="font-mono text-white/80 bg-white/5 px-1 rounded">{formatCoordinate(move.from)}</span>
                                                    <ArrowRight size={10} />
                                                    <span className="font-mono text-white/80 bg-white/5 px-1 rounded">{formatCoordinate(move.to)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Used</span>
                                                    <span className="text-orange-300 font-medium">{move.skillId}</span>
                                                    {move.targetId && (
                                                        <>
                                                            <span>on</span>
                                                            <span className="text-red-300 font-medium">{getUnitName(move.targetId)}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
