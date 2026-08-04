import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Two projects, because the suite covers two runtimes:
//   ui  – components and browser-side lib code, in jsdom
//   api – app/ route handlers, which run on the server against Web APIs
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'ui',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: [
            'components/**/*.test.{ts,tsx}',
            'lib/**/*.test.{ts,tsx}',
            'integration/**/*.test.{ts,tsx}',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'api',
          environment: 'node',
          include: ['app/**/*.test.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**', 'components/**', 'lib/**'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        'components/ui/**',
        'components/academic-calendar/calendar-data*',
      ],
    },
  },
});
