import { green, indigo, slate, yellow } from '@radix-ui/colors';
import { createStitches } from '@stitches/react';

export const { getCssText, globalCss, styled } = createStitches({
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  },
  theme: {
    colors: {
      ...green,
      ...indigo,
      ...slate,
      ...yellow,
      white: '#FFFFFF',
    },
    fonts: {
      monospace: 'Consolas, Menlo, Monaco, monospace',
    },
    fontSizes: {
      xs: '10px',
      sm: '12px',
      md: '14px',
      lg: '24px',
      xl: '32px',
    },
  },
});

export const StitchesStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: getCssText() }} id="stitches" />
);
