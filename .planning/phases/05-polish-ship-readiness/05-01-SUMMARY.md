---
phase: 05-polish-ship-readiness
plan: 01
subsystem: link-verification + deploy-pipeline
tags: [rout-06, dply-01, check-links, github-pages, legacy-cleanup]
requires:
  - dist/ built output (npm run build)
  - scripts/check-design-tokens.mjs (house style)
  - Phase 1 root-host config (astro.config.mjs site/base)
provides:
  - scripts/check-links.mjs (one-off internal-link crawl over dist/, ROUT-06/D-09/D-10)
  - .github/workflows/deploy.yml (pinned GH Pages Actions pipeline, both gates in CI)
  - verify-foundation.mjs asserting legacy index.html removal (D-04)
  - Decision D-xx record: deploy target = user-pages repo jmaillot/jmaillot.github.io (option-a)
affects:
  - https://jmaillot.github.io (goes live after user push — see Checkpoint)
tech-stack:
  added: [withastro/action v6, actions/deploy-pages v5, actions/checkout v7]
  patterns: [SHA-pinned action refs, OIDC-only Pages deploy, advisory-only external links]
key-files:
  created:
    - scripts/check-links.mjs
    - .github/workflows/deploy.yml
  modified:
    - scripts/verify-foundation.mjs
  deleted:
    - index.html (legacy single-file placeholder — untracked in worktree; removed from disk per orchestrator pre-brief, no git rm possible)
decisions:
  - "Task 2 (AUTO_MODE auto-select, first option): option-a — User-pages repo jmaillot/jmaillot.github.io serves https://jmaillot.github.io. Rationale: matches locked Phase 1 config (site=root host, base unset) with zero code changes; canonical/OG/meta URLs stay correct; astro.config.mjs untouched (verified empty diff)."
metrics:
  duration: ~10min
  completed: 2026-08-23
status: BLOCKED_AT_HUMAN_ACTION — workflow ready but push requires user auth (no gh CLI / SSH key in executor worktree); live verification pending
---

# Phase 5 Plan 01: Ship Readiness — Link Crawl & Deploy Summary

**Internal-link crawl proving all 5 built routes resolve every href/src, legacy `index.html` deleted, and a SHA-pinned least-privilege GitHub Pages workflow wired via `withastro/action@v6` — push-to-live awaiting one manual auth step.**

## What Was Built

### Task 1 — Legacy cleanup + crawl script (commit 2cbf72a)

- **Legacy `index.html` deleted.** Confirmed it was the Ada-Lovelace-placeholder single-file page before deletion. Only `scripts/verify-foundation.mjs` referenced it. NOTE: the file was **untracked** in this worktree (never committed on this branch), so per the orchestrator's DELETION NOTE it was removed from disk (`rm`) rather than `git rm` — the plan's acceptance criterion "`D  index.html` staged" is therefore N/A; nothing to stage.
- **`scripts/verify-foundation.mjs`:** section-4 "Legacy untouched" execSync/git-diff block replaced with a pure-fs assertion:
  ```js
  // 4. Legacy removed (Phase 5 D-04)
  !existsSync('index.html') ? ok('legacy index.html removed') : fail('legacy index.html still present');
  ```
  `execSync` import kept (still used by section 6). Full run passes: `All foundation checks passed.` including the new line `✓ legacy index.html removed`.
- **`scripts/check-links.mjs` created** (house style per check-design-tokens.mjs): shebang + header citing ROUT-06/D-09/D-10/D-11, `node:` imports, ✓/✗/⚠ prefixes, `resolve()` paths, missing-dist guard with exit 1. Crawls all `dist/**/*.html`, extracts quoted href/src values, skips mailto/tel/#anchor/data:, logs http(s) as `⚠ external (unverified per D-10)` advisories (34 found), maps internal paths via pretty-URL candidates + literal asset path, verifies with `existsSync`. Summary block: `✗ N broken link(s)` exit 1 / `All internal links resolved.` exit 0. T-5-04 verified by grep: zero `execSync|eval(` occurrences; not chained into package.json (grep count 0).

**Verification:** fresh `npm run build` green (both gate messages), then crawl reports `Crawled 5 page(s); 34 external URL(s) logged as advisories.` / `All internal links resolved.` exit 0.

### Task 2 — Deploy-target decision (checkpoint:decision, AUTO_MODE auto-selected)

**Selected: option-a — User-pages repo (`jmaillot/jmaillot.github.io`)** (first-listed/recommended option). Rationale recorded above in frontmatter decisions. Consequence honored: `astro.config.mjs` NOT touched (`git diff astro.config.mjs` = empty, verified).

### Task 3 — Deploy workflow (commit bacde68)

`.github/workflows/deploy.yml` created following the current official Astro recipe, re-verified LIVE from the withastro/action README at implementation time 2026-08-23 (per D-02, cached knowledge not trusted):

| Action | Version verified | Pinned ref (full commit SHA) |
|---|---|---|
| actions/checkout | v7 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| withastro/action | v6 | `e84f40bd8d2caa9e768ec82ad30dd81f0b280853` |
| actions/deploy-pages | v5 | `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` |

- Trigger: `push` to `[master]` + `workflow_dispatch`; `concurrency: { group: pages, cancel-in-progress: true }`
- Top-level `permissions: { contents: read, pages: write, id-token: write }` only (T-5-01)
- Two jobs (build ubuntu-latest → deploy needs:build with `environment: github-pages` + page_url)
- `node-version: 22.12.0` matches `.nvmrc`/engines
- Both gates run in CI: v6 default build command is `<package-manager> run build` → `npm run build` → tokens gate + astro build + placeholders gate
- Plan verify command passes: `WORKFLOW_OK`. No `@(main|master)` refs anywhere (an initial draft comment containing the literal string "@main" tripped the acceptance grep — reworded to "mutable branch refs forbidden"; behavior identical).

## Deviations from Plan

**1. [Rule 1 - Bug] Crawl script initially mis-flagged real built assets as broken**
- **Found during:** task 1 (first crawl run)
- **Issue:** candidate mapping only tried `.html` targets, so `/favicon.ico`, `/_astro/BaseLayout.*.css`, `/placeholder-16x9.svg` were reported broken although they exist in `dist/` (16 false ✗ lines) — contradicted the must-have truth "every internal href/src resolves to an existing built file"
- **Fix:** added the literal path `join(DIST, path)` as a third existsSync candidate alongside pretty-URL page candidates
- **Files modified:** scripts/check-links.mjs
- **Commit:** 2cbf72a (same commit — fixed before task completion)

**2. [Rule 3 - Blocking] Legacy index.html deleted from disk instead of `git rm`**
- The file was untracked on this worktree branch (never committed), so staging a deletion was impossible. Per orchestrator pre-brief this intentional deletion is expected; merge deletion-guard already briefed.

**3. Build-log "warn" grep hits are FALSE POSITIVES — waived with rationale**
- Acceptance requires no `grep -iE "warn"` lines in the tee'd build log. The only matches are the token gate's own PASS lines for color tokens *named* "warning": `✓ warning #f5a623`, `✓ warning-soft #ffefcf`, `✓ warning-deep #ab570a`, and `All token checks passed. (0 advisory warning(s))`. There are ZERO actual Astro/compiler warnings in `/tmp/05-01-build.log` (no `[WARN]`, no warn-level output; build completed clean in 4.32s, 5 pages). DPLY-01's "without warnings" clause holds.

No other deviations.

## Auth Gates

**Task 3, steps 3–4 (push + Actions-run confirmation) — HUMAN ACTION REQUIRED.** This executor worktree has neither the `gh` CLI nor an SSH publickey (`git ls-remote git@github.com:jmaillot/jmaillot.github.io.git` → `Permission denied (publickey)`). The target repo cannot be created or pushed from here. Prepared commands for the user:

```bash
# From the main checkout of this branch (master):
gh repo create jmaillot/jmaillot.github.io --public --source . --push
#   …or manually: create empty repo jmaillot/jmaillot.github.io on github.com, then:
git remote add pages git@github.com:jmaillot/jmaillot.github.io.git
git push pages master

# Then enable Pages: Settings -> Pages -> Build and deployment -> Source: GitHub Actions
# Then confirm the run: gh run list --repo jmaillot/jmaillot.github.io --workflow=deploy.yml --limit 1
```

## Known Stubs

None.

## Threat Flags

None beyond the plan's threat model. T-5-01 (least privilege) and T-5-02 (SHA pinning) mitigations implemented and grep-verified; T-5-04 mitigation verified (no eval/exec/fs-write in check-links.mjs).

## Verification Results (plan-level)

1. ✅ `npm run build` exits 0, both pass messages present; zero genuine warnings (see Deviation 3 waiver)
2. ✅ `node scripts/check-links.mjs` exits 0 against fresh build — `All internal links resolved.` (ROUT-06)
3. ✅ `node scripts/verify-foundation.mjs` passes incl. new "legacy index.html removed" check (D-04)
4. ⛔ Actions-run-green + live URL checks (routes/CSS/.nojekyll/identity) — **BLOCKED**: network reaches github.io (currently HTTP 404 — no deployment yet) but the push itself requires user auth. Not faked.
5. ⛔ Human browser spot-check — deferred behind #4.

## Self-Check: PARTIAL — code artifacts PASSED, deployment verification BLOCKED

- FOUND: scripts/check-links.mjs
- FOUND: .github/workflows/deploy.yml
- FOUND: scripts/verify-foundation.mjs updated ("legacy index.html removed" ×1, "untouched" ×0)
- FOUND: index.html absent from disk; dist/index.html present
- FOUND: commit 2cbf72a
- FOUND: commit bacde68
- MISSING (blocked, requires user action): push to jmaillot/jmaillot.github.io, green Actions run, live URL checks, human spot-check approval
