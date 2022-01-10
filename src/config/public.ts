export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || '';
if (!ORIGIN) {
  throw new Error('Missing ORIGIN');
}
