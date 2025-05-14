import React from 'react';
import { useGame } from '../context/GameContext';
import StartScreen from './screens/StartScreen';
import BattleScreen from './screens/BattleScreen';
import MapScreen from './screens/MapScreen';
import InventoryScreen from './screens/InventoryScreen';
import VictoryScreen from './screens/VictoryScreen';
import GameOverScreen from './screens/GameOverScreen';
import QuestScreen from './screens/QuestScreen';

const GameContainer: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="w-full max-w-3xl bg-indigo-900 rounded-lg shadow-2xl overflow-hidden border-2 border-indigo-700">
      {state.screen === 'start' && <StartScreen />}
      {state.screen === 'map' && <MapScreen />}
      {state.screen === 'battle' && <BattleScreen />}
      {state.screen === 'inventory' && <InventoryScreen />}
      {state.screen === 'victory' && <VictoryScreen />}
      {state.screen === 'gameOver' && <GameOverScreen />}
      {state.screen === 'quest' && <QuestScreen />}
    </div>
  );
};

export default GameContainer;