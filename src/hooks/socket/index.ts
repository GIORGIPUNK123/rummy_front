import { useMemo } from 'react';
import { useSocketConnection } from './useSocketConnection';
import { useRoomActions } from './useRoomActions';
import { useGameActions } from './useGameActions';
import type { UseSocketOptionsT } from './types';

/**
 * Main hook that composes all socket functionality
 */
export const useSocket = (options: UseSocketOptionsT = {}) => {
  const { socket, isConnected } = useSocketConnection(options);

  const roomActions = useRoomActions(socket);
  const gameActions = useGameActions(socket);

  // Memoize the returned object to maintain referential stability
  return useMemo(
    () => ({
      socket,
      isConnected,
      ...roomActions,
      ...gameActions,
    }),
    [socket, roomActions, gameActions]
  );

  // return {
  //   socket,
  //   isConnected,
  //   ...roomActions,
  //   ...gameActions,
  // };
  // [socket, roomActions, gameActions]
  // );
};
