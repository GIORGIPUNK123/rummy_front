import { useState } from 'react';
import { ButtonAtom } from '../atoms/ButtonAtom';
import { InputAtom } from '../atoms/InputAtom';

interface ShareRoomProps {
  roomId: string;
}

export const ShareRoom = ({ roomId }: ShareRoomProps) => {
  const [copied, setCopied] = useState(false);

  const roomLink = `${window.location.origin}/room/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='mt-4 sm:mt-8 p-3 sm:p-4 md:p-6 border border-gray-600 rounded-lg bg-gray-900 w-full mx-auto'>
      <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3'>
        Share Room Link
      </h3>
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center'>
        <InputAtom
          value={roomLink}
          readOnly
          full
          className='flex-1 min-w-0 overflow-x-auto'
        />
        <div className='w-full sm:w-auto sm:shrink-0'>
          <ButtonAtom
            text={copied ? '✓ Copied' : 'Copy'}
            onClick={handleCopy}
            full={true}
          />
        </div>
      </div>
      <p className='mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400'>
        Share this link with friends to invite them to the game
      </p>
    </div>
  );
};
