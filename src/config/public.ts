import { zonedTimeToUtc } from 'date-fns-tz';

////
/// Server settings
//

export const APP_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || 'local';
export const DEPLOYMENT_HOST =
  process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';

export const PROTOCOL = APP_ENV === 'local' ? 'http:' : 'https:';
export const ORIGIN =
  process.env.NEXT_PUBLIC_ORIGIN || `${PROTOCOL}//${DEPLOYMENT_HOST}`;

////
/// Game settings
//

export const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';

const startDateString = process.env.NEXT_PUBLIC_START_DATE;
if (typeof startDateString !== 'string') {
  throw new Error('Missing NEXT_PUBLIC_START_DATE');
}
export const START_DATE = zonedTimeToUtc(startDateString, TIMEZONE);

////
/// Plausible Analytics
//
export const PLAUSIBLE_ANALYTICS_DOMAIN =
  process.env.NEXT_PUBLIC_PLAUSIBLE_ANALYTICS_DOMAIN;
