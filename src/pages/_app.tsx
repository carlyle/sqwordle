import { AppProps } from 'next/app';
import Head from 'next/head';
import PlausibleAnalyticsProvider from 'next-plausible';
import { Provider as ReakitProvider } from 'reakit/Provider';

import { ORIGIN, PLAUSIBLE_ANALYTICS_DOMAIN } from '@app/config/public';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>

    <PlausibleAnalyticsProvider
      customDomain={ORIGIN}
      domain={PLAUSIBLE_ANALYTICS_DOMAIN || ''}
      enabled={typeof PLAUSIBLE_ANALYTICS_DOMAIN === 'string'}
    >
      <ReakitProvider>
        <Component {...pageProps} />
      </ReakitProvider>
    </PlausibleAnalyticsProvider>

    <style jsx global>{`
      body {
        font-family: Consolas, Menlo, Monaco, monospace;
        max-width: 680px;
        margin: 0 auto;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </>
);

export default App;
