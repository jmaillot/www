# Requirements: Online Profile Site

**Defined:** 2026-08-20
**Core Value:** A visitor quickly sees who you are and can easily reach you — email and GitHub are never more than one click away.

> Milestone scope: modular rebuild of the validated single-file profile page (`index.html`) into a multi-page Astro site with Markdown content, closing the meta/a11y/perf gaps the codebase map identified. Not a new product surface.

## v1 Requirements

Requirements for the milestone. Each maps to a roadmap phase.

### ROUT — Structure & Routing

- [x] **ROUT-01**: Site has 4 distinct pages: Home (`/`), Projects (`/projects/`), Skills (`/skills/`), Contact (`/contact/`)
- [ ] **ROUT-02**: Every page renders a shared nav with links to all 4 pages and an active-state indicator for the current page
- [ ] **ROUT-03**: Every page renders a shared footer including the contact CTA band
- [ ] **ROUT-04**: Page and branding links navigate to the Home page
- [x] **ROUT-05**: Site serves a branded 404 page offering navigation back to Home plus email/GitHub links
- [ ] **ROUT-06**: All internal links resolve correctly under the configured `site`/`base` when previewed and built

### CONT — Markdown Content & Identity

- [ ] **CONT-01**: Profile information (name, role, one-line pitch, availability) is editable in a single Markdown content file
- [ ] **CONT-02**: Projects are editable as Markdown files (one per project) with validated frontmatter (title, year, summary, stack, repoUrl, image fields)
- [ ] **CONT-03**: Skills are editable in a Markdown content file as tag groups by category
- [ ] **CONT-04**: Contact details (email, GitHub URL) live in a Markdown content file and form the single identity source rendered in nav, hero, footer, and 404
- [ ] **CONT-05**: Content collections are validated by strict Zod schemas — an invalid content file fails the build (fix the `.md`, never loosen the schema)

### PROJ — Projects

- [x] **PROJ-01**: Projects page renders each project as a card with name, year, summary, and stack tags, all from Markdown content
- [x] **PROJ-02**: Each project card shows an image slot with a styled placeholder at 16:9 aspect ratio (no layout shift); real screenshots can replace placeholders without template changes
- [x] **PROJ-03**: Each project card links to its GitHub repository
- [x] **PROJ-04**: Project cards support an optional live-demo link rendered only when the content provides one

### REACH — Contact & CTA

- [x] **REACH-01**: Email is reachable in one click from every page (nav CTA, hero CTA, footer band, 404)
- [x] **REACH-02**: GitHub is reachable in one click from every page (nav, hero, footer, project cards)
- [ ] **REACH-03**: All contact values render from the single identity source — no hardcoded email/GitHub in markup

### META — SEO & Metadata

- [ ] **META-01**: Every page has a unique `<title>` and meta description
- [ ] **META-02**: Every page emits Open Graph + Twitter card meta (title, description, url, type)
- [ ] **META-03**: Site includes a favicon (`.ico`/`.png`) and `theme-color` meta sourced from a design token (canvas/soft)
- [x] **META-04**: HTML `lang` is set and every page has exactly one `h1`

### A11Y — Accessibility

- [ ] **A11Y-01**: Mobile nav menu traps keyboard focus, closes on Escape, and restores focus to the toggle button
- [ ] **A11Y-02**: Page keeps the validated baseline: skip link, semantic landmarks, `:focus-visible` outlines
- [x] **A11Y-03**: Scroll-reveal effects respect `prefers-reduced-motion` and never hide content when JS is disabled
- [x] **A11Y-04**: Site is responsive at DESIGN.md breakpoints (mobile <600px, tablet 600–959px, desktop ≥960px)

### PERF — Performance & Typography

- [ ] **PERF-01**: All styling ships as one external CSS file whose `:root` block is the only place raw design values live (swappable design system)
- [ ] **PERF-02**: CSS design tokens mirror DESIGN.md — verified by a drift-check script wired into the build (token-diff pass, not copy-paste)
- [ ] **PERF-03**: Fonts do not block first paint (Astro built-in fonts system or equivalent)
- [x] **PERF-04**: Output is fully static — zero client-side rendering; enhancement JS is minimal (nav menu + scroll reveal only)

### DPLY — Ship Readiness

- [ ] **DPLY-01**: Site builds into a static `dist/` without warnings; served output verified (asset paths, `.nojekyll`, base) on the chosen host or preview
- [ ] **DPLY-02**: Build gate fails if placeholder identity values remain (`Ada Lovelace`, `hello@example.com`, `yourusername`)

## v2 Requirements

Deferred to a future milestone. Tracked but not in the current roadmap.

### Deploy-triggered

- **META-05**: Static OG share card (1200×630, DESIGN.md-branded) wired into the layout — needs a real deployed URL
- **META-06**: JSON-LD `Person` schema and `robots.txt` — needs a real deployed URL
- **META-07**: `sitemap.xml` — needs a real `site` URL

### Asset-triggered

- **PROJ-05**: Real project screenshots swapped into the image slots via Astro `<Image />` — user supplies images
- **REACH-04**: Availability badge rendered from profile/contact content — identity values finalized

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Blog | PROJECT.md excludes it; a blog with no cadence reads as abandoned |
| CMS / admin UI | MD files are the editing surface by design; a CMS reintroduces backend + auth |
| Analytics | Contradicts the zero-JS performance differentiator; deploy logs suffice for a personal hub |
| Contact form | Needs backend/JS and adds friction + spam — against the one-click takeaway |
| Social feeds (GitHub activity, tweets) | External API dependency; feed content rarely on-message |
| Skill charts / percentage bars | Anti-pattern fake precision; tag lists validated in M1 |
| SPA client-side routing / JS-heavy effects | Static MPA is the point |
| Dark mode | Conflicts with the swappable-design-system goal; waits for DESIGN.md swap decision |
| Per-project case-study pages | HIGH cost, needs schema expansion; do not pre-build |
| Tutorial/boilerplate projects | Signals the opposite of skill; only real work ships |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ROUT-01 | Phase 4 | Complete |
| ROUT-02 | Phase 3 | Complete |
| ROUT-03 | Phase 3 | Complete |
| ROUT-04 | Phase 3 | Complete |
| ROUT-05 | Phase 4 | Complete |
| ROUT-06 | Phase 5 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 2 | Complete |
| PROJ-01 | Phase 4 | Complete |
| PROJ-02 | Phase 4 | Complete |
| PROJ-03 | Phase 4 | Complete |
| PROJ-04 | Phase 4 | Complete |
| REACH-01 | Phase 4 | Complete |
| REACH-02 | Phase 4 | Complete |
| REACH-03 | Phase 3 | Complete |
| META-01 | Phase 3 | Complete |
| META-02 | Phase 3 | Complete |
| META-03 | Phase 3 | Complete |
| META-04 | Phase 4 | Complete |
| A11Y-01 | Phase 3 | Complete |
| A11Y-02 | Phase 3 | Complete |
| A11Y-03 | Phase 4 | Complete |
| A11Y-04 | Phase 4 | Complete |
| PERF-01 | Phase 2 | Complete |
| PERF-02 | Phase 2 | Complete |
| PERF-03 | Phase 3 | Complete |
| PERF-04 | Phase 4 | Complete |
| DPLY-01 | Phase 5 | Complete |
| DPLY-02 | Phase 5 | Complete |

**Coverage by phase:**
- Phase 1 (foundation): 0 requirements — enables ROUT-06, PERF-03, PERF-04, DPLY-01, DPLY-02
- Phase 2: 7 (CONT-01..05, PERF-01, PERF-02)
- Phase 3: 10 (ROUT-02, ROUT-03, ROUT-04, REACH-03, META-01..03, A11Y-01, A11Y-02, PERF-03)
- Phase 4: 12 (ROUT-01, ROUT-05, PROJ-01..04, REACH-01, REACH-02, META-04, A11Y-03, A11Y-04, PERF-04)
- Phase 5: 3 (ROUT-06, DPLY-01, DPLY-02)

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32 ✓
- Unmapped: 0

---
*Requirements defined: 2026-08-20*
*Last updated: 2026-08-20 after roadmap creation*