export const DisplayPenalty = (props: { penalty: number }) => {
  const { penalty } = props;

  return (
    <div className='hover:shadow-2xl transition-shadow duration-200 absolute top-12 left-10 z-10 bg-black/70 border border-white/10 rounded-xl h-16 sm:w-20 px-3 py-2  flex flex-col gap-0.5 backdrop-blur-sm'>
      <span className='text-[9px] uppercase tracking-[0.2em] text-gray-300'>
        Penalty
      </span>
      <span className='text-white text-md  font-semibold'>{penalty}</span>
    </div>
  );
};
