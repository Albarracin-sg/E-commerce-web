import { test, expect, devices } from '@playwright/test';

test('login route stays usable on a mobile viewport', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:4173/login');

  await expect(page.getByRole('heading', { level: 2, name: /^bienvenido\.$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();

  await context.close();
});
