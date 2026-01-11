import { WORD_DATA, CATEGORIES } from '../constants';
import { Difficulty, Player } from '../types';

export const getRandomWord = (categoryIds: string[], difficulties: Difficulty[]): { word: string; categoryName: string } => {
  // 1. Filter valid categories based on what the user selected
  const validCategories = CATEGORIES.filter(c => categoryIds.includes(c.id));
  
  if (validCategories.length === 0) {
    return { word: 'Error', categoryName: 'None' };
  }

  // 2. Pick a random category from the valid ones
  const randomCategory = validCategories[Math.floor(Math.random() * validCategories.length)];
  
  // 3. Get words for that category based on selected difficulties
  let pool: string[] = [];
  difficulties.forEach(diff => {
    if (WORD_DATA[randomCategory.id] && WORD_DATA[randomCategory.id][diff]) {
      pool = [...pool, ...WORD_DATA[randomCategory.id][diff]];
    }
  });

  // Fallback if pool is empty (shouldn't happen if logic is correct)
  if (pool.length === 0) {
    pool = WORD_DATA[randomCategory.id][Difficulty.EASY];
  }

  const randomWord = pool[Math.floor(Math.random() * pool.length)];

  return { word: randomWord, categoryName: randomCategory.name };
};

export const assignRoles = (players: Player[]): Player[] => {
  const newPlayers = [...players];
  const totalPlayers = newPlayers.length;
  
  // Reset roles
  newPlayers.forEach(p => {
    p.isImposter = false;
    p.hasViewedRole = false;
  });

  // Pick random index for imposter
  const imposterIndex = Math.floor(Math.random() * totalPlayers);
  newPlayers[imposterIndex].isImposter = true;

  // Simple balance logic: if we had history, we would check if this player was imposter recently.
  // For this local version, random is sufficient and fair over time.

  return newPlayers;
};
