import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createVitestTestConfig } from './create-vitest-test-config';

export default defineConfig({
  test: createVitestTestConfig('unit'),
  plugins: [swc.vite(),  tsconfigPaths()],
  esbuild: {
    loader: 'tsx', // Usa el cargador de esbuild para TypeScript
    target: 'es2020',
  },
});
