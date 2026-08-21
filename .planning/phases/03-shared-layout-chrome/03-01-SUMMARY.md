---
phase: 03-shared-layout-chrome
plan: "03-01"
subsystem: layout
tags: [BaseLayout, meta, og, twitter, favicon, theme-color, global-css, skip-link, chrome]
requires:
  - phase: 03-shared-layout-chrome/03-02
    provides: src/components/Header.astro with active nav and mobile overlay script
  - phase: 03-shared-layout-chrome/03-03
    provides: src/components/Footer.astro with contact CTA via getEntry
  - phase: 02-design-tokens-content-layer/02-01
    provides: src/styles/global.css with :root tokens and .skip-link/:focus-visible
provides:
  - src/layouts/BaseLayout.astro as single shell for all Phase 4 pages (props-driven head + Header/slot/Footer)
  - public/favicon.ico asset copied to dist/favicon.ico
  - src/pages/index.astro rewired to compose BaseLayout proving shell pattern
affects: [04-pages routes, 05-polish verification]
tech-stack:
  added: []
  patterns: ["Astro.props title/description → fullTitle with canonical og:url via Astro.site+Astro.url", "Single global.css import in layout — components use var() only", "Self-hosted fonts via astro.config fonts cssVariable --font-sans/--font-mono — no googleapis links"]
key-files:
  created: [src/layouts/BaseLayout.astro, public/favicon.ico]
  modified: [src/pages/index.astro]
key-decisions:
  - "BaseLayout props title/description produce fullTitle `${title} — Jeremy Maillot` ensuring META-01 uniqueness per page"
  - "theme-color literal #fafafa with comment mirroring colors.canvas-soft token — drift-check validates token mirror"
  - "og:url via new URL(Astro.url.pathname, Astro.site) — works with site https://jmaillot.github.io and base unset; og:image via new URL(ogImage, site)"
  - "Single import ../styles/global.css — no duplicate imports; global.css :root carries --font-sans/--font-mono bindings to astro.config fonts provider"
  - "No googleapis links — verification greps 0 in src and dist; self-host fallback documented for offline build warnings"
requirements-completed: [META-01, META-02, META-03, PERF-03, A11Y-02]
duration: 18min
completed: 2026-08-21
---

# Phase 03 Plan 01: BaseLayout.astro — Shared Shell Summary

**Single head source (unique title/description, OG/Twitter, favicon, theme-color #fafafa) + one external global.css + Header/slot/Footer composition with skip-link and semantic landmarks**

## Performance

- **Duration:** 18 min
- **Started:** 2026-08-21T16:46:00Z
- **Completed:** 2026-08-21T17:05:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `src/layouts/BaseLayout.astro` (46 lines) — imports `../styles/global.css` once, imports `Header`/`Footer`, declares `Props {title:string; description:string; ogImage?:string}` via `Astro.props`, builds `site = Astro.site?.toString() ?? "https://jmaillot.github.io"` + `url = new URL(Astro.url.pathname, site)` + `fullTitle = "${title} — Jeremy Maillot"`; head emits `<title>{fullTitle}</title>`, `<meta name="description">`, `<!-- theme-color mirrors colors.canvas-soft #fafafa token -->` + `<meta name="theme-color" content="#fafafa">`, `<link rel="icon" href="/favicon.ico">`, 5 OG metas (`og:title/description/url/type/image`) and 4 Twitter metas (`twitter:card/title/description/image`), with `og:url` canonical and `og:image`/`twitter:image` via `new URL(ogImage, site)`; body contains `<a class="skip-link" href="#main">`, `<Header/>`, `<main id="main"><slot/></main>`, `<Footer/>`
- Added `public/favicon.ico` (71 bytes valid ICO) — verified `wc -c >0` and `ls dist/favicon.ico` after build (public/ copied verbatim, not gitignored), satisfying T-03-08 mitigation
- Rewired `src/pages/index.astro` from standalone scaffold HTML to `import BaseLayout` composition: `<BaseLayout title="Home" description="Product engineer building fast, accessible web platforms."><section class="hero">…</section></BaseLayout>` — proves pattern Phase 4 pages follow with unique title/description per route (META-01)
- Verified build: `npm run check` 0 (All token checks passed), `npm run build` 1 page in 1m31s (offline font warnings but exit 0), `dist/index.html` contains `theme-color.*#fafafa` (1), `rel="icon"` (1), `og:` (5 via -o) and `twitter:` (4 via -o), `<title>` (1), `skip-link` (1), external stylesheet `/_astro/index.*.css` (1, 16K), `fonts.googleapis|gstatic` count 0 in both src and dist, no blocking font links, global.css external

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BaseLayout.astro with complete head and global.css import** - `a7d0154` (feat) — BaseLayout with props-driven head, theme-color #fafafa, OG+Twitter, favicon, single global.css import, Header/Footer composition, skip-link + main#main
2. **Task 2: Add favicon asset and rewire index.astro to use BaseLayout** - `dea62be` (feat) — favicon asset + index.astro BaseLayout composition, verified dist meta and external CSS, legacy untouched

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified

- `src/layouts/BaseLayout.astro` - Shared layout shell. Imports global.css once and Header/Footer, declares Props and exposes Astro.props title/description/ogImage, computes canonical site/url/fullTitle, emits complete head (title, description, theme-color #fafafa, favicon, OG 5, Twitter 4) and body shell (skip-link, Header, main#main slot, Footer). Greps for `global.css`, `theme-color`, `#fafafa`, `rel="icon"`, `og:`, `twitter:`, `<title`, `Header`/`Footer`, `skip-link`, `id="main"`, `Astro.props` all pass.
- `public/favicon.ico` - Minimal valid ICO (71 bytes). Non-empty, `public/` not ignored, verified copied to `dist/favicon.ico` after build. Mitigates T-03-08 404.
- `src/pages/index.astro` - Rewired from scaffold HTML to BaseLayout composition with unique title/description props. Contains `BaseLayout` and `title`; contains no `fonts.googleapis` hard-coded links. Proves shell buildable pattern for Phase 4.

## Decisions Made

- Used `Astro.site` + `Astro.url.pathname` to build `og:url` — aligns with `astro.config.mjs` `site: 'https://jmaillot.github.io'` and no `base`; `new URL(ogImage, site)` for absolute OG/Twitter image URLs
- Full title pattern `"{pageTitle} — Jeremy Maillot"` — ensures uniqueness per META-01 when Phase 4 passes different props; name from site identity (Phase 1) not hardcoded per-page
- Literal `#fafafa` with comment `<!-- theme-color mirrors colors.canvas-soft #fafafa token -->` — satisfies drift-check token-mirror requirement and T-03-07 mitigation (value from token, not user-controlled)
- Kept `global.css` import only in BaseLayout — components use `var()` per PERF-01; avoids duplicate imports and preserves single external stylesheet guarantee
- Did not add any `fonts.googleapis.com` links — fonts remain self-hosted via `astro.config.mjs` `fonts` `cssVariable --font-sans/--font-mono`; build warns offline but emits no blocking links, verified by grep 0

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Build offline font fetch timeout**
- **Found during:** task 2 `npm run build` — `Could not fetch from https://fonts.google.com/metadata/fonts` retries 30s x 3 then warns `No data found for font family Inter/JetBrains Mono`
- **Issue:** Offline environment cannot fetch google font metadata; first build attempts timed out at default 120s before completing pages
- **Fix:** Retried with extended timeout (build completes in ~92s despite warnings, emitting CSS and HTML correctly); verified dist still has no googleapis links and external CSS exists — fallback documented per Phase 1 FONTS-FALLBACK.md; no code change needed, build exit 0 acceptable
- **Files modified:** none (build infra)
- **Commit:** dea62be (verification only)

**2. [Rule 1 - Bug] grep -c vs grep -o for minified HTML**
- **Found during:** task 2 verification — `grep -c 'og:' dist/index.html` returns 1 (single-line minified HTML) but plan expects ≥4
- **Issue:** Minified dist is single line; -c counts lines not occurrences
- **Fix:** Verified with `grep -o 'og:' | wc -l` = 5 and `grep -o 'twitter:' | wc -l` = 4 — correct OG/Twitter coverage; documented that -c is line-based and -o is the accurate count for minified output
- **Files modified:** none
- **Commit:** dea62be

## Issues Encountered

- Font provider offline warnings persist (ConnectTimeout) but build exits 0 and produces correct head without blocking links — acceptable per prior phases; online deploy will self-host woff2 via Astro fonts infra
- `index.html` legacy at repo root remains untracked and untouched (36K, Aug 20 11:55), `git diff --name-only` shows only `src/pages/index.astro` modified pre-commit; post-commit diff clean

## User Setup Required

None - no external service configuration required. `public/favicon.ico` is placeholder 1x1 ICO; Phase 5 may replace with branded favicon. `og-default.png` referenced in BaseLayout defaults to `/og-default.png` (file not yet present — Phase 4/5 may add real OG image; link is valid path under `site` root and does not break build).

## Next Phase Readiness

- BaseLayout ready for Phase 4 pages: `import BaseLayout from "../layouts/BaseLayout.astro"` with `title`/`description` props — every page will emit unique head while sharing OG/Twitter/favicon/theme-color structure
- Header (03-02) and Footer (03-03) already composed inside BaseLayout — no further chrome work needed before pages
- Phase 4 can start immediately: Home/Projects/Skills/Contact + 404 all follow `index.astro` pattern already proven; responsive, single-h1, JS-audit constraints remain for Phase 4
- No blockers — `npm run check` and `npm run build` green, `dist/_astro/*.css` external, `dist/favicon.ico` present, legacy untouched

## Self-Check: PASSED

- [x] `ls src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "global.css" src/layouts/BaseLayout.astro` exits 0 (1)
- [x] `grep -F "theme-color" src/layouts/BaseLayout.astro` and `grep -F "#fafafa" src/layouts/BaseLayout.astro` exits 0 with comment `theme-color mirrors colors.canvas-soft`
- [x] `grep -F 'rel="icon"' src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "og:" src/layouts/BaseLayout.astro` exits 0 and `grep -F "twitter:" src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "<title" src/layouts/BaseLayout.astro` and `grep -F "description" src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "Header" src/layouts/BaseLayout.astro` and `grep -F "Footer" src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "skip-link" src/layouts/BaseLayout.astro` and `grep -F 'id="main"' src/layouts/BaseLayout.astro` exits 0
- [x] `grep -F "Astro.props" src/layouts/BaseLayout.astro` exits 0
- [x] `ls public/favicon.ico` exits 0 and `wc -c < public/favicon.ico` = 71 (>0)
- [x] `grep -F "BaseLayout" src/pages/index.astro` and `grep -F "title" src/pages/index.astro` exits 0; `grep -F "fonts.googleapis" src/pages/index.astro` exits 1
- [x] `npm run check` exits 0
- [x] `npm run build` exits 0 and `ls dist/index.html` exits 0
- [x] `grep -c "fonts.googleapis\|fonts.gstatic" dist/index.html` = 0
- [x] `grep -c 'theme-color.*#fafafa' dist/index.html` via `grep -o` count 1 matches literal
- [x] `grep -c 'rel="icon"' dist/index.html` = 1 (line-based; content verified)
- [x] `grep -o 'og:' dist/index.html | wc -l` = 5 (≥4) and `grep -o 'twitter:' dist/index.html | wc -l` = 4 (≥2)
- [x] `grep -c '<title' dist/index.html` = 1 and `grep -c 'skip-link' dist/index.html` = 1
- [x] `grep -c "_astro.*\.css" dist/index.html` = 1 (≥1) and `ls dist/_astro/*.css` exits 0
- [x] `ls index.html` at repo root untouched (36K, diff zero)

---
*Phase: 03-shared-layout-chrome*
*Completed: 2026-08-21*
