import React from 'react';
import { Player } from '../../types/gameTypes';
import HealthBar from './HealthBar';

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  // Calculate experience percentage
  const expPercentage = (player.experience / player.experienceToNextLevel) * 100;
  
  return (
    <div className="bg-indigo-800/60 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {player.level}
        </div>
        <div>
          <h3 className="text-green-300 font-bold">{player.name}</h3>
          <div className="text-yellow-200 text-sm">{player.gold} Gold</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Health bar */}
        <HealthBar current={player.health} max={player.maxHealth} />
        
        {/* Experience bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>EXP</span>
            <span>{player.experience}/{player.experienceToNextLevel}</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-width duration-300 ease-out" 
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;