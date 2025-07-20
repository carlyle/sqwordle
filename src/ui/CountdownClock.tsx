'use client';

import { differenceInSeconds } from 'date-fns';

import { useCurrentTime } from '@app/lib/time';

interface Props {
  endAt: number;
}

const getIntervalString = ({
  from,
  to,
}: {
  from: number;
  to: number;
}): string => {
  const totalSeconds = Math.max(
    0,
    differenceInSeconds(to, from, { roundingMethod: 'floor' })
  );

  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = totalSeconds - hours * 60 * 60 - minutes * 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

export const CountdownClock = ({ endAt }: Props) => {
  const currentTime = useCurrentTime();

  return (
    <span>
      {currentTime
        ? getIntervalString({ from: currentTime, to: endAt })
        : '--:--:--'}
    </span>
  );
};
