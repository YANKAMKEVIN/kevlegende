import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/bot/**/*.test.ts'], environment: 'node', testTimeout: 900_000 },
});
