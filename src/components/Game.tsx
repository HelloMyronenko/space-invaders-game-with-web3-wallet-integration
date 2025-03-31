import React, { useRef, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import GameHUD from './GameHUD';
import PauseScreen from './PauseScreen';
import GameOverScreen from './GameOverScreen';

// Game entities
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  points: number;
}

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    gameState, 
    togglePause, 
    incrementScore, 
    decrementLives,
    isConnected
  } = useGameContext();
  
  const [player, setPlayer] = useState<Player>({
    x: 0,
    y: 0,
    width: 40,
    height: 30,
    speed: 5,
    color: '#4ade80'
  });
  
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  
  // Game initialization
  useEffect(() => {
    if (!isConnected) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initialize player position
    setPlayer(prev => ({
      ...prev,
      x: canvas.width / 2 - prev.width / 2,
      y: canvas.height - prev.height - 20
    }));
    
    // Initialize enemies
    createEnemyWave();
    
    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        togglePause();
      }
      
      setKeys(prev => ({ ...prev, [e.key]: true }));
      
      // Shoot with spacebar
      if (e.key === ' ' && gameState === 'playing') {
        shoot();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isConnected, gameState, togglePause]);
  
  // Create a wave of enemies
  const createEnemyWave = () => {
    const newEnemies: Enemy[] = [];
    const rows = 3;
    const enemiesPerRow = 8;
    const enemyWidth = 30;
    const enemyHeight = 30;
    const padding = 20;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < enemiesPerRow; col++) {
        const x = col * (enemyWidth + padding) + padding;
        const y = row * (enemyHeight + padding) + padding + 50;
        
        newEnemies.push({
          x,
          y,
          width: enemyWidth,
          height: enemyHeight,
          speed: 1,
          color: row === 0 ? '#ef4444' : row === 1 ? '#f97316' : '#facc15',
          points: (3 - row) * 10 // Top row worth more points
        });
      }
    }
    
    setEnemies(newEnemies);
  };
  
  // Player shoots a bullet
  const shoot = () => {
    const newBullet: Bullet = {
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7,
      color: '#22d3ee'
    };
    
    setBullets(prev => [...prev, newBullet]);
  };
  
  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || !isConnected) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameLoop = () => {
      if (gameState !== 'playing') return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update player position based on key presses
      setPlayer(prev => {
        let newX = prev.x;
        
        if (keys['ArrowLeft'] && prev.x > 0) {
          newX = prev.x - prev.speed;
        }
        
        if (keys['ArrowRight'] && prev.x < canvas.width - prev.width) {
          newX = prev.x + prev.speed;
        }
        
        return { ...prev, x: newX };
      });
      
      // Update bullets
      setBullets(prev => {
        return prev
          .map(bullet => ({
            ...bullet,
            y: bullet.y - bullet.speed
          }))
          .filter(bullet => bullet.y + bullet.height > 0);
      });
      
      // Update enemies
      setEnemies(prev => {
        // Check if any enemy reached the edge
        let reachedEdge = false;
        let reachedBottom = false;
        
        prev.forEach(enemy => {
          if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            reachedEdge = true;
          }
          
          if (enemy.y + enemy.height >= player.y) {
            reachedBottom = true;
          }
        });
        
        // If enemies reached bottom, player loses a life
        if (reachedBottom) {
          decrementLives();
          return prev.map(enemy => ({
            ...enemy,
            y: enemy.y - 100 // Move enemies back up
          }));
        }
        
        // Move enemies
        return prev.map(enemy => ({
          ...enemy,
          x: reachedEdge 
            ? enemy.x 
            : enemy.x + enemy.speed,
          y: reachedEdge 
            ? enemy.y + 10 
            : enemy.y,
          speed: reachedEdge 
            ? -enemy.speed 
            : enemy.speed
        }));
      });
      
      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        
        setEnemies(prevEnemies => {
          const remainingEnemies = [...prevEnemies];
          
          // Check each bullet against each enemy
          for (let i = remainingBullets.length - 1; i >= 0; i--) {
            const bullet = remainingBullets[i];
            
            for (let j = remainingEnemies.length - 1; j >= 0; j--) {
              const enemy = remainingEnemies[j];
              
              // Check collision
              if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
              ) {
                // Remove bullet and enemy
                remainingBullets.splice(i, 1);
                remainingEnemies.splice(j, 1);
                
                // Increment score
                incrementScore(enemy.points);
                break;
              }
            }
          }
          
          // If all enemies are destroyed, create a new wave
          if (remainingEnemies.length === 0) {
            createEnemyWave();
            return remainingEnemies;
          }
          
          return remainingEnemies;
        });
        
        return remainingBullets;
      });
      
      // Draw player
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Draw bullets
      bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
      
      // Draw enemies
      enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
      
      // Continue game loop
      requestAnimationFrame(gameLoop);
    };
    
    const animationId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [gameState, keys, bullets, enemies, player, isConnected, incrementScore, decrementLives]);
  
  return (
    <div className="relative w-full h-full">
      <GameHUD />
      
      <div className="relative bg-gray-900 rounded-lg border border-green-600 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        
        {gameState === 'paused' && <PauseScreen />}
        {gameState === 'gameOver' && <GameOverScreen />}
        
        {(!isConnected || gameState === 'menu') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gray-900 p-8 rounded-lg border-2 border-green-600 max-w-md w-full text-center">
              <h2 className="text-3xl font-bold mb-6 text-green-500">Space Invaders</h2>
              
              {!isConnected ? (
                <p className="text-xl mb-4">Connect your wallet to play!</p>
              ) : (
                <button
                  onClick={() => gameState === 'menu' && isConnected && togglePause()}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                >
                  Start Game
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Controls: Arrow keys to move, Spacebar to shoot, ESC to pause</p>
      </div>
    </div>
  );
};

export default Game;
