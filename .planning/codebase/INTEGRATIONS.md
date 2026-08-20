# External Integrations

**Analysis Date:** 2026-08-20

## APIs & External Services

**Web Fonts:**
- Google Fonts (fonts.googleapis.com / fonts.gstatic.com) - Loads the site's two typefaces, per the comment at `index.html:9` ("Font substitutes per DESIGN.md: Inter for the geometric sans, JetBrains Mono for the mono face")
  - Integration method: `<link rel="stylesheet">` to the CSS2 API in `index.html:12` — `family=Inter:wght@400;500;600` and `family=JetBrains+Mono:wght@400;500`, `display=swap`
  - Connection setup: `preconnect` to both `https://fonts.googleapis.com` and `https://fonts.gstatic.com` with `crossorigin` (`index.html:10-11`)
  - Auth: None (public static resource)
  - Note: `DESIGN.md` typography tokens specify Geist as the primary face; Inter is the substitute actually loaded in `index.html`. If Geist is later self-hosted or licensed, the `<link>` can be removed — fonts fall back to local stacks via `--font-sans` / `--font-mono` at `index.html:43-44`

**Outbound profile links (placeholders):**
- GitHub - Links to `https://github.com/yourusername` (placeholder; not a real account). All instances use `target="_blank" rel="noopener"`:
  - Nav: `index.html:650`, mobile overlay: `index.html:671`
  - Project cards (Orbit / Paperlink / Ledgerline): `index.html:732`, `index.html:749`, `index.html:766`
  - Footer CTA: `index.html:835`; footer socials: `index.html:849`, `index.html:867`
- Email (`mailto:hello@example.com`) - Placeholder address; no mail-sending service behind it. Appears at `index.html:651`, `index.html:670`, `index.html:685`, `index.html:834`, `index.html:848`, `index.html:866`

**Downstream/planned consumers (referenced, not present):**
- `scripts/derive-examples-block.mjs` and routes `/preview-design`, `/generate-kit` are referenced by the "Examples (illustrative)" section of `DESIGN.md` — none exist in this repo. Per `AGENTS.md` they are downstream/planned; `TO_FILL` markers there indicate missing primitives, not broken links. There is no API surface to integrate with here.

## Data Storage

**Databases:**
- None. No database, no ORM, no persistence layer. The page is fully static HTML/CSS/JS

**File Storage:**
- Local filesystem only — repo contents are `index.html`, `DESIGN.md`, `AGENTS.md` (plus `.planning/` and `.git/`). No images, fonts, or assets are committed; the project-card thumbnails are CSS placeholder grids (`index.html:431-455`)

**Caching:**
- None. No Redis, no service worker, no CDN config committed (browser/HTTP caching of the static file + Google Fonts only)

## Authentication & Identity

**Auth Provider:**
- None. No login, no sessions, no OAuth, no tokens. The mailto links imply a human workflow (visitor clicks → opens mail client)

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry/LogRocket/analytics scripts — the page loads exactly one external stylesheet (Google Fonts) and zero external JS

**Logs:**
- None server-side. No backend exists to log to

## CI/CD & Deployment

**Hosting:**
- Not configured in-repo. Any static host works (the page is a single self-contained `.html` file). There is no deployment config, no `netlify.toml`, no GitHub Pages workflow, no `.github/` directory

**CI Pipeline:**
- None. No workflows, no secrets. `AGENTS.md` describes "verification" as re-reading `DESIGN.md` and cross-checking `{section.key}` references, hex/px values, and Do's/Don'ts — a manual process, not a pipeline

## Environment Configuration

**Development:**
- Required env vars: None
- Secrets location: None. No `.env` files, no credentials, no API keys anywhere in the repo

**Production:**
- Secrets management: Not applicable (no secrets)
- The only external dependency at runtime is Google Fonts availability; the CSS font stacks at `index.html:43-44` degrade gracefully to system-ui / ui-monospace if the font CDN is unreachable

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None (all links are plain browser navigations: `mailto:`, `https://github.com/...`, and in-page `#` anchors)

---

*Integration audit: 2026-08-20*
*Update when adding/removing external services*
