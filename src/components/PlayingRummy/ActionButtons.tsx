import type { GameStateT } from '../../types/game';

export const ActionButtons = (props: {
  isMyTurn: boolean;
  hasDrawnCard: boolean;
  hasDiscardedCard: boolean;
  selectedCardId: string | null;
  isActionLoading: boolean;
  gameState: GameStateT | null;
  onDrawFromDeck: () => void;
  onDrawFromDiscard: () => void;
  onDiscardCard: () => void;
  onEndTurn: () => void;
}) => {
  const {
    isMyTurn,
    hasDrawnCard,
    hasDiscardedCard,
    selectedCardId,
    isActionLoading,
    onDiscardCard,
    onEndTurn,
  } = props;

  if (!isMyTurn) return null;

  return (
    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 flex-wrap justify-center max-w-full px-4'>
      {!hasDrawnCard && (
        <>
          {/* <button
            onClick={onDrawFromDeck}
            disabled={isActionLoading}
            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Draw from Deck
          </button> */}
          {/* {gameState?.discardPileTop && (
            <button
              onClick={onDrawFromDiscard}
              disabled={isActionLoading}
              className='px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Draw from Discard
            </button>
          )} */}
        </>
      )}
      {hasDrawnCard && !hasDiscardedCard && selectedCardId && (
        <button
          onClick={onDiscardCard}
          disabled={isActionLoading}
          className=' cursor-pointer px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Discard Selected Card
        </button>
      )}
      {hasDrawnCard && hasDiscardedCard && (
        <button
          onClick={onEndTurn}
          disabled={isActionLoading}
          className='text-sm cursor-pointer sm:px-4 sm:1.5 xl:px-6 xl:py-3 bg-black-russian-500 hover:bg-black-russian-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          End Turn
        </button>
      )}
    </div>
  );
};
