import { useEffect, useState } from 'react';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    setCurrentTime(Date.now());

    if (typeof window.requestAnimationFrame === 'function') {
      let frameId: number;
      const onAnimationFrame = () => {
        setCurrentTime(Date.now());

        frameId = window.requestAnimationFrame(onAnimationFrame);
      };

      frameId = window.requestAnimationFrame(onAnimationFrame);

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    } else {
      const intervalId = setInterval(() => setCurrentTime(Date.now()), 100);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [setCurrentTime]);

  return currentTime;
};
