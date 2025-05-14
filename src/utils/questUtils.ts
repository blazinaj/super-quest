import { Quest } from '../types/gameTypes';
import { generateEnemy } from './enemyUtils';
import { v4 as uuidv4 } from './uuid';

const questTemplates = [
  {
    name: 'Pest Control',
    description: 'The local farmers are troubled by creatures destroying their crops. Help them eliminate the threat.',
    objective: 'Defeat the enemy causing havoc in the farmlands.',
    difficulty: 'easy' as const,
  },
  {
    name: 'Lost Artifact',
    description: 'A valuable artifact has been stolen by bandits. Track them down and recover it.',
    objective: 'Defeat the bandit leader and retrieve the artifact.',
    difficulty: 'medium' as const,
  },
  {
    name: 'Mysterious Cave',
    description: 'Strange noises have been heard from a nearby cave. Investigate and eliminate any threats.',
    objective: 'Explore the cave and defeat whatever lurks inside.',
    difficulty: 'medium' as const,
  },
  {
    name: 'Dragon Slayer',
    description: 'A fearsome dragon has been terrorizing the kingdom. You must defeat it to save the land.',
    objective: 'Slay the dragon and return victorious.',
    difficulty: 'hard' as const,
  },
];

export const getNewQuest = (playerLevel: number): Quest => {
  // Filter quests based on player level
  let availableQuests;
  if (playerLevel <= 2) {
    availableQuests = questTemplates.filter(q => q.difficulty === 'easy');
  } else if (playerLevel <= 5) {
    availableQuests = questTemplates.filter(q => q.difficulty !== 'hard');
  } else {
    availableQuests = questTemplates;
  }
  
  // Random selection
  const selectedQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
  
  // Scale rewards based on difficulty and player level
  let expMultiplier, goldMultiplier, enemyLevelBoost;
  
  switch (selectedQuest.difficulty) {
    case 'easy':
      expMultiplier = 1;
      goldMultiplier = 1;
      enemyLevelBoost = 0;
      break;
    case 'medium':
      expMultiplier = 1.5;
      goldMultiplier = 1.5;
      enemyLevelBoost = 1;
      break;
    case 'hard':
      expMultiplier = 2.5;
      goldMultiplier = 2;
      enemyLevelBoost = 2;
      break;
    default:
      expMultiplier = 1;
      goldMultiplier = 1;
      enemyLevelBoost = 0;
  }
  
  const expReward = Math.floor(50 * playerLevel * expMultiplier);
  const goldReward = Math.floor(30 * playerLevel * goldMultiplier);
  
  // Generate an enemy for the quest
  const enemy = generateEnemy(playerLevel + enemyLevelBoost);
  
  // Custom name for the enemy based on quest
  if (selectedQuest.name === 'Pest Control') {
    enemy.name = `Giant ${enemy.name}`;
  } else if (selectedQuest.name === 'Lost Artifact') {
    enemy.name = `Bandit ${enemy.name}`;
  } else if (selectedQuest.name === 'Dragon Slayer') {
    enemy.name = `Ancient Dragon`;
    enemy.health = Math.floor(enemy.health * 1.5);
    enemy.maxHealth = enemy.health;
    enemy.attack = Math.floor(enemy.attack * 1.3);
  }
  
  return {
    id: uuidv4(),
    name: selectedQuest.name,
    description: selectedQuest.description,
    objective: selectedQuest.objective,
    difficulty: selectedQuest.difficulty,
    expReward,
    goldReward,
    enemyToDefeat: enemy,
    completed: false,
  };
};