import { defineConfig, devices } from '@playwright/test';

const executablePath = process.env.PW_CHROMIUM || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'off',
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [{ name: 'mobile', use: { ...devices['Pixel 7'], deviceScaleFactor: 1 } }],
});
