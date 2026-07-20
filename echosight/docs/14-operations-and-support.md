# EchoSight AI — Operations Manual, Support System & Hiring Plan

Council owners: Support Manager, Customer Success Lead, CEO, Financial Controller.

---

## 1. Operating rhythm

| Cadence | Ritual | Owner |
| --- | --- | --- |
| Daily | Metrics standup (signups, activation, MRR delta, AI unit cost, error budget) — dashboard, 10 min | CEO/CPO |
| Weekly | Product review (experiment results, eval scores, top user feedback themes) · Growth review (channel CAC/payback) · Ops review (support queue, infra cost) | CPO · Growth · CTO |
| Monthly | Financial close + board pack (cash, cohort retention, unit economics) · Model/eval release review · Security review (alerts, access recert sample) | FC · ML · CISO-hat |
| Quarterly | Roadmap re-plan · DR + Meta-kill-switch drill · Pricing review · Data Use Checkup prep | Council |

## 2. Support system

- **Channels:** in-app messenger + email (single tool: **ASSUMPTION** Intercom or Plain); Discord community (peer + team office hours); phone/Slack Connect for Enterprise.
- **Tiers/SLAs:** Free/Starter: first response < 24h business. Pro: < 8h. Agency: < 4h. Enterprise: < 1h SEV-linked, named CSM.
- **Deflection stack:** searchable help centre (seeded with 60 articles at GA: onboarding, connections/tokens, scores explained, billing, privacy); AI support assistant grounded **only** on the help centre + the user's own workspace state (never invents policy; escalates on low confidence or emotion detection); status page (status.echosight.ai) with component-level states including "Instagram data sync".
- **Support→product loop:** every ticket tagged (area, root cause); weekly top-5 friction report into product review; bug SLAs by severity (S1 fix < 24h, S2 < 1 wk).
- **Tone standard:** same brand voice — specific, numerate, honest; macros drafted for the 20 commonest issues (token expiry, metric availability differences, credit questions, refund policy — 14-day no-questions refund on first purchase).

## 3. Runbooks (index — each is a standing doc in the ops wiki)

Token-expiry surge · Graph API version sunset · Meta app restricted (kill-switch ladder) · AI cost spike · Model regression rollback (pin previous `model_version`, scores re-served from cache) · Stripe webhook backlog · Data-deletion request (DSR) end-to-end · Breach response (see [Security §6](09-security-and-compliance.md)) · Status-page comms templates.

## 4. Hiring plan (gated, **ASSUMPTION**)

| Phase | Gate | Adds | Team size |
| --- | --- | --- | --- |
| Founding (M0) | Seed closed | CEO, CTO, 2× full-stack, founding ML, product designer | 6 |
| Beta (M4–6) | Beta retention ≥ 40% wk-4 | Growth lead, backend eng, CS #1 | 9 |
| GA (M7–12) | $50k MRR | ML eng #2, frontend eng, CS #2, fractional finance+privacy officer | 14 |
| Scale (Y2) | $250k MRR | AE ×2, SE, support ×2, eng ×4, data analyst, ops mgr | ~26–30 |

Principles: senior-heavy early; every role has a written scorecard; compliance-sensitive roles (Privacy Officer) fractional-professional, never skipped. ESOP 12% pool at seed.

## 5. Vendor & cost management

Vendor register with data-classification of each (DPA status, exit plan): AWS, Vercel, Clerk, Stripe, Anthropic, Datadog, Sentry, PostHog, Resend, Intercom. Monthly infra+AI cost review against per-tenant unit targets; any vendor > 5% of revenue gets an annual renegotiation/alternatives review.

## 6. Legal/admin calendar

Company secretarial (ASIC), R&D Tax Incentive claim (AU — material for this cost base), insurance (cyber, PI, D&O), Meta Data Use Checkup, SOC 2 audit windows, privacy-policy annual review, trademark renewals.
