import { useState, useEffect, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import type { GameStateT, ShowResult, Card } from '../../types/game.js';

/**
 * Hook for managing game state
 */
export const useGameState = (
  socket: Socket | null,
  roomId: string | null,
  playerUid: string | null
) => {
  const [gameState, setGameState] = useState<GameStateT | null>(null);
  const [showResult, setShowResult] = useState<ShowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update game state from server
   */
  const updateGameState = useCallback((newState: GameStateT) => {
    setGameState(newState);
    setError(null);
  }, []);

  /**
   * Listen to game state updates
   */
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleStateUpdate = (state: GameStateT) => {
      updateGameState(state);
    };

    const handleTurnChanged = (data: {
      currentPlayerUid: string;
      gameState: GameStateT;
    }) => {
      updateGameState(data.gameState);
    };

    const handleCardDrawn = (data: {
      playerUid: string;
      source: 'deck' | 'discard';
      deckCount: number;
      discardPileTop: any;
    }) => {
      // Update local state optimistically
      setGameState((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          deckCount: data.deckCount,
          discardPileTop: data.discardPileTop,
        };
      });
    };

    const handleCardDiscarded = (data: {
      playerUid: string;
      card: any;
      discardPileTop: any;
    }) => {
      // Update local state optimistically
      setGameState((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          discardPileTop: data.discardPileTop,
        };
      });
    };

    const handleShowResult = (result: ShowResult) => {
      setShowResult(result);
    };

    const handleHandReordered = (data: {
      myHand: Card[] | null;
      score?: number | null;
    }) => {
      // Update game state with new hand order
      setGameState((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          myHand: data.myHand,
          score:
            data.score !== undefined ? data.score : prevState.score ?? null,
        };
      });
    };

    const handleGameEnd = (data: {
      winner: string;
      scores: Record<string, number>;
      reason?: string;
    }) => {
      // Update game state to mark game as ended
      setGameState((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          gameEnded: true,
          winner: data.winner,
          scores: data.scores,
        };
      });
    };

    const handlePlayerLeft = (data: {
      leftPlayerUid: string;
      scores: Record<string, number>;
    }) => {
      // Update game state with scores when a player leaves
      setGameState((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          gameEnded: true,
          scores: data.scores,
        };
      });
    };

    socket.on('game:state-update', handleStateUpdate);
    socket.on('game:turn-changed', handleTurnChanged);
    socket.on('game:card-drawn', handleCardDrawn);
    socket.on('game:card-discarded', handleCardDiscarded);
    socket.on('game:show-result', handleShowResult);
    socket.on('game:hand-reordered', handleHandReordered);
    socket.on('game:end', handleGameEnd);
    socket.on('game:player-left', handlePlayerLeft);

    return () => {
      socket.off('game:state-update', handleStateUpdate);
      socket.off('game:turn-changed', handleTurnChanged);
      socket.off('game:card-drawn', handleCardDrawn);
      socket.off('game:card-discarded', handleCardDiscarded);
      socket.off('game:show-result', handleShowResult);
      socket.off('game:hand-reordered', handleHandReordered);
      socket.off('game:end', handleGameEnd);
      socket.off('game:player-left', handlePlayerLeft);
    };
  }, [socket, roomId, updateGameState]);

  /**
   * Check if it's current player's turn
   */
  const isMyTurn = gameState?.currentPlayerUid === playerUid;

  /**
   * Check if player has drawn a card this turn
   */
  const hasDrawnCard = gameState?.turnState?.hasDrawnCard ?? false;

  /**
   * Check if player has discarded a card this turn
   */
  const hasDiscardedCard = gameState?.turnState?.hasDiscardedCard ?? false;

  /**
   * Get player's hand
   */
  const myHand = gameState?.myHand ?? null;

  /**
   * Get player's points
   */
  // const myPoints = gameState?.myPoints ?? 0;
  return {
    gameState,
    showResult,
    error,
    isMyTurn,
    hasDrawnCard,
    hasDiscardedCard,
    myHand,
    // myPoints,
    updateGameState,
    setError,
  };
};
