import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Info, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';

interface MainMenuProps {
    onPlay: () => void;
    onHowToPlay: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onHowToPlay }) => {
    return (
        <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-like spring
                className="relative z-10 w-full max-w-sm flex flex-col items-center"
            >
                {/* Logo */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 relative"
                    >
                        <h1 className="text-7xl font-display font-bold text-white tracking-tight mb-2 drop-shadow-2xl">
                            GRIDLOCK
                        </h1>
                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-accent-blue to-transparent rounded-full opacity-80" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-sm text-system-label-secondary tracking-[0.2em] font-medium uppercase"
                    >
                        Tactical Grid Combat
                    </motion.p>
                </div>

                {/* Menu Buttons */}
                <div className="w-full space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full h-14 text-lg shadow-xl shadow-accent-blue/20"
                            onClick={onPlay}
                            leftIcon={<Play size={20} fill="currentColor" />}
                        >
                            Play Game
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button
                            variant="glass"
                            size="lg"
                            className="w-full h-14 text-lg"
                            onClick={onHowToPlay}
                            leftIcon={<BookOpen size={20} />}
                        >
                            How to Play
                        </Button>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <Button
                                variant="glass"
                                size="md"
                                className="w-full"
                                leftIcon={<Settings size={18} />}
                            >
                                Settings
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                        >
                            <Button
                                variant="glass"
                                size="md"
                                className="w-full"
                                leftIcon={<Info size={18} />}
                            >
                                About
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Version */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12"
                >
                    <span className="px-3 py-1 rounded-full bg-system-fill-tertiary text-[10px] text-system-label-tertiary font-mono border border-white/5">
                        v0.1.0 Alpha
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MainMenu;
