import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Move, Zap, Skull, Shield, Activity } from 'lucide-react';

export const MoveHistory: React.FC = () => {
    const { combatLogs } = useGameStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [combatLogs]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'move': return <Move size={12} />;
            case 'skill': return <Zap size={12} />;
            case 'damage': return <Activity size={12} />;
            case 'death': return <Skull size={12} />;
            case 'heal': return <Activity size={12} className="text-green-400" />;
            default: return <Shield size={12} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'move': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'skill': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'damage': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'death': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            case 'heal': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-white/5 text-white/60 border-white/10';
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Combat Log</h3>
                <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{combatLogs.length}</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2"
            >
                <AnimatePresence initial={false}>
                    {combatLogs.length === 0 ? (
                        <div className="text-center py-8 opacity-30">
                            <div className="text-2xl mb-2">📜</div>
                            <div className="text-xs">No actions recorded</div>
                        </div>
                    ) : (
                        combatLogs.map((log, index) => (
                            <motion.div
                                key={`${log.timestamp}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-2.5 rounded-lg border backdrop-blur-sm text-xs flex items-start gap-2.5 ${getColor(log.type)}`}
                            >
                                <div className="mt-0.5 opacity-80">
                                    {getIcon(log.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white/90 leading-relaxed">
                                        {log.text}
                                    </div>
                                    <div className="text-[10px] opacity-50 mt-1 font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
