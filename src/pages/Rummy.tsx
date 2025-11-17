import {
  useLocation,
  useParams,
  useNavigate,
  type NavigateFunction,
} from 'react-router-dom';
import { ButtonAtom } from '../atoms/ButtonAtom';
import { InputAtom } from '../atoms/InputAtom';
import { useEffect, useState, useRef } from 'react';
import { ShareRoom } from '../components/ShareRoom';
import { Countdown } from '../components/Countdown';
import { PlayingRummy } from '../components/PlayingRummy';

import type { Socket } from 'socket.io-client';
import { useRoomActions } from '../hooks/socket/useRoomActions';
import type { RoomT } from '../types/room';

const addListeners = (
  socket: Socket | null,
  navigate: NavigateFunction,
  setRoom: React.Dispatch<React.SetStateAction<RoomT | null>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!socket) return;

  const handleRoomUpdated = (roomState: RoomT) => {
    setRoom(roomState);
    if (roomState.status === 'playing') setGameStarted(true);
  };

  const handleGameStart = (roomState: RoomT) => {
    setRoom(roomState);
    setGameStarted(true);
  };

  const handleRoomClosed = () => {
    alert('Room was closed by the host');
    navigate('/');
  };

  socket.on('room:updated', handleRoomUpdated);
  socket.on('game:start', handleGameStart);
  socket.on('room:closed', handleRoomClosed);

  return () => {
    socket.off('room:updated', handleRoomUpdated);
    socket.off('game:start', handleGameStart);
    socket.off('room:closed', handleRoomClosed);
  };
};

export const Rummy = (props: { socket: Socket; isConnected: boolean }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket, isConnected } = props;
  const [room, setRoom] = useState<RoomT | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(true);
  const { getRoom, joinRoom, leaveRoom, updateName, toggleReady } =
    useRoomActions(props.socket);
  const listenersSetupRef = useRef(false);
  // Player info
  const playerUid = location.state?.playerUid || socket?.id;
  const playerName = location.state?.playerName || '';
  const [localName, setLocalName] = useState<string>(
    location.state?.playerName || ''
  );

  // --- Attach socket listeners ---
  useEffect(() => {
    if (!socket) return;

    const cleanup = addListeners(socket, navigate, setRoom, setGameStarted);
    listenersSetupRef.current = true;

    return () => {
      listenersSetupRef.current = false;
      if (typeof cleanup === 'function') cleanup();
    };
  }, [navigate, socket]);

  // --- Join room ---
  useEffect(() => {
    if (!id || !isConnected) return;
    if (!listenersSetupRef.current) return; // wait until listeners attached

    (async () => {
      try {
        const res = await getRoom(id!);
        if (!res.success) {
          setError(res.error || 'Room does not exist.');
          setIsJoining(false);
          return;
        }

        const existingRoom = res.room!;
        const existingPlayer = existingRoom.players.find(
          (p) => p.uid === playerUid
        );
        if (!existingPlayer) {
          // Join with empty name if not provided (will show name input)
          const result = await joinRoom(id!, playerUid!, playerName || '');
          if (!result?.success) {
            setError(result?.error || 'Failed to join room');
            setIsJoining(false);
            return;
          }

          // fetch latest room state after join to sync any missed events
          const latest = await getRoom(id!);
          if (latest.success && latest.room) {
            setRoom(latest.room);
            // Set local name from room state
            const player = latest.room.players.find((p) => p.uid === playerUid);
            if (player) {
              setLocalName(player.name);
            }
          } else if (result.roomState) {
            setRoom(result.roomState);
            const player = result.roomState.players.find(
              (p) => p.uid === playerUid
            );
            if (player) {
              setLocalName(player.name);
            }
          }

          setIsJoining(false);
        } else {
          setRoom(existingRoom);
          setLocalName(existingPlayer.name);
          setIsJoining(false);
        }
      } catch (err) {
        console.error('Join flow error:', err);
        setError('An error occurred joining room');
        setIsJoining(false);
      }
    })();
  }, [
    id,
    socket,
    playerUid,
    playerName,
    joinRoom,
    leaveRoom,
    getRoom,
    setRoom,
    isConnected,
  ]);

  const handleLeaveRoom = () => {
    if (room) {
      leaveRoom(room.id, playerUid!);
    }
  };

  // Sync local name when room updates
  useEffect(() => {
    if (room && playerUid) {
      const player = room.players.find((p) => p.uid === playerUid);
      if (player && player.name !== localName) {
        setLocalName(player.name);
      }
    }
  }, [room, playerUid]);

  // --- Handle disconnect ---
  useEffect(() => {
    if (!socket && room) setError('Disconnected from server. Reconnecting...');
    else if (socket) setError(null);
  }, [socket, room]);

  if (error) {
    return (
      <div className='flex flex-col mt-12 mx-32 text-white'>
        <h1 className='text-4xl font-bold text-red-500'>Error</h1>
        <p className='mt-4 text-lg'>{error}</p>
        <ButtonAtom text='Back to Lobby' onClick={() => navigate('/')} />
      </div>
    );
  }
  if (isJoining || !room) {
    return (
      <div className='flex flex-col mt-12 mx-32 text-white'>
        <h1 className='text-4xl font-bold'>Joining room...</h1>
      </div>
    );
  }
  const currentPlayer = {
    uid: playerUid,
    name: playerName,
  };

  if (room.status === 'playing' && gameStarted) {
    return (
      <PlayingRummy
        currentPlayer={currentPlayer}
        players={room.players}
        roomId={room.id}
        socket={socket}
        playerUid={playerUid!}
        onLeave={handleLeaveRoom}
      />
    );
  } else if (room.status === 'waiting' || room.status === 'countdown') {
    const currentPlayer = room.players.find((p) => p.uid === playerUid);
    const isCurrentPlayerReady = currentPlayer?.isReady ?? false;
    const allReady =
      room.players.length === room.numOfPlayers &&
      room.players.every((p) => p.isReady === true);

    const handleNameUpdate = async () => {
      if (!localName.trim()) {
        alert('Name cannot be empty');
        return;
      }
      if (localName.trim().length > 20) {
        alert('Name must be 20 characters or less');
        return;
      }
      const result = await updateName(id!, localName.trim());
      if (!result.success) {
        alert(result.error || 'Failed to update name');
      }
    };

    const handleToggleReady = async () => {
      const result = await toggleReady(id!);
      if (!result.success) {
        alert(result.error || 'Failed to toggle ready');
      }
    };

    return (
      <div className='flex flex-col mt-12 mx-8 sm:mx-12 lg:mx-32 text-white relative'>
        <h1 className='text-4xl font-bold'>Room ID: {id}</h1>
        <p className='mt-2 text-lg'>Rummy Type: {room.rummyType}</p>
        <p className='mt-1 text-gray-400'>Status: {room.status}</p>

        {room.status === 'countdown' && (
          <Countdown
            key={room.players.length}
            startedAt={room.countdownStartedAt}
            duration={room.countdownDuration}
            onComplete={() => setGameStarted(true)}
          />
        )}

        {/* Name Input Section */}
        {room.status === 'waiting' && currentPlayer && (
          <div className='mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg'>
            <label className='block text-sm font-medium mb-2'>Your Name:</label>
            <div className='flex gap-2'>
              <InputAtom
                value={localName}
                onChange={setLocalName}
                placeholder='Enter your name'
                full
                className='flex-1'
              />
              <ButtonAtom text='Update' onClick={handleNameUpdate} />
            </div>
          </div>
        )}

        <h2 className='mt-6 text-2xl'>
          Players ({room.players.length}/{room.numOfPlayers}):
        </h2>
        <ul className='list-disc ml-6 mt-2 space-y-2'>
          {room.players.map((p) => (
            <li key={p.uid} className='flex items-center gap-2'>
              <span>{p.name}</span>
              {p.uid === playerUid && (
                <span className='text-yellow-400'>(You)</span>
              )}
              {p.isReady ? (
                <span className='text-green-400 font-semibold'>✓ Ready</span>
              ) : (
                <span className='text-gray-500'>Not Ready</span>
              )}
            </li>
          ))}
        </ul>

        {/* Ready Button */}
        {room.status === 'waiting' && currentPlayer && (
          <div className='mt-6'>
            <ButtonAtom
              text={isCurrentPlayerReady ? 'Not Ready' : 'Ready'}
              onClick={handleToggleReady}
              full
            />
            {allReady && (
              <p className='mt-2 text-center text-green-400 font-semibold'>
                All players ready! Game will start soon...
              </p>
            )}
          </div>
        )}

        <ShareRoom roomId={id!} />
        <div className='mt-6'>
          <ButtonAtom text='Back to Lobby' onClick={() => navigate('/')} />
        </div>
      </div>
    );
  } else if (room.status === 'aborted') {
    const scores = room?.gameState?.scores ?? room.gameState?.scores;

    return (
      <div className='flex flex-col mt-12 mx-32 text-white'>
        <h1 className='text-4xl font-bold mb-4'>Game Aborted</h1>
        <p className='mt-2 text-lg mb-6'>
          A player left the game. Here are the final scores:
        </p>

        {scores && Object.keys(scores).length > 0 ? (
          <div className='bg-gray-800 p-6 rounded-lg mb-6'>
            <h2 className='text-2xl font-semibold mb-4'>Final Scores:</h2>
            <div className='space-y-2'>
              {Object.entries(scores)
                .sort(([, a], [, b]) => a - b) // Sort by score (lowest first)
                .map(([uid, score]) => {
                  const player = room.players.find((p) => p.uid === uid);
                  return (
                    <div
                      key={uid}
                      className='flex justify-between items-center p-2 bg-gray-700 rounded'
                    >
                      <span className='text-lg'>
                        {player?.name || 'Unknown'}
                        {uid === playerUid && (
                          <span className='ml-2 text-yellow-400'>(You)</span>
                        )}
                      </span>
                      <span className='text-xl font-bold'>{score} points</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <p className='text-gray-400 mb-6'>No scores available</p>
        )}

        <ButtonAtom text='Back to Lobby' onClick={() => navigate('/')} />
      </div>
    );
  } else if (room.status === 'finished') {
    const scores = room?.gameState?.scores ?? {};
    const winner = room?.gameState?.winner ?? null;

    return (
      <div className='flex flex-col mt-12 mx-32 text-white'>
        <h1 className='text-4xl font-bold mb-4'>Game Finished!</h1>

        {winner && (
          <div className='mb-6'>
            <p className='text-2xl font-semibold text-yellow-400'>
              Winner:{' '}
              {room.players.find((p) => p.uid === winner)?.name || 'Unknown'}
            </p>
          </div>
        )}

        {scores && Object.keys(scores).length > 0 ? (
          <div className='bg-gray-800 p-6 rounded-lg mb-6'>
            <h2 className='text-2xl font-semibold mb-4'>Final Scores:</h2>
            <div className='space-y-2'>
              {Object.entries(scores)
                .sort(([, a], [, b]) => a - b) // Sort by score (lowest first)
                .map(([uid, score]) => {
                  const player = room.players.find((p) => p.uid === uid);
                  const isWinner = uid === winner;
                  return (
                    <div
                      key={uid}
                      className={`flex justify-between items-center p-2 rounded ${
                        isWinner
                          ? 'bg-yellow-600 border-2 border-yellow-400'
                          : 'bg-gray-700'
                      }`}
                    >
                      <span className='text-lg'>
                        {player?.name || 'Unknown'}
                        {uid === playerUid && (
                          <span className='ml-2 text-yellow-400'>(You)</span>
                        )}
                        {isWinner && (
                          <span className='ml-2 text-yellow-200'>👑</span>
                        )}
                      </span>
                      <span className='text-xl font-bold'>{score} points</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <p className='text-gray-400 mb-6'>No scores available</p>
        )}

        <ButtonAtom text='Back to Lobby' onClick={() => navigate('/')} />
      </div>
    );
  }
};
