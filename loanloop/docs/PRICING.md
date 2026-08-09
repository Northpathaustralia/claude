# Pricing

| Plan | Price | Leads/mo | Branding | Extras |
| --- | --- | --- | --- | --- |
| **Free** | $0 | 20 | "Powered by LoanLoop" badge on the widget | Dashboard, CSV export |
| **Pro** | $49/mo | Unlimited | White-label (badge removed) | Custom brand colour, instant email alerts, CRM-ready CSV |
| **Growth** | $99/mo | Unlimited | White-label | Everything in Pro + up to 5 websites + Zapier/Make.com automations + priority support |

## Reasoning

- **Free tier is the acquisition engine, not a loss leader to fix later.** 20 leads/mo is enough
  for a small broker to feel the value, and the visible "Powered by LoanLoop" badge on every free
  widget is itself a distribution channel (every free broker's site advertises the product to
  their visitors).
- **$49 Pro is priced against the alternative, not against cost.** A single paid lead from a
  comparison site or portal often costs $30–$150. Pro pays for itself at 1–2 leads/month, and the
  marginal lead beyond that is free to the broker (unlike per-lead marketplaces). That contrast is
  the entire acquisition pitch.
- **$99 Growth exists to capture multi-site/multi-broker practices** without building a bespoke
  enterprise tier prematurely — it's the same product, wider limits, plus the automation
  connectors (Zapier/Make) that let a broker plug this into whatever CRM they already run.
- **No annual contracts, no setup fee.** Self-serve SaaS with a monthly Stripe subscription keeps
  the "minimal human involvement" promise — there's no sales call, no invoice to chase.

## Unit economics (indicative, MVP stage)

- **Cost per broker/month** at Free/Pro volumes: effectively $0 given free-tier hosting, webhook
  function, sheet-as-database and email allowances (see `AUTOMATION_WORKFLOW.md`). Stripe fees are
  ~1.75% + $0.30 per transaction (AU domestic card).
- **Break-even:** a handful of Pro subscribers covers the operator's own time investment in support
  and the eventual paid tiers of the automation tools once free-tier caps are exceeded (e.g.
  Zapier's 100 free tasks/mo, Resend's 3,000 free emails/mo) — those thresholds are the natural
  trigger to start paying for infrastructure, not before.
