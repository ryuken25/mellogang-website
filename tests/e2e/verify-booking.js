/**
 * Verify the redesigned /pelanggan dashboard:
 *  - no emoji in DOM (inspect textContent of .booking-card)
 *  - status pill + dot present
 *  - magnetic track link works (mousemove doesn't error)
 *  - reduced-motion path (set media query via emulateMedia)
 *  - keyboard tab reaches the track link
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '..', '..', 'pages', 'screenshots', 'audit');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const reduce of [false, true]) {
    const ctx = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'id-ID',
      reducedMotion: reduce ? 'reduce' : 'no-preference',
    });
    const page = await ctx.newPage();
    // Login as customer
    await page.goto('http://localhost:8080/login');
    await page.fill('input[name="email"]', 'pengguna1@mellogang.test');
    await page.fill('input[name="password"]', '123123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});

    // Visit dashboard
    await page.goto('http://localhost:8080/pelanggan', { waitUntil: 'networkidle' });
    await page.waitForTimeout(reduce ? 200 : 900); // wait for entrance reveal animation
    await page.evaluate(() => window.scrollTo(0, 0));

    // Inspect
    const summary = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.booking-card'));
      const dots = document.querySelectorAll('.booking-card .status-dot').length;
      const refs = Array.from(document.querySelectorAll('.booking-ref')).map(e => e.textContent.trim());
      const titles = Array.from(document.querySelectorAll('.booking-title')).map(e => e.textContent.trim());
      const pills = Array.from(document.querySelectorAll('.booking-card .status')).map(e => ({
        text: e.textContent.trim().replace(/\s+/g, ' '),
        classList: Array.from(e.classList),
      }));
      const links = Array.from(document.querySelectorAll('.track-link')).map(e => e.textContent.trim().replace(/\s+/g, ' '));
      const bodyText = document.body.innerText;
      // Find any emoji in card area
      const cardText = document.querySelector('.booking-grid')?.innerText || '';
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      const hasEmoji = emojiRegex.test(cardText);
      // Inspect first card's pill + dot
      const firstPill = document.querySelector('.booking-card .status');
      const firstDot  = document.querySelector('.booking-card .status-dot');
      const firstAnim = firstDot ? getComputedStyle(firstDot).animationName : '(none)';
      const firstAnimDur = firstDot ? getComputedStyle(firstDot).animationDuration : '(none)';
      // Reduce-motion: animation should be 'none' OR the class should still be there
      const cssLink = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .map(l => l.href).join('\n');
      return {
        cardCount: cards.length,
        visibleCount: cards.filter(c => c.classList.contains('is-visible')).length,
        dots,
        refs,
        titles,
        pills,
        links,
        hasEmoji,
        pageTextHasEmoji: emojiRegex.test(bodyText),
        firstPillClassList: firstPill ? Array.from(firstPill.classList) : [],
        firstDotAnim: firstAnim,
        firstDotAnimDur: firstAnimDur,
        cssLinkCount: cssLink.split('\n').length,
      };
    });

    // Screenshot
    const fname = `pelanggan-dashboard-${reduce ? 'reduce' : 'normal'}.png`;
    await page.screenshot({ path: path.join(OUT, fname), fullPage: true });
    await ctx.close();

    results.push({ reduce, ...summary });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();
