export const RightPart = (props: { rummyType: 'indian' | 'gin' }) => {
  const { rummyType } = props;

  // Rules for both variants
  const rules =
    rummyType === 'indian'
      ? {
          players: '2 - 4 (usually 4)',
          cards: '106 (2 decks)',
          jokers: '2 normal + 8 wild (1st face-up card decides wild joker)',
          aceValue: '1 or 10',
          startingHand: '13 cards',
          specialRule: 'None, random player starts',
          turnAction: 'Draw, then discard (from face-up or face-down pile)',
          tableKnock: 'No',
          winCondition: 'Valid hand; other players get penalty points',
        }
      : {
          players: '2 (1v1)',
          cards: '52 (1 deck)',
          jokers: '0',
          aceValue: 'Always 1',
          startingHand: '10 cards',
          specialRule: 'Both players can draw the first face-up card',
          turnAction: 'Draw, then discard (from face-up or face-down pile)',
          tableKnock: 'Yes, game ends 1 turn after a player knocks',
          winCondition: 'Highest hand wins; both players compare hand value',
        };

  // Card info sections
  const infoCards = [
    { title: 'Players', value: rules.players },
    { title: 'Deck', value: `${rules.cards}, Jokers: ${rules.jokers}` },
    { title: 'Ace Value', value: rules.aceValue },
    { title: 'Starting Hand', value: rules.startingHand },
    { title: 'Special Rule', value: rules.specialRule },
    { title: 'Turn Action', value: rules.turnAction },
    { title: 'Table Knock', value: rules.tableKnock },
    { title: 'Win Condition', value: rules.winCondition },
  ];

  return (
    <div className='flex flex-col w-full bg-[#181835] rounded-xl '>
      <h2 className='text-xl sm:text-2xl md:text-3xl text-center mt-4 sm:mt-6 md:mt-8'>
        Rules
      </h2>
      <div className='p-4 sm:p-6 md:p-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        {infoCards.map((card) => (
          <div
            key={card.title}
            className='bg-black-russian-950 p-4 sm:p-6 rounded-xl border-2 border-solid border-black-russian-800 flex flex-col gap-1 sm:gap-2 shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-200'
          >
            <p className='text-xs sm:text-sm text-gray-400'>{card.title}</p>
            <p className='text-sm sm:text-base text-white font-medium'>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
