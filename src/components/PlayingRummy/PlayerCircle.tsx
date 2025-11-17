import type { playerTypeT } from '../types';

export const PlayerCircle = (props: {
  player: playerTypeT;
  isCurrentTurn: boolean;
  cardCount: number;
}) => {
  const { player, isCurrentTurn } = props;
  const { name } = player;
  return (
    <div
      className={` z-10 rounded-full w-20 h-20 md:w-20 md:h-20 xl:w-36 xl:h-36 border-2 border-solid text-center flex flex-col justify-center items-center text-xl font-mono transition-all duration-300 ${
        isCurrentTurn
          ? 'bg-black-russian-600 border-black-russian-700 scale-110 shadow-lg shadow-blue-500/50'
          : 'bg-gray-800 border-white'
      }`}
    >
      <span className='text-white sm:text-sm xl:text-lg '>{name}</span>
    </div>
  );
};
