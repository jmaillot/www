import { defineConfig, fontProviders } from 'astro/config';

// Host decision: GitHub Pages root — https://jmaillot.github.io
// - `site` is the canonical origin for sitemap/OG/canonical URLs.
// - `base` is intentionally unset (root host `<user>.github.io` serves from `/`, not `/repo/`).
//   If the repo were a project site (e.g. jmaillot.github.io/homepage) we would set base: '/homepage/'.
//   base unset — root host serves from / (no base key present).
// - `output: 'static'` enforces fully static HTML (no SSR/adapter) — aligns with PERF-04/DPLY-01.
// - `public/.nojekyll` (empty file) prevents GH Pages Jekyll from dropping `_astro/` assets.
export default defineConfig({
  site: 'https://jmaillot.github.io',
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
