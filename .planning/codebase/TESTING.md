# Testing Patterns

**Analysis Date:** 2026-08-20

## Test Framework

**Runner:**
- Not applicable — there is no automated test runner. No `package.json`, no `jest.config.*`, no `vitest.config.*`, no test files, no CI configuration anywhere in the repo (`/mnt/c/Projects/homepage` contains only `index.html`, `DESIGN.md`, `AGENTS.md`).

**Assertion Library:**
- Not applicable — no assertion library is installed or configured.

**Run Commands:**
- There are no test commands to run. Per `AGENTS.md`: "There are no commands to run." Nothing to install, build, lint, or execute.

## Test File Organization

**Location:**
- Not applicable — no test files exist and no test directory structure is defined.

**Naming:**
- Not applicable.

**Structure:**
- Not applicable.

## Test Structure

- Not applicable — no suites, no `describe`/`it`, no setup/teardown. There is no codebase test idiom to match yet; if automated testing is ever introduced, the pattern would need to be established from scratch (the only "unit" of behavior today is the vanilla-JS IIFE in `index.html:891-933`).

## Mocking

- Not applicable — nothing to mock. The only external dependencies are Google Fonts stylesheets (`index.html:9-12`) and the DOM APIs used by the inline script (`getElementById`, `classList`, `IntersectionObserver`, `matchMedia`).

## Fixtures and Factories

- Not applicable — no test data exists. The closest analog is the token set in the `DESIGN.md` frontmatter (`colors`, `typography`, `spacing`, `rounded`, `components` — `DESIGN.md:6-389`), which serves as the reference data for manual verification.

## Coverage

**Requirements:**
- Not applicable — no coverage tooling, no coverage targets, no CI enforcement.

## Test Types

**Unit Tests:**
- Not used.

**Integration Tests:**
- Not used.

**E2E Tests:**
- Not used.

## Verification Discipline (the actual testing model)

The repo's only "testing" is **manual verification against the design spec**, defined in `AGENTS.md` and implied by `DESIGN.md`. This is the pattern to follow when checking any change:

### 1. Token reference integrity check
- Re-read the changed file(s) and confirm every `{section.key}` reference in `DESIGN.md` prose (e.g., `{colors.primary}`, `{typography.display-xl}`, `{spacing.md}`, `{rounded.pill}`) has a matching frontmatter key — and that no frontmatter token is orphaned without a prose reference.
- CSS custom properties in `index.html` `:root` must map 1:1 to those tokens: `--ink: #171717` ↔ `colors.primary: "#171717"` (`index.html:20` ↔ `DESIGN.md:7`), `--radius-pill: 100px` ↔ `rounded.pill: 100px` (`index.html:50` ↔ `DESIGN.md:131`), `--space-lg: 24px` ↔ `spacing.lg: 24px` (`index.html:56` ↔ `DESIGN.md:139`).

### 2. Value consistency check
- Confirm hex values and px values referenced in prose match the frontmatter exactly (e.g., the mesh gradient stops in `DESIGN.md:443-445` vs the `--grad-*` pairs in `index.html:35-40`; `--link-deep: #0761d1` vs `colors.link-deep: "#0761d1"`).
- Confirm the CSS implementation matches the token values, including derived aliases (`--grad-develop-s` ↔ `colors.gradient-develop-start`).

### 3. Design-law compliance check
- Verify the change does not violate `## Do's and Don'ts` (`DESIGN.md:718-736`): no sixth accent color, no all-caps headlines, no sans weights > 600, no single heavy drop-shadow, no gradient below hero scale, no mono in body copy.

### 4. Manual browser check (the de-facto E2E)
- Open `index.html` directly in a browser (no server needed — it is fully self-contained; fonts load from Google CDN).
- Verify at the three breakpoints defined in `DESIGN.md` ("Responsive Strategy", `DESIGN.md:510-530`) and mirrored in `index.html:605-622`: mobile < 600px, tablet 600–959px, desktop ≥ 960px.
- Verify the mobile full-overlay menu: burger opens/closes, `Escape` closes, resize ≥ 600px closes (`index.html:904-916`).
- Verify reveal animations appear on scroll and that `prefers-reduced-motion: reduce` disables them (`index.html:601-603`, `index.html:624-628`).
- Spot-check accessibility affordances: skip link, `:focus-visible` outlines, `aria-expanded` toggling, keyboard-only navigation.

## Recommendations for Introducing Automated Tests

If a test framework is ever added, the highest-value targets are:
1. **Token sync** — a script that parses `DESIGN.md` frontmatter (YAML) and asserts every `--*` custom property in `index.html`'s `:root` block has a matching token with an identical value (hex/px), and that every `{section.key}` prose reference resolves.
2. **Design-law lint** — assert the Do's/Don'ts mechanically (font-weight ceilings, uppercase usage, shadow stack structure).
3. **DOM behavior** — the IIFE in `index.html:891-933` is the only logic worth unit-testing (menu open/close state, ARIA sync, reduced-motion guard), which would require extracting it from the single-file page.

---

*Testing analysis: 2026-08-20*
*Update when test patterns change*
