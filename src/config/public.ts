import { zonedTimeToUtc } from 'date-fns-tz';

export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';
export const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';

const startDateString = process.env.NEXT_PUBLIC_START_DATE;
if (typeof startDateString !== 'string') {
  throw new Error('Missing NEXT_PUBLIC_START_DATE');
}
export const START_DATE = zonedTimeToUtc(startDateString, TIMEZONE);
