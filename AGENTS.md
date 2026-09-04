# AGENTS.md

## What this repo is

A modular, multi-page personal profile site for Jérémy Maillot with five routes: `/`, `/projects/`, `/skills/`, `/contact/`, and a branded 404. Built with Astro static output — content lives in Markdown collections, styling comes from design tokens, and there is zero client-side rendering (enhancement JS is limited to the mobile nav menu and scroll reveal).

## Stack

- **Astro `7.2.4`** (pinned exactly in `package.json`)
- **TypeScript `^6`, strict mode**
- **Node ≥22.12** (see `.nvmrc`), **npm ≥10.9.8**
- Deploy: GitHub Pages via GitHub Actions

## Content layer rules

> **Fix the `.md`, never loosen the schema.**

Content lives in `src/content/{profile,projects,skills,contact}/*.md`, validated by strict Zod schemas in `src/content.config.ts`. An invalid content file fails the build — do not weaken a schema to make bad content pass; fix the content.

Identity (name / email / GitHub) has exactly one source: the contact collection entry (`src/content/contact/contact.md`). Never hardcode identity values in markup or components — everything reads from the collection via `getEntry`.

## Token discipline

`DESIGN.md` YAML frontmatter is the token source of truth. `src/styles/global.css`'s `:root` block mirrors it and is the only place raw values live in CSS. When you change a value, change it in both places (or better: change DESIGN.md and mirror it). `npm run check:tokens` fails the build on drift between the two.

## Placeholder gate

`npm run check:placeholders` scans the built `dist/**/*.html` post-build for exactly three placeholder-identity strings:

- `Ada Lovelace`
- `hello@example.com`
- `yourusername`

Any hit fails the build (fail-closed, exit non-zero). Fix the source (fix the `.md`) — never edit `dist/` output. The gate runs after `astro build` inside `npm run build`, locally and in CI.

## Commands

```bash
npm install              # once
npm run build            # token gate → astro build → placeholder gate (both fail-closed)
npm run check            # astro check + token drift check
npm run check:tokens     # DESIGN.md ↔ :root drift gate alone
npm run check:placeholders  # dist/ placeholder scan alone (requires a prior build)
npm run preview          # serve the built site
```

One-off verification scripts (invoked directly, deliberately NOT chained into the build):

```bash
node scripts/check-links.mjs        # internal-link crawl over built dist/ HTML
node scripts/verify-foundation.mjs  # foundation invariants
```

## Deploy story

Push to `master` → GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with `npm run build` (so both gates run in CI) and deploys `dist/` to GitHub Pages via `withastro/action` + `actions/deploy-pages`. Live at https://www.jeremymaillot.fr.

## Known limitations

- External project `repoUrl`s (`https://github.com/jmaillot/<slug>`) point at repos that may not exist yet — accepted by design (externals are unverified; see phase decision D-10).
- v2 deferred items (OG share card, sitemap, dark mode, real project screenshots, …) are tracked in `.planning/REQUIREMENTS.md`.

## Agent Guardrails — Protected Files (Do Not Push)

**Never stage, commit, or push these paths — even with `git add -f` or bypass flags. They are local-only or human-owned:**

- `.planning/` (entire directory — already `.gitignored` and `commit_docs: false`; use `gsd_run query commit` which auto-skips it, never `git add -f .planning`)
- `DESIGN.md` — token source of truth, human-owned
- `AGENTS.md` — agent instructions, human-owned

Rules for all GSD agents (executor, planner, doc-writer, verifier, etc.):
1. Never `git add` any protected path. Before every commit, run `git status --short` and verify no protected path is staged.
2. Never `git add .` / `git add -A` — stage files individually and verify allow-list.
3. Never `git push` a commit that touches a protected path. If `git diff --cached --name-only` or `git diff --name-only HEAD~1 HEAD` includes any protected path, unstage it (`git restore --staged <path>`) and stop.
4. Bypass flags `GSD_ALLOW_PROTECTED_COMMIT` / `GSD_ALLOW_PLANNING_SHRINK` are for human use only — agents must not set them.
5. If a plan explicitly requires changing `DESIGN.md` or `AGENTS.md`, pause and request human verification via `checkpoint:human-verify` (`gate="blocking-human"`) instead of auto-committing.
6. Violation is fail-closed: repository `pre-commit`/`pre-push` hooks block the commit/push and explain why.

## Verification

How to check work: `npm run build` exits 0 and its output includes both gate pass messages — `All token checks passed.` and `All placeholder checks passed.` Any failure names the offending file/string and blocks the build.
