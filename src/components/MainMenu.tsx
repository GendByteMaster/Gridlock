import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Info } from 'lucide-react';

interface MainMenuProps {
    onPlay: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay }) => {
    return (
        <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            {/* Animated background grid - Made subtle for new theme */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ willChange: 'transform' }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                        style={{ willChange: 'transform' }}
                        className="mb-6 relative"
                    >
                        <h1 className="text-8xl font-bold text-white tracking-tighter mb-2 drop-shadow-2xl">
                            GRIDLOCK
                        </h1>
                        <div className="absolute -inset-10 bg-blue-500/20 blur-3xl rounded-full -z-10 opacity-50" />
                        <div className="h-1.5 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg text-white/40 tracking-[0.2em] font-medium uppercase"
                    >
                        Tactical Grid Combat
                    </motion.p>
                </div>

                {/* Menu Buttons */}
                <div className="space-y-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ willChange: 'transform' }}
                        onClick={onPlay}
                        className="group w-full py-5 bg-white text-black font-bold text-xl rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-blue-50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Play size={24} fill="black" />
                        PLAY
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ willChange: 'transform' }}
                        className="w-full py-4 bg-gray-900/40 hover:bg-gray-800/60 backdrop-blur-xl border border-white/10 text-white font-medium text-lg rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 hover:border-white/20"
                    >
                        <Settings size={20} className="text-white/60 group-hover:text-white" />
                        Settings
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ willChange: 'transform' }}
                        className="w-full py-4 bg-gray-900/40 hover:bg-gray-800/60 backdrop-blur-xl border border-white/10 text-white font-medium text-lg rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 hover:border-white/20"
                    >
                        <Info size={20} className="text-white/60 group-hover:text-white" />
                        About
                    </motion.button>
                </div>

                {/* Version */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center mt-12"
                >
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/30 font-mono">v0.1.0 Alpha</span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MainMenu;
