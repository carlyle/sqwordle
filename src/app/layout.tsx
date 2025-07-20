import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactNode } from 'react';

import { ORIGIN } from '@app/config/public';
import { getDay, getGameForDay } from '@app/lib/game';

import '../theme/global.css';

const shareImageUrl = new URL('/share.png', ORIGIN);
export const generateMetadata = async (): Promise<Metadata> => {
  const { WORDS } = await import('@app/config/private');

  const game = getGameForDay({ day: getDay(), words: WORDS });

  const description = 'A Pokémon-themed take on Wordle';
  const title = `SQWORDLE #${game.day}`;

  return {
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

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en-US">
    <body className="bg-slate-50">{children}</body>
  </html>
);

export default Layout;
