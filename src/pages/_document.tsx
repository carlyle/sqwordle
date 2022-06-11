import { Head, Html, Main, NextScript } from 'next/document';

import { StitchesStyles } from '@app/ui/core';

const Document = () => (
  <Html lang="en-US">
    <Head>
      <StitchesStyles />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
