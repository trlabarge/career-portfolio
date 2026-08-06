#!/usr/bin/env node
/**
 * Rewrites the canonical production origin everywhere it appears.
 *
 *   node scripts/set-canonical-origin.mjs https://www.timsmarketing.com
 *
 * The origin is baked into every canonical link, og:url, og:image,
 * twitter:image, JSON-LD block, the sitemap, and robots.txt. Getting it wrong
 * is not cosmetic:
 *
 *   - A canonical pointing at a domain you do not serve tells Google the real
 *     version of every page lives somewhere else.
 *   - An og:image the scraper cannot fetch makes LinkedIn and iMessage fall
 *     back to hunting the page for the largest image they can find, which on
 *     this site means a logo from the brand marquee.
 *
 * Pass the origin with a scheme and no trailing slash. Run `npm run
 * timbot:build` afterwards, since the page text feeds the chatbot corpus.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every origin this project has ever used. Add to this, never remove. */
const KNOWN_ORIGINS = [
  'https://timlabarge.com',
  'https://www.timlabarge.com',
  'https://timsmarketing.com',
  'https://www.timsmarketing.com',
];

const target = process.argv[2];

if (!target || !/^https:\/\/[^/]+$/.test(target)) {
  console.error('Usage: node scripts/set-canonical-origin.mjs https://example.com');
  console.error('Scheme required, no trailing slash, no path.');
  process.exit(1);
}

const files = globSync(
  ['**/*.html', 'sitemap.xml', 'robots.txt', 'assets/og-image.source.html'],
  { cwd: ROOT, exclude: (p) => p.includes('node_modules') }
);

let changedFiles = 0;
let changedRefs = 0;

for (const rel of files) {
  const path = join(ROOT, rel);
  const before = readFileSync(path, 'utf8');
  let after = before;

  for (const origin of KNOWN_ORIGINS) {
    if (origin === target) continue;
    const pattern = new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    after = after.replace(pattern, target);
  }

  if (after !== before) {
    const hits = before.split(/https:\/\/(?:www\.)?tim[a-z]*\.com/).length - 1;
    writeFileSync(path, after, 'utf8');
    changedFiles += 1;
    changedRefs += hits;
    console.log(`  ${relative(ROOT, path)}`);
  }
}

console.log(
  changedFiles
    ? `\nSet ${changedRefs} references across ${changedFiles} files to ${target}.\n` +
        'Now run: npm run timbot:build'
    : `\nNothing to change. Everything already points at ${target}.`
);
