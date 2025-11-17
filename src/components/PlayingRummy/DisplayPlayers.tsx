import type { playerTypeT } from '../types';
import type { GameStateT } from '../../types/game';
import { PlayerCircle } from './PlayerCircle';

export const DisplayPlayers = (props: {
  currentPlayer: playerTypeT;
  players: playerTypeT[];
  gameState: GameStateT | null;
}) => {
  const { currentPlayer, players, gameState } = props;
  const numOfPlayers = players.length;
  const currentPlayerUid = gameState?.currentPlayerUid || '';

  const getPlayerCardCount = (uid: string) => {
    return gameState?.playerHands[uid] || 0;
  };

  if (numOfPlayers === 2) {
    const otherPlayer = players.find((p) => p.uid !== currentPlayer.uid)!;
    return (
      <>
        <div className='absolute -top-14 xl:-top-24 left-1/2 transform -translate-x-1/2 z-10'>
          <PlayerCircle
            player={otherPlayer}
            isCurrentTurn={otherPlayer.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayer.uid)}
          />
        </div>
      </>
    );
  } else if (numOfPlayers === 3) {
    const otherPlayers = players.filter((p) => p.uid !== currentPlayer.uid);
    return (
      <>
        <div className='absolute -top-14 xl:-top-24 left-1/2 transform -translate-x-1/2'>
          <PlayerCircle
            player={otherPlayers[0]!}
            isCurrentTurn={otherPlayers[0]!.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayers[0]!.uid)}
          />
        </div>
        <div className='absolute -left-14 xl:-left-24 top-1/2 transform -translate-y-1/2'>
          <PlayerCircle
            player={otherPlayers[1]!}
            isCurrentTurn={otherPlayers[1]!.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayers[1]!.uid)}
          />
        </div>
      </>
    );
  } else if (numOfPlayers === 4) {
    const otherPlayers = players.filter((p) => p.uid !== currentPlayer.uid);
    return (
      <>
        <div className='absolute -top-14 xl:-top-24 left-1/2 transform -translate-x-1/2'>
          <PlayerCircle
            player={otherPlayers[0]!}
            isCurrentTurn={otherPlayers[0]!.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayers[0]!.uid)}
          />
        </div>
        <div className='absolute -left-14 xl:-left-24 top-1/2 transform -translate-y-1/2'>
          <PlayerCircle
            player={otherPlayers[1]!}
            isCurrentTurn={otherPlayers[1]!.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayers[1]!.uid)}
          />
        </div>
        <div className='absolute -right-14 xl:-right-24 top-1/2 transform -translate-y-1/2'>
          <PlayerCircle
            player={otherPlayers[2]!}
            isCurrentTurn={otherPlayers[2]!.uid === currentPlayerUid}
            cardCount={getPlayerCardCount(otherPlayers[2]!.uid)}
          />
        </div>
      </>
    );
  }
  return null;
};
