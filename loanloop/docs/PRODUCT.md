# Product — LoanLoop

**One line:** an embeddable borrowing-power calculator that turns a mortgage/finance broker's
existing website traffic into qualified, contactable leads, 24/7, with no ongoing effort from the
broker.

## The problem

A broker's website gets visitors at 11pm, on weekends, during client meetings — almost none of
whom will pick up the phone or fill in a generic "Contact us" form. That traffic is mostly wasted.
Meanwhile the broker has no time to build or maintain lead-gen tooling themselves.

## The product

A single `<script>` + `<div>` snippet a broker pastes onto their own site. It renders:

1. A short calculator (income, existing debts, dependents, deposit).
2. An instant **indicative borrowing-power range** (never a single number, never a guarantee).
3. A lead-capture form (name, email, phone, explicit consent) gating the result.

Every submission becomes a lead in the broker's dashboard and, once connected, their inbox/CRM —
automatically. The broker never touches the tool day-to-day; they just paste it once and let it run.

## Why this, not something else

- **Narrow and buildable.** One calculator, one workflow. No app to learn, no login for the
  broker's clients.
- **Reuses a real skill/asset.** NorthPath already operates in this exact market (mortgage broking
  lead generation) — this repo's own `src/ai/leadScoring.js` and `src/utils/compliance.js` prove
  the domain knowledge and compliance pattern already exist and work.
- **Naturally 24/7.** The value (an instant estimate) requires no human in the loop to deliver.
- **Low build cost, free tools.** Static HTML/JS/CSS + free-tier hosting + free-tier
  webhook/email/spreadsheet tools cover the entire MVP (see `AUTOMATION_WORKFLOW.md`).
- **Clear monetisation.** Brokers already pay for lead sources (Google Ads, PropTrack, portals) at
  far higher cost per lead than a flat SaaS fee.

## What it is not

- Not a licensed credit-advice tool. It never recommends a lender or product, never says "you're
  approved," and always shows a range with a mandatory disclaimer (see `COMPLIANCE_AND_PRIVACY.md`).
- Not a full serviceability/HEM calculator. The estimate is intentionally simple — that simplicity
  is what keeps it in "general information" territory rather than personal credit advice.

## MVP scope (built in this repo)

| Piece | Where | Status |
| --- | --- | --- |
| Embeddable widget (calculator + lead capture + compliance guard) | `widget/loanloop.js`, `widget/loanloop.css` | Built, unit-tested, browser-tested |
| Marketing/landing page | `site/index.html` | Built |
| Self-serve "sign up → get embed code" flow | `site/signup.html` | Built (client-side demo of the flow; production wiring in `MVP_LAUNCH_STEPS.md`) |
| Broker website simulation with the real embed | `site/demo.html` | Built |
| Lead dashboard + CSV export | `site/dashboard.html` | Built |
| Automated lead delivery (webhook → sheet → email) | `server/webhook-function.js` + `AUTOMATION_WORKFLOW.md` | Reference implementation + setup steps (needs the operator's own free-tier accounts to go live) |
| Billing (Stripe self-serve subscriptions) | `MVP_LAUNCH_STEPS.md` | Documented, not provisioned (needs the operator's own Stripe account) |

The parts that require a human's own third-party accounts (Stripe, a hosting domain, an email
sender) are documented step-by-step rather than fabricated, since no working software product
should claim to be "live" with credentials it was never given.
