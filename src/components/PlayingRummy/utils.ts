import type { Card } from '../../types/game';

// Helper function to get card value for sorting (higher = higher number)
export const getCardSortValue = (value: Card['value']): number => {
  const valueMap: Record<Card['value'], number> = {
    king: 13,
    queen: 12,
    jack: 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    '1': 1, // Ace is lowest
    joker: 0, // Jokers are lowest
  };
  return valueMap[value] ?? 0;
};

// Helper function to get suit sort value
export const getSuitSortValue = (suit: Card['suit']): number => {
  const suitMap: Record<Card['suit'], number> = {
    spades: 4,
    hearts: 3,
    diamonds: 2,
    clubs: 1,
  };
  return suitMap[suit] ?? 0;
};
