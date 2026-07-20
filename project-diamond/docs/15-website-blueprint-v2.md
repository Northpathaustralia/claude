# 15 — Website Blueprint v2 (Phase 2 additions)
Extends doc 05 (unchanged). The prototype in `website/` now implements the full experience: index, shop, product, about, faq, contact, shipping, returns, privacy, checkout, thank-you + shared `style.css`/`site.js` (cart drawer with order bump and free-shipping bar, sticky ATC, exit-intent, variant selection, scroll-reveal). Verified rendering at 1280px and 390px.

## Meta titles & descriptions (implemented in prototype `<head>`)
| Page | Title (≤60ch) | Description (≤155ch) |
|---|---|---|
| Home | Evenfall — Magnesium Bath Ritual, Made in Australia \| The Night, Reclaimed | Premium magnesium bath ritual with Tasmanian botanicals. 12 rituals per jar, same-day dispatch from Melbourne. |
| PDP | The Deep Soak — Magnesium Bath Flakes with Tasmanian Botanicals \| Evenfall | Pharmaceutical-grade magnesium chloride with kunzea, lavender, cedarwood. 12 rituals. 60-Night Guarantee. $64. |
| Shop | Shop the Ritual — Bath Soaks, Mists & Gift Sets \| Evenfall | The full evening ritual: Deep Soak, Night Mist, Night Balm, Evening Tea, refills, gift sets. |
| About | Our Story — Why Evenfall Exists \| Evenfall | It began with a fight about a candle. Made in Melbourne, scented in Tasmania — the honest evening-ritual brand. |
| FAQ | FAQ — Honest Answers About the Ritual \| Evenfall | Absorption science, tub staining, pregnancy, no-bathtub options, shipping, the 60-Night Guarantee. |
| Contact / Shipping / Returns / Privacy | per-page, implemented | per-page, implemented |
Checkout & thank-you: `noindex`.

## Luxury interaction & animation spec (implemented / for production build)
- **Scroll behaviour:** sections fade-rise 24px over 700ms on first entry (IntersectionObserver, `.reveal`); disabled under `prefers-reduced-motion`. Never parallax the hero text; the gradient film loop (production: 6s dusk/steam loop, poster-first) is the only moving background.
- **Micro-interactions:** buttons invert on hover over 250ms; product cards lift 4px with a soft 40px shadow; accordion +/– glyph in brass; variant cards get inset ring on selection; cart drawer slides 350ms ease with dimmed overlay.
- **Restraint rules:** one animation type per viewport; nothing autoplays with sound; no scroll-jacking; exit-intent fires once per session, desktop only, ≥20s dwell (implemented in `site.js`).

## Lifestyle imagery shot list (production)
1. Hero film: bath filling at dusk, steam through last light, hand pours scoop (6s loop). 2. Jar weight-in-hand, thumb on wood lid. 3. Petals surfacing, top-down. 4. Bath edge still-life: jar, book, brass thermometer. 5. Foot-basin + novel + lamp (apartment context). 6. Unboxing sequence: seal → tissue → Rest Note. 7. Texture macro: crystals on stone. 8. Tasmanian distiller environmental portrait. 9. "After" mood: made bed, mist bottle on nightstand. 10. Gifting flat-lay, Mother's Day variant. All at dusk grade per brand guide; no faces in hero shots (viewer projects themselves).

## Performance & image optimisation
Targets unchanged (LCP <2.0s, CLS <0.1). Production: AVIF with WebP fallback, `srcset` at 480/960/1440, hero `fetchpriority=high` + poster-first video, lazy-load below fold, font subset + `font-display: swap`, JS <30KB (prototype `site.js` is 4KB), max 6 Shopify apps, quarterly Lighthouse audit gate ≥90 mobile.

## Schema markup (implemented in prototype)
Organization (home) · Product + Offer + AggregateRating (PDP) · FAQPage (FAQ). Production adds: BreadcrumbList, Article (Journal), sitewide SearchAction. Rule: AggregateRating only once genuine review count exists — prototype numbers are placeholders and must be replaced at launch.

## Analytics implementation plan
- GA4 via GTM: `view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, plus custom `bump_accepted`, `upsell_accepted`, `exit_capture`, `bedtime_saved`.
- Meta Pixel + CAPI (server-side via Shopify native), TikTok pixel, Pinterest tag — all behind consent mode.
- Klaviyo onsite tracking for browse-abandonment triggers.
- Dashboards per doc 10; source of truth for revenue = Shopify, for attribution = Triple Whale blended MER (never platform-reported ROAS alone).

## Checkout & post-purchase (implemented as mock)
Express wallets above form · address autocomplete noted · SMS + gift options as checkboxes · order summary with bump line · trust row · thank-you page: one-click 30%-off second jar (this-page-only), ritual film, bedtime capture, $15/$15 referral.
