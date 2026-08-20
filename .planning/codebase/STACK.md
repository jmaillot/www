# Technology Stack

**Analysis Date:** 2026-08-20

## Languages

**Primary:**
- HTML5 - Single-page markup in `index.html` (semantic landmarks, ARIA attributes, skip link, `lang="en"`)
- CSS3 - All styling is inline `<style>` in `index.html` (custom properties design tokens, `clamp()` fluid type, `color-mix()`, `mask-image`, `backdrop-filter`, CSS Grid/Flexbox, media queries at 959px/599px, `prefers-reduced-motion`)
- JavaScript (vanilla, ES5-style IIFE) - Single inline `<script>` block in `index.html` (mobile menu toggle, IntersectionObserver reveal animation, `matchMedia` reduced-motion guard)

**Secondary:**
- Markdown - `DESIGN.md` (design-system prose spec)
- YAML - Frontmatter block at the top of `DESIGN.md` (machine-readable design tokens: `colors`, `typography`, `spacing`, `rounded`, `components`)

## Runtime

**Environment:**
- None (zero build step). The site is three static files: `index.html`, `DESIGN.md`, `AGENTS.md`
- Only runtime requirement is a standards-compliant web browser. CSS features used require modern browsers: `color-mix()` (Chrome 111+, Safari 16.2+, Firefox 113+), `mask-image` (prefixed + unprefixed included), `IntersectionObserver` (with a non-support fallback that shows all content)

**Package Manager:**
- None. No `package.json`, no lockfile, no `node_modules`, no `.nvmrc` or `.python-version`

## Frameworks

**Core:**
- None. No framework — no React/Vue/Svelte, no Tailwind, no Bootstrap. All CSS/JS is hand-written in `index.html`

**Testing:**
- None. No test framework, no test files, no test runner

**Build/Dev:**
- None. No bundler, no transpiler, no linter, no formatter config, no CI. `AGENTS.md` explicitly states "There are no commands to run"

## Key Dependencies

**Critical:**
- None. Zero npm/pip/cargo packages. The only third-party runtime resource is Google Fonts (see INTEGRATIONS.md)

**Infrastructure:**
- Google Fonts CSS2 API - Loads Inter (400/500/600) and JetBrains Mono (400/500) via `<link>` in `index.html:12`, with `preconnect` hints at `index.html:10-11`
- Native browser APIs only - `IntersectionObserver`, `matchMedia`, `classList`, standard DOM events (see inline script, `index.html:889-934`)

## Configuration

**Environment:**
- No environment variables, no `.env` files, no secrets anywhere in the repo
- Design configuration lives in the YAML frontmatter of `DESIGN.md` (`colors`, `typography`, `spacing`, `rounded`, `components` tokens, `version: alpha`)

**Build:**
- No build config files. The design tokens in `DESIGN.md` frontmatter are manually mirrored as CSS custom properties in `:root` at `index.html:18-68` (each property annotated with the token key it mirrors, e.g. `--ink: #171717; /* colors.primary */`) — keeping the two in sync is the repo's only "verification" step per `AGENTS.md`

## Platform Requirements

**Development:**
- Any platform with a text editor and browser. No toolchain required. Repo contains only `index.html`, `DESIGN.md`, `AGENTS.md` (plus `.planning/` and `.git/`)

**Production:**
- Any static file host (GitHub Pages, Netlify, Vercel, S3, nginx, etc.). No server-side code, no API routes. Deployment requires no special configuration
- `DESIGN.md` references planned downstream consumers (`scripts/derive-examples-block.mjs`, `/preview-design`, `/generate-kit`) — these do not exist in this repo and are not part of the current stack

---

*Stack analysis: 2026-08-20*
*Update after major dependency changes*
