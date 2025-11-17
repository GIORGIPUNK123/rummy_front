import type { GameStateT } from './game';

export interface PlayerT {
  uid: string;
  name: string;
  socketId: string;
  isReady?: boolean; // Ready state for starting the game
}

export interface RoomT {
  id: string;
  rummyType: 'indian' | 'gin';
  numOfPlayers: 2 | 3 | 4;
  players: PlayerT[];
  createdAt: number;
  status: 'waiting' | 'countdown' | 'playing' | 'finished' | 'aborted';
  countdownStartedAt: number | undefined; // Timestamp when countdown started
  countdownDuration: number;
  gameState?: GameStateT; // Game state when status is 'playing' or 'finished'
}
