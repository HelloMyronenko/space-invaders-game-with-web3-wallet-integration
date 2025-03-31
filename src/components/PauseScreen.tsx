import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Play, RotateCcw } from 'lucide-react';

const PauseScreen: React.FC = () => {
  const { togglePause, resetGame } = useGameContext();

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 p-8 rounded-lg border-2 border-yellow-600 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-yellow-500">Game Paused</h2>
        
        <div className="space-y-4">
          <button
            onClick={togglePause}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
          >
            <Play size={18} />
            Resume Game
          </button>
          
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
          >
            <RotateCcw size={18} />
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
