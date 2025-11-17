import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from './constants';
import type { UseSocketOptionsT } from './types';

export const useSocketConnection = (options: UseSocketOptionsT = {}) => {
  const { url = SOCKET_CONFIG.url } = options;
  const [socket, setSocket] = useState(() => io(url, { autoConnect: false }));
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  return { socket, isConnected };
};
