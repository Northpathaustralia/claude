# Minimum-Cost Launch Stack (AUD)

Three budget levels. Principle: one tool per job, free tiers where reliable, nothing that makes the product look cheap. Detailed month-one numbers in `month-one-budget.csv`; setup sequence in `tool-setup-order.md`.

## Level A — Bare-Minimum Validation (≈ A$45–95 month one, then ~A$25/mo)

Goal: waitlist live, content shipping, demand measured. No product backend.

| Job | Tool | Cost | Tier |
| --- | --- | --- | --- |
| Domain | echosight.ai via a mainstream registrar (or echosight.com.au fallback) | ~A$60–120/yr (.ai is pricier; **compulsory**) | Compulsory |
| Hosting (static site) | Cloudflare Pages or Netlify free tier | A$0 | Compulsory |
| Waitlist/contact form backend | Tally.so free or Formspree free (50 subs/mo) | A$0 | Compulsory |
| Email (receiving hello@) | Cloudflare Email Routing (forwards to Gmail) | A$0 | Compulsory |
| Analytics | none, or Cloudflare Web Analytics (cookieless) | A$0 | Recommended |
| Content scheduling | Meta Business Suite (free, IG+FB native) | A$0 | Recommended |
| Video generation | Higgsfield credits | ~A$130–250 for all 12; A$25–45 for first 2 videos only | Recommended (start with 2) |
| Design (carousels) | Canva free | A$0 | Recommended |
| Everything else | Defer | A$0 | Defer until revenue |

## Level B — Lean Professional Launch (≈ A$150–260 month one, then ~A$70–110/mo)

Everything in A, plus:

| Job | Tool | Cost | Tier |
| --- | --- | --- | --- |
| Sending email (waitlist broadcasts) | Resend free tier → Buttondown/MailerLite (~A$15/mo at 1k subs) | A$0–15/mo | Recommended |
| Full video month | All 12 Higgsfield packs | ~A$130–250 once | Recommended |
| Privacy-respecting analytics | Plausible (~A$14/mo) or keep Cloudflare free | A$0–14/mo | Recommended |
| Legal review (privacy policy, terms) | AU solicitor fixed-fee review of our drafts | ~A$800–1,500 once — **before charging money** | Compulsory before payments, defer before |
| Meta developer setup | Free (developer account + app) | A$0 | Compulsory for product beta |
| Monitoring (site up) | UptimeRobot free | A$0 | Recommended |

## Level C — Growth-Ready (adds ~A$150–400/mo, only at revenue)

Auth (Clerk free→paid), database (Neon/Supabase free→~A$40/mo), transactional email volume, Stripe (pay-per-use 1.7–3.5% + 30¢, no fixed cost), paid scheduling tool if Business Suite chafes (Metricool ~A$40/mo), support inbox (Plain/Intercom ~A$50+/mo), error monitoring (Sentry free tier fine for months), optional paid ads (never before organic signal; A$300/mo starter cap if used).

## Explicit non-purchases (and why)

- **No paid scheduler at launch** — Business Suite covers IG; TikTok/Shorts are manual-post (10 min/day).
- **No Intercom/website-chat** — email + Discord until support volume forces it.
- **No SEO tools** — Search Console is free and sufficient pre-launch.
- **No paid stock/music subscriptions** — style bible uses ambient/foley and CapCut's licensed library.
- **No LLC-in-Delaware nonsense** — Australian Pty Ltd when incorporating (ASIC ~A$597 + ~A$310/yr review fee), timed with legal review, not before validation.
