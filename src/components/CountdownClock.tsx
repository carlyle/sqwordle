import { useCurrentDate } from '@app/lib/time';
import { differenceInSeconds } from 'date-fns';

type Props = {
  endDate: Date;
};

const getIntervalString = ({ from, to }: { from: Date; to: Date }): string => {
  const totalSeconds = differenceInSeconds(to, from, {
    roundingMethod: 'floor',
  });
  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = totalSeconds - hours * 60 * 60 - minutes * 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
};

const CountdownClock = ({ endDate }: Props) => {
  const currentDate = useCurrentDate();

  return (
    <span>
      {currentDate
        ? getIntervalString({ from: currentDate, to: endDate })
        : '--:--:--'}
    </span>
  );
};

export default CountdownClock;
