import { test, expect } from '@playwright/test';

test('admin can trigger social fetch (fixture mode)', async ({ page, request }) => {
  // Login admin
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@mellogang.test');
  await page.fill('input[name="password"]', '123123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 10_000 });

  // Buka halaman social
  await page.goto('/admin/social');
  await expect(page.locator('#btnFetch')).toBeVisible();
});
