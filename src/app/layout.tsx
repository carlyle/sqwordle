import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../theme/global.css';
import { ORIGIN } from '@app/config/public';

const title = 'SQWORDLE';

export const metadata = {
  metadataBase: new URL(ORIGIN),

  description: 'A Pokémon-themed take on Wordle',
  title,
} satisfies Metadata;

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en-US">
    <body className="bg-slate-50">
      {children}
      <Analytics />
    </body>
  </html>
);

export default Layout;
