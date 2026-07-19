# 05 — Website Specification
Platform: Shopify (Online Store 2.0, custom theme on "Prestige"-class base or headless later). Domain: evenfall.com.au.

## Architecture & navigation
```
Home
├── Shop (collection) ── The Deep Soak (PDP, hero) · Night Mist · Night Balm · Evening Tea · Ritual Set · Refills · Objects
├── The Ritual (how-to / editorial anchor page)
├── Our Story (About)
├── Journal (SEO blog)
└── Utility: FAQ · Shipping · Returns · Privacy · Terms · Contact
```
Header: logo centre (mobile) / left (desktop); links: Shop, The Ritual, Our Story, Journal; icons: search, account, cart (slide-out drawer). Announcement bar: single rotating line ("Free AU shipping over $80 · Dispatched same day from Melbourne").

## Page-by-page CRO spec

**Home** — section order (mobile-first):
1. Hero: full-bleed dusk film loop (bath steam, last light), H1 + one CTA ("Begin the ritual"). No carousel.
2. Social proof strip: press/review stars + "12,000 nights reclaimed" counter.
3. Hero product block: jar on stone, price, 3 benefit bullets, Add to Cart in-line.
4. "The Ritual in 3 steps" (draw → pour → 20 minutes) — illustrated, 3 cards.
5. Ingredient provenance map (Tasmanian kunzea etc.) — differentiation.
6. Honest-science block ("What a bath can and can't do") — objection pre-empt, trust spike.
7. Reviews (photo-first, 3 visible).
8. Ritual Set gifting block.
9. Journal teaser + email capture ("The Rest Notes — one calm email a week").
10. Footer.

**PDP (The Deep Soak)** — conversion page rules:
- Above the fold (mobile): gallery (jar, texture macro, in-bath, unboxing, dose scoop), title, stars + count, price + Afterpay line, variant (one-time / subscribe-save 15%), sticky ATC.
- Below: benefit bullets → sensory description → "12 rituals per jar = $5.30 a night" value math → ingredients (full INCI + plain-English) → honest-science accordion → how-to (incl. foot-soak) → reviews with photos → FAQ accordion → cross-sell (Mist/Balm) → guarantee banner.
- Order bump in cart drawer: Night Balm $19. Free-shipping progress bar. Express pay (Shop Pay/Apple Pay/PayPal) above fold in checkout.

**Other pages:** About = founder letter + provenance + values (link from PDP trust row). FAQ = mirrors objection matrix (04). Shipping/Returns = plain-English tables, 60-night guarantee. Thank-you page = ritual onboarding video + referral offer ("Give $15, get $15").

## UX / design system
- Aesthetic per brand guide: bone ground, ink text, dusk imagery; max content width 1200px; 8pt spacing grid; buttons: ink fill, bone text, subtle 200ms ease; no popups in first 20s (exit-intent email capture only, desktop).
- Mobile: thumb-zone CTAs, sticky ATC, tap targets ≥44px, gallery swipe with dots.

## Performance
LCP < 2.0s on 4G (hero as AVIF/WebP + poster-first video), CLS < 0.1, lazy-load below fold, font subsetting + `font-display: swap`, no app-bloat (audit monthly; max 6 Shopify apps).

## Accessibility
WCAG 2.2 AA: contrast ≥ 4.5:1 (ink on bone passes), focus states visible, alt text with sensory description, reduced-motion media query disables film loop, forms with labels + error text, semantic landmarks.

## SEO structure
- Home: "magnesium bath soak Australia" (secondary; brand primary).
- PDP: "magnesium bath flakes" / "sleep bath soak" — Product schema + review stars.
- The Ritual page: "night routine ideas" / "how to wind down before bed" (top-funnel magnet).
- Journal clusters: sleep rituals, bath science honesty, Australian botanicals, gifting guides. Internal links journal → The Ritual → PDP. FAQ schema on FAQ page; Organization + LocalBusiness schema; clean `/products/deep-soak` URLs.

## Checkout optimisation
Shopify checkout + Shop Pay; express wallets on step 1; address autocomplete; trust row (60-night guarantee · AU-made · secure checkout); post-purchase one-click upsell (second jar −30%); order-status SMS opt-in.

## Analytics & testing
GA4 + Meta CAPI + Klaviyo events; north-star: session→purchase CVR (target ≥ 2.8% blended, ≥ 4% on PDP traffic from email). A/B roadmap (priority order): hero CTA copy → PDP gallery first-frame → subscribe-first vs one-time-first ordering → bump price $19 vs $24.
