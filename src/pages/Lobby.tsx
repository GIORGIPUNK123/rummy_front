import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftPart } from '../components/LeftPart';
import { RightPart } from '../components/RightPart';
import type { Socket } from 'socket.io-client';
import { useRoomActions } from '../hooks/socket/useRoomActions';
// import { useSocket } from '../hooks/useSocket';

export const Lobby = (props: { socket: Socket; isConnected: boolean }) => {
  const [rummyType, setRummyType] = useState<'indian' | 'gin'>('indian');
  const [numOfPlayers, setNumOfPlayers] = useState<2 | 3 | 4>(2);
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();
  const { createRoom } = useRoomActions(props.socket);

  const handleCreateRoom = async () => {
    if (!props.isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }

    if (!name.trim()) {
      alert('Please enter a player name');
      return;
    }

    try {
      const res = await createRoom(
        props.socket.id!,
        name,
        rummyType,
        numOfPlayers
      );

      if (res.success && res.roomId) {
        navigate(`/room/${res.roomId}`, {
          state: { playerUid: props.socket.id!, playerName: name },
        });
      } else {
        alert(`Failed to create room: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Error creating room');
    }
  };

  return (
    <div className='flex flex-col mt-8 sm:mt-12 md:mt-16 mx-4 sm:mx-8 md:mx-16 lg:mx-32 text-white relative'>
      {/* <div className='absolute top-4 right-8 text-sm'>
        <span className='text-gray-300 mr-2'>Socket ID:</span>
        <span className='font-mono'>{props.socket?.id || 'Connecting...'}</span>
      </div> */}
      <h1 className='text-2xl sm:text-3xl md:text-4xl text-center font-bold'>
        Play Rummy
      </h1>

      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8'>
        <LeftPart
          rummyType={rummyType}
          setRummyType={setRummyType}
          numOfPlayers={numOfPlayers}
          setNumOfPlayers={setNumOfPlayers}
          name={name}
          setName={setName}
          handleCreateRoom={handleCreateRoom}
        />
        <RightPart rummyType={rummyType} />
      </div>
      <div className='flex flex-col items-center'></div>
    </div>
  );
};
