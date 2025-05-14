import { Item, ItemType, ItemRarity, ItemEffect } from '../types/itemTypes';
import { v4 as uuidv4 } from './uuid';

const weaponPrefixes = ['Sharp', 'Mighty', 'Fierce', 'Ancient', 'Blessed', 'Cursed', 'Dragon', 'Holy'];
const armorPrefixes = ['Sturdy', 'Heavy', 'Light', 'Mystic', 'Sacred', 'Dark', 'Royal', 'Divine'];
const accessoryPrefixes = ['Lucky', 'Wise', 'Swift', 'Magical', 'Enchanted', 'Mysterious', 'Powerful'];

const weaponTypes = ['Sword', 'Axe', 'Mace', 'Dagger', 'Staff', 'Bow'];
const armorTypes = ['Plate', 'Chain', 'Leather', 'Robe', 'Shield'];
const accessoryTypes = ['Ring', 'Amulet', 'Belt', 'Bracers', 'Crown'];

const rarityModifiers = {
  common: { min: 1, max: 1.2, price: 1 },
  uncommon: { min: 1.2, max: 1.5, price: 2 },
  rare: { min: 1.5, max: 2, price: 4 },
  epic: { min: 2, max: 2.5, price: 8 },
  legendary: { min: 2.5, max: 3, price: 16 }
};

const getRarityColor = (rarity: ItemRarity): string => {
  switch (rarity) {
    case 'common': return 'text-gray-200';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-white';
  }
};

const generateItemName = (type: ItemType, rarity: ItemRarity): string => {
  const prefixes = {
    weapon: weaponPrefixes,
    armor: armorPrefixes,
    accessory: accessoryPrefixes,
    consumable: []
  };

  const types = {
    weapon: weaponTypes,
    armor: armorTypes,
    accessory: accessoryTypes,
    consumable: ['Potion', 'Elixir', 'Tonic']
  };

  if (type === 'consumable') {
    return `Health ${types[type][Math.floor(Math.random() * types[type].length)]}`;
  }

  const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
  const itemType = types[type][Math.floor(Math.random() * types[type].length)];
  return `${prefix} ${itemType}`;
};

const generateItemStats = (type: ItemType, rarity: ItemRarity, playerLevel: number): Item['stats'] => {
  const modifier = rarityModifiers[rarity];
  const baseValue = Math.max(1, Math.floor(playerLevel * modifier.min));
  const maxValue = Math.max(2, Math.floor(playerLevel * modifier.max));

  switch (type) {
    case 'weapon':
      return {
        attack: Math.floor(Math.random() * (maxValue - baseValue) + baseValue),
        critChance: Math.floor(Math.random() * 5 * modifier.min)
      };
    case 'armor':
      return {
        defense: Math.floor(Math.random() * (maxValue - baseValue) + baseValue),
        health: Math.floor(Math.random() * (maxValue * 5 - baseValue * 5) + baseValue * 5)
      };
    case 'accessory':
      return {
        attack: Math.floor(Math.random() * (maxValue/2 - baseValue/2) + baseValue/2),
        defense: Math.floor(Math.random() * (maxValue/2 - baseValue/2) + baseValue/2),
        health: Math.floor(Math.random() * (maxValue * 2 - baseValue * 2) + baseValue * 2)
      };
    case 'consumable':
      return {
        healAmount: Math.floor(Math.random() * (maxValue * 10 - baseValue * 5) + baseValue * 5)
      };
    default:
      return {};
  }
};

export const generateItem = (type: ItemType, playerLevel: number, forcedRarity?: ItemRarity): Item => {
  const rarityRoll = Math.random() * 100;
  let rarity: ItemRarity;
  
  if (forcedRarity) {
    rarity = forcedRarity;
  } else {
    if (rarityRoll < 50) rarity = 'common';
    else if (rarityRoll < 80) rarity = 'uncommon';
    else if (rarityRoll < 95) rarity = 'rare';
    else if (rarityRoll < 99) rarity = 'epic';
    else rarity = 'legendary';
  }

  const stats = generateItemStats(type, rarity, playerLevel);
  const name = generateItemName(type, rarity);
  const baseValue = playerLevel * 10;
  const price = Math.floor(baseValue * rarityModifiers[rarity].price);

  let effect: ItemEffect | undefined;
  if (type === 'consumable') effect = 'heal';

  return {
    id: uuidv4(),
    name,
    type,
    rarity,
    effect,
    value: Math.floor(price * 0.8), // Sell value
    price, // Buy price
    stats,
    description: generateItemDescription(type, stats, rarity)
  };
};

const generateItemDescription = (type: ItemType, stats: Item['stats'], rarity: ItemRarity): string => {
  const descriptions = [];
  
  if (stats.attack) descriptions.push(`Attack +${stats.attack}`);
  if (stats.defense) descriptions.push(`Defense +${stats.defense}`);
  if (stats.health) descriptions.push(`Health +${stats.health}`);
  if (stats.critChance) descriptions.push(`Crit Chance +${stats.critChance}%`);
  if (stats.healAmount) descriptions.push(`Heals ${stats.healAmount} HP`);

  return descriptions.join(', ');
};

export const generateShopInventory = (playerLevel: number): Item[] => {
  const inventory: Item[] = [];
  const itemTypes: ItemType[] = ['weapon', 'armor', 'accessory', 'consumable'];
  
  // Generate 2-3 items of each type
  itemTypes.forEach(type => {
    const count = type === 'consumable' ? 5 : Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
      inventory.push(generateItem(type, playerLevel));
    }
  });

  // Add one guaranteed rare or better item
  const guaranteedType = itemTypes[Math.floor(Math.random() * 3)]; // Exclude consumables
  const guaranteedRarity: ItemRarity = Math.random() < 0.8 ? 'rare' : 'epic';
  inventory.push(generateItem(guaranteedType, playerLevel, guaranteedRarity));

  return inventory;
};

export { getRarityColor };