import type { Card } from '../../../types/game';

/**
 * Gets the point value of a card for scoring
 * Face cards (J, Q, K, A) = 10 points
 * Number cards = face value
 */
export const getCardPoints = (card: Card): number => {
  const faceCards: string[] = ['jack', 'queen', 'king', '1']; // Ace is also 10 points
  if (faceCards.includes(card.value)) {
    return 10;
  }

  if (card.value === 'joker') {
    return 0; // Jokers don't count in scoring
  }

  // Number cards (2-10)
  const numValue = parseInt(card.value);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Calculates penalty points based on current hand arrangement
 * This is a simplified frontend calculation that shows what penalty points
 * the player would get if they showed now
 */
