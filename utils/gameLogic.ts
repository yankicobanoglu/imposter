import { WORD_DATA, CATEGORIES } from '../constants';
import { Difficulty, Player } from '../types';

export const getRandomWord = (
    categoryIds: string[], 
    difficulties: Difficulty[], 
    usedWords: string[] = [],
    customPool?: string[]
): { word: string; categoryName: string } => {
  
  // Handle Custom Pot Mode
  if (categoryIds.includes('custom') && customPool && customPool.length > 0) {
      // For custom mode, we might not track used words strictly or we assume the pool *is* the list
      // But standard logic: try to find one not used.
      const availableCustom = customPool.filter(w => !usedWords.includes(w));
      
      if (availableCustom.length > 0) {
          const randomWord = availableCustom[Math.floor(Math.random() * availableCustom.length)];
          return { word: randomWord, categoryName: 'Custom Pot' };
      } else {
          // If all custom words used, just pick from full pool (repeats allowed if exhausted)
          const randomWord = customPool[Math.floor(Math.random() * customPool.length)];
          return { word: randomWord, categoryName: 'Custom Pot' };
      }
  }

  // 1. Filter valid categories based on what the user selected (excluding custom)
  const validCategories = CATEGORIES.filter(c => categoryIds.includes(c.id) && c.id !== 'custom');
  
  if (validCategories.length === 0) {
    return { word: 'Error', categoryName: 'None' };
  }

  // 2. Build full candidate pool from all selected categories/difficulties
  let candidatePool: {word: string, category: string}[] = [];
  
  validCategories.forEach(cat => {
      difficulties.forEach(diff => {
          if (WORD_DATA[cat.id] && WORD_DATA[cat.id][diff]) {
              WORD_DATA[cat.id][diff].forEach(w => {
                  candidatePool.push({ word: w, category: cat.name });
              });
          }
      });
  });

  // If pool empty (shouldn't happen), fallback
  if (candidatePool.length === 0) {
     return { word: 'Error', categoryName: 'None' };
  }

  // 3. Filter out used words
  const unusedPool = candidatePool.filter(item => !usedWords.includes(item.word));

  // 4. Select word
  let selection;
  if (unusedPool.length > 0) {
      selection = unusedPool[Math.floor(Math.random() * unusedPool.length)];
  } else {
      // If we used all words, pick from the full pool (allows repeats now)
      selection = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  }

  return { word: selection.word, categoryName: selection.category };
};

export const assignRoles = (players: Player[]): Player[] => {
  const newPlayers = [...players];
  const totalPlayers = newPlayers.length;
  
  // Reset roles
  newPlayers.forEach(p => {
    p.isImposter = false;
    p.hasViewedRole = false;
  });

  // Determine number of imposters
  // If > 7 players, we have 2 imposters. Otherwise 1.
  const numImposters = totalPlayers > 7 ? 2 : 1;
  
  let impostersAssigned = 0;
  while (impostersAssigned < numImposters) {
      const randomIndex = Math.floor(Math.random() * totalPlayers);
      if (!newPlayers[randomIndex].isImposter) {
          newPlayers[randomIndex].isImposter = true;
          impostersAssigned++;
      }
  }

  return newPlayers;
};