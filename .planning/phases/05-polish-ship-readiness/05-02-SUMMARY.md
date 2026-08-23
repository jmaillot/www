---
phase: 05-polish-ship-readiness
plan: 02
subsystem: build-gates + repo-docs
tags: [dply-02, placeholder-gate, fail-closed, identity, docs]
requires:
  - scripts/check-design-tokens.mjs (analog gate structure)
  - package.json build chain
  - src/content/projects/*.md (placeholder repoUrls)
provides:
  - scripts/check-placeholders.mjs (fail-closed post-build gate)
  - npm script check:placeholders chained into build after astro build
  - real GitHub repoUrls in project cards
  - rewritten AGENTS.md + new README.md
affects:
  - .github/workflows/deploy.yml (plan 05-01 inherits both gates via `npm run build`)
tech-stack:
  added: []
  patterns: [fail-closed post-build gate mirroring check-design-tokens.mjs house style]
key-files:
  created:
    - scripts/check-placeholders.mjs
    - README.md
  modified:
    - package.json
    - src/content/projects/01-orbit.md
    - src/content/projects/02-paperlink.md
    - src/content/projects/03-ledgerline.md
    - AGENTS.md
decisions:
  - "D-07 × D-10 resolved via option (a): project repoUrls updated to https://github.com/jmaillot/<slug> rather than weakening the gate"
  - "D-05 accent note: 'Jérémy Maillot' accented spelling stands; it matches no gate string and no normalization was added to the gate"
metrics:
  duration: ~8min
  completed: 2026-08-23
---

# Phase 5 Plan 02: Placeholder Gate & Repo Docs Summary

**Fail-closed placeholder gate scanning built dist/ HTML for the three DPLY-02 identity strings, wired into `npm run build` after astro build; real jmaillot repoUrls; AGENTS.md rewritten for the modular Astro repo + new lean README.**

## What Was Built

### Task 1 — `scripts/check-placeholders.mjs` (commit 388c398)

Fail-closed post-build gate mirroring `check-design-tokens.mjs` house style exactly:

- Header comments cite D-06 (scan built dist/ HTML), D-07 (exactly three strings), D-08 (fail-closed wiring)
- Recursively walks `dist/**/*.html`; paths resolved from repo root (cwd-independent under npm scripts)
- Gate strings EXACTLY: `Ada Lovelace`, `hello@example.com`, `yourusername`
- Per-hit log `✗ placeholder: "<string>" found at <rel-path>:<line>`; clean files log `✓ <rel-path> clean`
- Guard clause first: missing `dist/` → `✗ dist/ missing — run npm run build first`, exit 1
- Actionable failure block: "Fix the source in src/content/*.md (fix the .md), then rebuild — never edit dist/ output."
- Summary: `\n✗ N placeholder failure(s) — build blocked (fail-closed)` / `\nAll placeholder checks passed.` with explicit exit codes
- T-5-06 mitigation verified by acceptance grep: zero `execSync|eval(|fetch(` occurrences

**Verification:** positive run against stale dist correctly flagged the then-real `yourusername` leak; negative test (`dist/gate-test.html` planted with `hello@example.com`) flipped exit to non-zero → GATE_OK.

### Task 2 — Build chain wiring + real repoUrls (commit 42c6b8f)

```json
"check": "astro check && npm run check:tokens",
"check:tokens": "node scripts/check-design-tokens.mjs",
"check:placeholders": "node scripts/check-placeholders.mjs",
"build": "npm run check:tokens && astro build && npm run check:placeholders",
"preview": "astro preview"
```

Project repoUrls updated (content-only edits, zero schema/markup changes):

- `01-orbit.md` → `https://github.com/jmaillot/orbit`
- `02-paperlink.md` → `https://github.com/jmaillot/paperlink`
- `03-ledgerline.md` → `https://github.com/jmaillot/ledgerline`

Identity frontmatter verified already real, ZERO edits: contact.md has `jeremymaillot@gmail.com` / `https://github.com/jmaillot` / name `Jérémy Maillot`; profile.md name likewise (`git diff` empty for both files).

**Negative chain test (recorded raw outcome):** injecting `yourusername` into a *rendered frontmatter value* of `src/content/contact/contact.md` made `npm run build` exit **1** with the raw tail:

```
✗ placeholder: "yourusername" found at skills/index.html:1  (×5)
...
Fix the source in src/content/*.md (fix the .md), then rebuild — never edit dist/ output.
✗ 25 placeholder failure(s) — build blocked (fail-closed)
```

Reverted via explicit `git checkout -- src/content/contact/contact.md`; rebuild green. **Deviation detail (Rule 3 adjustment, not a plan change):** the plan's literal injection point (appending to contact.md's markdown *body*) does not propagate to HTML because `/contact/` renders only frontmatter fields (verified: body text absent from built page). The injection was moved to the rendered `name:` frontmatter field within the same file — same intent, actually exercises the leak path the gate exists for.

### Task 3 — AGENTS.md rewrite + README.md (commit 9ce402e)

- **AGENTS.md**: full rewrite removing all stale single-file-era claims. Sections: what the repo is (5 routes, Astro static), stack (Astro 7.2.4 pinned, TS ^6 strict, Node ≥22.12, npm ≥10.9.8), content-layer rule (**"Fix the `.md`, never loosen the schema."**, single identity source = contact entry), token discipline (DESIGN.md frontmatter ↔ `:root`, `check:tokens` fail-closed), placeholder gate (all three strings documented), commands (both gates + one-off `check-links.mjs`/`verify-foundation.mjs`), deploy story (push master → Actions → https://jmaillot.github.io), known limitations (external `<slug>` repoUrls unverified per D-10; v2 deferrals in REQUIREMENTS.md), verification recipe.
- **README.md**: lean project card (~45 lines): site description, tech bullets, commands block, where content lives, deploy story, known-limitation note. No badges/license boilerplate.
- Note: `scripts/check-links.mjs` is documented as instructed but is landed by the parallel plan (05-01 wave); docs describe the target end-state of the phase.
- Deploy URL kept at root `https://jmaillot.github.io` — 05-01-SUMMARY.md did not exist at execution time (parallel wave), so the plan's default applies.

## Deviations from Plan

**1. [Rule 3 - Blocking issue] Negative-chain-test injection point adjusted**
- **Found during:** task 2
- **Issue:** appending `yourusername` to contact.md's markdown body does not reach built HTML (the contact page renders frontmatter only), so the build stayed green and the negative test could not demonstrate fail-closure
- **Fix:** injected into the rendered frontmatter `name:` field of the same file instead; test then failed as required (exit 1, 25 hits across all pages via nav/footer propagation)
- **Files modified:** `src/content/contact/contact.md` (temporarily; reverted via `git checkout --`)
- **Commit:** n/a (test-only, tree left clean — `git status --porcelain src/content/` shows only intended project-file edits)

No other deviations — plan executed as written otherwise.

## Auth Gates

None.

## Known Stubs

None. No stub patterns introduced.

## Threat Flags

None. No security-relevant surface beyond the plan's threat model was introduced (gate is string-scan only; T-5-06/T-5-07 mitigations verified).

## Verification Results (plan-level)

1. ✅ `npm run build` exits 0 with BOTH pass messages (`All token checks passed.` + `All placeholder checks passed.`)
2. ✅ Negative tests at both levels: raw dist file (Task 1 GATE_OK) and content source through full chain (Task 2, exit 1 recorded above)
3. ✅ `grep -rn "yourusername" src/` empty; project cards link plausible `github.com/jmaillot/<slug>` URLs
4. ✅ AGENTS.md/README.md greps confirm accurate, stale-free docs (all acceptance greps pass)

## Self-Check: PASSED

- FOUND: scripts/check-placeholders.mjs
- FOUND: README.md
- FOUND: AGENTS.md (rewritten)
- FOUND: commit 388c398
- FOUND: commit 42c6b8f
- FOUND: commit 9ce402e
