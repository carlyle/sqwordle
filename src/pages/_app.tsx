import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Component {...pageProps} />
    <style jsx global>{`
      body {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue',
          'Helvetica', 'Arial', sans-serif;
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
