# Milestones

## v1.0 Online Profile Site MVP (Shipped: 2026-08-24)

**Phases completed:** 5 phases, 15 plans, 33 tasks

**Key accomplishments:**

- Pinned Astro 7.2.4 + TypeScript ^6 + Node 22.12 scaffold with static placeholder page and clean astro check/build emitting dist/index.html
- GitHub Pages root host config (site https://jmaillot.github.io, base unset, output static) with Astro 7 built-in self-hosted fonts binding --font-sans/--font-mono via fontProviders.google(), .nojekyll bypass, and preconnect fallback docs
- Green `astro check && astro build` (0 errors/0 warnings, 1m32s build) emitting 1.1K static dist/index.html with zero JS/hydration, dist/.nojekyll present at 0 bytes, no render-blocking font links, and repeatable scripts/verify-foundation.mjs verification (fallback documented for offline font fetch)
- Single external CSS with complete :root mirror (~40 tokens), AA-fixed --mute #767676, documented button divergence, and burger is-open animation — var-only component rules ready for drift-check swap
- Fail-closed DESIGN.md↔CSS token mirror validated via zero-dep Node script with AA allowlist, theme-color #fafafa, and exception advisory — wired into check and build so drift blocks deploy (proven by temp edit)
- 4 strict Zod collections via Astro 7 glob() loaders with 6 placeholder Markdown files — single identity source validated, fail-closed proven (invalid .md blocks build, restore green), zero hardcoded identity in chrome
- Single head source (unique title/description, OG/Twitter, favicon, theme-color #fafafa) + one external global.css + Header/slot/Footer composition with skip-link and semantic landmarks
- Shared header with 4-link active-state nav (aria-current), branding to Home, identity from contact content file — mobile overlay traps focus, closes on Escape, restores focus, syncs aria-expanded, closes at ≥600px, consumes 02-01 is-open animation and global breakpoints
- Footer CTA band (Get in touch + Email me mailto + GitHub) and 4-column footer grid (brand href=/ + sitemap + contact + currently) driven by contact content file via getEntry — zero hardcoded identity in chrome, reuses global.css footer classes, static-only
- Content-fed Home hero (badge/headline/bolded lead/mailto CTA/terminal) plus shared .js-gated scroll-reveal — extended strict profile schema drives terminal and badge
- Route set completed: `/skills/` tag-group cards, `/contact/` one-click email/GitHub with copyable fallback, and the branded flat-band 404 — all pure composition of the content layer and Phase 3 chrome
- Phase 4 gate passed: automated 11-check audit green against all five built pages at `35ad426`, plus user-approved visual/responsive walkthrough at every DESIGN.md breakpoint
- Internal-link crawl proving all 5 built routes resolve every href/src, legacy `index.html` deleted, and a SHA-pinned least-privilege GitHub Pages workflow wired via `withastro/action@v6` — push-to-live awaiting one manual auth step.
- Fail-closed placeholder gate scanning built dist/ HTML for the three DPLY-02 identity strings, wired into `npm run build` after astro build; real jmaillot repoUrls; AGENTS.md rewritten for the modular Astro repo + new lean README.

---

**Delivered:** A five-route personal profile site for Jérémy Maillot — Astro 7 static, Markdown content layer with strict Zod validation, DESIGN.md token discipline enforced by a fail-closed drift gate, placeholder-identity build gate, and CI deploy to GitHub Pages. Live at https://www.jeremymaillot.fr (custom domain via repo `jmaillot/www` + CNAME; host config evolved from the original github.io root plan during Phase 5).

**Milestone audit:** passed — 32/32 requirements, 12/12 integration wiring, 7/7 E2E flows (.planning/milestones/v1.0-MILESTONE-AUDIT.md).

**Known items at close:** 05-HUMAN-UAT resolved 4/4 (acknowledged); deferred v2 backlog tracked in archived REQUIREMENTS.md.
