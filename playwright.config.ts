import { defineConfig } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT ?? '4173')
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('PLAYWRIGHT_PORT must be an integer between 1024 and 65535.')
}
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'no-preference',
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `npm run preview -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
