# QA Test Results — 21 July 2026

Every result below is from a **genuinely executed** run in this build environment (headless Chromium 1194 via Playwright; Lighthouse CLI over a local HTTP server; grep audits over the repo). Nothing is inferred. Commands and scripts summarised per section; unexecuted checks are in `known-limitations.md` — not here.

## 1. Full-site automated suite (Playwright, all 31 HTML pages)

| Check | Result |
| --- | --- |
| Pages tested | **31** (index, demo, app + 28 generated) |
| Broken internal links (href/src static audit, every page) | **0** |
| JS/console errors (browser run, every page, 400ms settle) | **0** |
| Horizontal overflow at 320px and 390px (every page) | **0** *(2 defects found and fixed during the cycle: nav CTA row at 320px; data-processing tables — repairs logged in §5)* |
| Exactly one `<h1>` per page | **31/31** *(app.html restructured during cycle)* |
| `meta description` present | **31/31** |

## 2. Interaction tests (Playwright, scripted user flows)

| Flow | Result |
| --- | --- |
| Demo: select sample Reel → stage renders with scores | PASS (score rendered: 58 for sample 1) |
| Demo: generate Higgsfield brief → brief content appears | PASS |
| Waitlist form: empty submit blocked with field-level errors | PASS |
| Waitlist form: valid submit → honest demo-mode message shown, data saved locally | PASS |
| App prototype: hash route `#preflight` activates correct view | PASS |
| App prototype: upload simulation runs to completed state | PASS |
| Mobile menu opens on generated pages at 390px | PASS |

## 3. Lighthouse (local server, headless Chromium, three representative pages)

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| index.html | **100** | **100** | **100** | **100** |
| pricing.html | **100** | **100** | **100** | **100** |
| demo.html | **100** | **100** | **100** | **100** |

(Accessibility was 98 on first run — heading-order: footer `h4` jump; fixed by converting footer labels to styled divs; re-run to 100. Local-server numbers exclude real-network latency; the site is 552KB total for 31 pages with zero external requests, so production scores should hold — re-verify after deploy.)

## 4. axe-core WCAG 2.2 A/AA scan (9 key pages incl. forms, demo, app, legal)

**0 violations** after repairs. Initial run found: white-on-`echo-500` buttons at 3.63:1 (below AA 4.5:1) across 7 pages, and colour-only inline links on demo. Fixes: new `echo-600 #4A63E8` button fill (4.95:1, computed), underlines on all in-text and footer-legal links. Both re-verified to zero.

## 5. Content & claims audits (grep, whole repo)

| Audit | Result |
| --- | --- |
| Banned hype terms (brand prohibited list pattern) on site + marketing + video scripts | **0 hits** (sole match is the rules document quoting the banned list) |
| Secret scan (key/token/password assignment patterns, all file types) | **0 hits** |
| Private-data phrase audit ("who saved/shared/viewed") | All 4 site occurrences verified to be negations/scam-warnings — compliant |
| "Example data" labelling | Present in-viewport on hero mock, all demo stages, all app views, examples page |

## 6. Defects found and fixed this cycle (the honest ledger)

1. Nav overflow at 320px (all pages) → CTA row hidden ≤480px, tighter gaps. Re-tested: clean.
2. `data-processing.html` table overflow on mobile → scrollable tables ≤680px. Re-tested: clean.
3. `app.html` had 12 `h1`s → one visually-hidden h1 + h2 view titles. Re-tested: clean.
4. Button contrast 3.63:1 → `echo-600` fill 4.95:1 (brand doc amended). Re-tested: 0 violations.
5. Colour-only links (demo body + legal footer) → underlined. Re-tested: 0 violations.
6. Footer heading-order jump → non-heading labels. Lighthouse a11y 98 → 100.

## 7. Not tested here (see known-limitations.md for full list)

Real-device testing; production-network performance; authentication/rate-limit/upload security (no backend exists — static site attack surface only); email deliverability; Lighthouse on all 31 pages (3 representative pages tested; the other 28 share the identical generated template of pricing.html).
