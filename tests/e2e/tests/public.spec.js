import { test, expect } from '@playwright/test';

test('public home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MellogangVisuals/i);
  // logo brand tampil
  await expect(page.locator('.brand__logoimg').first()).toBeVisible();
});

test('public katalog loads', async ({ page }) => {
  await page.goto('/katalog');
  await expect(page.locator('body')).toContainText(/Paket|katalog/i);
});

test('public portofolio loads', async ({ page }) => {
  await page.goto('/portofolio');
  await expect(page.locator('body')).toContainText(/Portofolio/i);
});

test('public status page loads', async ({ page }) => {
  await page.goto('/status-pesanan');
  await expect(page.locator('body')).toContainText(/Pesanan|kode pemesanan/i);
});

test('login page shows form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('register page shows form', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('input[name="nama_lengkap"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('input[name="password_confirm"]')).toBeVisible();
});

test('customer login → dashboard redirect', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'pengguna1@mellogang.test');
  await page.fill('input[name="password"]', '123123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/pelanggan/, { timeout: 10_000 });
  await expect(page.locator('body')).toContainText(/Dashboard|Pesanan|Selamat datang/i);
});

test('admin login → admin dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@mellogang.test');
  await page.fill('input[name="password"]', '123123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 10_000 });
});

test('editor login → editor dashboard + popup', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'editor1@mellogang.test');
  await page.fill('input[name="password"]', '123123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/editor/, { timeout: 10_000 });
  // Popup tugas harus muncul (el #tugasModal)
  await expect(page.locator('#tugasModal')).toBeAttached();
});

test('dot-trick registration: second email is rejected', async ({ page }) => {
  // Register tess@gmail.com lebih dulu
  const stamp = Date.now();
  const e1 = `dot${stamp}@gmail.com`; // akan jadi canonical
  await page.goto('/register');
  await page.fill('input[name="nama_lengkap"]', 'Dot Trick Test 1');
  await page.fill('input[name="email"]', e1);
  await page.fill('input[name="no_telepon"]', '081234567890');
  await page.fill('input[name="password"]', 'Aman12345');
  await page.fill('input[name="password_confirm"]', 'Aman12345');
  await page.click('button[type="submit"]');
  // Harus redirect ke halaman verify (OTP) — bukan error
  await page.waitForURL(/auth\/verify/, { timeout: 10_000 });

  // Logout via GET /logout
  await page.goto('/logout');

  // Coba register dot-trick
  const e2 = `d.o.t.${stamp}@gmail.com`;
  await page.goto('/register');
  await page.fill('input[name="nama_lengkap"]', 'Dot Trick Test 2');
  await page.fill('input[name="email"]', e2);
  await page.fill('input[name="no_telepon"]', '081234567891');
  await page.fill('input[name="password"]', 'Aman12345');
  await page.fill('input[name="password_confirm"]', 'Aman12345');
  await page.click('button[type="submit"]');
  // Harusnya ada error "Email ini sudah terdaftar."
  await expect(page.locator('.alert.error')).toContainText(/sudah terdaftar/i);
});
