import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'compact-phone', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium', channel: 'chrome', viewport: { width: 390, height: 844 } } },
    { name: 'tablet', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 1440, height: 1000 } } },
    { name: 'wide-desktop', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 1920, height: 1080 } } },
    { name: 'firefox-desktop', use: { browserName: 'firefox', viewport: { width: 1440, height: 1000 } } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'], browserName: 'webkit', viewport: { width: 390, height: 844 } } },
  ],
});
