import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import PlayerStats from '../ui/PlayerStats';
import IsometricMap from '../ui/IsometricMap';
import { Map, Backpack } from 'lucide-react';
import { generateEnemy } from '../../utils/enemyUtils';
import { generateRandomEvent } from '../../utils/eventUtils';

interface Position {
  x: number;
  y: number;
}

const MapScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 3 }); // Start at castle
  
  const handleTileSelect = (x: number, y: number, type: string) => {
    if (selectedTile?.x === x && selectedTile?.y === y) {
      // Move to the selected tile
      setPlayerPosition({ x, y });
      setSelectedTile(null);
      
      // Generate random event
      const event = generateRandomEvent(state.player.level);
      dispatch({ type: 'TRIGGER_EVENT', payload: event });
      
      // If it's a battle event, customize the enemy based on the terrain
      if (event.type === 'battle') {
        const enemy = generateEnemy(state.player.level);
        
        // Customize enemy based on terrain
        switch (type) {
          case 'mountain':
            enemy.name = `Dragon ${enemy.name}`;
            enemy.attack *= 1.2;
            break;
          case 'crypt':
            enemy.name = `Undead ${enemy.name}`;
            enemy.defense *= 1.2;
            break;
          case 'forest':
            enemy.name = `Wild ${enemy.name}`;
            enemy.maxHealth *= 1.1;
            enemy.health = enemy.maxHealth;
            break;
        }
        
        dispatch({ type: 'START_BATTLE', payload: enemy });
      }
    } else {
      setSelectedTile({ x, y });
    }
  };
  
  const handleOpenInventory = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'inventory' });
  };
  
  const handleStartQuest = () => {
    if (state.quests.length > 0 && !state.currentQuest) {
      dispatch({ type: 'START_QUEST', payload: state.quests[0] });
    }
  };

  const hasAvailableQuests = state.quests.length > 0 && !state.currentQuest;

  return (
    <div className="flex flex-col p-4 min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">World Map</h2>
        <PlayerStats player={state.player} />
      </div>
      
      <div className="flex-1 mb-6">
        {/* Isometric World Map */}
        <div className="bg-indigo-900/80 p-6 rounded-lg border-2 border-indigo-700 mb-4">
          <IsometricMap 
            onTileSelect={handleTileSelect} 
            selectedTile={selectedTile} 
            playerPosition={playerPosition}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`bg-indigo-800/80 ${hasAvailableQuests ? 'hover:bg-indigo-700/80 cursor-pointer' : 'opacity-60 cursor-not-allowed'} transition-colors p-4 rounded-lg border border-indigo-600`} onClick={hasAvailableQuests ? handleStartQuest : undefined}>
            <h4 className="text-yellow-300 font-bold mb-1 flex items-center">
              <Map className="w-4 h-4 mr-2" /> Quest Board
            </h4>
            <p className="text-indigo-200 text-sm">
              {hasAvailableQuests 
                ? `${state.quests.length} quest${state.quests.length !== 1 ? 's' : ''} available` 
                : 'No quests available'}
            </p>
          </div>
          
          <div className="bg-indigo-800/80 hover:bg-indigo-700/80 transition-colors p-4 rounded-lg cursor-pointer border border-indigo-600" onClick={handleOpenInventory}>
            <h4 className="text-blue-300 font-bold mb-1 flex items-center">
              <Backpack className="w-4 h-4 mr-2" /> Inventory
            </h4>
            <p className="text-indigo-200 text-sm">{state.inventory.length} items in your bag</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Button onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: 'start' })} secondary>
          Back to Title
        </Button>
      </div>
    </div>
  );
};

export default MapScreen;