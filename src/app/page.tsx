import type { Metadata } from 'next';

import { type Game, getDay, getGameForDay } from '@app/lib/game';
import { GamePage } from '@app/ui/GamePage';

export const revalidate = 60;

const getGameForToday = async (): Promise<Game> => {
  const { WORDS } = await import('@app/config/private');

  return getGameForDay({ day: getDay(), words: WORDS });
};

const shareImage = {
  height: 359,
  width: 856,
  url: '/share.png',
};
export const generateMetadata = async (): Promise<Metadata> => {
  const game = await getGameForToday();

  return {
    openGraph: {
      images: [shareImage],
      siteName: 'SQWORDLE',
      type: 'website',
      url: '/',
    },
    title: `SQWORDLE #${game.day}`,
    twitter: {
      card: 'summary_large_image',
    },
  } satisfies Metadata;
};

const Page = async () => {
  const game = await getGameForToday();

  return <GamePage game={game} />;
};

export default Page;
