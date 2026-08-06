#!/usr/bin/env node
/**
 * Renders assets/og-image.source.html to assets/og-image.png at 1200x630.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/render-og-image.mjs
 *
 * Must be run somewhere with network access. The source pulls Space Grotesk
 * and Inter from Google Fonts, and without them the card silently falls back
 * to a system sans and stops looking like the site. The script fails loudly
 * rather than shipping that.
 */

import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'og-image.source.html');
const OUT = join(ROOT, 'assets', 'og-image.png');

const { chromium } = await import('playwright').catch(() => {
  console.error('playwright is not installed. Run: npm i -D playwright');
  process.exit(1);
});

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

const failed = [];
page.on('requestfailed', (r) => failed.push(r.url()));

await page.goto(`file://${SRC}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const gotFonts = await page.evaluate(() =>
  document.fonts.check('700 29px "Space Grotesk"')
);

if (!gotFonts || failed.some((u) => u.includes('fonts.g'))) {
  await browser.close();
  console.error(
    'Space Grotesk did not load, so the card would render in a fallback face.\n' +
      'Run this somewhere with access to fonts.googleapis.com.'
  );
  process.exit(1);
}

await page.screenshot({ path: OUT });
await browser.close();
console.log(`Wrote assets/og-image.png at 1200x630.`);
