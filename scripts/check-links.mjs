#!/usr/bin/env node
// Internal-link crawl over built dist/ HTML — ROUT-06 / D-09.
// One-off verification script per D-11 (NOT chained into package.json — invoke directly:
// `node scripts/check-links.mjs` after `npm run build`).
// External http(s) URLs are advisory-only (⚠, unverified) per D-10.
// SECURITY (T-5-04): extracted href/src strings are used ONLY in existsSync() checks and
// console output — never eval'd, exec'd, or written anywhere. Regex is bounded to quoted
// attribute values.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';

const DIST = resolve('dist');

const ok = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => { console.error(`✗ ${msg}`); process.exitCode = 1; };

if (!existsSync(DIST)) {
  console.error('✗ dist/ missing — run npm run build first');
  process.exitCode = 1;
  process.exit(process.exitCode);
}

// --- Collect every *.html file under dist/ ---
const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (extname(entry) === '.html') htmlFiles.push(full);
  }
})(DIST);

// --- Classify + verify every href/src value ---
let broken = 0;
let externals = 0;

function checkHref(pageRel, raw) {
  const value = raw.trim();

  // Skip non-URL schemes and pure anchors
  if (
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('#') ||
    value.startsWith('data:')
  ) {
    return;
  }

  // External URLs — advisory only, never a failure (D-10)
  if (/^https?:\/\//i.test(value)) {
    console.warn(`⚠ external (unverified per D-10): ${value}`);
    externals++;
    return;
  }

  // Internal: strip query/hash
  let path = value.split('#')[0].split('?')[0];
  if (path === '') return; // was pure "#..." after strip

  // Map to expected file(s) under dist/ (Astro pretty URLs for pages, literal path for assets)
  const candidates =
    path === '/'
      ? [join(DIST, 'index.html')]
      : [
          join(DIST, path, 'index.html'),
          join(DIST, `${path.replace(/\/$/, '')}.html`),
          join(DIST, path), // literal asset path (e.g. /_astro/*.css, /favicon.ico, *.svg)
        ];

  // Protocol-relative or root-relative handled above; anything else resolves from root
  if (candidates.some(existsSync)) {
    ok(`${pageRel} → ${value}`);
  } else {
    fail(`broken: ${pageRel} → ${value}`);
    broken++;
  }
}

for (const file of htmlFiles) {
  const rel = `/${file.slice(DIST.length + 1)}`;
  const html = readFileSync(file, 'utf8');
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    checkHref(rel, m[1]);
  }
}

// --- Summary ---
console.log(`\nCrawled ${htmlFiles.length} page(s); ${externals} external URL(s) logged as advisories.`);
if (broken > 0) {
  console.error(`\n✗ ${broken} broken link(s)`);
  process.exitCode = 1;
} else {
  console.log('\nAll internal links resolved.');
  process.exitCode = 0;
}
