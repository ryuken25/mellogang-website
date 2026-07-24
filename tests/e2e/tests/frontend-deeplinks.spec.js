import { test, expect } from '@playwright/test';

/**
 * Direct-load (fresh page load, BUKAN client-side nav) setiap route publik
 * React frontend. Refresh / deep link tidak boleh 404 — SPA fallback ada di
 * frontend/vercel.json (Vercel) atau vite preview (lokal).
 *
 * Jalankan dengan:
 *   E2E_FRONTEND_URL=https://mellogang.vercel.app npx playwright test frontend-deeplinks
 * atau lokal:
 *   cd frontend && pnpm run build && pnpm run preview   # port 4173
 *   E2E_FRONTEND_URL=http://localhost:4173 npx playwright test frontend-deeplinks
 */
const FRONTEND = process.env.E2E_FRONTEND_URL || '';

// Route publik dari frontend/src/App.jsx (tanpa yang butuh auth).
const PUBLIC_ROUTES = [
  '/',
  '/katalog',
  '/portofolio',
  '/portfolio', // redirect client-side ke /portofolio
  '/kontak',
  '/status-pesanan',
  '/status',
  '/auth',
  '/login', // redirect client-side ke /auth
  '/register', // redirect client-side ke /auth
];

test.describe('frontend deep links (direct load)', () => {
  test.skip(FRONTEND === '', 'set E2E_FRONTEND_URL untuk menjalankan suite ini');

  for (const route of PUBLIC_ROUTES) {
    test(`direct load ${route} -> 200 + app shell`, async ({ page }) => {
      const response = await page.goto(`${FRONTEND}${route}`, { waitUntil: 'domcontentloaded' });
      expect(response, `no response for ${route}`).not.toBeNull();
      expect(response.status(), `${route} must not 404 on fresh load`).toBe(200);
      // App shell React ter-mount (root div terisi, bukan halaman error host).
      await expect(page.locator('#root > *').first()).toBeVisible();
    });
  }

  test('unknown path renders SPA NotFound (bukan 404 host)', async ({ page }) => {
    const response = await page.goto(`${FRONTEND}/halaman-yang-tidak-ada`, { waitUntil: 'domcontentloaded' });
    // SPA fallback: host tetap serve index.html (200), NotFound dirender client-side.
    expect(response.status()).toBe(200);
    await expect(page.locator('#root > *').first()).toBeVisible();
  });
});
