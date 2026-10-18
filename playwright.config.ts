import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
/** URL. 없으면 로컬 webServer(3100)를 쓴다. */
const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '') ||
  `http://localhost:${PORT}`;
const useExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'ko-KR',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // 외부 URL이 있으면 앱을 직접 띄우지 않는다.
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: `pnpm dev --port ${PORT}`,
          url: BASE_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
