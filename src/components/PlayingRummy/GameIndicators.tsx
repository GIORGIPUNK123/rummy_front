import type { GameStateT } from '../../types/game';

export const GameIndicators = (props: {
  gameState: GameStateT | null;
  isMyTurn: boolean;
}) => {
  const { gameState, isMyTurn } = props;

  return (
    <>
      {/* Turn Indicator */}
      {isMyTurn && (
        <div className='absolute top-2 right-4 bg-green-600 px-4 py-2 rounded text-lg font-bold animate-pulse'>
          Your Turn!
        </div>
      )}

      {/* Wild Joker Indicator - displayed as actual card at top-right */}
      {gameState?.wildJokerCard ? (
        <div
          className='absolute top-16 right-4 flex flex-col items-center gap-1 z-20'
          style={{
            display: 'flex',
          }}
        >
          <div className='bg-yellow-600/90 px-2 py-1 rounded text-xs font-semibold text-black whitespace-nowrap'>
            Wild Joker
          </div>
          <div
            style={{
              display: 'block',
              width: '80px',
              height: 'auto',
            }}
          >
            <playing-card
              rank={gameState.wildJokerCard.value}
              suit={gameState.wildJokerCard.suit}
              className='w-14 md:w-16 lg:w-18 xl:w-20'
              style={{
                display: 'block',
                // width: '80px',
                height: 'auto',
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
