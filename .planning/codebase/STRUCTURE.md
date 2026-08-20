# Codebase Structure

**Analysis Date:** 2026-08-20

## Directory Layout

```
homepage/
├── .git/            # Git repository (fresh — no commits yet; all files untracked)
├── .planning/       # GSD planning artifacts
│   └── codebase/    # Codebase map documents (ARCHITECTURE.md, STRUCTURE.md, ...)
├── AGENTS.md        # Agent guidance — repo scope, DESIGN.md sync rules, verification
├── DESIGN.md        # Design system spec — YAML token frontmatter + prose design law
└── index.html       # The entire implementation — HTML + CSS + JS in one file
```

## Directory Purposes

**.planning/**
- Purpose: GSD planning artifacts — roadmaps, plans, reviews, and this codebase map
- Contains: `codebase/` subdirectory with per-focus analysis documents (`ARCHITECTURE.md`, `STRUCTURE.md`); other documents created as planning runs
- Key files: `codebase/ARCHITECTURE.md`, `codebase/STRUCTURE.md`
- Subdirectories: `codebase/` (this map)

**Root level:**
- Purpose: Everything else lives at the root — there is no `src/`, no `assets/`, no `config/`, no `scripts/`
- Contains: exactly three files — `AGENTS.md`, `DESIGN.md`, `index.html`
- Key files: all three (see below)

## Key File Locations

**Entry Points:**
- `index.html` — the sole entry point. Open in a browser (or serve statically); there is no build, dev server, or launcher

**Configuration:**
- Not applicable — no `package.json`, no build config, no linter, no CI, no env files. The only "configuration" is the design-token pair: `DESIGN.md` frontmatter (source) and the `:root` block in `index.html` (compiled mirror)

**Core Logic:**
- `index.html:18-68` — `:root` design-token CSS custom properties (colors, gradients, fonts, radii, spacing, elevation)
- `index.html:70-628` — all component CSS (base, layout, type scale, buttons, nav, hero, projects, skills, footer, responsive)
- `index.html:632-887` — page content: skip link, nav bar, mobile overlay, `<main>` (hero/me + projects + skills), footer/contact
- `index.html:889-933` — JS behaviors: `.js` class, mobile menu wiring, IntersectionObserver reveals

**Design Spec:**
- `DESIGN.md:1-390` — YAML frontmatter: `version`, `colors`, `typography`, `rounded`, `spacing`, `components` (incl. illustrative `ex-*` entries)
- `DESIGN.md:393-736` — prose: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts (normative design law)

**Documentation:**
- `AGENTS.md` — repo scope statement, DESIGN.md ↔ code sync rules, and verification procedure (the only "checking" workflow)

## Naming Conventions

**Files:**
- `UPPERCASE.md` for spec/guidance documents: `AGENTS.md`, `DESIGN.md`
- Lowercase conventional name for the implementation entry point: `index.html`

**CSS custom properties:**
- kebab-case with semantic prefixes: `--ink`, `--space-md`, `--radius-pill`, `--shadow-3`, `--grad-develop-s`, `--font-sans` (`index.html:18-68`)

**CSS classes (BEM-like):**
- Block: `.btn`, `.nav`, `.hero`, `.footer`, `.stack`, `.eyebrow`
- Child element with single hyphen: `.nav-inner`, `.project-card`, `.card-body`, `.skill-tags`, `.footer-col`, `.terminal-body`
- Modifier with double hyphen: `.btn--primary`, `.btn--secondary-sm`, `.btn--inverse`, `.accent--develop`, `.accent--preview`, `.accent--ship`
- State: `.is-open`, `.in`, `.js`-scoped rules (`.js .reveal`)

**HTML ids:**
- camelCase: `menuToggle`, `menuClose`, `mobileMenu`, `main`
- Section anchors are lowercase ids matching nav labels: `#me`, `#projects`, `#skills`, `#contact`

**JS:**
- camelCase for functions/variables: `setOpen`, `menuToggle`, `io`, `reduce`
- One IIFE (`(function () { … })()` at `index.html:891`) — no globals, no modules

## Where to Add New Code

**New Page Section (e.g., "Experience"):**
- Markup: new `<section class="section …" id="…">` inside `<main>` (`index.html:675-824`), following the band pattern: `.section` + `.container`, `.section-head` (eyebrow `0X · Label`, `display-lg` h2, `body-lg` sub), then the section's grid; alternate background surfaces (`--canvas` after `--soft`, dark `--ink` band only at footer)
- Styles: matching CSS block appended to the corresponding `<style>` subsection (e.g. projects at lines 412-477), consuming tokens via `var(--…)`
- Nav: add `<a class="nav-link" href="#…">` to `.nav-links` (`index.html:642-647`), the mobile menu (`index.html:663-668`), and the footer sitemap (`index.html:853-861`)

**New Token Value:**
- Source of truth: add/update the key in `DESIGN.md` frontmatter (`colors` lines 6-42, `typography` 44-121, `rounded` 123-132, `spacing` 134-146, `components` 148-388)
- Mirror: add the CSS custom property in `:root` (`index.html:18-68`) with a `/* section.key */` comment (e.g. `--cyan: #50e3c2; /* colors.cyan */`)
- Sync rule: any `{section.key}` prose reference in `DESIGN.md` must resolve to a frontmatter key, and any prose hex/px value must match frontmatter (`AGENTS.md` verification)

**New Component Class:**
- CSS: append to the relevant `<style>` subsection, always composed from token variables (`var(--space-md)`, `var(--shadow-3)`, `var(--radius-md)`)
- Markup: use the class in `index.html` body; follow BEM naming (block, `-child`, `--modifier`)

**New JS Behavior:**
- Add inside the existing `<script>` IIFE (`index.html:889-933`); keep the progressive-enhancement pattern — feature-detect (`'IntersectionObserver' in window`), guard for `prefers-reduced-motion`, toggle classes rather than inline styles, and reference ids that exist in the markup

**New Doc:**
- Root level with `UPPERCASE.md` naming (`AGENTS.md`, `DESIGN.md` precedent)

## Special Directories

**.planning/**
- Purpose: GSD planning artifacts (this codebase map lives in `codebase/`)
- Generated: Yes — created/maintained by GSD commands (`/gsd-map-codebase`, planning/execution flows)
- Committed: Yes (intended to be tracked)

**Pseudo-directory: `DESIGN.md` frontmatter ↔ `index.html` `:root`**
- These two blocks form one logical "configuration store" split across two files. `DESIGN.md:1-390` is the machine-readable source; `index.html:18-68` is the compiled mirror with keyed comments. They must stay in sync — `AGENTS.md` "Verification" treats a mismatch as broken work.

---

*Structure analysis: 2026-08-20*
*Update when directory structure changes*
