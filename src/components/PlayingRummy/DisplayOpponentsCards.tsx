import backCardImage from '../../assets/cards/deck.svg';

export const DisplayOpponentsCards = () => {
  // number of visible cards for opponents
  const count = 13;
  const cards = Array.from({ length: count });

  return (
    <div className=' absolute top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-end pointer-events-none'>
      <div className='flex items-end'>
        {cards.map((_, i) => (
          <div
            key={i}
            className={`relative ${i > 0 ? '-ml-10 sm:-ml-10' : ''}`}
            style={{ zIndex: i }}
          >
            <img
              src={backCardImage}
              alt={`Opponent's card ${i + 1}`}
              className='w-24 sm:w-24  shadow-lg'
            />
          </div>
        ))}
      </div>
    </div>
  );
};
