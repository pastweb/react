/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const WEB_REGEX = '**/tests/**/*.web.test.{js,ts,jsx,tsx}';
const NODE_REGEX = '**/tests/**/*.node.test.{js,ts,jsx,tsx}';

export default defineConfig({
  optimizeDeps: {
    include: [
      '@testing-library/react',
      '@toon-format/toon',
      'axios',
      'clsx',
      'history',
      'react',
      'react/jsx-dev-runtime',
    ],
  },
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['node_modules', 'dist', '**/*.d.ts'],
      thresholds: {
        branches: 0,
        functions: 5,
        lines: 5,
        statements: 5,
      },
    },

    // Multiple Projects
    projects: [
      {
        test: {
          name: 'Browser',
          browser: {
            enabled: true,
            instances: [
              { browser: 'chromium' },       // you can add firefox / webkit too
            ],
            headless: true,                  // set to false for local debugging
            provider: playwright(),          // or 'webdriverio'
            // screenshotFailures: false,
          },
          include: [WEB_REGEX],
          // setupFiles: [
          //   // './src/test/setup.ts',        // recommended
          //   'core-js/stable',
          //   'vitest-localstorage-mock',
          //   'fake-indexeddb/auto',
          // ],
          server: {
            deps: {
              inline: ['axios'],
            },
          },
        },
      },
      {
        test: {
          name: 'NODE',
          environment: 'node',
          include: [NODE_REGEX],
        },
      },
    ],
  },
});
