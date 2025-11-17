import { useEffect, useState } from 'react';

interface CountdownProps {
  startedAt: number | undefined;
  duration: number;
  onComplete?: () => void;
}

export const Countdown = ({
  startedAt,
  duration,
  onComplete,
}: CountdownProps) => {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!startedAt) return;

    const updateCountdown = () => {
      const elapsed = Date.now() - startedAt;
      const timeLeft = Math.max(0, duration - elapsed);
      setRemaining(Math.ceil(timeLeft / 1000));

      if (timeLeft <= 0) {
        onComplete?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [startedAt, duration, onComplete]);

  return (
    <div className='flex flex-col items-center justify-center my-8'>
      <div className='text-6xl font-bold text-yellow-400 animate-pulse'>
        {remaining}
      </div>
      <p className='mt-4 text-xl text-gray-300'>Game starting in...</p>
    </div>
  );
};
