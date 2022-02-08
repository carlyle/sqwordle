import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider as ReakitProvider } from 'reakit/Provider';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>

    <ReakitProvider>
      <Component {...pageProps} />
    </ReakitProvider>

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
