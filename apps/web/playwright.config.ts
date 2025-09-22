import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e', // we'll put our tests in apps/web/e2e
  reporter: 'list',
  // No webServer right now (we're not starting Next in CI yet).
  // We'll add it later when we want real browser tests against a running app.
})
