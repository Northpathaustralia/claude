# EXECUTIVE SUMMARY — TIDESTATE

**Premium streetwear engineered for the Australian climate. Built on the Gold Coast for
first light, late nights and everything between.** Founder: James Forycki.
Category created: **CLIMATE-BUILT PREMIUM STREETWEAR.**

This document indexes the full company build. Every file referenced below exists in this
repository right now.

---

## 1. What was researched

- **Competitor benchmark:** Front Runner AU (frontrunnerau.com) — founder-led growth via
  Timm Hanly's reality-TV audience, drop mechanics, unisex gym-to-street positioning,
  pricing (~AUD $140–400 hoodies, $90–140 tees), wholesale into Rebel Sport, anti-paid-
  influencer seeding philosophy. Full write-up + sourced links: `docs/COMPETITOR_AUDIT.md`.
- **Adjacent market:** Culture Kings, STAX, Babyboo, P.E Nation, White Fox, AS Colour —
  positioning gaps mapped. Australian online fashion market sized at ~AUD $9.6–10b/yr,
  25–30% online penetration and growing (sourced in COMPETITOR_AUDIT.md).
- **Legal/IP landscape:** IP Australia trademark search process, ASIC business
  registration, ACCC/ACL obligations, care-labelling standards, GST thresholds, import
  duty structure — `docs/AUSTRALIAN_SETUP.md`.

## 2. What was created

| Area | File(s) |
|---|---|
| Brand strategy, voice, visual system, taglines | `docs/BRAND_BLUEPRINT.md` |
| 20 scored name alternatives (TIDESTATE recommended, 89/100) | `docs/NAME_OPTIONS.md` |
| DROP 001: FIRST LIGHT — full 5-product spec | `docs/PRODUCT_RANGE.md` |
| Manufacturing spec, measurement charts, QC | `docs/MANUFACTURING_BRIEF.md` |
| Three sourcing models + unit economics | `docs/UNIT_ECONOMICS.md` |
| 12-month revenue scenarios | `docs/REVENUE_FORECAST.md` |
| Day-by-day 90-day launch plan | `docs/90_DAY_PLAN.md` |
| Three-engine content system | `docs/CONTENT_STRATEGY.md` |
| 100 original video hooks | `docs/100_VIDEO_HOOKS.md` |
| Lean Meta ad plan ($30/$75/$150 tiers) | `docs/PAID_AD_PLAN.md` |
| 17 email/SMS flows, full copy | `docs/EMAIL_AND_SMS.md` |
| STATE CREW creator program | `docs/CREATOR_PROGRAM.md` |
| Australian business setup checklist | `docs/AUSTRALIAN_SETUP.md` |
| Shopify handoff spec | `docs/SHOPIFY_HANDOFF.md` |
| Visual identity (wordmark, monogram, favicon, packaging) | `/assets/*.svg` |
| Shopify-importable product catalogue | `/data/products.csv` |
| Financial model (scenarios + unit economics) | `/data/financial-model.csv` |
| 90-day content calendar | `/data/content-calendar.csv` |
| **Working ecommerce site** (React/Vite/Tailwind) | `/store` |

## 3. What is functional (built and tested, not mocked-up)

The `/store` prototype is a real, running application — not screenshots. Verified with an
automated Playwright pass (37/37 checks) plus manual visual QA:

- **All 18 page routes** render: home, shop-all, drop page (real countdown timer, no fake
  urgency), men's/women's styling, product pages, collections, about, construction
  (Coastform), fit guide, journal + posts, creators, contact, FAQ, shipping, returns,
  privacy/terms placeholders, account.
- **Cart:** add/remove/adjust quantity, live subtotal, free-shipping progress bar, persists
  across reloads (localStorage).
- **Product pages:** colour/size selection, real per-size stock counts (only shown when
  ≤10 and always true to the data), sold-out states, back-in-stock notify form, exact
  measurement-chart tables, on-model data, sticky mobile add-to-cart.
- **Search** (overlay, live filtering), **filtering/sorting** on shop pages, **recently
  viewed**, **recommended products**.
- **Fit recommendation tool** (height/weight/preference → suggested size).
- **Outfit builder** ("Build Your State") — auto-detects matching bundle presets and
  applies capped-margin bundle pricing live.
- **VIP email capture**, mobile navigation drawer, 404 page, basic account flow.
- Confirmed responsive at 1440px and 390px; a real bug (CSS `backdrop-blur` collapsing the
  mobile nav's `fixed` positioning) was found and fixed during testing.
- `npm run store:dev` / `store:build` / `store:preview` wired into `package.json` without
  touching the existing NPAOS app already in this repo.

## 4. What still needs human approval

- **Final brand name.** TIDESTATE is recommended (89/100) but is a working name until
  trademark clearance completes (`docs/NAME_OPTIONS.md`).
- **Visual identity direction** — SVG assets are a real, usable starting system, not final
  agency-polished artwork. James should sign off before print production.
- **Founder story wording and photography direction** (`docs/BRAND_BLUEPRINT.md` §8).
- **Pricing** — targets are planning estimates; confirm against real landed costs before
  publishing final retail prices.
- **Which launch model** (Lean Validation / Premium Small Batch / Full Cut & Sew) and
  which budget tier (`docs/UNIT_ECONOMICS.md`) James wants to fund first.

## 5. What requires real supplier quotations (nothing here is a quote)

All landed costs, MOQs, lead times, freight and duty figures in `PRODUCT_RANGE.md`,
`MANUFACTURING_BRIEF.md` and `UNIT_ECONOMICS.md` are **conservative planning estimates**.
Before committing money: get real quotes from blank suppliers (Model 1), small-batch
factories (Model 2), a customs broker (duty/HS codes), and a 3PL (pick/pack rates).

## 6. What requires legal or trademark checking

- IP Australia trademark search + attorney clearance for TIDESTATE (classes 25 + 35)
  **before** printing any labels — see `docs/NAME_OPTIONS.md` and `AUSTRALIAN_SETUP.md`.
- Privacy Policy and Terms of Service pages in `/store` are explicitly marked
  **PLACEHOLDER — LAWYER REVIEW REQUIRED** in the app itself.
- Supplier contracts, insurance, and the AIRLINE JERSEY livery (confirm no resemblance to
  existing sports codes) — flagged in `MANUFACTURING_BRIEF.md`.
- Structure decision (sole trader vs Pty Ltd) — accountant call, see `AUSTRALIAN_SETUP.md`.

## 7. The exact next ten actions for James

1. Read `docs/NAME_OPTIONS.md` and pick a final 1–2 name candidates to send to a
   trademark attorney this week.
2. Book the accountant call (structure + GST timing) — `docs/AUSTRALIAN_SETUP.md` §1–3.
3. Register the ABN and reserve domains/handles for the chosen name the same day.
4. Run `npm run store:dev` locally, click through `/store`, and mark up anything that
   feels off before it goes further.
5. Decide funding tier ($3k / $5k / $10k / $20k) using `docs/UNIT_ECONOMICS.md` §"Cost
   control budgets" — $10k Model 1 is the recommendation.
6. Request real quotes from 2–3 premium blank suppliers + 1 local Gold Coast decorator
   for the HEATFORM tee and BREAKLINE cap (fastest path to Phase 2 samples).
7. Start Engine One content today — Day 1 of `docs/90_DAY_PLAN.md` — film the first
   founder video before anything else is "ready".
8. Stand up the VIP landing page (the `/store` homepage's email capture is launch-ready)
   and start collecting the list.
9. Send `docs/PRODUCT_RANGE.md` to the trademark attorney alongside the name — the
   AIRLINE Jersey livery needs a sanity check against existing sports branding.
10. Block out the Phase 1 gate review (Day 14) on a calendar now, with the KPI table in
    `90_DAY_PLAN.md` as the scorecard.

## 8. Plain-English instructions (new to ecommerce)

- **This repo is the whole company's paperwork, in folders.** `/docs` = the business plan
  and playbooks (read them in the order listed in this summary). `/assets` = logo files.
  `/data` = spreadsheet-style files you can open in Excel/Sheets or import into Shopify.
  `/store` = a working, clickable website you can run on your own computer.
- **To see the website:** you (or a developer) run `npm install` once, then
  `npm run store:dev`, then open the address it prints in a browser. Nothing gets
  published anywhere by doing this — it only runs on your machine until you deploy it.
- **This is not yet a real, sellable Shopify store.** `docs/SHOPIFY_HANDOFF.md` is the
  instruction sheet for turning this prototype into an actual Shopify store — it maps
  every page and feature here to the exact Shopify feature that builds it for real.
- **Nothing in here is a guarantee.** Every price, cost and forecast is a planning number
  to make decisions with, not a promise of what will happen. Update the real numbers as
  you get real quotes and real sales.
- **Start small.** The whole system is designed so you can launch validation-style for
  about $10,000, prove people want it, and only then spend more on custom manufacturing.
