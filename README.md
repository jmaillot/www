# homepage — Jérémy Maillot

Personal profile site for [Jérémy Maillot](https://github.com/jmaillot), live at
https://www.jeremymaillot.fr. A modular multi-page Astro static site (home, projects,
skills, contact, branded 404) with content authored in Markdown collections and
styling driven by the design-token set in `DESIGN.md`.

## Tech

- **Astro** static output — zero client-side JS beyond mobile-nav + scroll-reveal enhancement
- Markdown content layer (`src/content/*/`) validated by strict Zod schemas
- Design-token CSS: `DESIGN.md` frontmatter is mirrored into `src/styles/global.css`
- Fail-closed build gates: token drift check (pre-build) + placeholder-identity scan of built HTML (post-build)

## Commands

```bash
npm install        # install dependencies
npm run build      # tokens → astro build → placeholder gate (all fail-closed)
npm run preview    # serve the built site locally
```

## Where content lives

One Markdown file per collection entry under `src/content/`:

- `src/content/profile/profile.md` — hero identity, role, terminal block
- `src/content/projects/*.md` — project cards (frontmatter-driven)
- `src/content/skills/skills.md` — skill categories and tags
- `src/content/contact/contact.md` — single identity source (email / GitHub / name)

## Deploy

Push to `master` → GitHub Actions builds with `npm run build` and deploys `dist/`
to GitHub Pages. Live at https://www.jeremymaillot.fr.

Note: external project repo links (`https://github.com/jmaillot/<slug>`) may not exist yet — known limitation.
