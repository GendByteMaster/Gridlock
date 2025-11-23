import React from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';

interface TopBarProps {
    onBack?: () => void;
    backLabel?: string;
    rightContent?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ onBack, backLabel = 'Back', rightContent }) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            {onBack ? (
                <button
                    onClick={() => {
                        soundManager.playClick();
                        onBack();
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    {backLabel}
                </button>
            ) : (
                <div className="w-20" /> // Spacer
            )}

            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(48,209,88,0.6)]" />
                <span className="text-white font-bold text-lg tracking-widest">GRIDLOCK</span>
            </div>

            <div className="flex items-center gap-4">
                {rightContent}

                <div className="h-6 w-px bg-white/10" />

                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <RotateCw size={18} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
