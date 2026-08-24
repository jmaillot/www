---
phase: 05-polish-ship-readiness
verified: 2026-08-24T08:20:00Z
status: passed
score: 14/15 must-haves verified
overrides_applied: 0
overrides: []
re_verification: null
gaps: []
deferred: []
human_verification:
  - test: "Open https://www.jeremymaillot.fr in a browser and visit /, /projects/, /skills/, /contact/ — confirm fonts load, token colors apply, no unstyled flash"
    expected: "All four pages fully styled with Inter/JetBrains Mono self-hosted fonts"
    why_human: "Visual rendering cannot be verified programmatically"
  - test: "At ≤599px viewport width, open the mobile menu on the live site"
    expected: "Focus trapped inside menu, Escape closes it, focus returns to toggle button, aria-expanded syncs"
    why_human: "Interactive keyboard/focus behavior requires a real browser session"
  - test: "Enable OS prefers-reduced-motion, then scroll the live Home page"
    expected: "Sections visible immediately — no reveal animation, no hidden content"
    why_human: "OS-level media-query interaction needs a human-driven session"
  - test: "Tab through the live Home page"
    expected: "Skip link appears on first Tab; :focus-visible outlines visible on nav/CTAs"
    why_human: "Keyboard traversal visuals require a human session"
---

# Phase 5: Polish & Ship-Readiness Verification Report

**Phase Goal:** The rebuild is verifiably complete and shippable — the served output works under the configured host (custom domain https://www.jeremymaillot.fr, served from repo jmaillot/www via GH Pages; assets, `.nojekyll`, all internal links), placeholder identity is gate-blocked, and repo docs match the modular structure.
**Verified:** 2026-08-24T08:20:00Z
**Status:** passed — human verification completed 2026-08-24 (4/4 items approved by developer; see 05-HUMAN-UAT.md)
**Re-verification:** No — initial verification

## Methodology Note — Live Checks Required Direct IP Resolution

This environment's local DNS resolves `www.jeremymaillot.fr` to **192.168.1.251** (a private LAN address), which intermittently serves a Go-based plain-text `404 page not found` instead of the real site. This is an **environmental DNS split-horizon artifact, not a project defect**. All live checks below were therefore executed against GitHub Pages' authoritative edge IPs via `curl --resolve www.jeremymaillot.fr:443:185.199.108.153` (and cross-checked against `185.199.109.153`), bypassing the polluted resolver.

**Result: the site IS live and correctly configured on GitHub Pages for the custom domain.** The recorded curl evidence in 05-01-SUMMARY.md Task 4 is corroborated by these direct-to-edge checks. Future live checks from this machine should use `--resolve` or public DNS.

## Goal Achievement

### Observable Truths

Merged from ROADMAP success criteria (SC1–SC4, the contract) + PLAN frontmatter must-haves.

| # | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1 | Served output verified on chosen host: `_astro/*.css` + asset requests succeed, `.nojekyll` served, pages fully styled (DPLY-01, SC1) | ✓ VERIFIED | Via GH Pages edge IPs: `/` `/projects/` `/skills/` `/contact/` → 200; `/_astro/BaseLayout.CnRtr4_s.css` → 200; `/_astro/fonts/e868cdf4720e9ea5.woff2` → 200; `/.nojekyll` → 200; `/CNAME` → 200 |
| 2 | All internal links resolve on the built site under configured site/base, previewed and deployed (ROUT-06, SC2) | ✓ VERIFIED | `node scripts/check-links.mjs` exit 0 over fresh build — "Crawled 5 page(s); 34 external advisories / All internal links resolved."; live routes 200; `og:url` = `https://www.jeremymaillot.fr/` |
| 3 | Build gate fails when placeholder values remain, passes only with zero matches (DPLY-02, SC3) | ✓ VERIFIED | Negative test: planted `hello@example.com` in `dist/gate-test.html` → non-zero exit (GATE_OK); clean rebuild exits 0 with "All placeholder checks passed."; zero placeholders on all live routes |
| 4 | AGENTS.md describes the modular Astro repo — no stale single-file claims; drift-check script + build gate documented (SC4) | ✓ VERIFIED | AGENTS.md contains `check:tokens`/`check:placeholders`/"never loosen the schema"/all three gate strings/GitHub Pages deploy story; zero matches for stale-claim patterns. ⚠️ See Warning W-1 (stale live URL in docs) |
| 5 | Every internal href/src in every built HTML page resolves to an existing built file (05-01) | ✓ VERIFIED | check-links.mjs substantive (98 lines, existsSync-based, external advisory-only per D-10, no eval/exec per T-5-04); run passes against fresh build |
| 6 | `npm run build` completes with zero warnings in captured output (05-01, DPLY-01) | ✓ VERIFIED | Fresh build exit 0; only `grep -i warn` hits are token *names* ("warning" color scale) — zero actual compiler/Astro warnings. Waiver rationale recorded in 05-01-SUMMARY Deviation 3 |
| 7 | Legacy single-file markup gone: root `index.html` deleted, `dist/index.html` renders from Astro content layer | ✓ VERIFIED | Root `index.html` absent; foundation script line 28 asserts removal ("legacy index.html removed") and full run passes; live home renders content-layer identity (jeremymaillot@gmail.com present) |
| 8 | Push to master triggers GH Actions run that builds (both gates green) and deploys (05-01, D-01) | ✓ VERIFIED | `.github/workflows/deploy.yml`: trigger `[master]` + workflow_dispatch, SHA-pinned refs (checkout v7 / withastro/action v6 / deploy-pages v5 — no `@main`/`@master`), least-privilege permissions, concurrency group. Deployment exists and serves content whose asset hash (`BaseLayout.CnRtr4_s.css`) exactly matches the current HEAD build — pipeline demonstrably ran and published |
| 9 | Live site serves all 5 routes fully styled over HTTPS with working `_astro/*.css` and served `.nojekyll` (05-01, D-03) | ✓ VERIFIED | All edge-IP checks in truths 1–2 pass over HTTP/2 TLS; unique `<title>` per route; branded 404 on garbage path |
| 10 | Reduced-motion and keyboard-focus behavior still hold on the live site (05-01 final spot-check) | ? UNCERTAIN | Code-level evidence present in deployed output: `prefers-reduced-motion` and `focus-visible` in built CSS. Interactive confirmation requires a human browser session → routed to Human Verification |
| 11 | Gate fails fail-closed when any of `Ada Lovelace` / `hello@example.com` / `yourusername` appears in built dist HTML (05-02) | ✓ VERIFIED | check-placeholders.mjs substantive (72 lines): exact three strings, missing-dist guard, per-hit ✗ logging, exit 1 summary; negative test GATE_OK |
| 12 | `npm run build` passes with zero placeholder matches on current content (05-02) | ✓ VERIFIED | Fresh `npm run build` exit 0, "All placeholder checks passed." in output; chain is `check:tokens && astro build && check:placeholders` in package.json |
| 13 | No `yourusername` under src/ — project cards link `github.com/jmaillot/<slug>` (05-02) | ✓ VERIFIED | `grep -rn` for all three strings under `src/` returns nothing; repoUrls are `jmaillot/orbit`, `jmaillot/paperlink`, `jmaillot/ledgerline`; crawl logs them as advisory-only externals per D-10 |
| 14 | Identity frontmatter confirmed real with zero markup/schema edits (05-02, D-05) | ✓ VERIFIED | contact.md: `jeremymaillot@gmail.com` / `https://github.com/jmaillot` / `Jérémy Maillot`; profile.md name accented — verify-only execution correct; accent decision recorded in SUMMARY |
| 15 | AGENTS.md rewritten for modular repo + lean README; codebase maps NOT refreshed (05-02, D-12/D-13/D-14) | ✓ VERIFIED | Both docs accurate to structure/gates/commands; no badges/license boilerplate; `.planning/codebase/` untouched |

**Score:** 14/15 truths verified (1 UNCERTAIN → human verification)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `scripts/check-links.mjs` | Internal-link crawl over dist/**/*.html, ≥40 lines, existsSync check | ✓ VERIFIED (+ WIRED) | 98 lines; invoked directly (not chained into package.json — grep count 0, per D-11); run passes |
| `scripts/check-placeholders.mjs` | Fail-closed post-build scan, contains `yourusername` | ✓ VERIFIED (+ WIRED) | 72 lines; chained via package.json `check:placeholders`; negative-tested fail-closed |
| `.github/workflows/deploy.yml` | GH Pages deploy via withastro/action + deploy-pages, contains `id-token: write` | ✓ VERIFIED (+ WIRED) | 45 lines; SHA-pinned; master trigger; both jobs present; site live proves it executed |
| `scripts/verify-foundation.mjs` | Updated for legacy index.html removal, contains "legacy index.html removed" | ✓ VERIFIED | Line 28 assertion present; "untouched" variant gone; full run passes |
| `package.json` | Build chain extended with check:placeholders after astro build | ✓ VERIFIED (+ WIRED) | Exact chain `check:tokens && astro build && npm run check:placeholders` confirmed; build executes all three |
| `AGENTS.md` | Rewritten modular-repo guide, contains "fix the .md" discipline | ✓ VERIFIED | All required sections present; zero stale claims |
| `README.md` | Lean project card, mentions Astro | ✓ VERIFIED | ~40 lines, tech bullets, commands, content locations, deploy story; no boilerplate |
| root `index.html` (deleted) | Legacy page removed | ✓ VERIFIED | Absent from disk and repo; foundation invariant enforces absence |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `.github/workflows/deploy.yml` | `npm run build` | withastro/action default build command | ✓ WIRED | Action ref present with comment confirming default chains both gates; live deployment carries current-build asset hashes |
| `.github/workflows/deploy-pages` | actions/deploy-pages | Deploy job publishing dist artifact | ✓ WIRED | `actions/deploy-pages@cd2ce8f…` with `environment: github-pages` + page_url; needs: build |
| `scripts/check-links.mjs` | `dist/**/*.html` | fs walk + href/src extraction + existsSync | ✓ WIRED | Executed successfully against fresh build — exit 0 |
| `package.json scripts.build` | `scripts/check-placeholders.mjs` | `astro build && npm run check:placeholders` chain | ✓ WIRED | Exact pattern present; gate runs in observed build output |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| Built pages (all 5) | Rendered identity/content | Zod-validated Markdown collections (`src/content/*`) | Yes — live HTML shows real identity (jeremymaillot@gmail.com, github.com/jmaillot), zero placeholders | ✓ FLOWING |
| Fonts | `@font-face` rules + woff2 assets | Astro fonts config → self-hosted `/_astro/fonts/*.woff2` (commit 9343345, PERF-03 closure) | Yes — 2 inline @font-face in live HTML head, preload link, 0 googleapis/gstatic, woff2 serves 200 | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Build green, warning-free, both gates | `npm run build > log; echo $?` | exit 0; "All token checks passed." + "All placeholder checks passed." in captured output | ✓ PASS |
| Internal-link crawl | `node scripts/check-links.mjs` | exit 0; "All internal links resolved." (5 pages, 34 advisories) | ✓ PASS |
| Foundation invariants incl. legacy removal | `node scripts/verify-foundation.mjs` | exit 0; "All foundation checks passed." | ✓ PASS |
| Placeholder gate fail-closed | Plant `hello@example.com` in dist/, rerun gate | Non-zero exit; GATE_OK after cleanup | ✓ PASS |
| Live routes + branded 404 | curl (edge IP) × 5 paths | 200/200/200/200/404; unique titles; branded 404 title | ✓ PASS |
| `.nojekyll` served | curl `/.nojekyll` (edge IP) | HTTP 200 | ✓ PASS |
| Assets served | curl CSS + woff2 (edge IP) | Both HTTP 200 | ✓ PASS |
| Identity live | grep live home HTML | jeremymaillot@gmail.com / github.com/jmaillot present | ✓ PASS |
| Zero placeholders live | grep × 4 live routes | 0 hits each | ✓ PASS |
| Deployment freshness | compare local vs live `_astro` CSS hash | Identical: `BaseLayout.CnRtr4_s.css` | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| ROUT-06 | 05-01 | All internal links resolve correctly under configured site/base when previewed and built | ✓ SATISFIED | Crawl exit 0 on fresh build; live routes 200 under `site: https://www.jeremymaillot.fr` |
| DPLY-01 | 05-01 | Static dist builds without warnings; served output verified (asset paths, .nojekyll, base) on chosen host | ✓ SATISFIED | Warning-free captured build (token-name false positives waived w/ rationale); host fully verified via edge IPs |
| DPLY-02 | 05-02 | Build gate fails if placeholder identity remains | ✓ SATISFIED | Fail-closed gate wired post-build locally AND inherited in CI via `withastro/action` default `npm run build` |

**Orphaned requirements:** None. REQUIREMENTS.md maps exactly {ROUT-06, DPLY-01, DPLY-02} to Phase 5; plans claim exactly those IDs. Note: REQUIREMENTS.md traceability-table rows for Phase 5 still read "Pending" — stale rows, superseded by this artifact-level verification.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `AGENTS.md` | 56 | Stale live URL: "Live at https://jmaillot.github.io" — that URL now returns 404; actual host is https://www.jeremymaillot.fr | ⚠️ Warning (W-1) | Docs misdirect readers to a dead URL; introduced because the custom-domain pivot (commit 65ccb5f) updated astro.config/CNAME but not the docs written earlier in the phase |
| `README.md` | 4, 35 | Same stale URL `https://jmaillot.github.io` | ⚠️ Warning (W-1, same root cause) | Same as above |

No blocker-severity anti-patterns. No TODO/FIXME/stub/console-log-only implementations in phase files. Working tree clean; all six cited commits (2cbf72a, bacde68, 388c398, 42c6b8f, 9ce402e, 9343345) exist on master.

## Human Verification Required

Four items (detailed in frontmatter): browser styling/font check across the four live routes; mobile-menu focus trap/Escape/focus-restore at ≤599px; reduced-motion reveal behavior on live Home; skip-link + :focus-visible keyboard traversal. Code-level evidence for all four exists in the deployed CSS/JS (media query, focus-visible rules, nav enhancement JS), and equivalents passed the Phase 3/4 audits — these checks confirm they hold **on the live deployment**.

## Warnings Summary

1. **W-1 — Stale documented live URL (recommended pre-milestone fix, ~2-line edit):** AGENTS.md §Deploy story and README.md state the site lives at `https://jmaillot.github.io`, which returns **404**. The actual host is `https://www.jeremymaillot.fr`. Update both files (and any other occurrence) to reference the custom domain. This does not fail any roadmap success criterion (SC4 targets structural accuracy, which holds), so it is recorded as a warning rather than a structured gap.
2. **Environmental DNS split-horizon:** On this machine, `www.jeremymaillot.fr` resolves to `192.168.1.251` (LAN), masking the real GitHub Pages site. Not a project defect. Use `curl --resolve www.jeremymaillot.fr:443:185.199.108.153` (or public DNS) for future live checks. The 05-01-SUMMARY Task-4 curl evidence was independently corroborated via direct-to-edge checks during this verification.

## Gaps Summary

No gaps blocking goal achievement. All 14 programmatically-verifiable must-haves pass against the codebase and the live GitHub Pages deployment (verified authoritatively via edge-IP resolution). One truth (live reduced-motion/focus spot-check) requires human confirmation, and one documentation warning (stale live URL in AGENTS.md/README.md) is recommended for cleanup before milestone close.

---

_Verified: 2026-08-24T08:20:00Z_
_Verifier: OpenCode (gsd-verifier)_
