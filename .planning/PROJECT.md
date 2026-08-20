# Online Profile Site

## What This Is

A multi-page static profile site for Ada Lovelace (placeholder identity), rebuilt from the single-file `index.html` milestone into a modular Astro site. Content lives in separate Markdown files (profile, projects, skills, contact) and styling is one external CSS file carrying the `DESIGN.md` token system, structured so the design system can be swapped later without touching markup.

## Core Value

A visitor quickly sees who you are and can easily reach you — email and GitHub are never more than one click away. Everything else (projects depth, skills breadth) supports that single takeaway.

## Requirements

### Validated

<!-- Shipped and confirmed valuable (met in milestone 1: single-file index.html). -->

- ✓ Profile landing page with hero/me band, projects band, skills band, and footer CTA — existing `index.html`
- ✓ `DESIGN.md` token system (colors, typography, spacing, rounded, elevation) compiled as CSS custom properties
- ✓ Responsive layout at DESIGN.md breakpoints (mobile <600px, tablet 600–959px, desktop ≥960px)
- ✓ Accessibility baseline: semantic landmarks, skip link, `:focus-visible` outlines, `prefers-reduced-motion` support
- ✓ Mobile full-overlay menu
- ✓ Zero-build static delivery — open the file and it runs

### Active

<!-- Current scope. Building toward these. -->

- [ ] Site is a multi-page site: Home/Profile, Projects, Skills, Contact
- [ ] Profile information lives in its own Markdown content file
- [ ] Projects content lives in its own Markdown content file
- [ ] Skills content lives in its own Markdown content file
- [ ] Contact information (email + GitHub) lives in its own Markdown content file
- [ ] All CSS is extracted out of the HTML into one external stylesheet
- [ ] Build produces static HTML via Astro (no client-side rendering)
- [ ] Project cards include image slots with styled placeholders, swappable for real app screenshots
- [ ] Project cards link to GitHub repositories
- [ ] Placeholder identity (name, email, GitHub URL) is editable from one central source
- [ ] Design tokens are read from a single source so a future `DESIGN.md` swap is a contained change

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- CMS / admin UI — content is edited as Markdown files, by design
- Blog — not requested for this project
- Analytics, contact forms, social feeds — not requested; "how to reach me" is the takeaway
- CSS frameworks (Tailwind etc.) — hand-written CSS per DESIGN.md system
- Client-side rendering / API backend — static HTML output is the target

## Context

- Milestone 1 shipped a single self-contained `index.html` implementing four anchor bands (me, projects, skills, footer). Its semantics, token system, breakpoints, and accessibility patterns are the validated baseline this rebuild preserves.
- The codebase was mapped to `.planning/codebase/` on 2026-08-20: zero dependencies, single entry point, design tokens mirrored from `DESIGN.md` frontmatter into `:root` custom properties (documented in `ARCHITECTURE.md`, `STACK.md`, `CONVENTIONS.md`, `CONCERNS.md`).
- Known issues from the map to carry forward as work item input (not blockers): placeholder content in ~21 locations, render-blocking Google Fonts, sub-AA contrast on 12px `--mute` labels, missing OG/Twitter/favicon/theme-color meta, missing focus trap in the mobile overlay, token drift (button padding 12px spec vs 24px implementation), `AGENTS.md` claims a single-file repo (now stale once modularized).
- The site is a personal hub first; professional hiring/client outcomes are secondary but still served by the core takeaway.
- Visual direction: keep the current DESIGN.md (Vercel-inspired ink/gray palette, mesh gradient at hero scale, Geist-adjacent type) for now; the user may switch to a different DESIGN.md design system later.

## Constraints

- **Tech stack**: Astro static build, no client-side rendering, no backend
- **Content**: Markdown files are the data source for all editable content (no JSON unless content must be dynamic)
- **Styling**: One external CSS file; tokens centralized at top so the design system is swappable
- **Identity**: Placeholder name ("Ada Lovelace"), email (`hello@example.com`), GitHub (`yourusername`) until the user supplies real values
- **Images**: Project images start as styled placeholders; real screenshots replace them later
- **Deployment**: Static host (GitHub Pages / Netlify / Vercel) later; must not require operational complexity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild as multi-page site | User wants profile info, projects, skills, contact as separate as possible | — Pending |
| Content in Markdown files | Editing content should not require touching HTML/JS | — Pending |
| Astro for the build | Content collections natively support MD files; emits fully static HTML with zero JS by default | — Pending |
| Single external CSS file | Clean separation of styling from structure, per user request | — Pending |
| Design tokens kept central & swappable | User may switch DESIGN.md later; swapping tokens must be a contained change | — Pending |
| Placeholder identity + images for now | Personal details and screenshots come later; layout is validated first | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-20 after initialization*