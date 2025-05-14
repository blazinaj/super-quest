import React from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import { RotateCcw, Home } from 'lucide-react';

const GameOverScreen: React.FC = () => {
  const { dispatch } = useGame();
  
  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  const handleBackToTitle = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'start' });
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[500px] bg-gradient-to-b from-indigo-900 to-indigo-950">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4 animate-pulse">Game Over</h2>
        <p className="text-indigo-200 max-w-sm mb-6">
          Your adventure has come to an end, but legends never truly die. 
          Will you embark on a new journey?
        </p>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleRestart} 
          primary 
          icon={<RotateCcw className="w-4 h-4 mr-2" />}
        >
          Start New Game
        </Button>
        <Button 
          onClick={handleBackToTitle} 
          secondary 
          icon={<Home className="w-4 h-4 mr-2" />}
        >
          Back to Title
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;