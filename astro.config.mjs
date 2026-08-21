import { defineConfig } from 'astro/config';

// Host decision: GitHub Pages root https://jmaillot.github.io — base unset (root), output static.
// Full site/fonts config landed in plan 01-02; this stub keeps the scaffold buildable.
export default defineConfig({
  site: 'https://jmaillot.github.io',
  output: 'static',
});
