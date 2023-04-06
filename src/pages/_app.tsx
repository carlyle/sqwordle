import { AppProps } from 'next/app';
import Head from 'next/head';

import '../theme/global.scss';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>

    <Component {...pageProps} />
  </>
);

export default App;
