import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createVitestTestConfig } from './create-vitest-test-config';


export default defineConfig({
  test: createVitestTestConfig('(unit|e2e)'),
  plugins: [
     // This is required to build the test files with SWC
      swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': 'src',
      '@tests': 'tests'
    }
  },
});
