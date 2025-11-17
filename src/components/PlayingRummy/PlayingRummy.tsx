import type { playerTypeT } from '../types';
import type { Card } from '../../types/game';
import type { Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { useGameActions } from '../../hooks/socket/useGameActions';
import { useGameState } from '../../hooks/socket/useGameState';
import { DisplayPlayers } from './DisplayPlayers';
import { DisplayCards } from './DisplayCards';
import { DeckAndDiscard } from './DeckAndDiscard';
import { GameIndicators } from './GameIndicators';
import { ActionButtons } from './ActionButtons';
import { DisplayOpponentsCards } from './DisplayOpponentsCards';
import { LeaveRoomBtn } from './LeaveRoomBtn';
import LeaveRummyModal from './modals/LeaveRummyModal';
import { useNavigate } from 'react-router-dom';

export const PlayingRummy = (props: {
  currentPlayer: playerTypeT;
  players: playerTypeT[];
  roomId: string;
  socket: Socket;
  playerUid: string;
  onLeave?: () => void;
}) => {
  const { players, currentPlayer, roomId, socket, playerUid, onLeave } = props;

  // All hooks must be called before any conditional returns
  const navigate = useNavigate();

  // Game state hook - manages all game state internally
  const gameStateHook = useGameState(socket, roomId, playerUid);
  const { getGameState } = useGameActions(socket);

  // Extract game state values
  const {
    gameState,
    isMyTurn,
    hasDrawnCard,
    hasDiscardedCard,
    myHand,
    // myPoints,
    error,
    setError,
    updateGameState,
  } = gameStateHook;

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { drawFromDeck, drawFromDiscard, discardCard, endTurn, reorderHand } =
    useGameActions(socket);

  // Fetch initial game state when component mounts
  useEffect(() => {
    if (roomId && getGameState) {
      getGameState(roomId).then((result) => {
        if (result.success && result.gameState) {
          updateGameState(result.gameState);
        }
      });
    }
  }, [roomId, getGameState, updateGameState]);
  // Optimistic local state for immediate UI feedback
  const [optimisticHand, setOptimisticHand] = useState<Card[] | null>(null);

  // Use optimistic hand if available, otherwise use myHand from backend
  const displayHand = optimisticHand || myHand;

  // Sync optimistic hand with backend when myHand updates
  useEffect(() => {
    if (myHand) {
      // If we have optimistic hand, check if cards changed
      if (optimisticHand) {
        const backendCardIds = new Set(myHand.map((c) => c.id));
        const optimisticCardIds = new Set(optimisticHand.map((c) => c.id));
        const cardsChanged =
          backendCardIds.size !== optimisticCardIds.size ||
          [...backendCardIds].some((id) => !optimisticCardIds.has(id)) ||
          [...optimisticCardIds].some((id) => !backendCardIds.has(id));

        // Only sync if cards actually changed (added/removed)
        if (cardsChanged) {
          setOptimisticHand(null); // Reset to use backend order
        }
      }
    } else {
      setOptimisticHand(null);
    }
  }, [myHand, optimisticHand]);

  // Handle card reordering - update optimistic state immediately, send to backend with debounce
  const handleReorderCards = (reorderedCards: Card[]) => {
    // Update optimistic state immediately for instant UI feedback
    setOptimisticHand([...reorderedCards]);

    // Clear previous timeout
    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current);
    }

    // Debounce reorder request (wait 300ms after last drag)
    reorderTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await reorderHand(roomId, reorderedCards);
        if (!result.success) {
          console.error('[Reorder] Failed to reorder hand:', result.error);
          // Revert optimistic state on error
          setOptimisticHand(null);
        }
        // Backend will send 'game:hand-reordered' event with updated hand
        // This will update myHand, which will then sync with optimisticHand
      } catch (error) {
        console.error('[Reorder] Error reordering hand:', error);
        setOptimisticHand(null);
      }
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current);
      }
    };
  }, []);

  const handleDrawFromDeck = async () => {
    if (!isMyTurn || hasDrawnCard || isActionLoading) return;
    setIsActionLoading(true);
    try {
      const result = await drawFromDeck(roomId, playerUid);
      if (!result.success) {
        setError(result.error || 'Failed to draw card');
      }
    } catch (error) {
      setError('Error drawing card');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDrawFromDiscard = async () => {
    if (!isMyTurn || hasDrawnCard || isActionLoading) return;
    setIsActionLoading(true);
    try {
      const result = await drawFromDiscard(roomId, playerUid);
      if (!result.success) {
        setError(result.error || 'Failed to draw card');
      }
    } catch (error) {
      setError('Error drawing card');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDiscardCard = async () => {
    if (
      !selectedCardId ||
      !isMyTurn ||
      !hasDrawnCard ||
      hasDiscardedCard ||
      isActionLoading
    )
      return;
    setIsActionLoading(true);
    try {
      const result = await discardCard(roomId, playerUid, selectedCardId);
      if (!result.success) {
        setError(result.error || 'Failed to discard card');
      } else {
        setSelectedCardId(null);
        // Don't auto-end turn - let user manually end turn or show hand
      }
    } catch (error) {
      setError('Error discarding card');
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleCardClick = (card: Card) => {
    if (!isMyTurn || !hasDrawnCard || hasDiscardedCard) return;
    setSelectedCardId(selectedCardId === card.id ? null : card.id);
  };

  const handleEndTurn = async () => {
    await endTurn(roomId, playerUid);
  };

  const penalty = gameState?.score || 80;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className='text-white min-h-screen w-full flex items-center justify-center relative overflow-hidden'>
      <LeaveRummyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLeave={() => {
          // Call parent's leave handler to notify server (server will handle socket.leave)
          if (onLeave) {
            onLeave();
          }

          // Navigate away (component will unmount and clean up all event listeners via useEffect cleanup)
          navigate('/');
        }}
      />
      {/* Error display */}

      {error && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg z-50 shadow-lg'>
          {error}
          <button
            onClick={() => setError(null)}
            className='ml-4 text-white hover:text-gray-200'
          >
            ×
          </button>
        </div>
      )}
      <LeaveRoomBtn handleClick={() => setModalOpen(true)} />
      <div
        className={`relative mx-4 lg:mx-32 xl:mx-64 h-[900px] shadow-xl border-4 border-solid border-b-blue-500 w-full max-h-[90vh]  rounded-[130px] bg-black-russian-900 text-center text-2xl p-8 flex items-center justify-center`}
      >
        <DeckAndDiscard
          gameState={gameState}
          isMyTurn={isMyTurn}
          hasDrawnCard={hasDrawnCard}
          onDrawFromDeck={handleDrawFromDeck}
          onDrawFromDiscard={handleDrawFromDiscard}
        />

        <GameIndicators gameState={gameState} isMyTurn={isMyTurn} />

        <DisplayPlayers
          currentPlayer={currentPlayer}
          players={players}
          gameState={gameState}
        />

        {/* Player's Hand */}
        {displayHand && (
          <>
            <DisplayOpponentsCards />

            <DisplayCards
              cards={displayHand}
              canClick={isMyTurn && hasDrawnCard && !hasDiscardedCard}
              onCardClick={handleCardClick}
              selectedCardId={selectedCardId}
              onReorderCards={handleReorderCards}
              isMyTurn={isMyTurn}
              penalty={penalty}
            />
          </>
        )}

        <ActionButtons
          isMyTurn={isMyTurn}
          hasDrawnCard={hasDrawnCard}
          hasDiscardedCard={hasDiscardedCard}
          selectedCardId={selectedCardId}
          isActionLoading={isActionLoading}
          gameState={gameState}
          onDrawFromDeck={handleDrawFromDeck}
          onDrawFromDiscard={handleDrawFromDiscard}
          onDiscardCard={handleDiscardCard}
          onEndTurn={handleEndTurn}
        />
      </div>
    </div>
  );
};
