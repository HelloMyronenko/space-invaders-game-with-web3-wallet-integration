import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

// Game state types
type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

interface GameContextType {
  score: number;
  lives: number;
  level: number;
  gameState: GameState;
  isConnected: boolean;
  startGame: () => void;
  togglePause: () => void;
  resetGame: () => void;
  incrementScore: (points: number) => void;
  decrementLives: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('menu');
  
  const { isConnected } = useAccount();

  // Reset game state when wallet disconnects
  useEffect(() => {
    if (!isConnected && gameState !== 'menu') {
      setGameState('menu');
      resetGame();
    }
  }, [isConnected, gameState]);

  const startGame = useCallback(() => {
    if (isConnected) {
      setGameState('playing');
    }
  }, [isConnected]);

  const togglePause = useCallback(() => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState('menu');
  }, []);

  const incrementScore = useCallback((points: number) => {
    setScore(prev => prev + points);
    
    // Level up every 1000 points
    if (Math.floor((score + points) / 1000) > Math.floor(score / 1000)) {
      setLevel(prev => prev + 1);
    }
  }, [score]);

  const decrementLives = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameOver');
      }
      return newLives;
    });
  }, []);

  const value = {
    score,
    lives,
    level,
    gameState,
    isConnected,
    startGame,
    togglePause,
    resetGame,
    incrementScore,
    decrementLives,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
