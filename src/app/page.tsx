import type { Metadata } from 'next';

import { ORIGIN } from '@app/config/public';
import { type Game, getDay, getGameForDay } from '@app/lib/game';
import { GamePage } from '@app/ui/GamePage';

export const revalidate = 60;

const getGameForToday = async (): Promise<Game> => {
  const { WORDS } = await import('@app/config/private');

  return getGameForDay({ day: getDay(), words: WORDS });
};

const shareImageUrl = new URL('/share.png', ORIGIN);
export const generateMetadata = async (): Promise<Metadata> => {
  const game = await getGameForToday();

  const description = 'A Pokémon-themed take on Wordle';
  const title = `SQWORDLE #${game.day}`;

  return {
    alternates: { canonical: ORIGIN },
    description,
    icons: ['/favicon.ico'],
    title,
    openGraph: { description, images: [shareImageUrl], title, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      description,
      images: [shareImageUrl],
      title,
    },
  } satisfies Metadata;
};

const Page = async () => {
  const game = await getGameForToday();

  return <GamePage game={game} />;
};

export default Page;
