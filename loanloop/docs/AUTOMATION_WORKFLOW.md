# Automation workflow — how it runs with (near) zero human involvement

Every step below uses a free or freemium tier. Nothing here requires a backend server the operator
has to babysit — everything is either static hosting, a serverless function, or a no-code
automation.

```
Visitor on broker's site
        │  fills in calculator, submits
        ▼
 loanloop.js (static, CDN-hosted)
        │  POSTs lead JSON over HTTPS
        ▼
 Serverless webhook function            <- server/webhook-function.js (reference implementation)
 (Cloudflare Workers free tier, or
  Netlify Functions free tier)
        │
        ├──▶ Google Sheet (via Apps Script Web App, free) — the "database"
        │        one row per lead, one tab per broker
        │
        ├──▶ Email to the broker (Resend free tier: 3,000 emails/mo, or
        │     EmailJS free tier: 200 emails/mo) — "New lead: Jane Smith, $575k–$745k"
        │
        └──▶ Email/SMS confirmation to the lead (same sender) — builds trust,
              nudges them toward booking a call
        │
        ▼
 Broker dashboard (static page reading the Google Sheet via its published
 CSV/JSON endpoint, or upgraded later to a small API) — no login system
 needed for MVP; a per-broker unguessable dashboard URL is enough for v1.
        │
        ▼ (optional, Growth plan)
 Zapier / Make.com free tier (100 tasks/mo on Zapier free, 1,000 ops/mo on
 Make free) — broker connects their own CRM (HubSpot free tier fits the
 existing NPAOS CSV schema) or calendar (Cal.com free) with no code.
```

## Why each choice keeps human involvement near zero

- **Hosting (Netlify or Cloudflare Pages, free tier):** deploys on every git push; no server to
  patch or restart.
- **Serverless webhook function (free tier, generous request quotas):** scales to zero, no idle
  cost, no server to monitor.
- **Google Sheets as the database:** the broker can eyeball their own leads without a login system
  being built; Apps Script Web Apps are free and don't expire.
- **Resend/EmailJS free tier:** transactional email with no SMTP server to run.
- **Stripe Checkout + Customer Portal:** subscriptions, upgrades, downgrades, cancellations and
  invoicing are entirely self-serve for the broker — the operator never manually processes a
  payment (see `MVP_LAUNCH_STEPS.md` for exact setup).
- **Stripe webhook → the same serverless function → updates the broker's plan/lead-cap in the
  Sheet:** so plan enforcement (e.g. Free tier's 20-lead cap) is automatic, not manually tracked.

## Where a human is still needed (by design, not accident)

- **Approving new sign-ups is not needed** — genuinely self-serve — but **responding to support
  requests** and **occasionally reviewing flagged content** (a broker's custom headline that trips
  the compliance guard) is manual by design: automatically *rejecting* a compliance violation with
  no appeal path is worse than a human glancing at an email once a week.
- **Weekly health check:** confirm the webhook function, email sender and Stripe webhook are all
  still green (a 10-minute task, not "minimal" in the literal-zero sense, but realistic).

## Reference implementation

`server/webhook-function.js` in this repo is a framework-agnostic reference handler (works as a
Cloudflare Worker or Netlify Function with minimal adaptation) showing: request validation, origin
allow-listing, plan-cap enforcement, and fan-out to the sheet + email steps above. It is not
deployed (it needs the operator's own free-tier account credentials as environment variables) —
see `MVP_LAUNCH_STEPS.md` for the exact deploy steps.
