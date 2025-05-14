import { GameState, GameAction, Enemy, Item } from '../types/gameTypes';
import { generateEnemy } from '../utils/enemyUtils';
import { getNewQuest } from '../utils/questUtils';
import { generateItem, generateShopInventory } from '../utils/itemUtils';

export const initialGameState: GameState = {
  screen: 'start',
  player: {
    name: 'Hero',
    level: 1,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    experience: 0,
    experienceToNextLevel: 100,
    gold: 50,
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    }
  },
  currentEnemy: null,
  inventory: [
    { 
      id: 'health-potion-1',
      name: 'Health Potion',
      type: 'consumable',
      rarity: 'common',
      effect: 'heal',
      value: 10,
      price: 20,
      stats: { healAmount: 20 },
      description: 'Restores 20 health points'
    }
  ],
  quests: [getNewQuest(1)],
  currentQuest: null,
  battleLog: [],
  gameOver: false,
  shopInventory: generateShopInventory(1),
  currentEvent: undefined
};

const calculatePlayerStats = (player: GameState['player']): GameState['player'] => {
  let totalAttack = 10; // Base attack
  let totalDefense = 5; // Base defense
  let totalHealth = 100; // Base health

  // Add equipment bonuses
  if (player.equipment.weapon?.stats.attack) {
    totalAttack += player.equipment.weapon.stats.attack;
  }
  if (player.equipment.armor?.stats.defense) {
    totalDefense += player.equipment.armor.stats.defense;
  }
  if (player.equipment.accessory) {
    if (player.equipment.accessory.stats.attack) totalAttack += player.equipment.accessory.stats.attack;
    if (player.equipment.accessory.stats.defense) totalDefense += player.equipment.accessory.stats.defense;
  }

  // Calculate total health from equipment
  if (player.equipment.armor?.stats.health) {
    totalHealth += player.equipment.armor.stats.health;
  }
  if (player.equipment.accessory?.stats.health) {
    totalHealth += player.equipment.accessory.stats.health;
  }

  return {
    ...player,
    attack: totalAttack,
    defense: totalDefense,
    maxHealth: totalHealth,
    health: Math.min(player.health, totalHealth) // Ensure health doesn't exceed new max
  };
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'TRIGGER_EVENT': {
      return {
        ...state,
        currentEvent: action.payload
      };
    }

    case 'RESOLVE_EVENT': {
      if (!state.currentEvent) return state;

      const { effect } = state.currentEvent;
      let updatedState = { ...state };

      if (effect.health) {
        const newHealth = Math.max(1, Math.min(
          state.player.maxHealth,
          state.player.health + effect.health
        ));
        updatedState.player = { ...state.player, health: newHealth };
      }

      if (effect.gold) {
        updatedState.player = {
          ...updatedState.player,
          gold: Math.max(0, state.player.gold + effect.gold)
        };
      }

      if (effect.experience) {
        const newExp = state.player.experience + effect.experience;
        if (newExp >= state.player.experienceToNextLevel) {
          updatedState.player = {
            ...updatedState.player,
            level: state.player.level + 1,
            experience: newExp - state.player.experienceToNextLevel,
            experienceToNextLevel: state.player.experienceToNextLevel + 50,
            maxHealth: state.player.maxHealth + 10,
            health: state.player.maxHealth + 10
          };
        } else {
          updatedState.player = {
            ...updatedState.player,
            experience: newExp
          };
        }
      }

      if (effect.item) {
        updatedState.inventory = [...state.inventory, effect.item];
      }

      return {
        ...updatedState,
        currentEvent: undefined
      };
    }

    case 'CHANGE_SCREEN':
      return {
        ...state,
        screen: action.payload,
        battleLog: action.payload === 'battle' ? [] : state.battleLog,
      };
      
    case 'START_BATTLE': {
      const enemyLevel = action.payload?.level || state.player.level;
      const enemy = action.payload || generateEnemy(enemyLevel);
      enemy.dropChance = Math.random(); // Add drop chance for items
      
      return {
        ...state,
        screen: 'battle',
        currentEnemy: enemy,
        battleLog: [`A ${enemy.name} appears!`],
      };
    }
      
    case 'PLAYER_ATTACK': {
      if (!state.currentEnemy) return state;
      
      const damage = Math.max(1, state.player.attack - state.currentEnemy.defense);
      const enemyHealthAfterAttack = Math.max(0, state.currentEnemy.health - damage);
      const updatedEnemy = { ...state.currentEnemy, health: enemyHealthAfterAttack };
      
      const newBattleLog = [
        ...state.battleLog,
        `You attack the ${state.currentEnemy.name} for ${damage} damage!`,
      ];
      
      if (enemyHealthAfterAttack <= 0) {
        // Enemy defeated
        const expGained = state.currentEnemy.expReward;
        const goldGained = state.currentEnemy.goldReward;
        
        const totalExp = state.player.experience + expGained;
        const levelUp = totalExp >= state.player.experienceToNextLevel;
        
        // Check for item drops
        let droppedItem: Item | null = null;
        if (state.currentEnemy.dropChance > 0.7) { // 30% chance to drop item
          const itemTypes: ('weapon' | 'armor' | 'accessory' | 'consumable')[] = ['weapon', 'armor', 'accessory', 'consumable'];
          const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
          droppedItem = generateItem(randomType, state.player.level);
          newBattleLog.push(`The ${state.currentEnemy.name} dropped a ${droppedItem.name}!`);
        }
        
        let updatedPlayer;
        if (levelUp) {
          updatedPlayer = calculatePlayerStats({
            ...state.player,
            level: state.player.level + 1,
            experience: totalExp - state.player.experienceToNextLevel,
            experienceToNextLevel: state.player.experienceToNextLevel + 50,
            maxHealth: state.player.maxHealth + 10,
            health: state.player.maxHealth + 10,
            gold: state.player.gold + goldGained,
          });
          
          newBattleLog.push(
            `You defeated the ${state.currentEnemy.name}!`,
            `You gained ${expGained} experience and ${goldGained} gold!`,
            `Level up! You are now level ${updatedPlayer.level}!`
          );
        } else {
          updatedPlayer = {
            ...state.player,
            experience: totalExp,
            gold: state.player.gold + goldGained,
          };
          newBattleLog.push(
            `You defeated the ${state.currentEnemy.name}!`,
            `You gained ${expGained} experience and ${goldGained} gold!`
          );
        }
        
        return {
          ...state,
          player: updatedPlayer,
          currentEnemy: null,
          screen: 'victory',
          battleLog: newBattleLog,
          inventory: droppedItem 
            ? [...state.inventory, droppedItem]
            : state.inventory
        };
      }
      
      return {
        ...state,
        currentEnemy: updatedEnemy,
        battleLog: newBattleLog,
      };
    }
      
    case 'ENEMY_ATTACK':
      if (!state.currentEnemy) return state;
      
      const enemyDamage = Math.max(1, state.currentEnemy.attack - state.player.defense);
      const playerHealthAfterAttack = Math.max(0, state.player.health - enemyDamage);
      const updatedPlayer = { ...state.player, health: playerHealthAfterAttack };
      
      const enemyAttackLog = [
        ...state.battleLog,
        `The ${state.currentEnemy.name} attacks you for ${enemyDamage} damage!`,
      ];
      
      if (playerHealthAfterAttack <= 0) {
        return {
          ...state,
          player: updatedPlayer,
          screen: 'gameOver',
          gameOver: true,
          battleLog: [...enemyAttackLog, 'You have been defeated!'],
        };
      }
      
      return {
        ...state,
        player: updatedPlayer,
        battleLog: enemyAttackLog,
      };
      
    case 'USE_ITEM': {
      const item = action.payload as Item;
      
      if (item.type === 'consumable' && item.effect === 'heal' && item.stats.healAmount) {
        const newHealth = Math.min(state.player.maxHealth, state.player.health + item.stats.healAmount);
        const updatedInventory = state.inventory.filter(i => i.id !== item.id);
        
        return {
          ...state,
          player: { ...state.player, health: newHealth },
          inventory: updatedInventory,
          battleLog: [...state.battleLog, `You used ${item.name} and recovered ${item.stats.healAmount} health!`],
        };
      }
      
      return state;
    }
      
    case 'EQUIP_ITEM': {
      const item = action.payload as Item;
      if (item.type === 'consumable') return state;
      
      const oldEquipment = state.player.equipment[item.type];
      const newInventory = state.inventory.filter(i => i.id !== item.id);
      
      if (oldEquipment) {
        newInventory.push(oldEquipment);
      }
      
      const newPlayer = calculatePlayerStats({
        ...state.player,
        equipment: {
          ...state.player.equipment,
          [item.type]: item
        }
      });
      
      return {
        ...state,
        player: newPlayer,
        inventory: newInventory
      };
    }
      
    case 'UNEQUIP_ITEM': {
      const slot = action.payload;
      const item = state.player.equipment[slot];
      
      if (!item) return state;
      
      const newPlayer = calculatePlayerStats({
        ...state.player,
        equipment: {
          ...state.player.equipment,
          [slot]: null
        }
      });
      
      return {
        ...state,
        player: newPlayer,
        inventory: [...state.inventory, item]
      };
    }
      
    case 'BUY_ITEM': {
      const item = action.payload as Item;
      if (state.player.gold < item.price) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - item.price
        },
        inventory: [...state.inventory, item],
        shopInventory: state.shopInventory.filter(i => i.id !== item.id)
      };
    }
      
    case 'SELL_ITEM': {
      const item = action.payload as Item;
      
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold + item.value
        },
        inventory: state.inventory.filter(i => i.id !== item.id)
      };
    }
      
    case 'REFRESH_SHOP':
      return {
        ...state,
        shopInventory: generateShopInventory(state.player.level)
      };
      
    case 'ADD_TO_INVENTORY':
      return {
        ...state,
        inventory: [...state.inventory, action.payload as Item],
      };
      
    case 'START_QUEST':
      return {
        ...state,
        currentQuest: action.payload,
        screen: 'quest',
      };
      
    case 'COMPLETE_QUEST': {
      const completedQuest = state.currentQuest;
      if (!completedQuest) return state;
      
      const rewards = {
        experience: state.player.experience + completedQuest.expReward,
        gold: state.player.gold + completedQuest.goldReward,
        inventory: [...state.inventory]
      };
      
      if (completedQuest.itemReward) {
        rewards.inventory.push(completedQuest.itemReward);
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          experience: rewards.experience,
          gold: rewards.gold,
        },
        inventory: rewards.inventory,
        quests: state.quests.filter(q => q.id !== completedQuest.id).concat(getNewQuest(state.player.level)),
        currentQuest: null,
        screen: 'map',
      };
    }
      
    case 'RESET_GAME':
      return initialGameState;
      
    default:
      return state;
  }
};

export default gameReducer;