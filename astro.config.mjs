import { defineConfig, fontProviders } from 'astro/config';

// Host decision: custom domain root — https://www.jeremymaillot.fr (repo: jmaillot/www)
// - `site` is the canonical origin for sitemap/OG/canonical URLs.
// - Custom domains serve GitHub Pages from `/` regardless of repo name, so
//   `base` stays unset and all root-absolute paths (`/_astro/*`, `/projects/`) work.
//   If we ever served from the repo subpath instead, base would need to be set.
// - public/CNAME pins the domain so it survives Actions-based deployments.
// - `output: 'static'` enforces fully static HTML (no SSR/adapter) — aligns with PERF-04/DPLY-01.
// - `public/.nojekyll` (empty file) prevents GH Pages Jekyll from dropping `_astro/` assets.
export default defineConfig({
  site: 'https://www.jeremymaillot.fr',
  // base: not set — root host serves from /
  output: 'static',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
});
