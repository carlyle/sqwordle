import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Component {...pageProps} />
    <style jsx global>{`
      body {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue',
          'Helvetica', 'Arial', sans-serif;
        padding: 20px 20px 60px;
        max-width: 680px;
        margin: 0 auto;
      }
    `}</style>
  </>
);

export default App;
