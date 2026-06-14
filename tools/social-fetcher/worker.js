#!/usr/bin/env node
/**
 * Social Fetcher — MellogangVisuals
 *
 * Scraping publik dari YouTube + Instagram untuk di-cache di
 * `social_post`. Dipanggil oleh Admin\SocialController (PHP)
 * dengan parameter --job=<id> --api=<base URL>.
 *
 * Usage:
 *   node worker.js --job=42 --api=http://localhost:8080 \
 *        [--fixture] [--platforms=youtube,instagram]
 *
 * Mode:
 *   - default: scraping live (butuh internet + cookies untuk IG)
 *   - --fixture: kembalikan data kalengan (untuk test e2e)
 *
 * Environment yang dipakai:
 *   YT_CHANNEL_URL    default https://www.youtube.com/@mellogangvisuals/videos
 *   IG_HANDLE         default mellogangvisuals
 *   IG_STORAGE_STATE  default ../../writable/secure/ig_state.json
 *   SOCIAL_MAX_ITEMS  default 12
 *   SOCIAL_HEADLESS   default "true"
 *
 * Worker melaporkan progres ke API:
 *   - PATCH job ke status=running (started_at)
 *   - setelah selesai: status=done / failed, isi items_youtube / items_instagram
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// -------- arg parsing --------
const argv = require('minimist-mini')(process.argv.slice(2));
const jobId = parseInt(argv.job || '0', 10);
const apiBase = (argv.api || 'http://localhost:8080').replace(/\/$/, '');
const fixtureMode = !!argv.fixture;
const platforms = (argv.platforms || 'youtube,instagram')
    .split(',').map(s => s.trim()).filter(Boolean);
const maxItems = parseInt(process.env.SOCIAL_MAX_ITEMS || '12', 10);
const headless = (process.env.SOCIAL_HEADLESS || 'true').toLowerCase() !== 'false';

if (!jobId) {
  console.error('FATAL: --job=<id> required');
  process.exit(2);
}

// -------- HTTP helper ke API internal --------
function apiPatch(body) {
  return new Promise((resolve) => {
    let url;
    try { url = new URL(apiBase + '/admin/social/status/' + jobId); }
    catch (e) { return resolve(false); }
    const lib = url.protocol === 'https:' ? https : http;
    const data = Buffer.from(JSON.stringify(body), 'utf8');
    const req = lib.request({
      method: 'POST',
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Worker': 'social-fetcher',
      },
      timeout: 10000,
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 400));
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(data);
    req.end();
  });
}

async function reportRunning() {
  await apiPatch({ status: 'running', started_at: new Date().toISOString().slice(0, 19).replace('T', ' ') });
}

async function reportDone(payload) {
  await apiPatch(Object.assign({
    status: 'done',
    finished_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }, payload));
}

async function reportFailed(message) {
  await apiPatch({
    status: 'failed',
    finished_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    message: String(message).slice(0, 1000),
  });
}

// -------- fixture mode --------
const FIXTURE_YT = [
  { external_id: 'demo1', title: 'Wedding Cinematic | Mellogang',  type: 'video',    thumbnail_url: 'https://i.ytimg.com/vi/demo1/hqdefault.jpg', permalink: 'https://youtu.be/demo1', posted_at: '2026-05-12 10:00:00' },
  { external_id: 'demo2', title: 'Pre-Wedding Bali',                type: 'video',    thumbnail_url: 'https://i.ytimg.com/vi/demo2/hqdefault.jpg', permalink: 'https://youtu.be/demo2', posted_at: '2026-05-10 10:00:00' },
  { external_id: 'demo3', title: 'Engagement Session Jakarta',      type: 'video',    thumbnail_url: 'https://i.ytimg.com/vi/demo3/hqdefault.jpg', permalink: 'https://youtu.be/demo3', posted_at: '2026-05-08 10:00:00' },
];
const FIXTURE_IG = [
  { external_id: 'igdemo1', caption: 'Save the date 💍', type: 'image', thumbnail_url: 'https://placehold.co/600x600/00F5B8/0A0E0D?text=IG+1', permalink: 'https://instagram.com/p/igdemo1', posted_at: '2026-05-13 09:00:00' },
  { external_id: 'igdemo2', caption: 'Behind the scene 🎬', type: 'reel', thumbnail_url: 'https://placehold.co/600x600/0A0E0D/00F5B8?text=IG+2', permalink: 'https://instagram.com/p/igdemo2', posted_at: '2026-05-12 09:00:00' },
];

// -------- write to API: upsert social_post --------
// Kita pakai endpoint internal yang menerima batch payload.
// Untuk kesederhanaan, kita panggil API admin/social/cache yang hanya
// read; untuk write kita tambahkan method upsert di sini via SQL
// langsung kalau ada akses DB. Karena ini worker Playwright yang
// berdiri sendiri, kita andalkan API endpoint khusus.
//
// Untuk MVP, kita kirim hasil sebagai JSON log dan biarkan PHP
// menariknya via endpoint cache. Tapi idealnya worker menulis
// langsung ke DB. Karena keterbatasan worker -> DB di stack ini,
// kita panggil API upsert (lihat Admin\SocialController::upsert).
function apiUpsert(platform, items) {
  return new Promise((resolve) => {
    let url;
    try { url = new URL(apiBase + '/admin/social/upsert'); }
    catch (e) { return resolve(false); }
    const lib = url.protocol === 'https:' ? https : http;
    const data = Buffer.from(JSON.stringify({ platform, items }), 'utf8');
    const req = lib.request({
      method: 'POST',
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Worker': 'social-fetcher',
      },
      timeout: 30000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, body: buf }));
    });
    req.on('error', () => resolve({ ok: false, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, body: '' }); });
    req.write(data);
    req.end();
  });
}

// -------- live scraping (YouTube only by default, IG butuh Playwright) --------
async function scrapeYouTubeLive(channelUrl, limit) {
  // Tanpa Playwright: parse halaman /videos (publik, tanpa login).
  // Kadang ada fallback kosong jika DOM berubah.
  try {
    const r = await fetch(channelUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MellogangBot/1.0)' },
    });
    if (!r.ok) return [];
    const html = await r.text();
    const re = /"videoId":"([A-Za-z0-9_-]{6,15})"[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"\}\][\s\S]*?"publishedTimeText":\{"simpleText":"([^"]+)"\}/g;
    const items = [];
    const seen = new Set();
    let m;
    while ((m = re.exec(html)) !== null && items.length < limit) {
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      items.push({
        external_id: id,
        title: m[2],
        type: 'video',
        thumbnail_url: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
        permalink: 'https://youtu.be/' + id,
        posted_at: m[3] || null,
      });
    }
    return items;
  } catch (e) {
    return [];
  }
}

async function scrapeYouTubeWithPlaywright(channelUrl, limit) {
  // Best-effort. Kalau Playwright tidak tersedia, fallback ke scraper live.
  let pw;
  try { pw = require('playwright'); }
  catch (e) {
    console.error('Playwright not installed, falling back to live parser');
    return scrapeYouTubeLive(channelUrl, limit);
  }
  const browser = await pw.chromium.launch({ headless });
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (compatible; MellogangBot/1.0)' });
  const page = await ctx.newPage();
  try {
    await page.goto(channelUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    const items = await page.evaluate((n) => {
      const out = [];
      const links = document.querySelectorAll('a#video-title-link, a.ytd-rich-grid-media');
      for (const a of links) {
        if (out.length >= n) break;
        const href = a.getAttribute('href') || '';
        const m = /[?&]v=([A-Za-z0-9_-]+)/.exec(href);
        if (!m) continue;
        out.push({
          external_id: m[1],
          title: (a.getAttribute('title') || a.textContent || '').trim().slice(0, 200),
          type: 'video',
          thumbnail_url: 'https://i.ytimg.com/vi/' + m[1] + '/hqdefault.jpg',
          permalink: 'https://youtu.be/' + m[1],
          posted_at: null,
        });
      }
      return out;
    }, limit);
    await browser.close();
    return items;
  } catch (e) {
    try { await browser.close(); } catch (_) {}
    return [];
  }
}

async function scrapeInstagramWithPlaywright(handle, limit, storageStatePath) {
  let pw;
  try { pw = require('playwright'); }
  catch (e) {
    console.error('Playwright not installed; IG fetch skipped');
    return [];
  }
  const browser = await pw.chromium.launch({ headless });
  let ctx;
  try {
    if (storageStatePath && fs.existsSync(storageStatePath)) {
      ctx = await browser.newContext({ storageState: storageStatePath });
    } else {
      ctx = await browser.newContext();
    }
  } catch (e) {
    ctx = await browser.newContext();
  }
  const page = await ctx.newPage();
  const url = 'https://www.instagram.com/' + handle.replace(/^@/, '') + '/';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const items = await page.evaluate((n) => {
      const out = [];
      const anchors = document.querySelectorAll('article a, main a[href*="/p/"], main a[href*="/reel/"]');
      const seen = new Set();
      for (const a of anchors) {
        const href = a.getAttribute('href') || '';
        const m = /\/(p|reel)\/([A-Za-z0-9_-]+)/.exec(href);
        if (!m) continue;
        if (seen.has(m[2])) continue;
        seen.add(m[2]);
        const img = a.querySelector('img');
        out.push({
          external_id: m[2],
          caption: '',
          type: m[1] === 'reel' ? 'reel' : 'image',
          thumbnail_url: img ? img.getAttribute('src') : null,
          permalink: 'https://www.instagram.com' + href,
          posted_at: null,
        });
        if (out.length >= n) break;
      }
      return out;
    }, limit);
    await browser.close();
    return items;
  } catch (e) {
    try { await browser.close(); } catch (_) {}
    return [];
  }
}

// -------- main --------
(async () => {
  await reportRunning();

  try {
    let ytCount = 0, igCount = 0;

    if (platforms.includes('youtube')) {
      const ytUrl = process.env.YT_CHANNEL_URL || 'https://www.youtube.com/@mellogangvisuals/videos';
      const items = fixtureMode
        ? FIXTURE_YT
        : await scrapeYouTubeWithPlaywright(ytUrl, maxItems);
      const r = await apiUpsert('youtube', items);
      ytCount = items.length;
      if (!r.ok) console.error('YT upsert failed:', r.body);
    }

    if (platforms.includes('instagram')) {
      const handle = process.env.IG_HANDLE || 'mellogangvisuals';
      const statePath = process.env.IG_STORAGE_STATE
        || path.resolve(__dirname, '..', '..', 'writable', 'secure', 'ig_state.json');
      const items = fixtureMode
        ? FIXTURE_IG
        : await scrapeInstagramWithPlaywright(handle, maxItems, statePath);
      const r = await apiUpsert('instagram', items);
      igCount = items.length;
      if (!r.ok) console.error('IG upsert failed:', r.body);
    }

    await reportDone({
      items_youtube: ytCount,
      items_instagram: igCount,
    });
  } catch (e) {
    await reportFailed(e.message || String(e));
  }
  process.exit(0);
})();
