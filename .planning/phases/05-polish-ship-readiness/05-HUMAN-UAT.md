---
status: partial
phase: 05-polish-ship-readiness
source: [05-VERIFICATION.md]
started: 2026-08-24T08:00:00Z
updated: 2026-08-24T08:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Browser styling + self-hosted fonts on all live routes
expected: All four routes (/, /projects/, /skills/, /contact/) fully styled at https://www.jeremymaillot.fr; headings/body render in Inter, code/terminal text in JetBrains Mono (DevTools → Network shows woff2 loaded from /_astro/fonts/, no googleapis requests)
result: [pending]

### 2. Mobile nav focus trap
expected: At ≤599px hamburger visible; opening overlay focuses first link, Tab wraps last→first and Shift+Tab wraps first→last, Escape closes and restores focus to toggle button, aria-expanded syncs true/false, resizing to ≥600px auto-closes
result: [pending]

### 3. Reduced-motion behavior
expected: With prefers-reduced-motion enabled (OS or DevTools emulation), section reveals appear immediately without scroll-in animation; page content fully visible without JS-driven motion
result: [pending]

### 4. Skip link + focus outlines
expected: First Tab press reveals "Skip to content" link that jumps focus to main; all interactive elements show visible :focus-visible outlines when keyboard-navigating
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
