import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import type {
  GameStateT,
  GameActionResponse,
  ShowResult,
  Card,
} from '../../types/game.js';

/**
 * Composable hook for game-related socket actions
 */
export const useGameActions = (socket: Socket | null) => {
  /**
   * Draw a card from deck
   */
  const drawFromDeck = useCallback(
    (roomId: string, playerUid: string): Promise<GameActionResponse> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:draw-card',
          {
            roomId,
            action: {
              type: 'draw-from-deck',
              playerUid,
            },
          },
          (response: GameActionResponse) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * Draw a card from discard pile
   */
  const drawFromDiscard = useCallback(
    (roomId: string, playerUid: string): Promise<GameActionResponse> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:draw-card',
          {
            roomId,
            action: {
              type: 'draw-from-discard',
              playerUid,
            },
          },
          (response: GameActionResponse) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * Discard a card
   */
  const discardCard = useCallback(
    (
      roomId: string,
      playerUid: string,
      cardId: string
    ): Promise<GameActionResponse> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:discard-card',
          {
            roomId,
            action: {
              type: 'discard-card',
              playerUid,
              cardId,
            },
          },
          (response: GameActionResponse) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * End turn
   */
  const endTurn = useCallback(
    (roomId: string, playerUid: string): Promise<GameActionResponse> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:end-turn',
          {
            roomId,
            action: {
              type: 'end-turn',
              playerUid,
            },
          },
          (response: GameActionResponse) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * Show/declare hand
   */
  const showHand = useCallback(
    (
      roomId: string
    ): Promise<{ success: boolean; error?: string; result?: ShowResult }> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:show',
          { roomId },
          (response: {
            success: boolean;
            error?: string;
            result?: ShowResult;
          }) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * Get current game state
   */
  const getGameState = useCallback(
    (
      roomId: string
    ): Promise<{
      success: boolean;
      error?: string;
      gameState?: GameStateT;
    }> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:get-state',
          { roomId },
          (response: {
            success: boolean;
            error?: string;
            gameState?: GameStateT;
          }) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  /**
   * Reorder hand - updates hand order in backend
   */
  const reorderHand = useCallback(
    (
      roomId: string,
      cards: Card[]
    ): Promise<{
      success: boolean;
      error?: string;
    }> => {
      return new Promise((resolve) => {
        if (!socket?.connected) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(
          'game:reorder-hand',
          { roomId, cards },
          (response: { success: boolean; error?: string }) => {
            resolve(response || { success: false, error: 'No response' });
          }
        );
      });
    },
    [socket]
  );

  return {
    drawFromDeck,
    drawFromDiscard,
    discardCard,
    endTurn,
    showHand,
    getGameState,
    reorderHand,
  };
};
