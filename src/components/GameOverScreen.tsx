import React from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Trophy } from 'lucide-react';

const GameOverScreen: React.FC = () => {
  const { score, level, resetGame } = useGameContext();

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 p-8 rounded-lg border-2 border-red-600 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-2 text-red-500">Game Over</h2>
        
        <div className="my-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            <span className="text-xl">Final Score: <span className="font-bold">{score}</span></span>
          </div>
          
          <p className="text-gray-400">You reached level {level}</p>
        </div>
        
        <button
          onClick={resetGame}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors mt-4"
        >
          <RotateCcw size={18} />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
