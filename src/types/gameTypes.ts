import { ItemRarity, ItemType, ItemEffect } from './itemTypes';

// Game Screens
export type GameScreen = 'start' | 'map' | 'battle' | 'victory' | 'inventory' | 'shop' | 'quest' | 'gameOver';

// Event Types
export type EventType = 'battle' | 'item' | 'accident' | 'boon';

export interface GameEvent {
  type: EventType;
  description: string;
  effect: {
    health?: number;
    gold?: number;
    experience?: number;
    item?: Item;
  };
}

// Player
export interface Player {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  experience: number;
  experienceToNextLevel: number;
  gold: number;
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    accessory: Item | null;
  };
}

// Enemy
export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  level: number;
  dropChance: number;
  image?: string;
  description?: string;
}

// Item
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  effect?: ItemEffect;
  value: number;
  price: number;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    critChance?: number;
    healAmount?: number;
  };
  description: string;
  image?: string;
}

// Quest
export interface Quest {
  id: string;
  name: string;
  description: string;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expReward: number;
  goldReward: number;
  itemReward?: Item;
  enemyToDefeat?: Enemy;
  completed?: boolean;
}

// Game State
export interface GameState {
  screen: GameScreen;
  player: Player;
  currentEnemy: Enemy | null;
  inventory: Item[];
  quests: Quest[];
  currentQuest: Quest | null;
  battleLog: string[];
  gameOver: boolean;
  shopInventory: Item[];
  currentEvent?: GameEvent;
}

// Game Actions
export type GameAction =
  | { type: 'CHANGE_SCREEN'; payload: GameScreen }
  | { type: 'START_BATTLE'; payload?: Enemy }
  | { type: 'PLAYER_ATTACK' }
  | { type: 'ENEMY_ATTACK' }
  | { type: 'USE_ITEM'; payload: Item }
  | { type: 'EQUIP_ITEM'; payload: Item }
  | { type: 'UNEQUIP_ITEM'; payload: ItemType }
  | { type: 'ADD_TO_INVENTORY'; payload: Item }
  | { type: 'REMOVE_FROM_INVENTORY'; payload: string }
  | { type: 'BUY_ITEM'; payload: Item }
  | { type: 'SELL_ITEM'; payload: Item }
  | { type: 'START_QUEST'; payload: Quest }
  | { type: 'COMPLETE_QUEST' }
  | { type: 'RESET_GAME' }
  | { type: 'REFRESH_SHOP' }
  | { type: 'TRIGGER_EVENT'; payload: GameEvent }
  | { type: 'RESOLVE_EVENT' };

// Context Type
export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}