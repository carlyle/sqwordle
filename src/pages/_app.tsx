import { AppProps } from 'next/app';
import Head from 'next/head';

import { globalCss } from '@app/ui/core';

const renderGlobalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
  },

  body: {
    margin: '0 auto',
    maxWidth: 680,

    backgroundColor: '$slate1',

    fontFamily: '$monospace',
    fontSize: '$md',
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  renderGlobalStyles();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
