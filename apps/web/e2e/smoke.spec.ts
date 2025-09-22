import { test, expect } from '@playwright/test'

test('smoke check: math still works', async () => {
  expect(1 + 1).toBe(2)
})
