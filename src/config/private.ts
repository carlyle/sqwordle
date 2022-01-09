import { startOfDay, parseISO } from 'date-fns';

const { START_DATE: START_DATE__TEXT = '' } = process.env;

export const START_DATE = startOfDay(parseISO(START_DATE__TEXT));
