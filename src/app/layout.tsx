import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from 'react';

import '../theme/global.css';

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en-US">
    <body className="bg-slate-50">
      {children}
      <Analytics />
    </body>
  </html>
);

export default Layout;
