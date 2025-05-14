import React from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import { Play, Scroll } from 'lucide-react';

const StartScreen: React.FC = () => {
  const { dispatch } = useGame();

  const handleStartGame = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'map' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[500px] bg-gradient-to-b from-indigo-900 to-indigo-950">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-4">Begin Your Adventure</h2>
        <p className="text-indigo-200 max-w-md mb-6">
          Embark on an epic journey through forgotten realms, battle fearsome creatures, 
          complete challenging quests, and become a legendary hero!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-lg mx-auto mb-8">
          <div className="bg-indigo-800 p-3 rounded-lg border border-indigo-600">
            <h3 className="text-yellow-200 font-bold mb-1">Combat</h3>
            <p className="text-indigo-200 text-sm">Turn-based battles against monsters and villains</p>
          </div>
          <div className="bg-indigo-800 p-3 rounded-lg border border-indigo-600">
            <h3 className="text-yellow-200 font-bold mb-1">Quests</h3>
            <p className="text-indigo-200 text-sm">Complete missions to earn rewards and fame</p>
          </div>
          <div className="bg-indigo-800 p-3 rounded-lg border border-indigo-600">
            <h3 className="text-yellow-200 font-bold mb-1">Treasures</h3>
            <p className="text-indigo-200 text-sm">Find powerful items to aid in your journey</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={handleStartGame} primary icon={<Play className="w-4 h-4 mr-2" />}>
          Begin Quest
        </Button>
        <Button onClick={() => {}} secondary icon={<Scroll className="w-4 h-4 mr-2" />}>
          How to Play
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;