# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Online Profile Site MVP

**Shipped:** 2026-08-24
**Phases:** 5 | **Plans:** 15 (33 tasks) | **Commits:** 48 | **Timeline:** 5 days (2026-08-20 → 2026-08-24)

### What Was Built
- Modular 5-route Astro 7 static site replacing the single-file baseline — content in Zod-validated Markdown collections, zero client-side rendering
- Two single sources of truth enforced by fail-closed build gates: DESIGN.md token mirror (`check:tokens`) and contact-collection identity (`check:placeholders`)
- Accessible shared chrome: active-state nav, focus-trapped mobile menu, identity-driven footer CTA band, complete per-page head with self-hosted fonts
- CI/CD: SHA-pinned least-privilege GitHub Actions → GitHub Pages on custom domain www.jeremymaillot.fr, verified live end-to-end
- Repo docs brought in sync (AGENTS.md rewrite, README, MIT license) and full planning archive under `.planning/milestones/`

### What Worked
- Discuss-phase before every phase produced locked decision records (D-01..D-14 in Phase 5 alone); plan-checker + decision-coverage gates caught dropped decisions pre-execution
- Pattern-mapper analog extraction made new scripts house-consistent (placeholder gate mirrored check-design-tokens.mjs structure)
- Fail-closed gates with negative tests (inject placeholder → build exits 1) proved the guards actually guard
- Wave ordering by real dependency (gate before deploy consumer) instead of roadmap numbering avoided shipping an ungated build

### What Was Inefficient
- Phase 3's font verification ran offline and produced a gap that looked resolved for two phases; an online-build check earlier would have surfaced the missing `<Font>` component immediately
- REQUIREMENTS.md traceability table was never updated by phase completions — 20 rows stayed "Pending" until milestone close; needed manual reconciliation
- Deploy-target confusion (repo named `www` vs user-site `jmaillot.github.io`) was foreseeable at Phase 1 when the remote was set; cost a mid-deploy pivot to custom domain
- Local DNS pollution on the dev machine masked the live site during verification; live checks should have used `--resolve` from the start

### Patterns Established
- "Fix the `.md`, never loosen the schema" — content-layer discipline documented unmissably in AGENTS.md
- Gates chained into `npm run build` (fail-closed), one-off verifiers kept out of the chain
- Identity single-source via `getEntry("contact","contact")`; grep-enforced zero hardcoding
- Check-scripts follow one house style (shebang, D-xx comments, ✓/✗ output, explicit exit codes)

### Key Lessons
1. Config-only API setup is not integration: Astro Fonts required rendering `<Font>` in the head AND resolving a `--font-sans` cascade collision — verify emitted artifacts (@font-face in dist), not config presence.
2. Verification debt compounds quietly: one `gaps_found` VERIFICATION.md sat unresolved across two phases; run audit-open before milestones, not just after phases.
3. Deployment naming (user-site vs project repo) must be decided against the actual git remote early — it changes base-path strategy for everything.
4. Traceability tables rot unless completion writes back automatically; treat stale checkboxes as audit findings.

### Cost Observations
- Model mix: planner opus; researcher/checker/executor/verifier sonnet
- Sessions: ~8 major sessions across planning, execution, review, deploy
- Notable: revision loops were cheap (mechanical citation fixes), deep replans never needed — upfront discuss-phase context paid for itself
