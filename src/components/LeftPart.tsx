import { SelectBit } from '../atoms/SelectBit';
import { ButtonAtom } from '../atoms/ButtonAtom';

export const LeftPart = (props: {
  rummyType: 'indian' | 'gin';
  setRummyType: React.Dispatch<React.SetStateAction<'indian' | 'gin'>>;
  numOfPlayers: 2 | 3 | 4;
  setNumOfPlayers: React.Dispatch<React.SetStateAction<2 | 3 | 4>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleCreateRoom: () => void;
}) => {
  return (
    <div className='p-3 sm:p-4 bg-[#181835] w-full lg:w-102 rounded-lg gap-4 sm:gap-6 flex flex-col'>
      <span className='text-xl sm:text-2xl mb-2 sm:mb-3 text-center'>
        Create Room
      </span>
      <div className='bg-black-russian-950 rounded-lg p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full m:gap-4'>
        <label className='mr-4 text-base sm:text-lg'>Select Rummy Type:</label>
        <SelectBit
          full
          active={props.rummyType === 'indian'}
          text='Indian'
          onClick={() => props.setRummyType('indian')}
        />
        <SelectBit
          full
          active={props.rummyType === 'gin'}
          text='Gin'
          onClick={() => props.setRummyType('gin')}
        />
      </div>

      <div className='bg-black-russian-950 rounded-lg p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full'>
        <label className='mr-4 text-base sm:text-lg'>Number Of Players</label>

        {props.rummyType === 'gin' ? (
          <SelectBit
            full
            active={props.numOfPlayers === 2}
            text='2'
            onClick={() => props.setNumOfPlayers(2)}
          />
        ) : (
          <>
            <SelectBit
              full
              active={props.numOfPlayers === 2}
              text='2'
              onClick={() => props.setNumOfPlayers(2)}
            />
            <SelectBit
              full
              active={props.numOfPlayers === 3}
              text='3'
              onClick={() => props.setNumOfPlayers(3)}
            />
            <SelectBit
              full
              active={props.numOfPlayers === 4}
              text='4'
              onClick={() => props.setNumOfPlayers(4)}
            />
          </>
        )}

        <div className='flex flex-col mt-2'>
          <input
            type='text'
            placeholder='Enter your name'
            className='mb-3 px-3 py-2 text-sm sm:text-base rounded bg-black-russian-700 text-white w-full'
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
          />
          <div className='w-full'>
            <ButtonAtom
              full
              text='Create Room'
              onClick={props.handleCreateRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
//
