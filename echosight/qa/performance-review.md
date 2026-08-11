# Performance Review — 21 July 2026

## Measured (local server, headless Chromium — see method note)

- **Lighthouse Performance: 100** on index, pricing, demo.
- **Total site weight: 552KB for all 31 pages** including the OG image (~200KB PNG) and favicon — i.e. typical page payload is ~15–30KB of HTML + 12KB shared CSS + 3KB shared JS.
- **Zero external requests**: no fonts fetched (system stack), no CDNs, no third-party scripts. Nothing to block render.
- No render-blocking beyond the single small stylesheet; JS is deferred-equivalent (end-of-body, no layout work on load).

## Method note (honest)

Local-server numbers exclude real-world network latency and CDN behaviour. However, the dominant real-world variables (payload size, request count, third-party scripts, main-thread work) are all measured properties of the artefact itself and are near-floor. Post-deploy verification on the live URL is a NEXT-7-DAYS item; regressions would have to be introduced by the host, not the site.

## Performance properties by construction

| Property | Value |
| --- | --- |
| External requests | 0 |
| Fonts | System stack (zero font bytes, zero FOUT) |
| JS on generated pages | 3KB shared (menu, reveal, forms, consent) |
| Largest asset | og.png (~200KB, only fetched by link-preview scrapers, not page loads) |
| Animation cost | CSS transforms/opacity only; IntersectionObserver reveals; no scroll listeners |
| Caching posture | Static files — host default immutable caching applies; no cache-busting complexity needed at this scale |

## Watchpoints for later

1. When real product screenshots/video replace CSS mocks, budget: hero media ≤ 200KB, lazy-load below-fold imagery (`loading="lazy"` already the pattern to use).
2. If a form service script is embedded (vs. the `data-endpoint` POST approach), it becomes the first third-party request — prefer the endpoint approach to keep the zero-third-party property.
3. Consent-gated analytics adds one script maximum; Cloudflare cookieless keeps it beacon-only.
