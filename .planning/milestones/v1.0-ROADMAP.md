# Roadmap: Online Profile Site

## Overview

Rebuild the validated single-file profile page (`index.html`) into a modular, multi-page Astro site with Markdown content — closing the M1 meta/a11y/perf gaps the codebase map identified (missing OG/favicon/theme-color, mobile-menu focus trap, render-blocking fonts, token drift, ~21 hardcoded placeholder literals). The journey follows the architecture's dependency order: stand up a pinned, deployment-safe static foundation (GitHub Pages root, `base` unset, `.nojekyll`, self-hosted fonts) → establish both single sources of truth (DESIGN.md tokens as the only raw values in `global.css`, all editable content as Zod-validated Markdown) → build the shared layout and chrome every page composes (head/meta, nav with mobile menu, footer with identity-driven CTAs) → compose the four pages + branded 404 as pure content-and-chrome output → verify the served build end-to-end and gate on placeholder identity. Each phase ends in a buildable, verifiable state; every phase's success criteria are the pitfall-verification steps from research.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scaffold & Static Foundation** - Pinned Astro 7 project configured for GitHub Pages root, `.nojekyll`, self-hosted fonts verified, static-only discipline
- [ ] **Phase 2: Design Tokens & Content Layer** - `global.css` token extraction with drift-check script + 4 strict content collections (profile, projects, skills, contact)
- [ ] **Phase 3: Shared Layout & Chrome** - BaseLayout (head/meta/OG/favicon/theme-color/fonts), accessible Header with mobile menu, Footer with identity-driven CTAs
- [x] **Phase 4: Pages & Sections** - Home, Projects (cards + image slots), Skills, Contact, branded 404 — responsive, one h1 each, JS-safe enhancements (completed 2026-08-23)
- [ ] **Phase 5: Polish & Ship-Readiness** - Served-output verification (`.nojekyll`, asset paths, links), placeholder build gate, AGENTS.md refresh

## Phase Details

### Phase 1: Scaffold & Static Foundation

**Goal**: A pinned, static-only Astro project configured for GitHub Pages root that builds clean — the foundation every later phase composes on. The must-decide-early decisions (host/base, font strategy, static output) are settled here so nothing gets retrofitted after assets exist.
**Depends on**: Nothing (first phase)
**Requirements**: None directly — foundation phase; enables ROUT-06, PERF-03, PERF-04, DPLY-01, DPLY-02 in later phases
**Success Criteria** (what must be TRUE):

  1. `astro check && astro build` exits clean (zero errors/warnings) with versions pinned: Astro dist-tag re-verified at scaffold time (`npm view astro dist-tags`), `typescript@^6`, Node ≥22.12 via `.nvmrc` — Pitfall 8 (build/CI traps)
  2. `public/` contains an empty `.nojekyll` file — Pitfall 1 (Jekyll silently drops `_astro/` without it)
  3. `astro.config.mjs` sets `site: https://<user>.github.io`, leaves `base` unset, explicitly sets `output: 'static'`, and comments the host decision — Pitfall 2 (host/base decided before first build)
  4. The Astro built-in `fonts` config is verified at scaffold: a build emits self-hosted font assets bound to `--font-sans`/`--font-mono` with no render-blocking font `<link>` in the head; the preconnect fallback is documented if the config misbehaves
  5. The scaffolded page is fully static: served HTML carries no framework runtime and no client-side rendering

**Plans**: 3 plans

Plans:

- [x] 01-01: Scaffold Astro 7 project (minimal template), pin versions (astro dist-tags, typescript ^6, `.nvmrc`), wire `astro check && astro build` script
- [x] 01-02: Configure `astro.config.mjs` (site/base/output static + host comment), add `.nojekyll`, verify built-in fonts config binds `--font-sans`/`--font-mono`
- [x] 01-03: Prove the foundation: clean check+build, preview renders static HTML, no render-blocking font CSS in built head

### Phase 2: Design Tokens & Content Layer

**Goal**: Both single sources of truth exist and are enforced — DESIGN.md tokens as the only raw values in `global.css` (swappable design layer) and all editable content as validated Markdown (profile, projects, skills, contact) — so every later phase composes on stable, verified data. Known M1 drift is resolved here, the one cheap moment to clean the mirror.
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):

  1. The site's styling ships as one external CSS file (`global.css`); its `:root` block is the only place raw design values live — component rules use `var()` only (grep for hex/rgba outside the token block returns zero) — PERF-01
  2. The drift-check script wired into the build passes: every `:root` custom property matches its DESIGN.md frontmatter value and referenced tokens exist; known M1 drift is resolved during extraction (button padding 24px→12px spec, missing color tokens added, `--mute` darkened to ≥4.5:1 AA) — PERF-02
  3. Profile, projects (one file per project), skills, and contact content all exist as Markdown with strict Zod schemas; a deliberately invalid content file fails the build, and the fix is always in the `.md`, never a schema loosening — CONT-01, CONT-02, CONT-03, CONT-05
  4. Contact details (email, GitHub URL) live in exactly one Markdown frontmatter block — the single identity source every chrome/page consumer reads; placeholder values live in the content (schema stays strict) — CONT-04

**Plans**: 3 plans
**UI hint**: yes

Plans:

- [ ] 02-01: Extract the M1 `:root` mirror into `src/styles/global.css` as a discrepancy-resolution pass vs DESIGN.md (fix button padding, add missing tokens, darken `--mute`, drop dead `.nav-burger.is-open` state)
- [ ] 02-02: Add the DESIGN.md↔CSS drift-check script (token-diff pass) wired into the build; register theme-color `#fafafa` (canvas/soft) as a token-mirror entry
- [ ] 02-03: Create `src/content.config.ts` (v6/v7 API: `glob()` loaders, `astro/zod`, `entry.id`) + 4 content collections with strict schemas + placeholder content files

### Phase 3: Shared Layout & Chrome

**Goal**: Every page composes one shell — complete head (unique title/description, OG/Twitter, favicon, theme-color, non-blocking fonts), accessible Header with active-state nav and a fixed mobile menu, Footer with the contact CTA band — with email/GitHub rendering from the identity source, never hardcoded markup.
**Depends on**: Phase 2
**Requirements**: ROUT-02, ROUT-03, ROUT-04, REACH-03, META-01, META-02, META-03, A11Y-01, A11Y-02, PERF-03
**Success Criteria** (what must be TRUE):

  1. Every page renders the shared nav with links to all 4 pages and an active-state indicator for the current page; branding and page links navigate to Home — ROUT-02, ROUT-04
  2. Every page renders the shared footer including the contact CTA band; the email and GitHub shown in nav and footer render from the contact content file — grep finds zero hardcoded identity strings in chrome markup — ROUT-03, REACH-03
  3. Every page's `<head>` emits a unique `<title>` + meta description, Open Graph + Twitter card meta, a favicon link, and `theme-color` from the canvas/soft token (`#fafafa`, registered as a token-mirror entry) — META-01, META-02, META-03
  4. The mobile nav (≤599px) opens a full overlay that traps keyboard focus, closes on Escape, restores focus to the toggle, syncs `aria-expanded`, and closes at ≥600px; the a11y baseline is kept (skip link, semantic landmarks, `:focus-visible` outlines) — A11Y-01, A11Y-02
  5. Fonts do not block first paint: the built site's head has no render-blocking font CSS; fonts are self-hosted via the Astro `fonts` config bound to `--font-sans`/`--font-mono` — PERF-03

**Plans**: 3 plans
**UI hint**: yes

Plans:

- [ ] 03-01: BaseLayout.astro — head (title/description/meta/OG/Twitter/favicon/theme-color), fonts, skip link, imports `global.css` once, composes Header + slot + Footer
- [ ] 03-02: Header.astro — nav with `Astro.url.pathname` active state, branding link, mobile overlay menu ported as a processed `<script>` with focus-trap/Escape/`is-open`/resize/`aria-expanded` fixes
- [ ] 03-03: Footer.astro — contact CTA band reading identity via `getEntry()`; chrome-only grep pass for hardcoded identity values

### Phase 4: Pages & Sections

**Goal**: The four routes exist as pure composition of the content and chrome layers — Home hero with CTAs, Projects grid with cards and image slots, Skills tag groups, Contact — plus a branded 404, all responsive with exactly one h1 per page and JS-safe enhancements.
**Depends on**: Phase 3
**Requirements**: ROUT-01, ROUT-05, PROJ-01, PROJ-02, PROJ-03, PROJ-04, REACH-01, REACH-02, META-04, A11Y-03, A11Y-04, PERF-04
**Success Criteria** (what must be TRUE):

  1. Four routes render — `/`, `/projects/`, `/skills/`, `/contact/` — each composing the shared chrome, each with exactly one `h1` and the layout's `lang` — ROUT-01, META-04
  2. `/projects/` renders each project as a card (name, year, summary, stack tags) from Markdown, with a styled 16:9 image slot (no layout shift; screenshots swappable without template changes), a GitHub link, and the optional demo link rendered only when content provides one — PROJ-01, PROJ-02, PROJ-03, PROJ-04
  3. Email is reachable in one click from every page (nav CTA, hero CTA, footer band, 404) and GitHub from every page (nav, hero, footer, project cards) — REACH-01, REACH-02
  4. Any unknown URL serves the branded 404 page with navigation back to Home plus email/GitHub links — ROUT-05
  5. The site is responsive at DESIGN.md breakpoints (<600, 600–959, ≥960) across all pages; enhancement JS is only the nav menu and scroll-reveal (built output fully static, zero client-side rendering, grep-verified); scroll-reveal respects `prefers-reduced-motion` and never hides content without JS — A11Y-04, A11Y-03, PERF-04

**Plans**: 4 plans
**UI hint**: yes

Plans:

- [x] 04-01: ProjectCard component + projects.astro — card composition, 16:9 image-slot placeholders, GitHub links, optional `demoUrl` (Wave 1)
- [x] 04-02: profile schema extension (headline/terminal) + index.astro rewrite — content-fed hero, teasers reusing ProjectCard, shared `.js`-gated scroll-reveal in BaseLayout (Wave 2)
- [x] 04-03: skills.astro (tag groups) + contact.astro + 404.astro — completes the route set with one-click identity CTAs (Wave 2, parallel with 04-02)
- [x] 04-04: Cross-page automated audit (single-h1, JS budget, identity/link hygiene) + human responsive verification at 599/600/959/960px (Wave 3)

### Phase 5: Polish & Ship-Readiness

**Goal**: The rebuild is verifiably complete and shippable — the served output works under the configured GitHub Pages root (assets, `.nojekyll`, all internal links), placeholder identity is gate-blocked, and repo docs match the modular structure.
**Depends on**: Phase 4
**Requirements**: ROUT-06, DPLY-01, DPLY-02
**Success Criteria** (what must be TRUE):

  1. The built site's served output is verified on the chosen host (or `astro preview` standing in): `_astro/*.css` and asset requests succeed, `.nojekyll` is present in the served root, and pages render fully styled — DPLY-01 (Pitfalls 1 + 2 final verification)
  2. All internal links (nav, footer, 404, project cards, CTAs) resolve on the built site under the configured `site`/`base` when previewed and deployed — ROUT-06
  3. The build gate fails when placeholder identity values remain (`Ada Lovelace`, `hello@example.com`, `yourusername`) and passes only with zero matches — DPLY-02 (Pitfall 9: no placeholder identity shipped live)
  4. AGENTS.md describes the modular Astro repo — no stale single-file claims; verification steps updated to include the drift-check script and the build gate (carried-forward work item from the codebase map)

**Plans**: 2 plans

Plans:
**Wave 1**

- [x] 05-02: Placeholder grep gate wired into the build; AGENTS.md refresh *(Wave 1 — also fixes `yourusername` project repoUrls → github.com/jmaillot/<slug>, creates README.md; identity frontmatter verified already real, "Jérémy Maillot" accented spelling stands)*

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-01: Deploy/serve verification — asset paths, `.nojekyll`, base, full internal-link crawl under preview, final a11y/reduced-motion spot-check; GH Pages Actions workflow if deploying now *(Wave 2, depends on 05-02 — deploy must ship a gated build; includes deploy-target decision: remote is `jmaillot/www` vs root-host config)*

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold & Static Foundation | 3/3 | Complete | 2026-08-21 |
| 2. Design Tokens & Content Layer | 0/3 | Not started | - |
| 3. Shared Layout & Chrome | 0/3 | Not started | - |
| 4. Pages & Sections | 4/4 | Complete   | 2026-08-23 |
| 5. Polish & Ship-Readiness | 1/2 | In Progress|  |

## Coverage

All 32 v1 requirements mapped to exactly one phase:

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1. Scaffold & Static Foundation | (foundation — no direct requirements) | 0 |
| 2. Design Tokens & Content Layer | CONT-01..05, PERF-01, PERF-02 | 7 |
| 3. Shared Layout & Chrome | ROUT-02, ROUT-03, ROUT-04, REACH-03, META-01..03, A11Y-01, A11Y-02, PERF-03 | 10 |
| 4. Pages & Sections | ROUT-01, ROUT-05, PROJ-01..04, REACH-01, REACH-02, META-04, A11Y-03, A11Y-04, PERF-04 | 12 |
| 5. Polish & Ship-Readiness | ROUT-06, DPLY-01, DPLY-02 | 3 |

**Total: 32/32 mapped ✓ — no orphans, no duplicates.**
