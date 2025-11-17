import './main.css';
import { Route, Routes } from 'react-router-dom';
import { Lobby } from './pages/Lobby';
import { Rummy } from './pages/Rummy';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from './hooks/socket/constants';
import { useEffect, useState } from 'react';
import type { cardTypeT } from './components/types';
// import { useSocket } from './hooks/useSocket';

export const App = () => {
  const [socket] = useState(() =>
    io(SOCKET_CONFIG.url, { autoConnect: false })
  );
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    // Connect once
    socket.connect();

    // Listen for connection events
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  let cards: cardTypeT[] = [];

  // // Generate all suit + value combinations (52 cards)
  // for (const suit of suits) {
  //   for (const value of values) {
  //     cards.push({ suit, value });
  //   }
  // }
  // cards.push({ suit: 'hearts', value: 'joker' }); // Red joker
  // cards.push({ suit: 'spades', value: 'joker' }); // Black joker
  return (
    <>
      {/* <button
        onClick={listAllRooms}
        className='cursor-pointer text-white bg-black-russian-900 absolute top-12 right-12 h-16 w-44 '
      >
        <span>List Rooms</span>
      </button> */}
      {cards.map((x: cardTypeT) => {
        return (
          <div className='w-16'>
            <playing-card
              className='w-12 h-16'
              rank={x.value}
              suit={x.suit}
            ></playing-card>
          </div>
        );
      })}
      <Routes>
        <Route
          path='/'
          element={<Lobby socket={socket} isConnected={isConnected} />}
        />
        <Route
          path='/room/:id'
          element={<Rummy socket={socket} isConnected={isConnected} />}
        />
      </Routes>
    </>
  );
};
