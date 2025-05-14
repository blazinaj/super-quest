import { Enemy } from '../types/gameTypes';
import { v4 as uuidv4 } from '../utils/uuid';

const enemyTypes = [
  { name: 'Goblin', baseHealth: 30, baseAttack: 5, baseDefense: 2, difficulty: 1 },
  { name: 'Wolf', baseHealth: 25, baseAttack: 8, baseDefense: 1, difficulty: 1 },
  { name: 'Skeleton', baseHealth: 35, baseAttack: 6, baseDefense: 3, difficulty: 2 },
  { name: 'Orc', baseHealth: 45, baseAttack: 9, baseDefense: 4, difficulty: 3 },
  { name: 'Troll', baseHealth: 60, baseAttack: 12, baseDefense: 5, difficulty: 4 },
  { name: 'Dragon', baseHealth: 100, baseAttack: 18, baseDefense: 8, difficulty: 6 },
];

export const generateEnemy = (playerLevel: number): Enemy => {
  // Filter enemies that are appropriate for the player's level
  const appropriateEnemies = enemyTypes.filter(enemy => 
    enemy.difficulty <= Math.max(1, Math.floor(playerLevel / 2) + 1)
  );
  
  // Random selection
  const selectedEnemy = appropriateEnemies[Math.floor(Math.random() * appropriateEnemies.length)];
  
  // Calculate level (slightly randomized based on player level)
  const level = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
  
  // Scale stats based on level
  const levelMultiplier = 1 + (level - 1) * 0.1;
  const health = Math.floor(selectedEnemy.baseHealth * levelMultiplier);
  const attack = Math.floor(selectedEnemy.baseAttack * levelMultiplier);
  const defense = Math.floor(selectedEnemy.baseDefense * levelMultiplier);
  
  // Calculate rewards based on level and difficulty
  const expReward = Math.floor(15 * level * selectedEnemy.difficulty);
  const goldReward = Math.floor(10 * level * selectedEnemy.difficulty);
  
  return {
    id: uuidv4(),
    name: selectedEnemy.name,
    level,
    health,
    maxHealth: health,
    attack,
    defense,
    expReward,
    goldReward,
  };
};