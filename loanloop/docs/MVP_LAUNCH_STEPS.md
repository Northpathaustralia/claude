# Exact steps to launch the MVP

Everything in `loanloop/widget/` and `loanloop/site/` already works today as static files (see
`README.md` for how to run it locally). These are the remaining steps to take it from "working
demo in this repo" to "live product a broker can actually use," using only free/freemium tools.
None of these steps have been performed by this build — they require the operator's own accounts.

## 1. Hosting (10 minutes)

1. Create a free Netlify or Cloudflare Pages account.
2. Connect this GitHub repo, set the publish directory to `loanloop/site` and add
   `loanloop/widget` as a second published path (or copy `widget/*` into `site/` at deploy time —
   both are static assets, no build step required).
3. Point a subdomain (e.g. `app.loanloop.example`) at the deployment. A domain is the one line
   item here that isn't free — everything else is.

## 2. Lead intake backend (20–30 minutes)

1. Create a free Google Sheet: one tab per broker (or one tab with a `brokerId` column — simpler
   for MVP). Publish it via **Apps Script → Deploy → Web app** to get a POST-able URL.
2. Create a free Cloudflare Workers (or Netlify Functions) project. Adapt
   `server/webhook-function.js`'s `handleLead` using the Cloudflare Worker example at the bottom
   of that file — inject `getBrokerPlan`/`appendLeadRow`/`sendBrokerNotification` implementations
   that call the Apps Script URL from step 1.
3. Sign up for Resend (free tier, 3,000 emails/mo) or EmailJS (free tier, 200 emails/mo) for the
   broker-notification and lead-confirmation emails.
4. Set the webhook URL as the `data-webhook` attribute in each broker's embed snippet (the signup
   flow in `site/signup.html` already has a placeholder for this — swap the demo fallback for a
   real default webhook URL once step 2 is live).

## 3. Billing (15 minutes)

1. Create a free Stripe account, add the Pro ($49/mo) and Growth ($99/mo) products as recurring
   prices.
2. Use **Stripe Checkout** (hosted, no custom payment form needed) linked from the pricing section
   of `site/index.html`.
3. Add a Stripe webhook (same serverless function project as step 2, a second route) that updates
   the broker's plan in the Google Sheet on `checkout.session.completed` /
   `customer.subscription.deleted`.
4. Point brokers to the **Stripe Customer Portal** (built into Stripe, free) for self-serve
   upgrades/downgrades/cancellations — no manual billing admin required.

## 4. Replace the demo sign-up with the real one (15 minutes)

`site/signup.html` currently stores the new broker to `localStorage` only, so the whole product
loop is demonstrable with zero backend. To go live: point the form's submit handler at a small
serverless endpoint that writes the broker row to the same Sheet from step 2 (id, business name,
email, plan = free, primary color, headline — same fields already collected) instead of
`localStorage`. Everything downstream (embed snippet generation, dashboard) is unchanged.

## 5. Compliance sign-off (before any real traffic)

Read `COMPLIANCE_AND_PRIVACY.md` in full and, given this touches consumer credit and personal
information in Australia, have an actual lawyer or compliance consultant confirm the general-advice
positioning before onboarding a paying broker. This is flagged again in `RED_TEAM_AUDIT.md` as the
one step that must not be skipped or treated as optional.

## 6. Soft launch

1. Embed the widget on one real site first (ideally James' own NorthPath site, or a friendly
   broker in the referral network) and watch it end-to-end for a week.
2. Then run `ACQUISITION_STRATEGY.md` step 2 (warm network) before anything public.

## Total cost to reach a live MVP

$0 in software (every tool above has a free tier sufficient for dozens of brokers and hundreds of
leads/month) plus the cost of a domain name (~$15–20/year) and Stripe's per-transaction fee only
once a broker actually pays.
