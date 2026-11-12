import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    // Trailing slash is required so relative paths like 'users' resolve correctly
    baseURL: process.env.BASE_URL ?? 'https://api.realworld.show/api/',
    extraHTTPHeaders: { Accept: 'application/json' },
  },
});
