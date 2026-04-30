import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function expectNoCriticalA11yViolations(page: Page, pageUrl: string) {
  await page.goto(pageUrl);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const criticalOrSerious = results.violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact ?? '')
  );

  expect(criticalOrSerious).toEqual([]);
}

test('public auth routes have no critical accessibility violations', async ({ page }) => {
  await expectNoCriticalA11yViolations(page, '/login');
  await expectNoCriticalA11yViolations(page, '/register');
});

test('authenticated client routes have no critical accessibility violations', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'vibe-pulse-auth',
      JSON.stringify({ id: 1, name: 'Cliente QA', email: 'qa@cliente.test', role: 'CLIENT' })
    );
    localStorage.setItem('vibe-pulse-token', 'qa-client-token');
  });

  await expectNoCriticalA11yViolations(page, '/home');
  await expectNoCriticalA11yViolations(page, '/cart');
  await expectNoCriticalA11yViolations(page, '/checkout');
});

test('authenticated admin route has no critical accessibility violations', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'vibe-pulse-auth',
      JSON.stringify({ id: 2, name: 'Admin QA', email: 'qa@admin.test', role: 'ADMIN' })
    );
    localStorage.setItem('vibe-pulse-token', 'qa-admin-token');
  });

  await expectNoCriticalA11yViolations(page, '/admin');
});
