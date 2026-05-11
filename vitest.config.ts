import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],

    env: {
      NEXT_PUBLIC_START_DATE: '2022-01-10',
      NEXT_PUBLIC_TIMEZONE: 'America/New_York',
    },
  },
});
