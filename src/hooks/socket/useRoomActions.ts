import { useCallback, useMemo } from 'react';
import type { Socket } from 'socket.io-client';
import type { RoomActionResponseT, RoomListResponseT } from './types';
import { SOCKET_EVENTS, TIMEOUTS } from './constants';
import type { RoomT } from '../../types/room';

const genRoomId = (): string => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

/**
 * Helper to emit socket event and wait for callback response with timeout
 */
const emitWithCallback = <T = any>(
  socket: Socket | null,
  event: string,
  data: any = null,
  timeoutMs = TIMEOUTS.roomAction
): Promise<T | null> => {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      console.warn(`[Socket] ${event} - socket not connected`);
      return resolve(null);
    }

    const timer = setTimeout(() => {
      console.warn(`[Socket] ${event} timed out after ${timeoutMs}ms`);
      resolve(null);
    }, timeoutMs);

    const callback = (response: T) => {
      clearTimeout(timer);
      resolve(response);
    };

    // Always emit with (data, callback). If caller passed `null`, send null as
    // the data so server handlers using signature (data, callback) receive the
    // callback as expected.
    try {
      socket.emit(event, data, callback);
    } catch (err) {
      clearTimeout(timer);
      console.error(`[Socket] Error emitting ${event}:`, err);
      resolve(null);
    }
  });
};

/**
 * Composable hook for room-related socket actions
 */
export const useRoomActions = (socket: Socket | null) => {
  /**
   * Join an existing room
   */

  const joinRoom = useCallback(
    async (roomId: string, uid: string, name: string) => {
      if (!socket?.connected) {
        return { success: false, error: 'Socket not connected' };
      }
      const response: {
        success: boolean;
        roomState?: RoomT;
        error?: string;
      } = await socket.emitWithAck(SOCKET_EVENTS.ROOM_JOIN, {
        roomId,
        uid,
        name,
      });
      return response;
    },
    [socket]
  );

  //   const getYourRooms = useCallback(
  //     async (uid: string) => {
  //       if (!socket?.connected) {
  //         return { success: false, error: 'Socket not connected' };
  //       }
  //       const response: {
  //         success: boolean;
  //         rooms?: RoomDataT[];
  //         error?: string;
  //       } = await socket.emitWithAck(SOCKET_EVENTS.ROOM_GET_YOUR_ROOMS, {
  //         uid,
  //       });
  //       return response;
  //     },
  //     [socket]
  //   );
  const getRoom = useCallback(
    async (roomId: string) => {
      if (!socket?.connected) {
        return { success: false, error: 'Socket not connected' };
      }
      const response: {
        success: boolean;
        room?: RoomT;
        error?: string;
      } = await socket.emitWithAck(SOCKET_EVENTS.ROOM_GET, {
        roomId,
      });
      return response;
    },
    [socket]
  );
  /**
   * Leave a room
   */
  const leaveRoom = useCallback(
    (roomId: string, uid: string) => {
      socket?.emit(SOCKET_EVENTS.ROOM_LEAVE, { roomId, uid });
    },
    [socket]
  );

  /**
   * Create a new room with auto-retry on ID collision
   */
  const createRoom = useCallback(
    async (
      hostUid: string,
      hostName: string,
      rummyType: 'indian' | 'gin' = 'indian',
      numOfPlayers: 2 | 3 | 4 = 2,
      maxRetries = 3
    ): Promise<RoomActionResponseT> => {
      if (!socket?.connected) {
        console.error('[createRoom] Socket not connected');
        return { success: false, error: 'Socket not connected' };
      }

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const roomId = genRoomId();

        try {
          const response = await emitWithCallback(
            socket,
            SOCKET_EVENTS.ROOM_CREATE,
            {
              uid: hostUid,
              rummyType,
              numOfPlayers,
              roomId,
              name: hostName,
            },
            TIMEOUTS.roomAction
          );

          if (!response) {
            return { success: false, error: 'Request timeout' };
          }

          if (response?.success && response.roomId) {
            return { success: true, roomId: response.roomId };
          }

          const err = response?.error || 'Failed to create room';
          const isRoomExists =
            response?.error === 'room_exists' || /room exists/i.test(err);

          if (isRoomExists && attempt < maxRetries) {
            continue;
          }

          return { success: false, error: err };
        } catch (err) {
          return {
            success: false,
            error: 'An error occurred while creating room',
          };
        }
      }

      return { success: false, error: 'Max retries exceeded' };
    },
    [socket]
  );

  /**
   * List all available rooms
   */
  const listAllRooms = useCallback(async (): Promise<RoomListResponseT> => {
    if (!socket?.connected) {
      return { success: false, error: 'Socket not connected' };
    }

    // Some server implementations expect only a callback (no data). Pass null
    // to ensure we emit as `socket.emit(event, callback)`.
    const response = await emitWithCallback<any>(
      socket,
      SOCKET_EVENTS.ROOM_LIST,
      null,
      TIMEOUTS.roomList
    );

    if (!response) {
      return { success: false, error: 'Request timeout' };
    }

    if (response?.success && Array.isArray(response.rooms)) {
      return { success: true, rooms: response.rooms };
    }

    return {
      success: false,
      error: response?.error || 'Failed to fetch rooms',
    };
  }, [socket]);

  /**
   * Listen to room updates
   */
  const onRoomUpdated = useCallback(
    (callback: (roomState: RoomT) => void) => {
      if (!socket) return () => {};

      socket.on(SOCKET_EVENTS.ROOM_UPDATED, callback);
      return () => {
        socket.off(SOCKET_EVENTS.ROOM_UPDATED, callback);
      };
    },
    [socket]
  );

  /**
   * Listen to room closed event
   */
  const onRoomClosed = useCallback(
    (callback: () => void) => {
      if (!socket) return () => {};

      socket.on(SOCKET_EVENTS.ROOM_CLOSED, callback);

      return () => {
        socket.off(SOCKET_EVENTS.ROOM_CLOSED, callback);
      };
    },
    [socket]
  );

  /**
   * Update player name
   */
  const updateName = useCallback(
    async (roomId: string, name: string) => {
      if (!socket?.connected) {
        return { success: false, error: 'Socket not connected' };
      }

      const response = await emitWithCallback<{
        success: boolean;
        error?: string;
      }>(socket, 'room:update-name', { roomId, name });

      return response || { success: false, error: 'No response' };
    },
    [socket]
  );

  /**
   * Toggle ready state
   */
  const toggleReady = useCallback(
    async (roomId: string) => {
      if (!socket?.connected) {
        return { success: false, error: 'Socket not connected' };
      }

      const response = await emitWithCallback<{
        success: boolean;
        error?: string;
      }>(socket, 'room:toggle-ready', { roomId });

      return response || { success: false, error: 'No response' };
    },
    [socket]
  );

  return useMemo(
    () => ({
      joinRoom,
      leaveRoom,
      createRoom,
      listAllRooms,
      onRoomUpdated,
      onRoomClosed,
      getRoom,
      updateName,
      toggleReady,
    }),
    [
      joinRoom,
      leaveRoom,
      createRoom,
      listAllRooms,
      onRoomUpdated,
      onRoomClosed,
      getRoom,
      updateName,
      toggleReady,
    ]
  );
  // return {
  //   joinRoom,
  //   leaveRoom,
  //   createRoom,
  //   listAllRooms,
  //   onRoomUpdated,
  //   onRoomClosed,
  //   // getYourRooms,
  //   getRoom,
  // };
};
