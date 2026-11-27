/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 700 },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/core/**', 'src/save/**', 'src/data/**', 'src/bot/**'],
      thresholds: { lines: 85, functions: 85, branches: 75 },
    },
  },
});
