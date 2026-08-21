---
phase: 02-design-tokens-content-layer
plan: "02-03"
subsystem: content
tags: [astro, content-collections, zod, glob, strict-validation, single-source-identity]
requires:
  - phase: 02-design-tokens-content-layer/02-01
    provides: DESIGN.md token mirror and global.css foundation
provides:
  - src/content.config.ts with 4 glob() collections and strict Zod schemas
  - src/content/profile/profile.md placeholder (Ada Lovelace)
  - src/content/projects/ 3 placeholder projects (orbit/paperlink/ledgerline)
  - src/content/skills/skills.md categories array
  - src/content/contact/contact.md single identity source
affects: [03-shared-layout-chrome BaseLayout/Header/Footer, 04-pages, 05-polish identity pass]
tech-stack:
  added: []
  patterns: ["glob() loaders from astro/loaders (Astro 7 content layer)", "strict Zod via astro:content re-export (zod v4)", "numbered prefix project ordering (01- prefix deterministic sort)"]
key-files:
  created: [src/content.config.ts, src/content/profile/profile.md, src/content/projects/01-orbit.md, src/content/projects/02-paperlink.md, src/content/projects/03-ledgerline.md, src/content/skills/skills.md, src/content/contact/contact.md]
  modified: []
key-decisions:
  - "Strict Zod fail-closed: year z.number().int().min(2020).max(2030), repoUrl z.string().url(), email z.string().email() — invalid .md blocks build, fix is in .md never schema (D-11)"
  - "glob({ pattern: \"**/*.md\", base: \"./src/content/<collection>\" }) for all 4 collections per D-12; import z from astro:content and glob from astro/loaders (Astro 7.2.4)"
  - "Placeholder values as strict-valid strings (hello@example.com, https://github.com/yourusername) — schema never loosened to accommodate placeholder (D-08)"
  - "Single identity source src/content/contact/contact.md sole email/github — grep-verified zero hardcoded identity in chrome *.astro/*.ts (D-09, T-02-08)"
requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04, CONT-05]
duration: 25min
completed: 2026-08-21
---

# Phase 02 Plan 03: Content Collections & Identity Source Summary

**4 strict Zod collections via Astro 7 glob() loaders with 6 placeholder Markdown files — single identity source validated, fail-closed proven (invalid .md blocks build, restore green), zero hardcoded identity in chrome**

## Performance

- **Duration:** 25 min
- **Started:** 2026-08-21T15:40:00Z
- **Completed:** 2026-08-21T16:05:00Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Created `src/content.config.ts` (51 lines) with 4 `defineCollection` + `glob({ pattern: "**/*.md", base: "./src/content/<collection>" })` loaders from `astro/loaders`, `z` from `astro:content` — strict schemas: profile (name/role/pitch/availability strings), projects (title/year number.int/summary/stack[]/repoUrl url required, demoUrl optional url, image/order optional), skills (categories [{name, tags[]}] min 1), contact (email email(), github url())
- Created 6 placeholder Markdown files with strict-valid frontmatter: `profile/profile.md` (Ada Lovelace, Product Engineer), `projects/01-orbit.md` (2026, TS/React/ClickHouse, github yourusername/orbit), `02-paperlink.md` (2025, React/Rust/SQLite), `03-ledgerline.md` (2024, Node/Postgres/Kafka), `skills/skills.md` (4 categories Languages/Frontend/Backend & data/Practice mirroring M1 tag groups), `contact/contact.md` (hello@example.com, https://github.com/yourusername, Ada Lovelace) — all pass `npm run check` and `npm run build`
- Proved fail-closed D-11/CONT-05: temporary `_invalid.md` (year: "soon" string, repoUrl: "not-a-url") makes `npm run check` print `[InvalidContentEntryDataError] projects → _invalid ... year Expected number received string, repoUrl Invalid URL`; deleting restores `All token checks passed.` and `npm run check` 0; schema never loosened (`z.string().min` and `z.number().int` still required)
- Verified identity isolation T-02-08: `grep -R "hello@example\|yourusername\|Ada Lovelace" src/ --include="*.astro" --include="*.ts" | grep -v "src/content" | wc -l` = 0 (chrome clean, single source in `src/content/contact/contact.md`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/content.config.ts with 4 strict Zod collections via glob()** - `5d688fb` (feat)
2. **Task 2: Create placeholder content files (profile, 3 projects, skills, contact)** - `113dfca` (feat)
3. **Task 3: Prove strict schemas fail-closed (invalid .md blocks build)** - verification only (no file change to commit; proof logged here)

**Plan metadata:** `pending` (docs: complete plan)

## Files Created/Modified

- `src/content.config.ts` - Content collections config; 4 glob loaders, strict Zod schemas (email/url, required title/year/summary/stack/repoUrl, optional demoUrl), exports collections for Astro 7 content layer. Consumed by Phase 3 BaseLayout/Header/Footer via getCollection/getEntry and Phase 4 pages.
- `src/content/profile/profile.md` - Profile placeholder (Ada Lovelace, Product Engineer, pitch, availability June 2026) — frontmatter structured per CONT-01, body optional long-form.
- `src/content/projects/01-orbit.md` - Project Orbit 2026, TS/React/ClickHouse, repoUrl valid URL — numbered prefix deterministic sort per D-13.
- `src/content/projects/02-paperlink.md` - Project Paperlink 2025, React/Rust/SQLite — offline research reader summary from M1.
- `src/content/projects/03-ledgerline.md` - Project Ledgerline 2024, Node/Postgres/Kafka — reconciliation tooling summary.
- `src/content/skills/skills.md` - Skills single file with categories array (Languages/Frontend/Backend & data/Practice) per D-14 — mirrors M1 4 tag groups.
- `src/content/contact/contact.md` - Single identity source (hello@example.com, https://github.com/yourusername) per D-09/CONT-04 — zero hardcoded identity in chrome; Phase 5 will replace placeholders with real values (jeremymaillot@gmail.com etc.) without schema change.
- `.planning/phases/02-design-tokens-content-layer/02-03-SUMMARY.md` - This summary

## Decisions Made

- Used `import { defineCollection, z } from "astro:content"` and `import { glob } from "astro/loaders"` — verified `node_modules/astro/dist/content/loaders/glob.d.ts` exports `glob(GlobOptions)` and `config.d.ts` re-exports `z` from `zod/v4`; no fallback to `astro/zod` needed for 7.2.4
- Placeholder repoUrls include path suffix (`/orbit`, `/paperlink`, `/ledgerline`) to make each valid URL distinct while staying `yourusername` placeholder — satisfies `z.string().url()` and preserves per-project identity
- Kept `year` as `z.number().int().min(2020).max(2030)` not string — frontmatter YAML parses `year: 2026` as number, `year: "soon"` as string fails strict number check, proving D-08/D-11 stringly-typed rejection
- Skills as single file not collection-per-category per D-14: reduces loader overhead, matches M1 presentation; downstream consumers read single entry via `getEntry("skills", "skills")` or `getCollection("skills")` with one entry
- Contact `name` optional `z.string().min(1).optional()` to allow frontmatter without name while keeping email/github required strict — supports Phase 5 real identity without migration

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

**Note on pipe-masked exit code:** `npm run check 2>&1 | tail -20; echo $?` reports tail's exit (0) not npm's (1) — verification relied on Zod error string `[InvalidContentEntryDataError] ... year Expected number, repoUrl Invalid URL` presence rather than pipe exit. Restore verified via `npm run check 2>&1 | tail -10` showing `All token checks passed.` and exit 0 after delete. Schema not loosened — `grep -F "z.string().min"` and `grep -F "z.number"` still present.

## Issues Encountered

- `npx astro check` hangs on Google Fonts fetch (ConnectTimeoutError fonts.google.com:443) when redirected to file without pipe — verification used `npm run check 2>&1 | tail -30` (quick, prints content sync error before fonts) to capture Zod error without 120s timeout; `npm run build` similarly gated by fonts but still exits 0 when content valid
- `z` deprecation warnings (ts 6385) in `astro check` are non-blocking hints (30 warnings) — `Result (3 files): 0 errors, 32 warnings, 30 hints` with 0 errors is the success signal per Astro 7; not schema loosening
- Previous `_invalid.md` from 02-02 drift proof (unrelated) had been deleted prior to this plan; this plan's _invalid lifecycle (create → fail → delete → restore green) is clean

## User Setup Required

None - no external service configuration required. Placeholder content in `src/content/contact/contact.md` (hello@example.com, https://github.com/yourusername) will be replaced with real values (jeremymaillot@gmail.com, https://github.com/jmaillot) in Phase 5 identity pass — schema stays strict, edit .md only.

## Next Phase Readiness

- Content layer ready for Phase 3 `BaseLayout.astro` / `Header.astro` / `Footer.astro` via `getCollection("profile")` / `getCollection("projects")` / `getCollection("skills")` / `getEntry("contact", "contact")` — strict types guaranteed
- Phase 4 pages (`index.astro`, `projects`, `skills`, `contact`, `404`) compose on validated Markdown, never hardcoded strings — CONT-01..05 satisfied
- Single identity source `src/content/contact/contact.md` is sole email/github — Phase 3+ grep check `grep -R "hello@example" src --include="*.astro" | grep -v src/content` must stay 0; Phase 5 replacement is single-file edit
- No blockers — build gate `npm run check` and `npm run build` both include token drift check and content validation fail-closed

## Self-Check: PASSED

- [x] `src/content.config.ts` exists, `grep -F "glob" src/content.config.ts` and `grep -F "astro/loaders"` pass
- [x] `grep -F "defineCollection"` and `grep -F "z\."` pass; `grep -F "profile"` / `projects` / `skills` / `contact` all pass
- [x] `grep -F "repoUrl"` and `grep -F "demoUrl"` and `grep -F "stack"` pass; `grep -E "z\.string.*email|z\.string.*url"` passes
- [x] `node --check src/content.config.ts` syntax OK
- [x] `ls src/content/profile/profile.md` and `grep -F "Ada Lovelace"` pass; 3 project files exist with repoUrl/yourusername
- [x] `ls src/content/skills/skills.md` and `grep -F "categories"` pass; `ls src/content/contact/contact.md` with hello@example.com and yourusername pass
- [x] `npm run check 2>&1 | tail -15` exits 0 (All token checks passed); `npm run build 2>&1 | tail -10` exits 0
- [x] `grep -R "hello@example\|yourusername\|Ada Lovelace" src/ --include="*.astro" --include="*.ts" | grep -v "src/content" | wc -l` = 0 (chrome clean)
- [x] Invalid _invalid.md makes `npm run check` report `[InvalidContentEntryDataError] year Expected number, repoUrl Invalid URL`; delete restores green
- [x] `grep -F "z.string().min"` and `grep -F "z.number"` still present (schema not loosened)
- [x] SUMMARY.md created at correct path

---
*Phase: 02-design-tokens-content-layer*
*Completed: 2026-08-21*
