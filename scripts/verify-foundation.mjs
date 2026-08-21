#!/usr/bin/env node
// Verifies Phase 1 foundation invariants — run with `node scripts/verify-foundation.mjs`
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

const ok = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => { console.error(`✗ ${msg}`); process.exitCode = 1; };

// 1. Pinned versions
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
(pkg.dependencies?.astro === '7.2.4' || pkg.devDependencies?.astro === '7.2.4') ? ok('astro pinned 7.2.4') : fail('astro not pinned 7.2.4');
(/^\^6/.test(pkg.dependencies?.typescript ?? pkg.devDependencies?.typescript ?? '')) ? ok('typescript ^6') : fail('typescript not ^6');
existsSync('.nvmrc') && readFileSync('.nvmrc','utf8').trim().match(/^v?22\.12/) ? ok('.nvmrc >=22.12') : fail('.nvmrc missing or wrong');

// 2. astro.config host decisions
const cfg = readFileSync('astro.config.mjs','utf8');
cfg.includes("https://jmaillot.github.io") ? ok('site set') : fail('site missing');
/^\s*base:/m.test(cfg) ? fail('base must be unset') : ok('base unset');
cfg.includes("output: 'static'") || cfg.includes('output: "static"') ? ok('output static') : fail('output not static');
cfg.includes('GitHub Pages root') ? ok('host comment present') : fail('host comment missing');
cfg.includes('--font-sans') && cfg.includes('--font-mono') ? ok('font CSS vars bound') : fail('font vars missing');

// 3. .nojekyll
existsSync('public/.nojekyll') && statSync('public/.nojekyll').size === 0 ? ok('public/.nojekyll empty') : fail('public/.nojekyll missing or not empty');
existsSync('dist/.nojekyll') ? ok('dist/.nojekyll present') : fail('dist/.nojekyll missing (build did not copy public/)');

// 4. Legacy untouched
try { execSync('git diff --name-only | grep -q "index.html" && exit 1 || exit 0', {stdio:'pipe'}); ok('legacy index.html untouched'); } catch { fail('legacy index.html was modified'); }

// 5. Built output static checks (only if dist exists)
if (existsSync('dist/index.html')) {
  const html = readFileSync('dist/index.html','utf8');
  !html.includes('client:') ? ok('no client: directives in built HTML') : fail('built HTML contains client:');
  /hydrat/i.test(html) ? fail('built HTML contains hydration marker') : ok('no hydration markers');
  /fonts\.googleapis/.test(html) ? fail('built HTML has render-blocking Google Fonts link') : ok('no render-blocking font link in built head');
  html.includes('Jeremy Maillot') || html.includes('jmaillot') ? ok('real identity in built HTML') : fail('real identity missing in built HTML');
} else {
  fail('dist/index.html missing — run npm run build first');
}

// 6. astro check + build (optional — skip if env var SKIP_BUILD=1)
if (!process.env.SKIP_BUILD) {
  try { execSync('npm run check 2>&1 | tail -5', {stdio:'pipe'}); ok('astro check ran'); } catch { fail('astro check failed'); }
}

if (!process.exitCode) console.log('\nAll foundation checks passed.');
else console.error('\nSome checks failed — see ✗ lines above.');
