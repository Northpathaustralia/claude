# MVP Design — Commission & Trail Reconciliation Checker

## What it does

A broker uploads (or pastes) two CSVs they already have to hand:

1. **Loan book** — the loans they've settled, with the commission terms they were quoted.
2. **Aggregator statement** — the payment lines their aggregator has actually paid them.

The tool matches the two, calculates what *should* have been paid on each loan, and reports every
discrepancy — ranked by dollar impact — so the broker knows exactly what to query with their
aggregator. Nothing is transmitted anywhere: parsing, matching and calculation all happen in the
browser tab.

## Inputs

**Loan book CSV** — `loan_ref, client_name, lender, settlement_date, loan_amount, upfront_rate_pct, trail_rate_pct, status`
`status` is `active`, `discharged` or `refinanced` (trail stops accruing once a loan leaves
`active`).

**Aggregator statement CSV** — `loan_ref, lender, payment_date, type, amount`
`type` is `upfront` or `trail`. Real aggregator exports vary in column names/order — the loader
maps by header name (case-insensitive, order-independent) so a broker's actual export mostly
just works after a light rename, and the UI shows a template + example to copy.

## Reconciliation logic (`lib/reconcile.js`)

- **Upfront:** expected once per loan = `loan_amount × upfront_rate_pct`, matched against the
  first `upfront` statement line for that `loan_ref`. Missing → flagged at full expected value.
  Paid but off by more than a cents-rounding tolerance → flagged as **short** (paid < expected) or
  **over** (paid > expected, still surfaced — it happens, and it's still worth knowing).
- **Trail:** expected *per statement period actually paid for that loan*, not a blanket annual
  figure — the engine only judges the trail payments that exist in the statement (it does not
  assume monthly trail was expected for a loan with zero statement lines; sustained non-payment
  over many months is a **coverage gap**, reported separately from per-payment variance, since
  "trail simply never started" is a different failure mode from "trail is short each month").
  Expected per paid period = `outstanding_balance_estimate × trail_rate_pct ÷ 12`, using
  `loan_amount` as the balance estimate for v1 (documented as an approximation — see Limitations).
- **Unmatched statement lines** (a payment for a `loan_ref` not in the loan book) are reported
  separately, not silently dropped — could be a data-entry typo on either side, so a human needs
  to see it.
- **Tolerance:** discrepancies under $2 are treated as rounding noise, not flagged, to keep the
  report focused on things worth an email to the aggregator.

## Output

- Summary bar: total expected, total received, total variance ($ and %).
- Discrepancy table sorted by absolute dollar impact, each row tagged `missing` / `short` /
  `over` / `coverage gap` / `unmatched statement line`, with the exact math shown per row (no
  "trust me" numbers).
- One-click CSV export of the discrepancy table (to attach to an email/ticket to the aggregator).
- Nothing persists by default; an explicit "remember my loan book in this browser" opt-in uses
  `localStorage` only (same pattern as NPAOS) — never sent anywhere.

## Compliance & privacy posture

- **This is a reconciliation calculator, not credit assistance or financial advice** — it does
  not recommend products, lenders or client action, so it sits outside NCCP Best Interests Duty
  scope. The UI states this explicitly.
- **No guarantee-of-recovery language.** Results are framed as "discrepancies to verify with your
  aggregator," never "money we'll get back for you" — same discipline as NPAOS's
  `compliance.js` guard against promised outcomes.
- **Data minimisation.** `client_name` is optional in the loan book — `loan_ref` alone is enough
  to reconcile. The UI recommends using loan/settlement reference numbers instead of full client
  names where the broker's own systems allow it, since none of this data needs to leave the tab.
- **Zero network calls.** No analytics, no telemetry, no upload endpoint in v1 — verifiable by
  reading the one HTML file. This is the strongest privacy story available and it's free to keep.
- **Aggregator agreement caution (flagged in the red-team audit):** some aggregator agreements
  restrict re-disclosure of commission *schedules/rates*; this tool only processes data the broker
  already legitimately holds about their own book and never transmits or publishes it, which
  keeps it inside normal use, but the UI carries a one-line reminder to check their own agreement
  before sharing exported statements with anyone else.

## Limitations (stated in-app, not hidden)

- Trail is estimated off original loan amount, not true amortised/redrawn balance — flagged in
  the UI as an approximation that will slightly overstate expected trail on loans with material
  principal paid down. A v2 could accept an optional `current_balance` column to remove this.
  approximation entirely.
- No live lender/rate data — this tool never claims to validate the *rate itself* is correct,
  only that expected-vs-paid math based on the broker's own inputs reconciles.

## Free-to-launch architecture

Single self-contained `app/index.html` (vanilla JS, ES module import of `lib/reconcile.js`, no
build step, no dependencies) — matches NPAOS's `release/*.html` model. Hosting cost is $0
(GitHub Pages, or just opening the file locally); no server, no database, no API keys.
