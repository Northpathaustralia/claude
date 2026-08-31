# 15–18. Launch Checklist, Tool Stack, Operations, 30/90-Day Plans

## Operations foundation (read once, decide once)

**Platform:** Shopify Basic (A$56/mo, or the ~A$1/mo first-3-months promo when available).
It wins on checkout conversion, app ecosystem, and support. (WooCommerce is cheaper but
costs you 10× the hours; not worth it for this model.)

**Fulfilment stack — hybrid, in this order:**
1. **CJdropshipping** (primary): product sourcing + quality checks + AU-reachable lines
   (6–12 day AU delivery on winners), no monthly fee, connects to Shopify natively.
2. **Zendrop or AutoDS** (secondary/backup): faster onboarding, auto-fulfilment, good for
   redundancy when a CJ line goes out of stock.
3. **AliExpress direct** (research + emergency backup only — never the primary at scale).
Rule: every hero product needs a second supplier identified before you scale ads on it.

**Product research tools:** free tier first — TikTok Creative Center (top ads by country/
category), AliExpress "orders" sort, Amazon Best Sellers (kitchen) for demand validation,
competitors' pixels via Meta Ad Library (search "kitchen gadget" AU). Paid (optional,
month 2+): Minea or PiPiAds (~A$50–75/mo) only when scaling creative research.

**How to avoid bad suppliers:**
- Order every product to your own address before listing it (the single most skipped,
  most important step). Film your own unboxing — that's content anyway.
- Require: food-grade certification PDFs for anything food-contact, real product photos
  on request (not renders), <2% dispute rate on the supplier, responsive within 24h.
- Test messages before committing: ask a technical question; if the answer is copy-paste
  nonsense, walk.
- Red flags: price wildly below market (quality dump), "hot seller" pages created last
  month, no AU line option, refuses sample orders.

**Shipping-time testing:** place 3 sample orders per hero product to AU addresses
(yours, a friend's, one regional) before launch; log actual door-to-door days; publish
the *slowest realistic* window on product pages. Under-promise, over-deliver — reviews
follow.

**Pricing method:** landed cost × 3 minimum (×3.5–4 on heroes). Sanity-check against
Amazon AU price for the same item: you can be equal or slightly above (brand premium)
but not 2× Amazon. Psychological endings: A$X9.95. Free-shipping threshold at A$60 is
built into the price architecture (see offers file).

**Returns handling:** 30-day guarantee, refund-without-return for items under ~A$20
(return postage costs more than the item — "keep it, gift it, we've refunded you" creates
fanatic word-of-mouth), photo-evidence replacement for damage/DOA, return-to-local
address (your address or a parcel locker) for higher-value items, never return-to-China
(customers won't, and it dies in customs).

**Shipping policy page:** state processing time (1–3 business days) separately from
transit time (6–12 AU), tracked always, what happens if lost (we reship or refund —
carrier problems are OUR problem, not yours), holiday cutoffs. Honesty here is the
cheapest retention tool that exists.

**Payments:** Shopify Payments (cards + Apple Pay + Google Pay) + PayPal (AU shoppers
expect it; enable despite the hold-period annoyance). Turn on Shop Pay. Later: Afterpay
(AU impulse-buy native). Set payout currency AUD; sell in AUD at launch (add USD/multi-
currency when targeting US in month 2–3).

**Order tracking:** Track123 or 17TRACK app (free tiers) → branded /pages/track page →
auto-emails on status change. Rename Chinese carrier checkpoints to neutral language
(both apps do this) — reduces "where is my order" tickets ~40%.

**Customer support:** support@whiskandwink.com via Gorgias (later) or plain Gmail +
Shopify Inbox (launch). Reply SLA 24h. Saved macros for: WISMO (where is my order),
returns, damage, cancellation. Tone: Mia's voice — helpful first, joke second. Every
angry customer gets solved *then* charmed, never charmed instead of solved.

**Automation targets:** auto-fulfilment (CJ/Zendrop push tracking automatically),
Klaviyo flows (set once), Track123 notifications, review requests (Judge.me auto-ask),
UpCart/checkout upsells (rule-based), social scheduling (Later/Buffer free tier).
Weekly human work at steady state: content creation, 30 min/day support, 30 min/day ad
checks, supplier QC pulse.

---

## 15. Launch checklist (zero → live, in order, dummy-proof)

**Phase 0 — Decisions (Day 1 morning)**
- [ ] Confirm brand name + buy whiskandwink.com and .com.au (~A$25/yr)
- [ ] Create brand email (Google Workspace A$9/mo or free Zoho at launch)
- [ ] Register socials: @whiskandwink on TikTok, IG, FB, Pinterest, YT (even unused ones)
- [ ] ABN registration (free, business.gov.au) — required for AU payments/tax

**Phase 1 — Store build (Days 1–4)**
- [ ] Shopify trial → Basic; connect domain; theme: **Dawn or Sense (free)** — do not buy
      a theme at launch
- [ ] Apply design system from `03-website.md` (colours, fonts, wink logo from Canva)
- [ ] Install: CJdropshipping, Judge.me (free), Klaviyo (free tier), Track123 (free),
      UpCart or similar upsell app (~A$15/mo, can wait a week)
- [ ] Import the 10 launch products; write pages from `04-product-pages.md`
- [ ] Build the 6 bundles from `05-offers-bundles.md` (Shopify native bundles or the
      bundle app's free tier)
- [ ] Create all pages: About, Meet the Sisters (with disclosure line), FAQ, Shipping,
      Returns, Contact, Track; generate + edit Privacy/Terms for AU consumer law
- [ ] Set shipping zones: AU free >A$60, A$7.95 flat under; configure taxes (GST if/when
      registered — see accountant note below)
- [ ] Enable Shopify Payments + PayPal + Shop Pay
- [ ] Install Meta Pixel + Conversions API, TikTok Pixel, GA4

**Phase 2 — Product & content (Days 3–10, overlaps)**
- [ ] Order samples of all 10 products to your address (~A$120 total, the best money
      you'll spend)
- [ ] Generate the sisters: lock character references, produce hero images, Meet-page
      images, and the first batch of 15 videos from `06-video-content-60.md` (concepts
      1, 3, 6, 8, 10, 17, 35, 47 first — the paid-ready ones)
- [ ] Shoot real sample footage when samples land; blend with AI-generated sister
      segments
- [ ] Reshoot/replace every supplier product photo
- [ ] Load welcome + abandoned-cart + post-purchase flows from `08-email-sms.md`

**Phase 3 — Pre-flight QA (Days 10–12)**
- [ ] Place a real test order end-to-end (then refund it): checkout, confirmation email,
      tracking page, upsell fire, pixel events (verify in Meta Events Manager + TikTok)
- [ ] Mobile audit: every page on an actual phone; LCP <2.5s (compress images)
- [ ] Legal audit: guarantee wording matches returns page; no fake reviews/timers
      anywhere; AI-disclosure line live on Meet page
- [ ] Soft-launch to friends/family list — first 5–10 real orders + honest feedback

**Phase 4 — Launch (Days 12–14)**
- [ ] Start posting organic: 1–2/day from the content batch
- [ ] Announce First 500 Winks to any pre-launch list
- [ ] Day 3 of organic: launch Meta testing campaign (A$30–40/day) with the 3 best
      organic performers; TikTok Spark Ads on anything that moved
- [ ] Daily rhythm begins: 30 min support / 30 min ads / post content / log numbers in a
      simple sheet (spend, orders, AOV, CPA)

---

## 16. Minimal-cost tool stack

**Must pay (launch):**
| Item | Cost |
|---|---|
| Shopify Basic | A$56/mo (or promo ~A$1 first months) |
| Domain(s) | ~A$25/yr |
| Product samples | ~A$120 one-off |
| Upsell app | ~A$15/mo |
| Canva Pro (brand kit + templates) | A$18/mo |
| AI image/video gen (Midjourney + one video tool tier) | A$30–60/mo |
| First ad budget (optional at day 1, needed by week 2) | A$300–600 for month 1 |
| **Total to launch** | **≈ A$300 without ads · A$600–900 with first ad month** |

**Free at launch:** Dawn/Sense theme, Klaviyo (to 250 contacts), Judge.me, Track123,
CJdropshipping, Meta/TikTok organic, CapCut (editing), Zoho mail, GA4, Shopify Inbox,
Later free tier, TikTok Creative Center research.

**Optional (skip until revenue):** paid product-research tools, Gorgias, SMS credits
(Klaviyo SMS — add ~month 2), Afterpay, paid theme, logo designer, Google Workspace.

**Do NOT waste money on:** paid "winning product" lists, store-setup gigs on Fiverr,
follower-buying, PR packages, paid theme/apps duplicating free ones, LLC/company
structures before revenue justifies it (ABN sole trader is fine to start — get
accountant advice once revenue is real), and >A$1k ad spend before a creative has
proven itself organically.

**Test-before-big-spend sequence:** organic views → (signal) → A$20–30/day Spark/Meta →
(CPA ≤ target on ≥5 sales) → scale 20–30%/48h. Never skip a gate.

---

## 17. First 30 days (day-by-day rhythm)

**Day 1 (setup day):** Phase 0 checklist + Shopify shell + socials registered.
**Days 2–7 (build week):** store build complete, samples ordered, sister assets
generated, 15 videos produced, flows live, QA test order. Start posting organic on day
5 even while polishing — the algorithm needs runway.
**Week 2 (launch week):** go live, First 500 Winks on, 1–2 posts/day, first Meta
campaign live day 3 of the week, first Spark Ad on best organic clip. Answer every
comment. Log every number.
**Weeks 3–4 (testing weeks):** 3 new ad creatives/week into test lane; kill by the rules
(`07-ads-and-organic.md`); first winner usually appears here — when a creative hits the
criteria, shift 60% of budget to it. Seed 10 micro-influencers. First bundle email
campaign. Review requests firing. End of month: full metrics review — CPA, AOV, best
product, best hook — and drop the 2 worst products from ads (keep listed).

**Month-1 success bar:** 30–100 orders, one creative with CPA ≤ A$25, AOV ≥ A$52,
≥25 organic posts live, ≥5 real reviews, zero unresolved support tickets >48h.

## 18. Days 31–90 (scale plan)

**Month 2 — scaling:**
- Double down on the winning product: 5 new creative variations of the winning hook,
  Advantage+ consolidation campaign, budget +20–30% per 48–72h while ROAS ≥ 2.
- Add retargeting campaign (audiences now big enough); launch SMS (Klaviyo SMS);
  broadcast channel on IG; TikTok Shop application.
- Catalogue: add products 11–12 + two new tests (validated by the same criteria);
  launch Kitchen Reset bundle to existing customers (email exclusive first).
- Ops: negotiate CJ private-line shipping + branded thank-you card insert (cheap,
  huge repeat-purchase lever); line up supplier #2 for the hero product.
- Content: pay the top 2–3 seeded creators; secure whitelisting; start weekly series
  properly ("Mum Reviews," "Tested So You Don't Have To").

**Month 3 — optimisation:**
- Kill the losers ruthlessly: product page test on hero (new gallery vs old — Shopify
  A/B via theme preview or Shoplift), AOV push to A$70 (tiered discounts + post-purchase
  upsell tuning), review count >100 sitewide.
- Margin work: private-label quote for hero product (custom colour + logo + box) at
  300–500 unit MOQ — decision point, not obligation; 3PL-in-AU evaluation for the hero
  SKU (2–4 day shipping unlocks a real competitive moat + higher prices).
- Expansion tests: US market ad set (USD pricing, US line from CJ), Pinterest ads
  small test for Q4 gift terms, Google Shopping on branded + "kitchen gadget" terms
  (A$10–15/day).
- **90-day success bar:** consistent 2.0+ blended ROAS, 300+ total orders, email/SMS
  ≥20% of revenue, hero product private-label decision made, repeat-purchase rate ≥8%.
