const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const view of ['desktop', 'mobile']) {
    const ctx = view === 'desktop'
      ? await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      : await browser.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:8080/showcase', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `pages/screenshots/showcase-${view}.png`,
      fullPage: true,
    });
    const h1 = await page.textContent('h1').catch(() => '');
    const shotCount = await page.locator('.sc-shot').count();
    console.log(`✓ showcase ${view} | H1: ${(h1||'').slice(0, 50).replace(/\n/g, ' ')} | shots: ${shotCount}`);
    await ctx.close();
  }
  await browser.close();
})();
