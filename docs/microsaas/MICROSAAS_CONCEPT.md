# Trustloop — a micro-SaaS built from the prompt

> *"Act as a senior SaaS founder and developer. Create a complete micro-SaaS idea that
> solves a real problem, can be built without coding, and has realistic potential to
> generate recurring revenue. Give me the product concept, target audience, features,
> free tools to build it, monetization model, and a step-by-step launch plan."*

This document is the direct answer to that prompt. A working reference build of the
product sits in [`/microsaas`](../../microsaas/README.md); it was then adversarially
reviewed in [`RED_TEAM_AUDIT.md`](./RED_TEAM_AUDIT.md) and
[`COUNCIL_REVIEW.md`](./COUNCIL_REVIEW.md), and the findings from both were fixed
before this was called done.

## 1. Product concept

**Trustloop** is a feedback-and-reputation funnel for small, local service businesses
(mortgage brokers, dentists, physios, tradies, salons, cafés). The owner puts one link
or QR code in front of every customer after a job/appointment. It:

1. Always shows a one-tap link to leave a public Google review.
2. Also offers a private feedback form, so unhappy customers are heard before they
   vent somewhere public.
3. Rolls every response into a simple dashboard: average rating, response trend, an
   alert queue for anything below a threshold the owner sets, and one-click CSV export.

**The real problem it solves:** most local businesses live or die by their Google star
rating, but asking for reviews is manual, inconsistent, and owners have no way to
intercept a bad experience before it becomes a public 1-star review. Off-the-shelf
tools that do this (Podium, Birdeye, NiceJob, Broadly) are built for franchises and
priced at $100–400/month — priced out of reach for a two-person mortgage broking shop
or a single-chair barber.

**Why now, why buildable:** the mechanism is simple enough to prototype with forms and
spreadsheets, has a short path to a first paying customer (one local business owner,
one conversation), and doesn't require novel technology — the edge is in productising
something every local business owner already does badly by hand.

## 2. Target audience

- **Primary:** solo-to-5-staff local service businesses where reputation drives
  bookings — mortgage/finance brokers, real estate agents, allied health (physio,
  dental, chiro), trades (electricians, plumbers), salons/barbers, cafés and
  restaurants.
- **Buyer:** the owner-operator, not a marketing department. They're not shopping for
  "reputation management software" — they're trying to stop losing bookings to the
  competitor down the road with 4.8★ and 200 reviews.
- **Beachhead:** mortgage and finance brokers first — a vertical with a clear
  compliance angle (see §6), high customer lifetime value per referral, and a network
  James already has direct access to for the first 5–10 pilot customers.

## 3. Features (MVP, matches the reference build)

| Feature | Why it matters |
| --- | --- |
| One feedback link/QR per business | Zero-friction ask after every appointment. |
| Public Google-review CTA shown to **every** customer | Not gated by rating — see §6, this is a hard compliance requirement, not a nice-to-have. |
| Private feedback form (rating + comment + optional contact) | Catches unhappy customers before they post publicly. |
| Owner alert queue | Surfaces anything at/below a configurable rating threshold, sorted newest first. |
| Dashboard stats | Response count, average rating, sentiment split, total Google-review clicks. |
| CSV export | Owners already live in spreadsheets; don't force them into a new tool for reporting. |
| PIN-gated dashboard | Baseline access control — flagged in the audit as demo-only, not production auth. |

**Deliberately not in the MVP** (roadmap, not missing): multi-location support,
automated SMS/email sending, staff-level leaderboards, white-labelling. Ship the core
loop to 5 paying customers before building for scale.

## 4. Free tools to build it — the no-code path

A non-technical founder can stand this up without writing code:

| Layer | Free tool | Role |
| --- | --- | --- |
| Feedback form | **Tally.so** or **Typeform** (free tier) | Captures rating + comment + contact. |
| Data store | **Google Sheets** | One row per response; the source of truth. |
| Routing/automation | **Zapier** or **Make.com** (free tier) | New form response → append row to Sheet → if rating ≤ threshold, send owner an email/Slack alert. |
| Public-facing page | **Carrd** ($19/yr) or **Softr free tier** | The branded "Share your experience" page with the link/QR + Google review button. |
| QR codes | **qr-code-generator.com** (free) | Printable QR for the counter/invoice. |
| Billing (once paying customers exist) | **Stripe** (free to integrate, pay-per-transaction only) | Subscription billing. |
| Landing page / waitlist | **Carrd** + **Google Forms** | Validate demand before building anything. |

This no-code stack is capped at a handful of customers (Zapier's free tier throttles
volume, Sheets doesn't scale past a few hundred rows cleanly) — which is fine. The
[`/microsaas`](../../microsaas/README.md) folder in this repo is the **coded v2
reference implementation** to migrate to once the no-code MVP has proven 5–10 people
will pay, per the industry-standard "de-risk with no-code, then rebuild" playbook.

## 5. Monetization model

Flat monthly SaaS subscription, month-to-month (no lock-in — see §6 on unfair
contract terms exposure):

| Tier | Price (AUD/mo) | Includes |
| --- | --- | --- |
| Starter | $19 | 1 location, unlimited responses, email alerts, CSV export |
| Growth | $49 | Up to 5 locations, priority (SMS) alerts, click analytics |
| Agency | $149 | Unlimited locations, white-label domain, client sub-accounts (for brokers/agencies managing reviews across a franchise network) |

**Reality check on revenue:** competitors charge $100–400/mo and serve franchises;
Trustloop is priced for the underserved solo/small-operator segment. 100 customers on
a blended ~$35/mo average is ~$3,500 MRR / ~$42k ARR — a realistic 12-month target for
a single-founder, no-code-first micro-SaaS, not a venture-scale outcome.

**Stated assumptions behind that number** (added after council review — see
`COUNCIL_REVIEW.md`, Skeptical CFO): self-serve SaaS at this price point in the
local-services segment typically churns 3–5%/month without a success touchpoint. At
4% monthly churn, holding 100 customers flat requires acquiring ~4 new customers every
month indefinitely — which is what the referral loop in step 7 of the launch plan
needs to actually deliver, not just gesture at. No CAC figure is assumed yet because
no acquisition channel has been paid-tested; that's a gap to close during the pilot,
not before it. Treat the $42k ARR figure as the ceiling of a clean scenario, not a
forecast.

## 6. Compliance notes that shaped the build (Australia-specific)

These came out of the red-team/council process and are baked into the product design,
not bolted on after:

- **Google's review-gating policy** explicitly prohibits selectively routing only
  happy customers to a public review link. Trustloop shows the Google review button to
  **every** customer, unconditionally, before and after they submit private feedback —
  the reference build has an automated test asserting this (`verify` script, see
  `RED_TEAM_AUDIT.md` §1).
- **Spam Act 2003 (Cth):** any future automated SMS/email "ask for a review" send needs
  explicit consent capture and a functional unsubscribe — not built in the MVP
  (nothing is auto-sent), called out as a hard requirement before that feature ships.
- **Privacy Act 1988 / Australian Privacy Principles:** the tool collects customer
  name/contact/feedback text — real production use needs a privacy policy, a stated
  retention period, and a way for a customer to request deletion. The reference build
  is explicit that it's a local-browser demo, not a compliant data processor, precisely
  so it isn't mistaken for one (see banner in the app itself).
- **Unfair contract terms (ACL, extended Nov 2023):** month-to-month pricing with no
  lock-in avoids the small-business unfair-contract-terms exposure that long lock-in
  SaaS contracts now carry meaningful penalties for.

## 7. Step-by-step launch plan

1. **Week 1–2 — Validate.** 15 conversations with local business owners (mortgage
   brokers first, via James's existing network). Confirm the problem ("I know I should
   ask for reviews but don't") and willingness to pay $19–49/mo. **Bar for passing
   this step (added after council review — see `COUNCIL_REVIEW.md`, Growth
   Marketer): at least 3 of the first 5 pilot businesses put down a deposit or
   pre-payment, not a verbal yes.** Verbal commitment is nearly free to give and has
   killed ideas in this repo before by looking like validation when it wasn't. Kill
   the idea here if that bar isn't met.
2. **Week 2–3 — No-code MVP.** Build the Tally + Sheets + Zapier + Carrd stack from §4
   for one pilot business. Total cash cost: under $30.
3. **Week 3–6 — Manual pilot.** Onboard 5 businesses free for 30 days in exchange for a
   testimonial/case study and honest feedback on the flow.
4. **Week 6 — Turn on billing.** Introduce the three tiers from §5, grandfather pilot
   users at a discount, wire up Stripe.
5. **Week 6–10 — Narrow, then expand.** Direct outreach into the mortgage/finance
   broker vertical (using the compliance angle as a selling point — "review requests
   your compliance team won't flag"), then widen to adjacent verticals (allied health,
   trades) once the pitch is proven.
6. **~20 paying customers — Rebuild in code.** Replace the Zapier/Sheets layer with a
   real backend (the `/microsaas` folder in this repo is that reference
   implementation: same UX, same logic, ready to plug into a real database and auth
   provider instead of `localStorage`).
7. **Ongoing — Referral loop.** Every satisfied Trustloop customer is, by definition, a
   business with a stream of happy customers — ask them to refer one other local
   business owner for a free month. Compounding, on-brand growth channel.

## Known limitation, stated plainly

The click-through metric in the dashboard ("Total Google review clicks") counts clicks
on the review link, not clicks ÷ page visits — this prototype deliberately does not
track anonymous page visits, because doing so without a stated privacy notice would
itself be a compliance problem. A true click-through rate needs a privacy-compliant
visit counter, which is a v2 item, not a v1 corner cut silently.
