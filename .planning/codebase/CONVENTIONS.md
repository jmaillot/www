# Coding Conventions

**Analysis Date:** 2026-08-20

## Overview

This is a code-free, single-file static site. All HTML, CSS, and JS lives in `index.html` (936 lines) — no separate source tree, no build step, no lint/format tooling. The styling layer is a direct implementation of the design-token system defined in `DESIGN.md` (YAML frontmatter = machine-readable tokens; prose = spec). Conventions below are derived from `index.html`, `DESIGN.md`, and `AGENTS.md`.

## Design-Token Mirroring (the dominant convention)

The CSS `:root` block in `index.html` is a hand-mirrored copy of the `DESIGN.md` frontmatter tokens. Every custom property carries an inline comment mapping it back to its token key:

```css
:root {
  /* colors */
  --ink: #171717;              /* colors.primary */
  --body: #4d4d4d;             /* colors.body */
  --hairline: #ebebeb;         /* colors.hairline */
  --radius-pill: 100px;        /* rounded.pill */
  --space-lg: 24px;            /* spacing.lg */
}
```

Rules (per `AGENTS.md`):
- Every `{section.key}` reference in prose must resolve to a frontmatter key, and vice versa — prose and frontmatter must stay in sync.
- Hex values / px values referenced in prose must match frontmatter exactly.
- When a value changes in one place, update both the frontmatter token and the matching CSS custom property.
- CSS files are allowed to introduce aliases for token subsets (e.g., `--grad-develop-s` for `colors.gradient-develop-start`), but only from existing tokens — never new palette values.
- The `## Do's and Don'ts` section of `DESIGN.md` is normative law: no new accent colors, no all-caps headlines, no sans weights > 600, no single heavy drop-shadows, no gradient below hero scale, no mono in body copy.

## Naming Patterns

**Files:**
- Flat repo root; three files only: `index.html` (the entire site), `DESIGN.md` (token spec), `AGENTS.md` (agent guidance).
- No test files, no config files, no package manifest. Do not add build/test artifacts without a stated reason.

**CSS custom properties:**
- `--kebab-case` prefixed by semantic group: `--ink`, `--on-ink`, `--radius-sm`, `--space-md`, `--shadow-3`, `--font-sans`, `--grad-develop-s` (`index.html:18-68`).
- Keep the group prefixes stable (`--space-*`, `--radius-*`, `--grad-*`) so token origin is traceable.

**CSS class names:**
- BEM-ish: `block` for components (`.btn`, `.nav`, `.project-card`, `.skill-card`, `.footer`), `block--modifier` for variants (`.btn--primary`, `.btn--secondary`, `.btn--sm`, `.btn--inverse`, `.accent--develop`, `.accent--preview`, `.accent--ship`) — `index.html:151-177`, `index.html:453-455`.
- kebab-case for element/utility classes: `.display-xl`, `.body-lg`, `.caption-mono`, `.eyebrow`, `.link-arrow`, `.card-body`, `.card-head`, `.card-tag`, `.thumb-label`, `.hero-badge-dot` (`index.html:117-138`, `index.html:457-465`).
- State classes use the BEM `is-` convention: `.is-open` on the mobile overlay (`index.html:287`), `.in` for reveal completion (`index.html:603`), plus `body.no-scroll` (`index.html:309`).
- Section-scoped descendants are prefixed with the block name: `.terminal-bar`, `.terminal-dot`, `.terminal-body`, `.nav-link`, `.nav-ctas` (`index.html:384-404`, `index.html:239-250`).
- Class names map to `DESIGN.md` components where one exists (`code-editor-mockup` → `.terminal`; `button-primary` → `.btn--primary`; `hero-band` → `.hero`).

**HTML IDs:**
- camelCase, used only for JS hooks and anchor targets: `menuToggle`, `menuClose`, `mobileMenu`, `main` (`index.html:654`, `index.html:662`, `index.html:661`, `index.html:675`).

**JS functions:**
- camelCase: `setOpen(open)` (`index.html:897`).
- Listener callbacks are anonymous `function () { ... }` expressions, not arrow functions and not named handlers (`index.html:904-916`).

**JS variables:**
- `var` only (ES5 style), camelCase: `toggle`, `close`, `overlay`, `reduce`, `io` (`index.html:893-921`).

**Types / Enums:**
- Not applicable — no TypeScript, no typed languages in this repo.

## Code Style

**Formatting:**
- No formatter configured (no `.prettierrc`, no `package.json`). Hand-formatted.
- HTML/CSS/JS all use 2-space indentation; CSS declarations inside rules indented 2 spaces (`index.html:18-68`).
- CSS rules ordered top-down by page section: tokens → base → layout → type scale → buttons → nav → hero → sections → footer → reveal → responsive (`index.html:14-629`).
- HTML uses double quotes for attributes; JS uses single quotes for strings.
- Semicolons required in CSS declarations and JS statements.
- Blank line between CSS rules; section banner comments (`/* ── base ── */`) separate major blocks.
- Media queries grouped at the end of the stylesheet, ordered desktop-down: `max-width: 959px`, `max-width: 599px`, `prefers-reduced-motion` (`index.html:605-628`).

**Linting:**
- No linter configured. `DESIGN.md` Do's/Don'ts act as the de-facto style law for anything visual; `AGENTS.md` verification rules are the de-facto lint for token consistency.

## Import Organization

**Order:**
- Not applicable — no imports. Third-party resources are limited to two `<link>` elements in `<head>`: Google Fonts preconnects + stylesheet for Inter (400/500/600) and JetBrains Mono (400/500) (`index.html:9-12`), which are the documented open-source substitutes for the spec's Geist / Geist Mono faces (`DESIGN.md` "Note on Font Substitutes").

## Error Handling

**Patterns:**
- Not applicable in the traditional sense — the only JS is progressive enhancement with no failure paths.
- Defensive patterns used instead (`index.html:919-932`):
  - Feature detection before using newer APIs: `if (!reduce && 'IntersectionObserver' in window)`.
  - Graceful degradation: when `IntersectionObserver` is unavailable or reduced-motion is set, all `.reveal` elements get `.in` added immediately (content is never hidden).
  - The reveal CSS is gated behind a `.js` class on `<html>` (`index.html:602`), so content is fully visible if JS fails to load.

## Logging

- Not applicable — no logging of any kind. No `console.*` calls in `index.html`.

## Comments

**When to Comment:**
- CSS: comment every rule whose value is not self-evident, with the *reason* or the *token origin*: `/* 100px marketing pill */` (`index.html:158`), `/* 16 mobile / 24 desktop gutters */` (`index.html:101`), `/* fallback without color-mix() */` (`index.html:212`), `/* grayscale placeholder state per spec */` (`index.html:437`).
- Every CSS custom property in `:root` carries a `/* colors.X */`-style token-map comment (`index.html:19-67`).
- HTML: banner comments delimit page regions with decorative separators: `<!-- ═══ Nav bar ═══ -->`, `<!-- ═══ Projects ═══ -->` (`index.html:634`, `index.html:708`).
- JS: a single leading comment states what the script does and which spec section it implements: `// Mobile full-overlay menu (per DESIGN.md collapsing strategy)` (`index.html:890`).
- Comments reference `DESIGN.md` sections explicitly (e.g., "per DESIGN.md collapsing strategy", "Breakpoints per DESIGN.md").

**JSDoc/TSDoc:**
- Not used.

**TODO Comments:**
- No `TODO`/`FIXME`/`HACK` markers exist. The only analogous marker is `TO_FILL` in `DESIGN.md:329,685`, which flags missing primitives in the illustrative `ex-*` components — per `AGENTS.md` these are intentionally unresolved (meant for a judgment pass), not broken references.

## Function Design

**Size:**
- The script is a single IIFE with one helper (`setOpen`) plus four inline listeners (`index.html:891-933`). Keep new behavior as small named functions inside the IIFE.

**Parameters:**
- Single boolean parameter for the state helper: `function setOpen(open)` (`index.html:897`).

**Return Values:**
- Helpers return nothing (`setOpen` mutates DOM/state directly). Event listeners are side-effect only.

## Module Design

**Exports:**
- Not applicable — no modules. All JS is wrapped in an immediately-invoked function expression to avoid leaking globals (`index.html:891`): `(function () { ... })();`. Any new script behavior must stay inside this IIFE.

**Global state:**
- Avoided. The only shared state is the `.js` class on `document.documentElement` and `is-open` / `no-scroll` class toggles on DOM nodes — the DOM is the state store.

## Accessibility Patterns (required, not optional)

The page treats these as conventions, not features:
- Skip link as first element in `<body>`: `<a class="skip-link" href="#main">` (`index.html:632`).
- `:focus-visible` outline on all focusable elements, `--link-deep` on light surfaces and `--cyan` inside the dark footer band (`index.html:93`, `index.html:599`).
- Decorative elements marked `aria-hidden="true"` (mesh gradient, dots, arrows, accents — `index.html:679`, `index.html:691-693`, `index.html:732`).
- Interactive state surfaced via ARIA: `aria-expanded` + `aria-controls` on the burger (`index.html:654`), toggled in sync with `.is-open` in `setOpen` (`index.html:898-900`).
- Visual mockups given semantic labels: `role="img" aria-label="Terminal mockup"` (`index.html:689`).
- All `<nav>` elements carry `aria-label` (`Primary`, `Mobile`, `Sitemap` — `index.html:642,663,853`).
- Keyboard support: `Escape` closes the mobile overlay (`index.html:911-913`).
- `prefers-reduced-motion` handling: reveal animation disabled, `scroll-behavior` reset, all transitions/animations forced to ~0 (`index.html:624-628`).
- Every `target="_blank"` link includes `rel="noopener"` (`index.html:650-651`).
- Touch targets: mobile CTAs stretch full-width to the 44px touch floor (`index.html:621`).

## "Do This" Summary for New Code

- Add CSS inside the existing `<style>` block in `index.html`, grouped under a matching `/* ── section ── */` banner.
- Add new colors/spacing/type ONLY as custom properties in `:root`, mapped to a `DESIGN.md` frontmatter token with a comment — and add/update the token in `DESIGN.md` frontmatter + prose in the same change.
- Reuse the existing class vocabulary (`.btn--primary`, `.display-lg`, `.eyebrow`, `.container`) instead of inventing parallel utilities.
- Keep any new JS inside the IIFE at `index.html:891`, `var` + function expressions, no globals, feature-detected with graceful degradation.
- Preserve the Do's/Don'ts law: weights ≤ 600 sans, sentence-case, stacked shadows, hero-scale gradient only, mono for technical labels only.

---

*Convention analysis: 2026-08-20*
*Update when patterns change*
