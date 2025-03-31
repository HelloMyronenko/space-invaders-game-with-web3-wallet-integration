import React from 'react';
import { Web3Button } from './components/Web3Button';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';
import { Rocket } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Rocket className="text-green-500" size={28} />
            <h1 className="text-2xl font-bold">Web3 Space Invaders</h1>
          </div>
          <Web3Button />
        </header>
        
        <main>
          <GameProvider>
            <Game />
          </GameProvider>
        </main>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Connect your wallet to play and save your high scores on the blockchain!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
