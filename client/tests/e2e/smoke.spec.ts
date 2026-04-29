import { test, expect } from '@playwright/test';

test('login route loads core content', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { level: 2, name: /^bienvenido\.$/i })).toBeVisible();
  await expect(page.getByLabel(/^email$/i)).toBeVisible();
});
