import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Board from './components/Board';
import SkillTree from './components/SkillTree';
import Lobby from './components/Lobby';
import MainMenu from './components/MainMenu';
import Hub from './components/Hub';
import UnitRoster from './components/UnitRoster';
import GameOverModal from './components/GameOverModal';
import TopBar from './components/TopBar';
import SkillBar from './components/SkillBar';
import { UnitInfoPanel } from './components/UnitInfoPanel';
import { PlayerPanel } from './components/PlayerPanel';
import { InitiativeTrack } from './components/InitiativeTrack';
import HowToPlay from './components/HowToPlay';
import { clsx } from 'clsx';
import './index.css';

type Screen = 'menu' | 'hub' | 'battle-local' | 'battle-online' | 'skill-tree' | 'roster' | 'how-to-play';

function App() {
    // @ts-ignore - Temporary ignore until store is fully updated
    const { turn, executeAITurn, gameStatus, gameStats, resetGame } = useGameStore();
    const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

    // Auto-execute AI turn (only in local battle mode)
    useEffect(() => {
        if (currentScreen === 'battle-local' && turn === 'opponent') {
            const timer = setTimeout(() => {
                if (executeAITurn) executeAITurn();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [turn, executeAITurn, currentScreen]);

    // Main Menu
    if (currentScreen === 'menu') {
        return <MainMenu onPlay={() => setCurrentScreen('hub')} onHowToPlay={() => setCurrentScreen('how-to-play')} />;
    }

    // How to Play
    if (currentScreen === 'how-to-play') {
        return <HowToPlay onBack={() => setCurrentScreen('menu')} />;
    }

    // Hub
    if (currentScreen === 'hub') {
        return (
            <Hub
                onNavigate={(destination) => setCurrentScreen(destination)}
                onBack={() => setCurrentScreen('menu')}
            />
        );
    }

    // Skill Tree (full screen)
    if (currentScreen === 'skill-tree') {
        return <SkillTree onBack={() => setCurrentScreen('hub')} />;
    }

    // Multiplayer Lobby
    if (currentScreen === 'battle-online') {
        return (
            <Lobby
                onGameStart={(isHost) => {
                    console.log('Game starting, isHost:', isHost);
                }}
                onBack={() => setCurrentScreen('hub')}
            />
        );
    }

    // Unit Roster
    if (currentScreen === 'roster') {
        return <UnitRoster onBack={() => setCurrentScreen('hub')} />;
    }

    // Local Battle
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full">
                <TopBar
                    onBack={() => setCurrentScreen('hub')}
                    backLabel="Hub"
                    rightContent={
                        <div className="px-4 py-1.5 bg-white/10 rounded-full flex items-center gap-2 border border-white/10">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mr-1">Turn</span>
                            <span className={clsx(
                                "text-sm font-bold",
                                turn === 'player' ? "text-accent-blue" : "text-accent-red"
                            )}>
                                {turn === 'player' ? 'Player' : 'Opponent'}
                            </span>
                        </div>
                    }
                />
            </div>

            {/* Main Content - Board */}
            <div className="w-full max-w-[900px] flex-1 flex items-center justify-center p-4 relative">
                <InitiativeTrack />
                <Board />
                <SkillBar />
                <UnitInfoPanel />
                <PlayerPanel />
            </div>

            {/* Footer Info */}
            <div className="w-full max-w-[900px] mt-6 flex items-center justify-center">
                <div className="flex items-center gap-8 px-8 py-2.5 bg-system-material-thin backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(10,132,255,0.5)]" />
                        <span className="text-[11px] font-medium text-system-label-secondary uppercase tracking-wide">Player Units</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-red shadow-[0_0_8px_rgba(255,69,58,0.5)]" />
                        <span className="text-[11px] font-medium text-system-label-secondary uppercase tracking-wide">Opponent Units</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(48,209,88,0.5)] animate-pulse" />
                        <span className="text-[11px] font-medium text-system-label-secondary uppercase tracking-wide">Valid Moves</span>
                    </div>
                </div>
            </div>

            {/* Game Over Modal */}
            {gameStatus && gameStatus !== 'playing' && (
                <GameOverModal
                    winner={gameStatus === 'player_won' ? 'player' : 'opponent'}
                    stats={gameStats || { turns: 0, damageDealt: 0, unitsLost: 0 }}
                    onRestart={() => {
                        if (resetGame) resetGame();
                    }}
                    onReturnToHub={() => {
                        if (resetGame) resetGame();
                        setCurrentScreen('hub');
                    }}
                />
            )}
        </div>
    );
}

export default App;
