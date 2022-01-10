import { useEffect, useState } from 'react';

export const useCurrentDate = () => {
  const [currentTime, setCurrentTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setCurrentTime(new Date());

    if (typeof window.requestAnimationFrame === 'function') {
      let frameId: number;
      const onAnimationFrame = () => {
        setCurrentTime(new Date());

        frameId = window.requestAnimationFrame(onAnimationFrame);
      };

      frameId = window.requestAnimationFrame(onAnimationFrame);

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    } else {
      const intervalId = setInterval(() => setCurrentTime(new Date()), 100);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [setCurrentTime]);

  return currentTime;
};
