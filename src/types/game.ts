/**
 * Game types matching backend
 */

export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type CardValue =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | 'joker';

export interface Card {
  suit: CardSuit;
  value: CardValue;
  id: string;
}

export interface TurnState {
  currentPlayerIndex: number;
  currentPlayerUid: string;
  turnStartedAt: number;
  hasDrawnCard: boolean;
  hasDiscardedCard: boolean;
}

export interface GameStateT {
  deckCount: number;
  discardPileTop: Card | null;
  playerHands: Record<string, number>; // playerUid -> card count
  myHand: Card[] | null; // Full hand for current player
  currentPlayerUid: string;
  turnState: TurnState | null;
  wildJokerCard?: Card | null;
  score: number | null;
  winner?: string | null;
  scores?: Record<string, number>;
  gameEnded?: boolean;
}

export interface GameActionResponse {
  success: boolean;
  error?: string;
  gameState?: GameStateT;
}

export interface ShowResult {
  declaringPlayerUid: string;
  isValidShow: boolean;
  scores: Record<string, number>;
  winner: string | null;
  error?: string;
}
