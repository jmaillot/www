# Architecture

**Analysis Date:** 2026-08-20

## Pattern Overview

**Overall:** Single-file static HTML document (zero-build, zero-framework profile landing page) with a spec-driven token system. The entire implementation lives in one self-contained file; a separate Markdown design spec is the normative source of truth for every visual value.

**Key Characteristics:**
- Single self-contained document — HTML, CSS, and JS all inline in `index.html`; no external files except Google Fonts
- Design-token-driven: CSS custom properties in `:root` (`index.html:18-68`) mirror `DESIGN.md` frontmatter keys 1:1
- Spec-first: `DESIGN.md` is the normative design law (tokens + "Do's and Don'ts"); `index.html` is the compiled implementation
- Progressive enhancement: the page is fully rendered with JS disabled; JS only adds the mobile overlay menu and scroll-reveal animations
- Stateless: no server, no API, no database, no build step — open the file in a browser and it runs

## Layers

**Design Token Layer:**
- Purpose: Single source of truth for color, typography, spacing, radius, and elevation values
- Location: `DESIGN.md` frontmatter (lines 1-390) and the mirror `:root` block in `index.html` (lines 18-68)
- Contains: YAML token maps (`colors`, `typography`, `spacing`, `rounded`, `components`) and their compiled CSS custom properties (`--ink`, `--space-md`, `--shadow-3`, ...), each commented with its source key (e.g. `--ink: #171717; /* colors.primary */` at `index.html:20`)
- Depends on: Nothing
- Used by: All CSS below it — every component rule resolves values via `var(--…)`; `AGENTS.md` requires both copies stay in sync

**Component Style Layer:**
- Purpose: All presentational rules for every component on the page
- Location: `index.html` `<style>` block (lines 14-629), after the `:root` tokens
- Contains: Base/reset (lines 70-95), layout scaffolding (lines 97-114), type-scale classes (lines 116-148), buttons (lines 150-204), nav + mobile overlay (lines 206-309), hero + terminal mockup (lines 311-404), section headers (lines 406-410), projects (lines 412-477), skills (lines 479-526), footer (lines 528-599), reveal animation (lines 601-603), responsive media queries (lines 605-628)
- Depends on: Design token layer (`var(--…)` references)
- Used by: The content layer via class attributes

**Content / Structure Layer:**
- Purpose: Semantic page content — the four anchor bands and their components
- Location: `index.html` `<body>` (lines 631-887)
- Contains: skip link (line 632), sticky nav bar (lines 635-658), full-overlay mobile menu (lines 661-673), `<main>` with hero/me (lines 678-706), projects (lines 709-772), skills (lines 775-822) sections, and dark footer/contact band (lines 827-887)
- Depends on: Component style layer
- Used by: Browser parser; JS enhancement layer queries its DOM nodes

**Enhancement Layer (JS):**
- Purpose: Progressive behavioral additions — mobile menu toggling and scroll reveal
- Location: `index.html` inline `<script>` (lines 889-933)
- Contains: Single IIFE (line 891) that adds `.js` to `<html>`, wires `menuToggle`/`menuClose`/`mobileMenu` handlers, Escape-key and ≥600px-resize close behavior, and an `IntersectionObserver`-based `.reveal` animation with a `prefers-reduced-motion` guard
- Depends on: DOM nodes from the content layer
- Used by: Browser event loop only

## Data Flow

**Page Load:**

1. Browser loads `index.html` (the sole entry point)
2. Google Fonts are requested via preconnect + stylesheet links (`index.html:10-12`) — Inter for the geometric sans, JetBrains Mono for the mono face (substitutes per `DESIGN.md` "Note on Font Substitutes", lines 484-487)
3. CSS custom properties are defined in `:root` (`index.html:18-68`) — the token mirror of `DESIGN.md` frontmatter
4. Layout renders: `.container` (max-width 1200px, line 98) centers each band; sections alternate surfaces (`--soft` → `--canvas` → `--soft` → `--ink`) per the polarity-flip depth cue
5. Script IIFE runs (`index.html:891-892`): adds `.js` to `<html>`, which activates the hidden initial state for `.js .reveal` (`index.html:602`)
6. `IntersectionObserver` (`index.html:921-928`, threshold 0.12, `-40px` root margin) observes `.reveal` elements; each gets `.in` when it scrolls 12% into view, triggering the fade-up
7. Fallbacks: if `IntersectionObserver` is missing or `prefers-reduced-motion: reduce` matches, every `.reveal` gets `.in` immediately (`index.html:930-932`); CSS also disables transitions under reduced motion (`index.html:624-628`)

**Mobile Menu Interaction:**

1. User clicks `.nav-burger` (`index.html:654`) — visible only below 600px (`index.html:616-617`)
2. `setOpen(open)` (`index.html:897-902`) toggles `.is-open` on `#mobileMenu`, syncs `aria-expanded`, and adds/removes `body.no-scroll`
3. Close paths: close button (line 907), any overlay link click (lines 908-910), Escape key (lines 911-913), viewport resize to ≥600px (lines 914-916)
4. Hash-link navigation: clicking `#me` / `#projects` / `#skills` / `#contact` anchors scrolls smoothly (`html { scroll-behavior: smooth }`, line 73), offset by `scroll-margin-top: 80px` on `section[id]` (line 95)

**State Management:**
- Stateless — no persistent state, no server round-trips, no storage
- The only runtime "state" is DOM class toggling (`.is-open`, `.no-scroll`, `.reveal.in`), held in the DOM itself and derived from the single IIFE closure

## Key Abstractions

**Design Token:**
- Purpose: Single named value for one design decision (color, type metric, space, radius, elevation)
- Examples: `--ink: #171717` (`index.html:20`) ↔ `colors.primary` (`DESIGN.md:7`); `--space-md: 16px` (`index.html:56`) ↔ `spacing.md` (`DESIGN.md:139`); `--shadow-3` (`index.html:66`) ↔ "Level 3 — Soft Stack" (`DESIGN.md:544`); gradient pairs `--grad-develop-s` … `--grad-ship-e` (`index.html:35-40`) ↔ `colors.gradient-*-start/end` (`DESIGN.md:35-40`)
- Pattern: CSS custom property, frontmatter-keyed via comment; must stay in sync with `DESIGN.md`

**Type Scale Class:**
- Purpose: One class per `typography.*` token so any element can adopt the exact display/body/caption metric
- Examples: `.display-xl` (line 117), `.display-lg` (line 123), `.body-lg` (line 132), `.eyebrow` mono-uppercase label (line 141), `.caption-mono` (line 137)
- Pattern: Utility class mirroring the typography token block

**Component Class (BEM-like):**
- Purpose: Named, reusable UI component with a clear visual contract
- Examples: `.btn--primary` / `.btn--secondary` / `.btn--inverse` (lines 166-190), `.project-card` (line 421), `.skill-card` (line 506), `.nav-link` (line 239), `.footer-col` (line 575)
- Pattern: block name; `-` for child elements (`.nav-inner`, `.card-body`, `.skill-tags`); `--` for modifiers (`.btn--primary-sm`, `.accent--develop`)

**Anchor Section Band:**
- Purpose: Top-level page segment addressed by the nav; each is a `<section>`/`<footer>` with an id anchor
- Examples: `.hero#me` (line 678), `.projects#projects` (line 709), `.skills#skills` (line 775), `.footer#contact` (line 827)
- Pattern: `.section`-level vertical padding + alternating background surface + `section[id]` scroll margin

**Enhancement IIFE:**
- Purpose: Contain all JS in one closure, keep zero globals, add behavior without blocking baseline render
- Example: `index.html:891` — single `(function () { … })()` that owns menu + reveal logic
- Pattern: IIFE + feature detection + DOM-class toggling

## Entry Points

**Document:**
- Location: `index.html` — opened directly in a browser or served statically (no dev server, no build)
- Triggers: Browser navigation to the file/URL
- Responsibilities: Everything — parse HTML content, apply token-driven CSS, load fonts, run the enhancement script

**Script IIFE:**
- Location: `index.html:889-933`
- Triggers: `DOMContentLoaded`-independent execution (script is at end of `<body>`, so nodes exist)
- Responsibilities: Add `.js` class, wire mobile menu, set up scroll-reveal observers

**Anchor Navigation:**
- Location: `.nav-links` (`index.html:642-647`), mobile menu (lines 663-668), footer sitemap (lines 853-861)
- Triggers: Click on `#me` / `#projects` / `#skills` / `#contact`
- Responsibilities: Smooth-scroll to the matching section band

## Error Handling

**Strategy:** Graceful degradation via progressive enhancement — no `try/catch` anywhere; robustness comes from feature detection, CSS fallbacks, and a no-JS baseline

**Patterns:**
- Feature detection: `'IntersectionObserver' in window` gate with an eager fallback (`index.html:920-932`)
- Reduced-motion guard: `matchMedia('(prefers-reduced-motion: reduce)')` checked in JS (line 919) and CSS (lines 624-628)
- CSS capability fallbacks: opaque `rgb(255 255 255 / 88%)` declared before `color-mix()` (lines 212-213); `-webkit-mask-image` alongside `mask-image` (lines 334-335)
- No-JS baseline: without the `.js` class, `.reveal` elements are never hidden (rule scoped `.js .reveal`, line 602); the burger is `display: none` on desktop so desktop nav works without JS
- Fixed DOM assumptions: script queries ids (`menuToggle`, `menuClose`, `mobileMenu`) directly — markup and script must be edited together

## Cross-Cutting Concerns

**Accessibility:**
- Skip-to-content link (`index.html:632`), `aria-expanded`/`aria-controls` on the burger (line 654), `aria-label`s on nav and decorative elements, `:focus-visible` outlines (line 93), footer dark-band focus recolor (line 599), `prefers-reduced-motion` support, 44px touch targets at mobile (line 621), semantic landmarks (`header`/`nav`/`main`/`footer`)

**Responsiveness:**
- Three media queries: tablet 600-959px (line 608), mobile <600px (line 615), reduced-motion (line 624); breakpoints match `DESIGN.md` "Responsive Strategy" (lines 510-536) — project grid 3-up → 2-up → 1-up, nav collapses to burger + full overlay, skills grid stacks

**Token Consistency (the design contract):**
- Every `:root` custom property carries a `/* section.key */` comment tying it to `DESIGN.md` frontmatter; prose `{section.key}` references must resolve to the same keys — `AGENTS.md` "Verification" (step 2) is the check for this
- The mesh gradient appears only at hero scale (`index.html:318-337`) — enforced by spec (`DESIGN.md` Do's/Don'ts, lines 724-736)

**Identity/Personalization:**
- Placeholder personal data is hardcoded: `hello@example.com` (lines 651, 670, 685, 834, 848, 866), `github.com/yourusername` (lines 650, 671, 732, 749, 766, 835, 849, 867), name "Ada Lovelace" (lines 6, 639, 683, 843, 883) — changing identity means editing these literals in `index.html`

---

*Architecture analysis: 2026-08-20*
*Update when major patterns change*
