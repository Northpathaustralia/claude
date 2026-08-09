# STILLUP — Product Spec (v1)

Idea #2 from the founder's task list: *"Find a simple software tool people would actually pay
for every month. Design the entire product from scratch — core features, user flow, pricing,
landing page copy, monetization strategy. Prioritize a product that can be built for free and
requires minimal maintenance after launch."*

**The category:** uptime / status-page monitoring. It's a proven, evergreen SaaS category
(UptimeRobot, Better Uptime, Checkly, Pingdom) with real monthly payers, a simple mental model,
and a natural free→paid ceiling that doesn't require a hard paywall or dark patterns to justify.

**What's built right now:** a fully working, free, client-side app (`/stillup`) — landing page,
pricing page, and a dashboard that adds monitors, runs real reachability checks from the
browser, computes uptime %, and exports a static status page. Zero backend, zero hosting cost,
zero ongoing maintenance beyond the code itself. This is genuinely useful today, not a mockup.

**What's *not* built:** the paid "Pro" server-side tier (24/7 checking, real HTTP status codes,
SSL/domain expiry, email alerts, billing). The pricing page says so explicitly and does not
collect payment — see [Compliance notes](#compliance-notes) for why that matters.

---

## 1. Core features

### Free tier (live today, `/stillup`)

| Feature | How it works |
| --- | --- |
| Add a monitor | Paste any `http(s)` URL (+ optional name). Validated client-side; only http/https accepted. |
| Reachability check | Browser `fetch(url, { mode: 'no-cors' })` with an 8s timeout. Resolves = "up" (network request completed), throws/times out = "down". |
| Auto-check | Optional toggle re-checks every monitor every 60s while the dashboard tab is open. |
| Uptime % | `successful checks / total checks`, per monitor, over up to the last 500 checks. |
| Response time | Average round-trip time of successful checks. |
| Incident log | Every down→up and up→down transition, with start time and duration (or "still down" if open). |
| Status page export | One click generates a self-contained, styled `status.html` file — host it anywhere (GitHub Pages, your own domain, a client's server). It's a snapshot, not live; re-export to refresh. |
| Local-only storage | Everything lives in `localStorage` under `stillup.v1`. No account, no server, no analytics. |

### Pro tier (roadmap, not built — see [Section 4](#4-production-architecture-for-pro-not-yet-built))

- Checks continue while the browser is closed (server-side cron).
- Real HTTP status codes (not just reachability) — requires a server, since CORS blocks this from a browser.
- SSL certificate and domain expiry alerts — no browser API can read this for third-party sites.
- Email alerts within 60 seconds of a failure.
- Hosted, always-current public status page (no manual export/re-upload).
- Unlimited monitors (free tier is capped at 5 to keep the browser-only history bounded and useful).

---

## 2. User flow

**First-time visitor → active user (free tier), target: under 60 seconds.**

1. Lands on `/` (marketing page). Reads the one-sentence pitch and the honest "what this can/can't
   do" section.
2. Clicks **"Start monitoring — free"** → `/app` (no signup gate).
3. Pastes a URL, optionally names it, clicks **Add monitor** → first check runs immediately.
4. Sees status (Up/Down), uptime %, response time. Turns on **auto-check** to keep a running
   history while they work.
5. Adds up to 4 more monitors (free tier cap).
6. When ready to share status externally, clicks **Export status page** → downloads `status.html`
   → uploads it to their own host (GitHub Pages, Netlify drop, cPanel, wherever).
7. Returns later; data is exactly as they left it (localStorage persists across sessions on the
   same browser/device).

**Conversion moment (Pro, once built):** the user hits the 5-monitor cap, or closes their laptop
and misses an outage because auto-check paused, or wants a status page that updates itself. That
ceiling is disclosed on the landing page *before* they hit it — nobody discovers it as a bait-
and-switch.

---

## 3. Landing page copy

Live at `/stillup/index.html` → `Landing.jsx`. Structure: hero → feature grid → "how it works"
(3 steps) → an explicit "what free can/can't do" comparison (the honesty section — see
[Compliance notes](#compliance-notes)) → FAQ → closing CTA. Full copy is in
`stillup/src/pages/Landing.jsx`; pricing copy is in `stillup/src/pages/Pricing.jsx`.

---

## 4. Production architecture for Pro (not yet built)

Documented here so it can be built later without re-deriving the design. All choices are
free-tier-first, matching the "build for free, minimal maintenance" brief:

| Layer | Service (free tier at small scale) | Why |
| --- | --- | --- |
| Scheduled checks | Cloudflare Workers Cron Triggers, or GitHub Actions scheduled workflow | Runs server-side, so real status codes and no CORS limitation; free tier covers thousands of checks/month. |
| Data store | Supabase (Postgres) or Cloudflare KV/D1 free tier | Monitor list, check history, incident log per account. |
| Auth | Supabase Auth (email magic link) | No password storage/rotation to maintain. |
| Alert email | Resend or Postmark free tier (~100–3,000 emails/mo) | Transactional only — outage alerts, not marketing. |
| Billing | Stripe Checkout + Customer Portal | Handles card storage, dunning, cancellation — nothing custom to build or secure. |
| SSL/domain expiry | Server-side TLS handshake inspection (`tls.connect` in a Node/Workers runtime) + WHOIS/RDAP lookup | Not possible from a browser; trivial server-side. |
| Status page hosting | Static export to Cloudflare Pages / Vercel per account, or a shared multi-tenant route | Keeps hosting cost near zero even with many customers. |

Estimated infra cost at low scale (few hundred monitors, checked every 5 minutes): **$0/month**
across the free tiers above. First real cost shows up around the point where volume alone would
justify the $7/mo subscription many times over.

---

## 5. Pricing & monetization strategy

- **Free: $0/forever.** Real value on its own (see Section 1) — not a crippled trial. This is
  the acquisition funnel; people convert themselves by outgrowing it, not by being blocked.
- **Pro: $7/month flat**, unlimited monitors. Flat-rate, not usage-metered — simple to budget,
  no surprise bill for adding a sixth monitor. Priced under the $9–15/mo most competitors charge
  for an equivalent single-user tier, since running cost stays near $0 at this scale (Section 4).
- **No annual-only pricing, no forced multi-seat minimums, no fake urgency countdown.** The
  target buyer is a solo founder or small team — friction in the pricing page is friction in
  revenue.
- **Revenue math (illustrative, not a forecast):** at $7/mo, 100 paying customers ≈ $700 MRR
  against near-zero infra cost — the entire margin is the founder's time to build and support it.
  Growth is expected to come from the free tier's built-in distribution: every exported status
  page footer credits StillUp (see `stillup/src/lib/statusPage.js`), so shared/public status
  pages are a passive acquisition channel.

---

## 6. Compliance notes

- **No fabricated claims.** The landing page does not claim 24/7 monitoring, real HTTP status
  checking, or SSL monitoring for the free tier — because it can't do those things from a
  browser. This is stated plainly in a dedicated "what this can/can't do" section rather than
  buried in fine print.
- **No fake checkout.** The Pro tier is clearly labeled "Coming soon" and the pricing page CTA
  is a waitlist scroll, not a payment form. Collecting money (or even an email address framed as
  a purchase) for a feature that doesn't exist yet would be deceptive; StillUp explicitly says
  so in its own copy ("We're not going to show you a checkout form before there's a server behind it").
- **No fabricated testimonials, logos, or customer counts.** None appear anywhere in the copy.
- **Privacy policy matches reality.** `stillup/src/pages/Legal.jsx` describes exactly what the
  free tier does (nothing leaves the browser except the direct reachability request to the
  monitored URL itself) and commits to updating the policy before Pro ever collects account data.
- **Terms of use caps check frequency at once per minute per monitor**, specifically to prevent
  StillUp itself being used as a denial-of-service tool against a target URL.
- **Input validation prevents scheme injection.** `parseMonitorUrl()` only accepts `http(s)://`
  URLs — `javascript:`, `data:`, and other schemes are rejected before ever reaching `fetch()`.
- **Exported status pages escape all user-entered text** (monitor name/URL) before interpolating
  into HTML, so a monitor named `<script>...</script>` can't inject into the exported file.

---

## 7. Repo layout

```
stillup/
  vite.config.js              dev/production build (→ stillup/dist)
  vite.standalone.config.js   single-file build (→ release/StillUp.html)
  src/
    lib/monitor.js            pure functions: URL validation, ping, uptime math, incidents
    lib/storage.js            localStorage load/save (versioned key stillup.v1)
    lib/statusPage.js         exported static status-page HTML builder (escapes user input)
    context/MonitorsContext.jsx  React state + actions (add/remove/check monitors)
    components/               Nav, Footer, shared ui.jsx primitives
    pages/                    Landing, Pricing, Dashboard, Legal (Privacy/Terms)
tests/stillup-monitor.test.js  unit tests for the monitoring engine (node --test)
```

Run it: `npm run stillup:dev` (dev server), `npm run stillup:build` (production build),
`npm run stillup:build:standalone` (single-file `release/StillUp.html`), `npm test` (full repo
test suite, includes StillUp's).
