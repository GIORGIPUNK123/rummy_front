import type { GameStateT } from '../../types/game';
import deckImg from '../../assets/cards/deck.svg';

export const DeckAndDiscard = (props: {
  gameState: GameStateT | null;
  isMyTurn: boolean;
  hasDrawnCard: boolean;
  onDrawFromDeck: () => void;
  onDrawFromDiscard: () => void;
}) => {
  const {
    gameState,
    isMyTurn,
    hasDrawnCard,
    onDrawFromDeck,
    onDrawFromDiscard,
  } = props;

  return (
    <>
      {/* Deck */}
      <div
        className='absolute w-16 sm:w-16 xl:w-24 top-1/3 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-200 z-10'
        onClick={onDrawFromDeck}
        title={isMyTurn && !hasDrawnCard ? 'Draw from deck' : ''}
      >
        <img src={deckImg} alt='deck' />
        {gameState && (
          <div className='absolute top-0 right-0 bg-black bg-opacity-75 px-1 py-0.5 xl:px-2 xl:py-1 rounded text-xs'>
            {gameState.deckCount}
          </div>
        )}
      </div>

      {/* Discard Pile */}
      {gameState?.discardPileTop ? (
        <div
          className='w-16 sm:w-16 xl:w-20 absolute top-1/3 xl:left-1/2 transform translate-x-20 cursor-pointer hover:scale-110 transition-transform duration-200 z-10'
          style={{
            height: 'auto',
            display: 'block',
          }}
          onClick={onDrawFromDiscard}
          title={isMyTurn && !hasDrawnCard ? 'Draw from discard' : ''}
        >
          <playing-card
            rank={gameState.discardPileTop.value}
            suit={gameState.discardPileTop.suit}
            className='w-18 xl:w-26'
            style={{
              display: 'block',
              // width: '96px',
              height: 'auto',
            }}
          />
        </div>
      ) : null}
    </>
  );
};
