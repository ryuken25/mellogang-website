#!/usr/bin/env node
/**
 * Capture Instagram storageState.
 *
 * Usage:
 *   node login-ig.js
 *
 * Akan membuka browser (headed), minta kamu login IG manual,
 * lalu simpan state ke ../writable/secure/ig_state.json.
 * Jalankan ulang kalau cookie expired.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const statePath = process.env.IG_STORAGE_STATE
    || path.resolve(__dirname, '..', '..', 'writable', 'secure', 'ig_state.json');

  fs.mkdirSync(path.dirname(statePath), { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });
  console.log('Login manual di browser. Tekan ENTER di terminal ini kalau sudah selesai.');
  await new Promise((r) => process.stdin.once('data', r));

  await page.waitForTimeout(2000);
  await ctx.storageState({ path: statePath });
  console.log('State tersimpan di', statePath);

  await browser.close();
})();
