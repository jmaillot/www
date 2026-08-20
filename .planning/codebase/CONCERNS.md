# Codebase Concerns

**Analysis Date:** 2026-08-20

## Tech Debt

**Placeholder identity/contact content not yet personalized:**
- Issue: The page ships as a template with placeholder identity — name "Ada Lovelace", `hello@example.com`, and `github.com/yourusername` — repeated across 21 locations in `index.html`: `<title>` (line 6), brand mark/name (lines 637-639, 843-844), all nav/hero/footer CTAs (`mailto:` and GitHub links at lines 650-651, 670-671, 685, 732, 749, 766, 834-835, 848-849, 866-867), hero lead copy (line 683), terminal mockup (line 698), and copyright line (line 883)
- Why: Template scaffolding was generated before the owner's real identity/links were available
- Impact: The site is unshippable as-is. Every external "View on GitHub" link 404s (`github.com/yourusername`), every `mailto:` goes to an address nobody monitors, and the fictional name reads as a fake page to visitors
- Fix approach: Do a single find-replace pass with the real name/email/GitHub handle, then grep `Ada Lovelace|hello@example|yourusername` to confirm zero matches remain. Coordinate with a decision on the terminal mockup's `ada-lovelace` user string (line 698) and the `A` brand-mark initial (line 638, 843)

**Time-sensitive copy that will rot:**
- Issue: Hard-coded dates and availability claims in `index.html`: "Available for work · June 2026" (line 681), "Free from June" (line 876), "© 2026" (line 883), timezone "Europe · UTC+2" (line 874), and project year tags 2024/2025/2026 (lines 726, 742, 760)
- Why: Static markup has no templating layer to derive these from a single source
- Impact: Content goes stale within weeks; the hero badge already implies availability began June 2026 (in the past relative to today). A returning visitor sees an abandoned page
- Fix approach: Replace availability/timestamps with evergreen phrasing or a documented "last updated" convention; keep the copyright year in a single place (footer base only) so it can be updated once

**Manual token mirror between `DESIGN.md` and `index.html`:**
- Issue: The CSS custom properties in `index.html` `:root` (lines 18-68) are a hand-maintained mirror of the `DESIGN.md` frontmatter tokens, explicitly annotated "mirrored from DESIGN.md frontmatter" (line 16). Nothing enforces sync — `AGENTS.md` lines 15-17 define verification as manual re-reading
- Why: No build step exists (single-file static page), so tokens are duplicated instead of imported
- Impact: Silent drift already exists. Examples: `DESIGN.md` `button-primary` padding is `0px {spacing.sm}` (12px) but `.btn` in `index.html` uses `padding: 0 var(--space-lg)` (24px, line 158); `DESIGN.md` line 486 recommends `font-feature-settings: "ss01", "ss02"` for the Inter substitute but no such rule exists in `index.html`; `DESIGN.md` defines ~40 color tokens but `index.html` mirrors ~28, so a future DESIGN.md edit to an unmirrored token (e.g. `error`, `warning`) silently never reaches the page
- Fix approach: Add a lightweight check script (or a manual checklist in `AGENTS.md`) that asserts every `--*` variable in `index.html` matches its `DESIGN.md` frontmatter value, plus a reverse check that referenced tokens exist. At minimum, update `AGENTS.md`'s verification section to cover `index.html`

**`AGENTS.md` is stale relative to the repo:**
- Issue: `AGENTS.md` line 5 says "A single-file, code-free design-spec repository. The only file is `DESIGN.md`... There is no code, build, test, lint, package manifest, or git history." — but `index.html` (935 lines of inline CSS/JS) exists, and a `.git` directory is present (zero commits so far)
- Why: `AGENTS.md` was written for the design-spec-only state and not updated when the implementation page was added
- Impact: Any agent or human onboarding follows guidance that describes a repo with a single file, so `index.html` work (including this map's own concerns, and any future personalization pass) is invisible to the documented workflow
- Fix approach: Rewrite `AGENTS.md` to describe the two-file state (spec + implementation), add `index.html` token-mirroring instructions alongside the DESIGN.md frontmatter rules, and record the "no code/build/test" caveat as "no toolchain" rather than "no code"

**Unstyled `.nav-burger.is-open` state:**
- Issue: The menu JS toggles `is-open` on the burger button (`index.html` line 900), and the burger spans declare transitions (line 268), but no CSS rule for `.nav-burger.is-open` exists — the three-line icon never morphs into a close "×"
- Why: The close affordance was implemented as a separate overlay `×` button (line 662), so the burger icon state was left incomplete
- Impact: Cosmetic inconsistency — the burger looks static while the overlay opens; if the overlay `×` is missed, there's no visual cue from the button. Dead class (`is-open` on `#menuToggle`) with no consumer
- Fix approach: Either add `.nav-burger.is-open span` transform rules (rotate top/bottom bars, fade middle) or remove the `is-open` toggle from `setOpen()` in `index.html` line 897-902

**Inline style attribute bypasses the token system:**
- Issue: `index.html` line 844 sets `style="color: var(--on-ink)"` on the footer brand name — the only inline style in the file
- Why: The `.brand-name` inside the dark footer would otherwise inherit the wrong color from the footer's link styling
- Impact: A one-off exception in an otherwise token-pure stylesheet; a maintainer changing footer link colors won't catch this element, and it contradicts the "all tokens in `:root`" convention
- Fix approach: Add a `.footer-brand .brand-name { color: var(--on-ink); }` rule in the CSS (near `.footer-brand` at line 564) and delete the inline attribute

## Known Bugs

**Keyboard focus escapes the open mobile overlay:**
- Symptoms: With the mobile menu open (≤599px), pressing Tab moves focus to links and buttons *behind* the overlay — the close button and menu links are reachable only by tabbing through hidden page content first; focus is never moved into the overlay on open and never restored to the burger on close
- Trigger: Open the burger menu at mobile width, then press Tab
- Workaround: Mouse users can click the overlay `×`; keyboard users eventually reach the menu items after tabbing through background content
- Root cause: `setOpen()` in `index.html` (lines 897-902) manages classes/`aria-expanded`/scroll lock but does not focus the overlay, trap focus, or restore focus
- Fix: In `setOpen(true)`, move focus to `#menuClose` (or first menu link); add a keydown Tab handler to trap focus within `#mobileMenu`; on close, restore focus to `#menuToggle`

**Burger icon shows no open state:**
- Symptoms: The three-line burger icon never changes while the full-screen overlay is open
- Trigger: Any mobile-width view (≤599px), open the menu
- Workaround: The overlay itself is visible, so users infer the state from the screen covering the page
- Root cause: `is-open` class toggled in JS (`index.html` line 900) with no matching CSS — see Tech Debt entry above
- Fix: Add `.nav-burger.is-open` span-transform rules, or drop the class toggle

**`github.com/yourusername` placeholder links 404:**
- Symptoms: All six "View on GitHub" / "GitHub" links (lines 650, 671, 732, 749, 766, 835, 849, 867) resolve to a nonexistent user page; the hero/footer `mailto:hello@example.com` CTAs (lines 651, 670, 685, 834) send mail to an unmonitored reserved-domain address
- Trigger: Clicking any GitHub CTA
- Workaround: None — the copy is fictional
- Root cause: Placeholder identity never replaced (see Tech Debt)
- Fix: Single personalization pass (find-replace + grep verification)

## Security Considerations

**Third-party Google Fonts dependency:**
- Risk: Every page view sends the visitor's IP (and the `Referer` header) to `fonts.googleapis.com`/`fonts.gstatic.com` — a privacy disclosure to a third party with no user consent UI, and a supply-chain surface: a compromised font CSS response could inject arbitrary stylesheet rules (e.g., exfiltrating link clicks). Regionally, the font CDN may be blocked or slow
- Current mitigation: `display=swap` (line 12) degrades to system fonts; `--font-sans`/`--font-mono` stacks (lines 43-44) carry `system-ui`/`ui-monospace` fallbacks; two `preconnect` hints (lines 10-11) reduce latency
- Recommendations: Self-host the two font families (Inter 400/500/600, JetBrains Mono 400/500) under `/fonts/` to remove the third-party request entirely, or accept system-font rendering. If keeping the CDN, a `Referrer-Policy` header/meta reduces referrer leakage

**No Content-Security-Policy:**
- Risk: No CSP meta tag exists in `index.html` `<head>` (only charset/viewport/title/description/font links, lines 3-12). If the page is deployed alongside any injected content or a CMS, there's no defense-in-depth against inline-script/style abuse
- Current mitigation: The hazard is minimal today — no forms, no cookies, no user input, and the only scripts/styles are the page's own inline ones
- Recommendations: If deploying to a host that supports headers, add `Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'`. Not blocking for a static page

**Placeholder identity could be impersonated:**
- Risk: If the placeholder `github.com/yourusername` URL is ever registered by a third party, visitors clicking "View on GitHub" are taken to a stranger's profile; fictional name/copy misrepresents the page's owner
- Current mitigation: None
- Recommendations: Personalize before deploying (see Tech Debt); until then, consider removing external CTA links or pointing them at `#`

## Performance Bottlenecks

**Hero mesh gradient blur:**
- Problem: `.mesh` (lines 320-337) applies `filter: blur(28px) saturate(1.12)` to a layer spanning `min(680px, 75vh)` of the hero with six stacked radial-gradients — a large, continuously blurred paint surface in the first viewport
- Measurement: No profiling data available; severity depends on device (blur radius > 20px on a full-width layer forces nonzero GPU compositing cost on low-end mobile; scroll jank possible where the layer repaints)
- Cause: The decorative gradient treatment is inherently heavy; `filter` on a large element is costlier than the same visual via pre-blurred gradient stops or a soft SVG `<feGaussianBlur>` rendered once
- Improvement path: Reduce blur radius if visually acceptable, or replace the CSS blur with a pre-blurred inline SVG data-URI (cached, no per-frame filter cost). At minimum, confirm no repaint on scroll (the layer is `position: absolute` with `pointer-events: none`, which already helps)

**Render-blocking font stylesheet:**
- Problem: The Google Fonts `<link>` (line 12) is a render-blocking stylesheet in `<head>`; text is invisible until the CSS loads (though `display=swap` mitigates by swapping in fallbacks)
- Measurement: Adds 1-2 extra round trips and ~150-300 KB of woff2 across Inter (3 weights) + JetBrains Mono (2 weights) on first visit
- Cause: Standard Google Fonts embedding pattern
- Improvement path: Self-hosting (above) with `font-display: swap` and `preload` on the two most-used weights; or subset to the exact weights used (`400;500;600` for Inter is already requested)

**`backdrop-filter` on sticky nav:**
- Problem: `.nav` (lines 207-215) keeps `backdrop-filter: blur(8px)` active while sticky — a continuous compositing cost on a permanently visible band during scroll
- Measurement: Minor on modern devices; the band is only 64px tall
- Cause: Standard frosted-glass pattern
- Improvement path: Acceptable as-is; if low-end mobile jank appears, gate the blur behind a `@media (min-width: 600px)` or a reduced-motion/`prefers-reduced-data` query, falling back to the flat `rgb(255 255 255 / 88%)` background (line 212) that already exists

## Fragile Areas

**Token mirror sync (DESIGN.md frontmatter ↔ index.html `:root`):**
- Why fragile: Every token lives in two places (`DESIGN.md` lines 6-42 and `index.html` lines 18-68) with only a code comment (line 16) and a manual re-read process (`AGENTS.md` lines 15-17) holding them together. Any unilateral edit to either file silently desyncs the other
- Common failures: Changing a hex value in `DESIGN.md` prose without touching frontmatter or `index.html`; adding a token to frontmatter without a CSS variable; CSS var renamed without the comment updated
- Safe modification: When editing either file, always edit both and grep the counterpart for the old value; run the manual verification list in `AGENTS.md` before committing
- Test coverage: None — no tooling checks cross-file token equality

**`color-mix()` fallback pair:**
- Why fragile: `index.html` lines 212-213 declare the nav background twice — `rgb(255 255 255 / 88%)` as fallback, then `color-mix(in srgb, var(--canvas) 88%, transparent)` on the next line. Correct cascade pattern (older browsers ignore the unknown `color-mix` declaration), but the two values must stay visually equivalent by hand. Browsers without `color-mix()` support (< Chrome 111, Safari < 16.2) get the hard-coded white, which will diverge if `--canvas` is ever changed from `#ffffff`
- Common failures: Someone "cleans up" the duplicate declaration and drops support for older browsers; or someone edits `--canvas` and forgets the literal fallback
- Safe modification: Keep the fallback line immediately above the `color-mix()` line with its explanatory comment; if `--canvas` stops being white, re-derive the fallback
- Test coverage: None

**Breakpoint magic numbers duplicated across CSS and JS:**
- Why fragile: The 600px/960px design-system breakpoints (`DESIGN.md` lines 510-520) appear as bare values in three places: CSS `@media (max-width: 959px)` (line 608), CSS `@media (max-width: 599px)` (line 615), and JS `matchMedia('(min-width: 600px)')` (line 915) with an off-by-one relationship (JS closes the menu at ≥600px while CSS hides the burger at ≤599px — currently consistent, but any single-value edit breaks the pairing)
- Common failures: Changing a CSS breakpoint without updating the JS; the overlay then stays open / burger remains hidden at mismatched widths
- Safe modification: When touching responsive rules, update the JS `matchMedia` string in the same commit and re-test at exactly 599/600/959/960px
- Test coverage: None

**Mobile menu state machine:**
- Why fragile: The open/close logic in `index.html` (lines 891-916) touches six complementary touchpoints — burger click, overlay `×` click, menu link click, Escape key, resize ≥600px, and `body.no-scroll` — plus the `aria-expanded` attribute. Any one handler removed breaks the rest (e.g., removing the resize handler strands the overlay open on rotation)
- Common failures: Overlay left open after rotate/resize; scroll lock not released; `aria-expanded` out of sync
- Safe modification: Keep all six handlers inside the single IIFE and route them through `setOpen()` (line 897) so state changes stay centralized; add the focus-trap fix (see Known Bugs) in the same area
- Test coverage: None

## Scaling Limits

**Single-file structure:**
- Current capacity: One 935-line file (`index.html`) holding all markup, 600+ lines of CSS, and the inline JS — adequate for this one-page scope
- Limit: Adding sections (blog, work history, case studies) grows the inline `<style>` block past readable size; there is no build step, no CSS splitting, and no asset pipeline to absorb growth
- Symptoms at limit: Style conflicts from CSS-ordering mistakes, harder diffs, and an unmaintainable single blob
- Scaling path: Stay single-file while the page stays one-screen-worth of content; if content grows, split CSS into `styles.css` + tokens and move JS to a separate file — no framework needed, just file separation. Introduce the token-mirror check script at the same time

## Dependencies at Risk

**Google Fonts CSS API:**
- Risk: External third-party service; a Google Fonts outage (or regional blocking, e.g. mainland China, privacy blockers) silently drops the brand typography. The font CSS API also returns different responses by UA, so SRI hashing is impractical
- Impact: Visual degradation to system font stacks (graceful — `--font-sans`/`--font-mono` fallbacks at lines 43-44 cover it), plus the privacy disclosure noted under Security
- Migration plan: Self-host Inter + JetBrains Mono woff2 files (matching `DESIGN.md` lines 484-487 substitute recommendation) with `font-display: swap`; this removes the dependency entirely and is the strongest option for a portfolio page

**Inter weight 600 as display ceiling:**
- Risk: `DESIGN.md` (lines 482, 734) caps the geometric sans at weight 600, and `index.html` loads Inter only at 400/500/600 (line 12) — a deliberate constraint, but it means any future hero copy needing 700 (e.g., for accessibility at small sizes) conflicts with the spec rather than the font
- Impact: None today; worth knowing before requesting heavier weights
- Migration plan: Respect the 600 ceiling per the Do's/Don'ts (`DESIGN.md` line 734); increase contrast via size/letter-spacing instead

## Missing Critical Features

**No social sharing / rich preview meta:**
- Problem: `<head>` (lines 3-12) contains only charset, viewport, title, and description. No Open Graph (`og:*`) or Twitter Card tags, no canonical, no `theme-color` — verified zero matches via grep. Links shared to Slack/X/LinkedIn render as bare URLs or blank cards
- Current workaround: None; sharing relies on the platform's URL-preview fallback
- Blocks: Presentable link sharing, branded mobile browser chrome (no `theme-color`), favicon presence — browsers also 404 on `/favicon.ico`
- Implementation complexity: Low — a 10-line `<head>` addition (og:title/og:description/og:type=profile/og:image, twitter:card=summary, favicon link, theme-color) in `index.html`

**No structured data:**
- Problem: No `Person` JSON-LD — search engines can't associate the page with the owner's identity/links
- Current workaround: None
- Blocks: Rich-result eligibility and disambiguation for the personal brand
- Implementation complexity: Low — one `<script type="application/ld+json">` block

**No automated verification:**
- Problem: `AGENTS.md` (lines 15-17) defines verification as manual re-reading — "There are no commands to run." Nothing checks token sync, placeholder leakage (`hello@example|yourusername|Ada Lovelace`), or contrast
- Current workaround: Human review
- Blocks: Confidence that token drift, placeholder residue, or a11y regressions are caught before deploy
- Implementation complexity: Low — a ~20-line bash/node script (grep token pairs, grep placeholders) run pre-deploy

## Test Coverage Gaps

**Entire page — no automated tests:**
- What's not tested: Nothing is tested — no unit, integration, or E2E suite exists anywhere in the repo (verified: repo contains only `AGENTS.md`, `DESIGN.md`, `index.html`; no package manifest, no test files). This includes the mobile menu state machine, the reveal-on-scroll behavior, responsive layout at all breakpoints, and the reduced-motion path
- Risk: Any edit to the menu JS or media queries can break mobile navigation or animations un-noticed; the personalization pass (Tech Debt) could miss a placeholder and ship a broken link
- Priority: Medium
- Difficulty to test: Low-to-medium — the page is dependency-free, so a small Playwright or even a scripted DOM check could cover: menu open/close/Escape/resize, `.js .reveal` fallback, placeholder-free grep, and token-mirror equality

**WCAG contrast — never validated:**
- What's not tested: Contrast ratios of the muted-label colors. Notable failure candidates in `index.html`: `--mute: #888888` at 12px on light surfaces — `.eyebrow` (line 147, on `--soft` `#fafafa`), `.card-tag` (line 459, on white), `.thumb-label` (line 446, on `#f5f5f5`), `.skill-now` (line 526, on `#fafafa`) — measured at ~3.3-3.55:1, below the 4.5:1 WCAG AA threshold for normal text. `--cyan: #50e3c2` on near-white (`index.html` line 499, `.mono-note .dot`) measures ~1.4:1 but is a decorative glyph. The same `--mute` on the dark footer (`#888888` on `#171717`, line 595) measures ~5.0:1 and passes
- Risk: The 12px muted labels (eyebrows, tags, thumb labels) fail AA for low-vision users; an automated audit (axe/Lighthouse) would flag them on first run
- Priority: High (a11y is a stated brand value — "accessible" appears in the hero copy, line 682)
- Difficulty to test: Low — run Lighthouse/axe once; then either darken `--mute` to ≥ `#767676` (~4.6:1 on white) or scope it to non-text/decorative uses only

---

*Concerns audit: 2026-08-20*
*Update as issues are fixed or new ones discovered*