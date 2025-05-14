import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import BattleLog from '../ui/BattleLog';
import { Map, Repeat } from 'lucide-react';

const VictoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  // Add victory sound effect
  useEffect(() => {
    // Here we would play a victory sound if we had audio capabilities
  }, []);
  
  const handleContinue = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'map' });
  };
  
  const handleFightAgain = () => {
    dispatch({ type: 'START_BATTLE' });
  };
  
  return (
    <div className="flex flex-col items-center p-6 min-h-[500px] bg-gradient-to-b from-indigo-900 to-indigo-950">
      <div className="text-center mb-8 animate-bounce">
        <h2 className="text-3xl font-bold text-yellow-300 mb-2">Victory!</h2>
      </div>
      
      <div className="w-full max-w-md bg-indigo-800/60 rounded-lg p-4 mb-6">
        <BattleLog messages={state.battleLog} />
      </div>
      
      <div className="w-full max-w-md bg-indigo-800/60 rounded-lg p-4 mb-8">
        <h3 className="text-yellow-200 font-bold mb-2">Player Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-indigo-200">
          <div>Level: <span className="text-green-300 font-bold">{state.player.level}</span></div>
          <div>Health: <span className="text-green-300 font-bold">{state.player.health}/{state.player.maxHealth}</span></div>
          <div>Experience: <span className="text-blue-300 font-bold">{state.player.experience}/{state.player.experienceToNextLevel}</span></div>
          <div>Gold: <span className="text-yellow-300 font-bold">{state.player.gold}</span></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={handleContinue} 
          primary 
          icon={<Map className="w-4 h-4 mr-2" />}
        >
          Return to Map
        </Button>
        <Button 
          onClick={handleFightAgain} 
          secondary 
          icon={<Repeat className="w-4 h-4 mr-2" />}
        >
          Fight Another Enemy
        </Button>
      </div>
    </div>
  );
};

export default VictoryScreen;