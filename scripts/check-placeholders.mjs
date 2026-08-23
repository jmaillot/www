#!/usr/bin/env node
// Placeholder identity gate — fail-closed (DPLY-02, Phase 5 D-06/D-07/D-08)
// D-06: scans the BUILT dist/ HTML output post-build — catches placeholders wherever
//       they leak (content, markup, meta tags, alt text), not just .md sources.
// D-07: scans for EXACTLY three strings — 'Ada Lovelace', 'hello@example.com',
//       'yourusername'. No broader pattern list (avoids false positives).
// D-08: wired into `npm run build` AFTER `astro build`; any hit fails the build.
// Security note (T-5-06): contents are scanned as plain strings only — no dynamic
// code execution, no subprocess calls, no network access, no file writes.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';

const DIST_DIR = resolve('dist');
const PLACEHOLDERS = ['Ada Lovelace', 'hello@example.com', 'yourusername'];

if (!existsSync(DIST_DIR)) {
  console.error('✗ dist/ missing — run npm run build first');
  process.exitCode = 1;
  process.exit(1);
}

function walkHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let failures = 0;

for (const file of walkHtmlFiles(DIST_DIR)) {
  const rel = relative(DIST_DIR, file);
  const content = readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  let hits = 0;
  for (const placeholder of PLACEHOLDERS) {
    for (let i = 0; i < lines.length; i++) {
      let idx = lines[i].indexOf(placeholder);
      while (idx !== -1) {
        console.error(`✗ placeholder: "${placeholder}" found at ${rel}:${i + 1}`);
        failures++;
        hits++;
        idx = lines[i].indexOf(placeholder, idx + placeholder.length);
      }
    }
  }

  if (hits === 0) {
    console.log(`✓ ${rel} clean`);
  }
}

if (failures > 0) {
  console.error(`\nFix the source in src/content/*.md (fix the .md), then rebuild — never edit dist/ output.`);
}

// --- Summary ---
if (failures > 0) {
  console.error(`\n✗ ${failures} placeholder failure(s) — build blocked (fail-closed)`);
  process.exitCode = 1;
} else {
  console.log(`\nAll placeholder checks passed.`);
  process.exitCode = 0;
}
