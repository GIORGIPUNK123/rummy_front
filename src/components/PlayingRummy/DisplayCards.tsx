import { useState } from 'react';
import type { Card } from '../../types/game';
import { DisplayPenalty } from './DisplayPenalty';

export const DisplayCards = (props: {
  cards: Card[];
  canClick: boolean;
  onCardClick?: (card: Card) => void;
  selectedCardId?: string | null;
  onReorderCards?: (reorderedCards: Card[]) => void;
  isMyTurn: boolean;
  penalty: number;
}) => {
  const {
    cards,
    onCardClick,
    selectedCardId,
    canClick,
    onReorderCards,
    isMyTurn,
    penalty,
  } = props;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isMyTurn) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (
      draggedIndex === null ||
      draggedIndex === dropIndex ||
      !onReorderCards
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newCards = [...cards];
    const draggedCard = newCards[draggedIndex];
    newCards.splice(draggedIndex, 1);
    newCards.splice(dropIndex, 0, draggedCard);

    onReorderCards(newCards);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div
        className={` ml-6  ${
          isMyTurn ? 'opacity-100' : 'opacity-50'
        } absolute bottom-12 left-1/2 transform -translate-x-1/2 flex justify-center items-end`}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            draggable={isMyTurn}
            onDragStart={isMyTurn ? (e) => handleDragStart(e, i) : undefined}
            onDragOver={isMyTurn ? (e) => handleDragOver(e, i) : undefined}
            onDragLeave={isMyTurn ? handleDragLeave : undefined}
            onDrop={isMyTurn ? (e) => handleDrop(e, i) : undefined}
            onDragEnd={isMyTurn ? handleDragEnd : undefined}
            onClick={() => (canClick ? onCardClick?.(card) : null)}
            className={`transition-all duration-200 -ml-12 ${
              isMyTurn ? 'opacity-100 cursor-pointer' : ' cursor-not-allowed  '
            } 
            ${
              isMyTurn && selectedCardId !== card.id
                ? 'hover:scale-110  hover:-translate-y-2.5'
                : ''
            }
            ${
              selectedCardId === card.id
                ? 'transform scale-125 -translate-y-5'
                : ''
            }
            ${draggedIndex === i ? 'scale-90' : ''}
            ${dragOverIndex === i ? 'translate-x-2' : ''}
            ${isMyTurn ? 'cursor-grab active:cursor-grabbing' : ''}
            
            `}
            style={{
              // marginRight: '-40px',
              zIndex: draggedIndex === i ? 1000 : cards.length + i,
              // opacity: canClick ? 1 : 0.5,
            }}
          >
            <playing-card
              className='w-20 h-28 xl:w-24 xl:h-36'
              rank={card.value}
              suit={card.suit}
            />
          </div>
        ))}
      </div>
      <DisplayPenalty penalty={penalty} />
      {!isMyTurn ? (
        <span className='absolute bottom-24 opacity-100 text-white text-shadow-black text-shadow-md text-3xl w-full text-center'>
          Wait For Your Turn
        </span>
      ) : null}
    </>
  );
};
