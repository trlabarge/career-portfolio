#!/usr/bin/env node
/**
 * Renders assets/og-image.source.html to assets/og-image.png at 1200x630.
 *
 *   npm install
 *   npx playwright install chromium
 *   npm run og:build
 *
 * The card is set in Space Grotesk and Inter. Rather than pulling those from
 * Google Fonts at render time, which fails on any machine without network and
 * silently falls back to a system sans, this reads them out of node_modules
 * (@fontsource/*) and inlines them as data URIs before screenshotting. The
 * render is therefore offline and deterministic.
 *
 * It refuses to write a file if the display face did not load, because a card
 * in the wrong typeface stops looking like the site and nothing downstream
 * would catch it.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'og-image.source.html');
const OUT = join(ROOT, 'assets', 'og-image.png');

/** family, weight, and the @fontsource package file that provides it. */
const FACES = [
  ['Space Grotesk', 500, '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2'],
  ['Space Grotesk', 600, '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2'],
  ['Space Grotesk', 700, '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2'],
  ['Inter', 400, '@fontsource/inter/files/inter-latin-400-normal.woff2'],
  ['Inter', 500, '@fontsource/inter/files/inter-latin-500-normal.woff2'],
  ['Inter', 600, '@fontsource/inter/files/inter-latin-600-normal.woff2'],
];

function fontCss() {
  return FACES.map(([family, weight, rel]) => {
    const path = join(ROOT, 'node_modules', rel);
    if (!existsSync(path)) {
      console.error(`Missing ${rel}. Run: npm install`);
      process.exit(1);
    }
    const data = readFileSync(path).toString('base64');
    return (
      `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
      `font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2');}`
    );
  }).join('\n');
}

const { chromium } = await import('playwright').catch(() => {
  console.error('playwright is not installed. Run: npm install');
  process.exit(1);
});

// Playwright's bundled path is not always where the browser actually is.
const launchOptions = {};
if (process.env.CHROME_PATH) launchOptions.executablePath = process.env.CHROME_PATH;

const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

// Strip the remote stylesheet so a slow or blocked CDN cannot influence the
// result, then supply the same faces locally.
const html = readFileSync(SRC, 'utf8').replace(
  /<link[^>]+fonts\.googleapis\.com[^>]*>/g,
  ''
);

await page.setContent(html, { waitUntil: 'load' });
await page.addStyleTag({ content: fontCss() });
await page.evaluate(() => document.fonts.ready);

const ok = await page.evaluate(() => ({
  display: document.fonts.check('700 29px "Space Grotesk"'),
  body: document.fonts.check('400 17px "Inter"'),
}));

if (!ok.display || !ok.body) {
  await browser.close();
  console.error(
    `Fonts did not load (Space Grotesk: ${ok.display}, Inter: ${ok.body}).\n` +
      'Refusing to write a card in a fallback typeface.'
  );
  process.exit(1);
}

await page.screenshot({ path: OUT });
await browser.close();

const kb = (readFileSync(OUT).length / 1024).toFixed(0);
console.log(`Wrote assets/og-image.png, 1200x630, ${kb} KB.`);
