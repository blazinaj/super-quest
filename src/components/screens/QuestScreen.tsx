import React from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import { ArrowLeft, Swords, CheckCircle } from 'lucide-react';

const QuestScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { currentQuest } = state;
  
  if (!currentQuest) {
    return null;
  }
  
  const handleStartBattle = () => {
    if (currentQuest.enemyToDefeat) {
      dispatch({ type: 'START_BATTLE', payload: currentQuest.enemyToDefeat });
    }
  };
  
  const handleCompleteQuest = () => {
    dispatch({ type: 'COMPLETE_QUEST' });
  };
  
  return (
    <div className="flex flex-col p-4 min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Quest: {currentQuest.name}</h2>
        <div className="flex items-center">
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${
            currentQuest.difficulty === 'easy' 
              ? 'bg-green-700 text-green-100' 
              : currentQuest.difficulty === 'medium'
                ? 'bg-yellow-700 text-yellow-100'
                : 'bg-red-700 text-red-100'
          }`}>
            {currentQuest.difficulty.toUpperCase()}
          </span>
          <span className="text-indigo-200">
            Rewards: {currentQuest.expReward} XP, {currentQuest.goldReward} Gold
          </span>
        </div>
      </div>
      
      <div className="flex-1 mb-6">
        <div className="bg-indigo-800/40 p-4 rounded-lg mb-4">
          <h3 className="text-yellow-200 text-lg font-bold mb-2">Description</h3>
          <p className="text-indigo-200 mb-4">{currentQuest.description}</p>
          <div className="bg-indigo-700/40 p-3 rounded border border-indigo-600">
            <h4 className="text-yellow-100 font-bold mb-1">Objective:</h4>
            <p className="text-indigo-200">{currentQuest.objective}</p>
          </div>
        </div>
        
        {currentQuest.enemyToDefeat && (
          <div className="bg-indigo-800/40 p-4 rounded-lg">
            <h3 className="text-yellow-200 text-lg font-bold mb-2">Enemy to Defeat</h3>
            <div className="bg-indigo-700/80 p-3 rounded-lg border border-indigo-600 flex items-center">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold mr-3">
                Enemy
              </div>
              <div className="flex-1">
                <h4 className="text-red-300 font-bold">{currentQuest.enemyToDefeat.name}</h4>
                <p className="text-indigo-200 text-sm">Level {currentQuest.enemyToDefeat.level}</p>
              </div>
              <Button 
                onClick={handleStartBattle} 
                primary 
                icon={<Swords className="w-4 h-4 mr-1" />}
              >
                Fight
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto flex justify-between">
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: 'map' })} 
          secondary 
          icon={<ArrowLeft className="w-4 h-4 mr-1" />}
        >
          Back to Map
        </Button>
        
        {currentQuest.completed && (
          <Button 
            onClick={handleCompleteQuest} 
            primary 
            icon={<CheckCircle className="w-4 h-4 mr-1" />}
          >
            Complete Quest
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestScreen;