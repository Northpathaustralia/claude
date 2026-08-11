# Accessibility Review — 21 July 2026

Standard: WCAG 2.2 AA. Method: axe-core 4.x full A/AA ruleset via Playwright on 9 representative pages (home, pricing, FAQ, demo, app prototype, waitlist, privacy policy, trust, free review) + Lighthouse accessibility on 3 pages + manual keyboard pass.

## Automated results

- **axe-core: 0 violations** across all 9 pages (after repairs — initial findings and fixes in `test-results.md` §4/§6).
- **Lighthouse accessibility: 100 / 100 / 100** (index, pricing, demo).

## Manual checks performed (headless-verified where scriptable)

| Check | Result |
| --- | --- |
| Skip-to-content link on every page, visible on focus | PASS (template-level) |
| Full keyboard path: nav → menu → demo Reel selection → brief generation | PASS (demo picker uses real `<button>`s with `aria-pressed`) |
| Form errors announced: field-level messages + `role="status"` on success | PASS |
| Focus visibility: 2px ring on all interactive elements | PASS (`:focus-visible` global) |
| Reduced motion: all animation/transitions disabled under `prefers-reduced-motion`; demo scroll uses auto behaviour | PASS |
| Score information not colour-only: numerals accompany every colour signal; hero mock has a full `aria-label` describing the scores | PASS |
| Pacing-timeline visualisations marked `aria-hidden` with adjacent text explanation | PASS |
| App prototype: toggles are real checkboxes with labels; upload drop zone is keyboard-operable (`role="button"`, Enter/Space) | PASS |
| Language attribute, landmarks (nav/main/footer), single h1, sequential headings | PASS (verified in suite) |

## Known gaps (honest)

1. **No screen-reader session was run** (no VoiceOver/NVDA in this environment). The structural signals are right, but a human screen-reader pass is listed in NEXT-7-DAYS.
2. Only 9 of 31 pages axe-scanned directly; the other 22 are built from the same audited template with prose content — spot-risk is low but a full-crawl scan post-deploy is a one-command follow-up.
3. Touch-target size (24×24 minimum, 2.2 AA 44px advisory) verified by CSS inspection (buttons ≥44px, nav links padded) but not device-measured.
