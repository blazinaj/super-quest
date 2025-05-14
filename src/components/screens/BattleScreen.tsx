import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import HealthBar from '../ui/HealthBar';
import BattleLog from '../ui/BattleLog';
import Sprite from '../ui/Sprite';
import { Sword, Shield, Option as Potion, Map } from 'lucide-react';

const BattleScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, currentEnemy, battleLog } = state;
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAction, setCurrentAction] = useState<'attack' | 'defend' | 'heal' | 'idle' | 'victory'>('idle');
  const [showVictory, setShowVictory] = useState(false);

  const getEnemyType = (enemyName: string) => {
    if (enemyName.toLowerCase().includes('goblin')) return 'goblin';
    if (enemyName.toLowerCase().includes('dragon')) return 'dragon';
    if (enemyName.toLowerCase().includes('skeleton') || enemyName.toLowerCase().includes('undead')) return 'skeleton';
    return 'default';
  };

  useEffect(() => {
    if (!currentEnemy) {
      dispatch({ type: 'CHANGE_SCREEN', payload: 'map' });
    }
  }, [currentEnemy, dispatch]);

  const handleAttack = () => {
    if (!playerTurn || isAnimating || !currentEnemy) return;
    
    setIsAnimating(true);
    setCurrentAction('attack');
  };

  const handleDefend = () => {
    if (!playerTurn || isAnimating) return;
    setIsAnimating(true);
    setCurrentAction('defend');
    setTimeout(() => {
      setPlayerTurn(false);
      setIsAnimating(false);
      setCurrentAction('idle');
    }, 1000);
  };

  useEffect(() => {
    if (!playerTurn && currentEnemy && currentEnemy.health > 0) {
      const enemyAttackTimer = setTimeout(() => {
        setIsAnimating(true);
        setCurrentAction('attack');
      }, 1000);
      
      return () => clearTimeout(enemyAttackTimer);
    }
  }, [playerTurn, currentEnemy, dispatch]);

  const handleVictoryTransition = () => {
    setIsAnimating(true);
    setCurrentAction('victory');
    setTimeout(() => {
      dispatch({ type: 'CHANGE_SCREEN', payload: 'victory' });
    }, 2000); // Show victory animation for 2 seconds
  };

  const handleAnimationComplete = () => {
    if (playerTurn) {
      if (currentAction === 'attack') {
        dispatch({ type: 'PLAYER_ATTACK' });
        // Check if enemy is defeated
        if (currentEnemy && currentEnemy.health <= damage) {
          setShowVictory(true);
          handleVictoryTransition();
          return;
        }
      }
      setTimeout(() => {
        setIsAnimating(false);
        setPlayerTurn(false);
        setCurrentAction('idle');
      }, 300);
    } else {
      if (currentAction === 'attack') {
        dispatch({ type: 'ENEMY_ATTACK' });
      }
      setTimeout(() => {
        setIsAnimating(false);
        setPlayerTurn(true);
        setCurrentAction('idle');
      }, 300);
    }
  };

  const handleUsePotion = () => {
    if (!playerTurn || isAnimating) return;
    
    const healthPotion = state.inventory.find(item => 
      item.type === 'consumable' && item.effect === 'heal'
    );
    
    if (healthPotion) {
      setIsAnimating(true);
      setCurrentAction('heal');
      setTimeout(() => {
        dispatch({ type: 'USE_ITEM', payload: healthPotion });
        setIsAnimating(false);
        setPlayerTurn(false);
        setCurrentAction('idle');
      }, 1000);
    }
  };

  const handleFlee = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'map' });
  };

  if (!currentEnemy) return null;

  const damage = Math.max(1, state.player.attack - currentEnemy.defense);

  return (
    <div className="flex flex-col p-4 min-h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-800/60 p-4 rounded-lg order-2 md:order-1">
          <h3 className="text-yellow-300 text-lg font-bold mb-2">{currentEnemy.name}</h3>
          <div className="h-48 mb-3 flex items-center justify-center">
            <Sprite 
              type="enemy"
              enemyType={getEnemyType(currentEnemy.name)}
              isAnimating={isAnimating && !playerTurn}
              action={currentAction}
              onAnimationComplete={!playerTurn ? handleAnimationComplete : undefined}
            />
          </div>
          <HealthBar current={currentEnemy.health} max={currentEnemy.maxHealth} bgColor="bg-red-700" />
          <div className="flex justify-between text-indigo-200 text-sm mt-2">
            <span>ATK: {currentEnemy.attack}</span>
            <span>DEF: {currentEnemy.defense}</span>
            <span>LVL: {currentEnemy.level}</span>
          </div>
        </div>
        
        <div className="bg-indigo-800/60 p-4 rounded-lg order-1 md:order-2">
          <h3 className="text-green-300 text-lg font-bold mb-2">{player.name}</h3>
          <div className="h-48 mb-3 flex items-center justify-center">
            <Sprite 
              type="hero" 
              isAnimating={isAnimating && (playerTurn || showVictory)}
              action={currentAction}
              onAnimationComplete={playerTurn ? handleAnimationComplete : undefined}
            />
          </div>
          <HealthBar current={player.health} max={player.maxHealth} bgColor="bg-green-600" />
          <div className="flex justify-between text-indigo-200 text-sm mt-2">
            <span>ATK: {player.attack}</span>
            <span>DEF: {player.defense}</span>
            <span>LVL: {player.level}</span>
          </div>
        </div>
      </div>
      
      <div className="my-4">
        <BattleLog messages={battleLog} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-auto">
        <Button 
          onClick={handleAttack} 
          disabled={!playerTurn || isAnimating || showVictory}
          primary={playerTurn} 
          icon={<Sword className="w-4 h-4 mr-1" />}
        >
          Attack
        </Button>
        <Button 
          onClick={handleDefend} 
          disabled={!playerTurn || isAnimating || showVictory}
          primary={playerTurn} 
          icon={<Shield className="w-4 h-4 mr-1" />}
        >
          Defend
        </Button>
        <Button 
          onClick={handleUsePotion} 
          disabled={!playerTurn || isAnimating || !state.inventory.some(item => item.type === 'consumable' && item.effect === 'heal') || showVictory}
          primary={playerTurn} 
          icon={<Potion className="w-4 h-4 mr-1" />}
        >
          Potion ({state.inventory.filter(item => item.type === 'consumable' && item.effect === 'heal').length})
        </Button>
        <Button 
          onClick={handleFlee} 
          disabled={isAnimating || showVictory}
          secondary
          icon={<Map className="w-4 h-4 mr-1" />}
        >
          Flee
        </Button>
      </div>
    </div>
  );
};

export default BattleScreen;