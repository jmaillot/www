# Online Profile Site

## What This Is

The personal profile site of Jérémy Maillot, live at https://www.jeremymaillot.fr — a five-route static Astro site (Home, Projects, Skills, Contact, branded 404) with zero client-side rendering. Content lives in Zod-validated Markdown collections; styling is one external CSS file mirroring the `DESIGN.md` token system, enforced by a fail-closed drift gate. Identity (name/email/GitHub) has exactly one source: the contact collection.

## Core Value

A visitor quickly sees who you are and can easily reach you — email and GitHub are never more than one click away. Everything else (projects depth, skills breadth) supports that single takeaway.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

**Milestone 1 (single-file baseline):**
- ✓ Profile landing page with hero/me band, projects band, skills band, and footer CTA
- ✓ `DESIGN.md` token system compiled as CSS custom properties
- ✓ Responsive layout at DESIGN.md breakpoints (mobile <600px, tablet 600–959px, desktop ≥960px)
- ✓ Accessibility baseline: semantic landmarks, skip link, `:focus-visible` outlines, `prefers-reduced-motion` support
- ✓ Mobile full-overlay menu
- ✓ Multi-page site: Home, Projects, Skills, Contact (+ branded 404) — v1.0 Phase 4

**v1.0 (modular Astro rebuild, shipped 2026-08-24):**
- ✓ Profile/projects/skills/contact content as separate Markdown files with strict Zod schemas — v1.0 Phase 2
- ✓ All styling extracted to one external stylesheet; build emits static HTML via Astro 7 (zero JS beyond nav/reveal enhancement) — v1.0 Phases 1–4
- ✓ Single identity source (`src/content/contact/contact.md`); placeholder identity gate-blocked from shipping (`check:placeholders`) — v1.0 Phases 2 & 5
- ✓ Token single-source: `DESIGN.md` ↔ `:root` drift gate fails the build — v1.0 Phase 2
- ✓ Complete head per page: unique title/description, OG/Twitter, favicon, theme-color, self-hosted fonts via Astro Fonts API — v1.0 Phases 3 & audit fix
- ✓ Internal links verified on built output; deployed to GitHub Pages via SHA-pinned Actions on custom domain — v1.0 Phase 5

### Active

<!-- Next milestone scope. Seed candidates from the v1.0 deferred table: -->
- [ ] Real OG share card design + sitemap (META-05..07)
- [ ] Real project screenshots replacing styled placeholders (PROJ-05)
- [ ] Additional reach channels / contact surface (REACH-04)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- CMS / admin UI — content is edited as Markdown files, by design
- Blog — not requested for this project
- Analytics, contact forms, social feeds — not requested; "how to reach me" is the takeaway
- CSS frameworks (Tailwind etc.) — hand-written CSS per DESIGN.md system
- Client-side rendering / API backend — static HTML output is the target

## Context

- **v1.0 shipped 2026-08-24**: ~1.8K LOC (Astro components/TS/scripts/CSS), 5 routes, 48 commits over 5 days (2026-08-20 → 08-24). Milestone audit passed: 32/32 requirements, 12/12 integration wiring, 7/7 E2E flows.
- Stack: Astro 7.2.4 (pinned), TypeScript ^6 strict, Node ≥22.12. Deploy: GitHub Actions (`withastro/action` v6, SHA-pinned, least-privilege) → GitHub Pages at www.jeremymaillot.fr (custom domain; repo `jmaillot/www` + CNAME file).
- Build gates (all fail-closed, chained into `npm run build`): token drift check → astro build → placeholder scan. One-off verifiers: `scripts/check-links.mjs`, `scripts/verify-foundation.mjs`.
- Known debt: og-default.png is a generated placeholder card; local DNS on the dev machine resolves the domain to a LAN address (live checks need `--resolve` or public DNS).
- Visual direction: current DESIGN.md (Vercel-inspired ink/gray palette, mesh gradient at hero scale); user may swap DESIGN.md later — the drift gate makes that a contained change.
- Historical planning for v1.0 archived under `.planning/milestones/v1.0-*`.

## Constraints

- **Tech stack**: Astro static build, no client-side rendering, no backend
- **Content**: Markdown files are the data source; "fix the `.md`, never loosen the schema"
- **Styling**: One external CSS file; tokens centralized so the design system is swappable
- **Identity**: Single source = contact collection; never hardcode name/email/GitHub in markup (build-gate enforced against placeholder strings)
- **Images**: Project images are styled placeholders until real screenshots land
- **Deployment**: GitHub Pages via Actions; must not require operational complexity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild as multi-page site | Separate profile info, projects, skills, contact | ✓ Good — shipped v1.0 |
| Content in Markdown collections | Editing without touching markup | ✓ Good — proven end-to-end |
| Astro 7 pinned for the build | Native MD collections; fully static output | ✓ Good — zero-JS pages |
| Single external CSS + token mirror | Swappable design system | ✓ Good — drift gate proves containment |
| Fail-closed gates chained into build (tokens, placeholders) | Bad content can never ship silently | ✓ Good — negative-tested both gates |
| Custom domain www.jeremymaillot.fr (repo kept named `www` + CNAME) | User preference; avoids base-path rewrite ripple | ✓ Good — live and verified |
| Self-hosted fonts via Astro Fonts API (`<Font>` component required) | No render-blocking third-party font CSS | ✓ Good — after audit fix 9343345 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-24 after v1.0 milestone*
