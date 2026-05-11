'use client';

import { Temporal } from '@js-temporal/polyfill';
import { useMemo } from 'react';

import { TIMEZONE } from '@app/config/public';
import type { Game, GameDate } from '@app/lib/game';
import { useCurrentTime } from '@app/lib/time';

interface Props {
  game: Game;
}

const getEndTime = ({ day, month, year }: GameDate): number =>
  Temporal.ZonedDateTime.from({
    timeZone: TIMEZONE,
    year,
    month,
    day,
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  }).epochMilliseconds;

const getIntervalString = ({
  from,
  to,
}: {
  from: number;
  to: number;
}): string => {
  const totalSeconds = Math.max(0, Math.floor((to - from) / 1000));

  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = totalSeconds - hours * 60 * 60 - minutes * 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

export const CountdownClock = ({ game }: Props) => {
  const currentTime = useCurrentTime();
  const endTime = useMemo(() => getEndTime(game.date), [game.date]);

  return (
    <span>
      {currentTime
        ? getIntervalString({ from: currentTime, to: endTime })
        : '--:--:--'}
    </span>
  );
};
