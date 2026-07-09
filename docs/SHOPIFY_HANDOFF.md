# SHOPIFY HANDOFF — FROM PROTOTYPE TO PRODUCTION STORE

The `/store` prototype in this repo is the **design and UX specification**. This document
maps every prototype feature to its Shopify implementation so a developer (or James +
a free theme) can rebuild it 1:1.

## 1. Foundation
- **Theme base:** free **Dawn** theme (fast, accessible) — customised with brand tokens.
  Avoid paid themes until revenue justifies; Dawn + custom CSS reaches ~90% of the
  prototype look.
- **Brand tokens:** Ink `#090909`, Bone `#F1EEE6`, Concrete `#BFC0BA`, Cobalt `#1747FF`,
  Signal `#FF4A1F`. Fonts: Archivo (display+body), Space Grotesk (data/mono accents) —
  both on Shopify font library alternatives or self-hosted OFL files.
- **Currency/locale:** AUD, en-AU, GST-inclusive pricing on.

## 2. Page mapping

| Prototype route | Shopify object | Notes |
|---|---|---|
| `/` Home | Homepage template | Section order matches prototype: hero video → product ticker → climate-built story → construction video → Shop the Uniform → UGC → fit section → founder story → events → VIP |
| `/shop` | Collection: All | Filters via Search & Discovery app (free) |
| `/drop/first-light` | Collection: Drop 001 + page metafields for countdown | Countdown only to real events; toggle via metafield `drop.countdown_enabled` |
| `/mens` `/womens` | Collections (styling-led) | Same unisex products, gendered styling imagery + copy |
| `/product/:handle` | Product template | Variants = colour × size; metafields: measurements table, GSM, fit video URL, model specs |
| `/collections/:handle` | Collections | |
| `/about` `/construction` `/fit-guide` `/journal` `/contact` `/faq` `/shipping` `/returns` `/privacy` `/terms` | Pages (+ Blog for journal) | Privacy/Terms = lawyer-reviewed before launch |
| `/account` | Customer accounts (new customer accounts) | |
| `/creators` | Page + form | Form via Shopify Forms (free) |
| Cart drawer | Theme drawer cart | Free-shipping progress bar at $150 |
| Outfit builder `/uniform` | Custom section + bundle products | See §4 |

## 3. Feature mapping

| Prototype feature | Shopify implementation |
|---|---|
| Search | Predictive search (native) |
| Filtering/sorting | Search & Discovery (free app) |
| Variants + size selection | Native options; size chart metafield rendered as table + modal |
| Sticky mobile add-to-cart | Dawn custom section/CSS (prototype provides exact spec) |
| Recently viewed | Theme localStorage snippet (prototype logic ports directly) |
| Recommended products | Native product recommendations API |
| Email capture | Shopify Email/Klaviyo embed, double opt-in |
| SMS placeholder | Klaviyo SMS (AU sender compliance) |
| Reviews | Judge.me free tier — **verified buyers only, no imports, no seeding** |
| UGC gallery | Instafeed free tier or manual metaobjects with creator permission flags |
| Countdown (toggleable) | Metafield-driven section; only real datetimes |
| Back-in-stock | Klaviyo back-in-stock or "Back in Stock" free tier app |
| Stock counts | Show only when true; threshold display "Only N left" at N≤10 via theme setting |
| Bundles (BUILD YOUR STATE) | Shopify Bundles (free, native) — fixed bundles; outfit builder as section adding multiple variants to cart with automatic discount (Order discount: 10–12% when bundle SKU set present) |
| Fit recommendation tool | Prototype logic (height/weight/fit-preference → size) as theme JS; upgrade path: Kiwi Sizing app |
| QR garment passport | Pages per style: `/pages/passport-ts-t01` linked from care label QR |
| Payments | Shopify Payments: Apple Pay, Google Pay, Shop Pay; Afterpay via Shopify Payments where approved |
| Express checkout | Native dynamic checkout buttons |

## 4. Bundle/outfit builder detail
Create products normally; define bundle sets (Double Tee, Tee+Cap, First Light Uniform,
Full State). Native Bundles app creates fixed-price bundle SKUs (prices per
PRODUCT_RANGE.md — capped ≤12% discount). Outfit-builder section = visual picker that
adds the bundle variant. Inventory is deducted from components automatically.

## 5. Apps budget (lean)
Free: Search & Discovery, Shopify Forms, Shopify Email (first 10k), Bundles, Judge.me
free, Instafeed free. Paid only when justified: Klaviyo (from ~$35/mo at 1k profiles),
Kiwi Sizing (optional later). **Target app spend at launch: <$50/mo.**

## 6. Data import
- `/data/products.csv` is formatted for Shopify product import (Handle/Title/Option
  columns) — import via Products → Import, then attach images and metafields.
- Set up metafield definitions first: `custom.gsm`, `custom.fit`, `custom.measurements`
  (JSON), `custom.model_specs`, `custom.fit_video`.

## 7. Performance & accessibility budget
LCP < 2.5s on 4G mobile · hero video ≤ 4MB poster-first · WebP images ≤ 200KB ·
all interactive elements keyboard-reachable, focus-visible (prototype demonstrates) ·
colour contrast: Bone-on-Ink and Ink-on-Bone both pass WCAG AA (verified in prototype);
Cobalt used at large sizes/accents only.

## 8. Launch QA checklist
Test order with real card + refund · all payment wallets on staging · shipping rates:
free ≥$150, $9.95 flat under · GST-inclusive display · email flows fire (Klaviyo test
profiles) · 404/search-empty states · Lighthouse mobile ≥85 · policies published ·
analytics (GA4 + Meta pixel + CAPI) verified with Tag Assistant.
