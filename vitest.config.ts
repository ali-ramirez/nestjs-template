import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createVitestTestConfig } from './create-vitest-test-config';

export default defineConfig({
  test: createVitestTestConfig('(unit|e2e)'),
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': 'src',
      '@tests': 'tests',
    },
  },
});
