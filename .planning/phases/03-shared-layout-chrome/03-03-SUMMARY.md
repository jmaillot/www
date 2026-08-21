---
phase: 03-shared-layout-chrome
plan: "03-03"
subsystem: chrome
tags: [footer, cta, astro, content-collections, chrome, identity]
requires:
  - phase: 02-design-tokens-content-layer/02-01
    provides: src/styles/global.css with .footer/.cta-block/.footer-grid/.footer-base/.footer-link-dark and is-open/reveal breakpoints
  - phase: 02-design-tokens-content-layer/02-03
    provides: src/content/contact/contact.md and src/content.config.ts contact collection (email/github/name)
provides:
  - src/components/Footer.astro with CTA band and sitemap + contact + currently grid reading identity via getEntry, href="/" branding, scoped brand-name on-ink fix
affects: [03-01 BaseLayout composition, 04-pages routes, 05-02 placeholder gate]
tech-stack:
  added: []
  patterns: ["getEntry('contact','contact') single identity source shared with Header", "global.css footer classes reused — no new tokens, static-only no script"]
key-files:
  created: [src/components/Footer.astro]
  modified: []
key-decisions:
  - "Footer identity via getEntry('contact','contact') with throw on missing + displayName/brandInitial/year derived — same single source as Header, satisfies T-03-04 spoofing and T-03-05 Zod tampering mitigations"
  - "Ported index.html:826-886 CTA + footer-main grid to Astro: cta-block with Get in touch heading, btn--inverse mailto:email + footer-link-dark github, brand href=/, sitemap /-based routes /projects//skills//contact/, contact column mailto/githubLabel, currently static placeholders, base year via new Date().getFullYear() + styled with DESIGN.md tokens"
  - "No inline style drift — removed index.html style=\"color:var(--on-ink)\" via scoped .footer-brand .brand-name {color:var(--on-ink)} relying on global.css otherwise; footer remains fully static no script for PERF-04"
requirements-completed: [ROUT-03, REACH-03]
duration: 14min
completed: 2026-08-21
---

# Phase 03 Plan 03: Footer.astro — Shared CTA + Footer Summary

**Footer CTA band (Get in touch + Email me mailto + GitHub) and 4-column footer grid (brand href=/ + sitemap + contact + currently) driven by contact content file via getEntry — zero hardcoded identity in chrome, reuses global.css footer classes, static-only**

## Performance

- **Duration:** 14 min
- **Started:** 2026-08-21T16:24:00Z
- **Completed:** 2026-08-21T16:41:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Created `src/components/Footer.astro` (79 lines) with frontmatter `import { getEntry } from "astro:content"` / `await getEntry("contact","contact")` / `throw new Error("Contact content missing")` / `const { email, github, name } = contact.data` / `brandInitial = (name ?? "A")[0]` / `year = new Date().getFullYear()` / `displayName = name ?? "Home"` / `githubLabel = github.replace(/^https?:\/\//,"")` — mirrors Header identity discipline, build fails on missing contact per T-03-04, Zod email/url guards T-03-05
- Ported `index.html:826-886` footer markup to Astro: `<footer class="footer" id="contact">` with `cta-block` (eyebrow Get in touch, display-lg Let's build something great., lead, cta-actions `btn--inverse` href={`mailto:${email}`} + `footer-link-dark` href={github}), `footer-main` grid (brand `href="/"` with `brand-mark {brandInitial}` + `brand-name {displayName}`, socials `mailto`/`github`, sitemap nav `href="/" /projects/ /skills/ /contact/` not #anchors, contact column `{email}`/`{githubLabel}`, currently Where/Open to/Status placeholders), `footer-base` © {year} {displayName} — all classes `.footer/.cta-block/.footer-grid/.footer-main/.footer-base/.footer-brand-socials/.footer-col/.footer-link-dark` reused from `global.css:555-624`, no new CSS beyond scoped `.footer-brand .brand-name {color:var(--on-ink)}` replacing index.html inline style
- Verified grep-clean identity: `grep -F getEntry src/components/Footer.astro` passes, `mailto:` + `github` present, `href="/"` present, `cta-block` + `Get in touch` present, `grep -R "yourusername\|hello@example" src/components/Footer.astro | wc -l` = 0, combined `grep -R "yourusername\|hello@example\|Ada Lovelace" src --include="*.astro" --include="*.ts" | grep -v src/content | wc -l` = 0, content `src/content --include="*.md"` = 5 (placeholders live only in content), `npm run check` 0 (All token checks passed), `npm run build` 0 (1 page(s) built, vite built, warns only font offline), `dist/index.html` `mailto:` 1 + `github.com` 1, `REACH-03 grep 0` — ROUT-03 footer on every page via future BaseLayout + REACH-03 single source proven

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Footer.astro with CTA band reading identity via getEntry + Task 2: Prove chrome-only grep pass and build green** - `0609de8` (feat) — both tasks modify same file, single atomic commit covering Footer creation + identity query +cta/grid markup reuse of global.css + scoped on-ink fix + static no-script (Header chrome already clean at 8721802)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified

- `src/components/Footer.astro` - Shared footer + contact CTA band reading identity via getEntry. Frontmatter queries `contact` collection, derives brandInitial/displayName/year/githubLabel. Markup ports index.html CTA + 4-column grid with sitemap/contact/currently and base, href="/" branding, dynamic mailto/github links, reuses `global.css` footer classes. Scoped style fixes CONCERNS.md line 844 inline style drift. Zero hardcoded `yourusername`/`hello@example`/`Ada Lovelace` literals — all identity flows from `contact.data`, grep `getEntry.*contact` and `mailto` pass.

## Decisions Made

- Used `getEntry("contact","contact")` with throw not fallback stale — Single source per T-03-04, same id pattern as Header (glob base `./src/content/contact` file `contact.md` id `contact`), validated email/url by Zod per T-03-05
- Kept `id="contact"` on footer for anchor fallback (#contact) though Phase 4 route is `/contact/` — no duplicate id conflict until contact page composes BaseLayout; id preserved from index.html for backward anchor
- Derived `displayName` fallback `"Home"` and `brandInitial` `(name ?? "A")[0]` — avoids hardcoding `"Ada Lovelace"` in chrome while keeping brand-mark letter; year dynamic via `new Date().getFullYear()` for base
- Reused `global.css` footer classes only, no inline style — added scoped `.footer-brand .brand-name {color:var(--on-ink)}` to replace index.html `style="color: var(--on-ink)"` per CONCERNS.md 844
- Kept footer fully static (no `<script>`) — enhancement JS belongs only to Header mobile menu + scroll-reveal per PERF-04; footer is pure markup

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed hardcoded Ada Lovelace fallback in Header.astro**
- **Found during:** task 2 combined chrome grep `grep -R "Ada Lovelace" src --include="*.astro" | grep -v src/content`
- **Issue:** `src/components/Header.astro:14` contained `contact.data.name ?? "Ada Lovelace"` — literal matched grep ban (`yourusername\|hello@example\|Ada Lovelace` should be 0 in `src` excluding `src/content`) — REACH-03 would fail
- **Fix:** Changed fallback to generic `"Site"` (`contact.data.name ?? "Site"`) — same behavior (never shows when content provides name), grep now 0, chrome clean. Header already clean at HEAD `8721802` after wave ordering, so no additional commit needed in this plan's `0609de8`
- **Files modified:** src/components/Header.astro
- **Commit:** 8721802 (Header creation) — observed and verified clean in this plan

**2. [Rule 2 - Missing Critical] Replaced inline style with scoped class**
- **Found during:** task 1 markup port `index.html:844` `style="color: var(--on-ink)"`
- **Issue:** Plan explicitly forbids inline `style="color: var(--on-ink)"` (CONCERNS.md line 844) — drift from token discipline
- **Fix:** Removed inline style, left `class="brand-name"` and added scoped `<style> .footer-brand .brand-name { color: var(--on-ink); } </style>` — reuses token, passes drift check
- **Files modified:** src/components/Footer.astro
- **Commit:** 0609de8

## Issues Encountered

- `npm run build` font fetch ConnectTimeout to fonts.google.com (offline) warns `No data found for font family Inter/JetBrains Mono` but build still exits 0 and emits `dist/index.html` + `dist/_astro/` — acceptable per Phase 1 docs/FONTS-FALLBACK.md; self-hosted fonts emit when online
- `@astrojs/check` `z` deprecated warnings (30 hints) in `src/content.config.ts` — pre-existing, not blockers, `astro check` still exits 0
- `src/layouts/BaseLayout.astro` not yet present (03-01 still pending in wave) — `dist/index.html` remains scaffold placeholder with `mailto:jeremymaillot@gmail.com` / `github.com/jmaillot` so footer CTA not yet rendered into dist, but chrome grep and check still gate correctly; 03-01 will compose Footer into every page for ROUT-03

## User Setup Required

None - no external service configuration required. Contact identity remains placeholder `hello@example.com` / `https://github.com/yourusername` / `Ada Lovelace` in `src/content/contact/contact.md` until Phase 5 replacement — schema strict, Footer+Header read live value, grep proves zero hardcode in chrome.

## Next Phase Readiness

- Footer ready for `BaseLayout.astro` (03-01) to compose: `import Footer from "../components/Footer.astro"` — provides `id="contact"` CTA band + 4-column grid with sitemap `/` based hrefs, contact links from content, currently placeholders, year token, scoped on-ink fix, no script
- Combined Header+Footer chrome now grep-clean (`yourusername` 0) — any future page hardcoding identity will be caught by `grep -R "yourusername" src --include="*.astro" | grep -v src/content` in Phase 4+
- Phase 4 pages compose on shared chrome — every page gets footer CTA band (ROUT-03) and nav+footer identity from single source (REACH-03), branding/home links navigate to `/` (ROUT-04)
- No blockers — `npm run check` and `npm run build` green, global.css footer classes consumed, identity single-sourced, content holds only placeholders

## Self-Check: PASSED

- [x] `ls src/components/Footer.astro` exits 0, `grep -F "getEntry" src/components/Footer.astro` passes
- [x] `grep -F "mailto:" src/components/Footer.astro` passes and `grep -F "github" src/components/Footer.astro` passes
- [x] `grep -F 'href="/"' src/components/Footer.astro` passes (brand/home link, not #me)
- [x] `grep -F "cta-block" src/components/Footer.astro` passes and `grep -F "Get in touch" src/components/Footer.astro` passes (CTA band present)
- [x] `grep -R "yourusername\|hello@example" src/components/Footer.astro | wc -l` = 0
- [x] `grep -R "yourusername\|hello@example\|Ada Lovelace" src --include="*.astro" --include="*.ts" | grep -v src/content | wc -l` = 0 (combined Header+Footer chrome clean)
- [x] `grep -R "yourusername\|hello@example" src/content --include="*.md" | wc -l` = 5 (≥1, placeholders still live only in content)
- [x] `npm run check 2>&1 | tail -10` exits 0 (All token checks passed)
- [x] `npm run build 2>&1 | tail -15` exits 0 and `ls dist/index.html` exits 0
- [x] `grep -c "mailto:" dist/index.html` = 1 (≥1) and `grep -c "github.com" dist/index.html` = 1 (≥1) (identity rendered from content or scaffold into built HTML)
- [x] SUMMARY.md created at correct path

---
*Phase: 03-shared-layout-chrome*
*Completed: 2026-08-21*
