import { GameEvent, EventType } from '../types/gameTypes';
import { generateItem } from './itemUtils';
import { v4 as uuidv4 } from './uuid';

export const generateRandomEvent = (playerLevel: number): GameEvent => {
  const eventTypes: EventType[] = ['battle', 'item', 'accident', 'boon'];
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  switch (randomType) {
    case 'item': {
      const itemTypes = ['weapon', 'armor', 'accessory', 'consumable'] as const;
      const randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const item = generateItem(randomItemType, playerLevel);
      
      return {
        type: 'item',
        description: `You found a ${item.name}!`,
        effect: { item }
      };
    }
    
    case 'accident': {
      const damagePercent = Math.floor(Math.random() * 20) + 10; // 10-30% damage
      const accidents = [
        'You stumbled and fell',
        'You triggered a trap',
        'You were ambushed by bandits',
        'You ate some poisonous berries'
      ];
      
      return {
        type: 'accident',
        description: `${accidents[Math.floor(Math.random() * accidents.length)]}!`,
        effect: { health: -damagePercent }
      };
    }
    
    case 'boon': {
      const boons = [
        { desc: 'You found a treasure chest', gold: Math.floor(Math.random() * 50) + 50 },
        { desc: 'You helped a merchant', gold: Math.floor(Math.random() * 30) + 20 },
        { desc: 'You discovered ancient knowledge', experience: Math.floor(Math.random() * 30) + 20 },
        { desc: 'You rested at a healing spring', health: 20 }
      ];
      
      const boon = boons[Math.floor(Math.random() * boons.length)];
      return {
        type: 'boon',
        description: `${boon.desc}!`,
        effect: {
          gold: boon.gold,
          experience: boon.experience,
          health: boon.health
        }
      };
    }
    
    case 'battle':
    default:
      return {
        type: 'battle',
        description: 'You encountered an enemy!',
        effect: {}
      };
  }
};