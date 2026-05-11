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
      NEXT_PUBLIC_START_DATE: '2022-01-01T00:00:00-05:00',
      NEXT_PUBLIC_TIMEZONE: 'America/New_York',
    },
  },
});
