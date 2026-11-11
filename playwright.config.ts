import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 4 : undefined,
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
