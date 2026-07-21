# HANDOVER — EchoSight Continuation Build

**Date:** 21 July 2026 · **Branch:** `claude/echosight-ai-venture-build-nppfzj` · **Directory:** `/echosight`

## What was actually built (and what it is)

| Deliverable | Reality |
| --- | --- |
| **Website — 31 pages** (`site/`) | Fully built, tested, deployable static site: home, 8 product/feature pages, 3 solutions pages, pricing (all prices public), free-review, examples, about, trust, security, FAQ, contact, login/signup (honest beta redirects), waitlist with founding offer, 5 legal drafts, 404, sitemap, robots, OG image, favicon. Zero external dependencies. |
| **Interactive demo** (`site/demo.html`) | Working: 3 sample Reels → scores/confidence → observations → ranked fixes → original-vs-improved script → Higgsfield brief generation. All example data, labelled in-viewport. |
| **App prototype** (`site/app.html`) | 13 hash-routed views (dashboard, Pre-Flight with simulated pipeline, teardown, coach, trends, competitors, briefs, connections, settings/privacy/billing, empty + failure states). Persistent "Demo data" banner. No fake backend claims — even the buttons say "prototype only". |
| **30-day content system** (`marketing/`) | 30 complete pieces: calendar CSV (hooks scored ≥8, A/B variants, costs, metrics), production playbook, caption/CTA library, thumbnail briefs, community plan, measurement dashboard. |
| **Higgsfield production system** (`higgsfield/`) | 6 global files (style bible, character continuity, camera + negative libraries, cost plan, beginner guide) + **12 complete video packages × 14 files each** (scripts, storyboards, shot lists, paste-ready prompts, SRT captions, EDLs, QC gates, costs) generated from a maintainable data module. |
| **Research** (`research/`) | Live July-2026 market audit with evidence register, competitor scorecard (EchoSight target ≥8.5 vs top-3 avg 6.73), customer language bank, hook pattern library. |
| **Strategy updates** (`docs/21–24`) | Continuation audit, segment decision (solo Reels-first creators primary), pricing v2 (margin-fixed), founding offer (200 seats, honest cap). |
| **Brand v2** (`brand/`) | Humanised voice system, copy style guide, visual direction v2, anti-AI checklist (grep-enforceable). |
| **Launch + compliance** (`launch/`, `compliance/`) | Minimum-cost stack (3 levels, AUD), month-one budget CSV, setup order, full beginner guide, claim register, privacy review, Meta API submission kit, staged compliance checklist. |
| **QA + reviews** (`qa/`, `reviews/`) | Genuinely executed test results (see below), security/accessibility/performance reviews, known-limitations register, 20-role council report, final red team. |

## What is functional vs demo vs blocked

- **Functional now:** the entire website and both interactive experiences, locally or on any static host.
- **Demo data:** every number in the demo/app/examples — labelled as such on screen, by design, because no product backend or customers exist yet.
- **Blocked externally (7 items, each one-step):** domain purchase · form backend · Higgsfield generation (connector disconnected mid-session — packs are ready) · founder-filmed videos · AU legal review · Meta App Review · company registration. Full table: `qa/known-limitations.md`.

## Preview URL

**No live URL yet — honestly.** No hosting credential was available in-session, and this repo's GitHub Pages is already used by the NorthPath app (deliberately not overwritten). Local preview: open `echosight/site/index.html` in any browser. **One-step deploy:** Cloudflare Pages → connect this repo → output directory `echosight/site` (guide step 4, ~20 min including domain).

## Test results (executed, not asserted)

31/31 pages: 0 broken links, 0 console errors, 0 mobile overflow (320/390px), 1 h1 each · axe-core WCAG 2.2 AA: **0 violations** (9 pages scanned; 6 real defects found and fixed during the cycle) · Lighthouse: **100/100/100/100** on index, pricing, demo · secret scan clean · banned-claims grep clean. Full detail: `qa/test-results.md`.

## Higgsfield video status

**0 of 12 generated** (toolchain disconnected before generation — documented in `higgsfield/production-cost-plan.md`). All 12 packages READY FOR HIGGSFIELD GENERATION with per-shot prompts, QC gates and stop-losses. Estimated cost to produce all 12: **A$130–250** in credits; first two (validation slice: day-01, day-16) ≈ A$45.

## Month-one cost

**A$135 validation tier** (domain + first 2 videos, everything else free) · **A$348 lean tier** (full video month) · **+A$1,200** only when taking payments (legal review) · full breakdown: `launch/month-one-budget.csv`.

## Your exact first action

Open **`launch/DUMMY-GUIDE-START-HERE.md`** and do Step 1 (buy the domain, ~10 minutes, ~A$90). Everything else in the guide chains from it, in order.
