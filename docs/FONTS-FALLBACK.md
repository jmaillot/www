# Fonts Fallback — Preconnect Strategy

## Current: Astro built-in self-host (preferred)

`astro.config.mjs` uses the Astro 7 built-in `fonts` config with `provider: 'google'` and
`cssVariable: '--font-sans'` / `'--font-mono'`. At build time Astro downloads the woff2
files and emits them to `dist/_astro/` with `@font-face` rules that use
`font-display: swap` and no external requests at runtime. Verification: `dist/_astro/*.woff2`
exists after `astro build` and `dist/index.html` contains no `<link href="https://fonts.googleapis.com">`.

## Fallback: preconnect + Google Fonts link (if built-in misbehaves)

If the built-in fonts config fails to emit assets (e.g. provider network error at build,
or Astro API moved), revert the scaffold page to the legacy preconnect pattern preserved
in `index.html` lines 10-12:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Keep `display=swap` to avoid FOIT. This fallback is render-blocking by design — prefer the
self-hosted path and only use preconnect if the build cannot emit woff2.

## Verification

- Self-host OK: `ls dist/_astro/*.woff2` succeeds and `grep -c 'fonts.googleapis' dist/index.html` is 0
- Fallback needed: `grep -c 'fonts.googleapis' dist/index.html` > 0 or no woff2 in dist/_astro/
