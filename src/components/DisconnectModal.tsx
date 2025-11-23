import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Clock } from 'lucide-react';

interface DisconnectModalProps {
    onWait: () => void;
    onForfeit: () => void;
}

const DisconnectModal: React.FC<DisconnectModalProps> = ({ onWait, onForfeit }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-8 bg-system-gray1/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
            >
                {/* Icon */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-yellow/20 flex items-center justify-center"
                    >
                        <WifiOff size={40} className="text-accent-yellow" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white mb-2">
                        Opponent Disconnected
                    </h2>

                    <p className="text-system-gray4">
                        Your opponent has lost connection to the game.
                    </p>
                </div>

                {/* Info */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 text-sm text-system-gray4">
                        <Clock size={16} />
                        <span>Waiting for reconnection...</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onWait}
                        className="flex-1 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white font-medium rounded-xl transition-colors"
                    >
                        Wait
                    </button>
                    <button
                        onClick={onForfeit}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors"
                    >
                        Return to Hub
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default DisconnectModal;
