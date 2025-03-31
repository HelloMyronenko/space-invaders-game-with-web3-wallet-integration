import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Heart, Trophy, Zap } from 'lucide-react';

const GameHUD: React.FC = () => {
  const { score, lives, level } = useGameContext();

  return (
    <div className="flex justify-between items-center mb-4 p-3 bg-gray-900 rounded-lg border border-green-600">
      <div className="flex items-center gap-2">
        <Heart className="text-red-500" size={20} />
        <span className="font-bold">{lives}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Trophy className="text-yellow-500" size={20} />
        <span className="font-bold">{score}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Zap className="text-blue-500" size={20} />
        <span className="font-bold">Level {level}</span>
      </div>
    </div>
  );
};

export default GameHUD;
