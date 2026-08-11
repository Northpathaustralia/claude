# Pricing & Packaging v2

Re-examination of the v1 ladder (Free/$29/$79/$199) against Phase-1 market data and margin maths. Conclusion first: **the corridor holds, with three structural changes** — not because v1 was assumed correct, but because the audit supports it.

## 1. What the audit showed

- Competitor bands (E1–E4): scheduling tools $19–79; serious analytics $49–179; Flick £11–55; Sprout $199+ per user. A $29 explanatory-analytics entry undercuts the analytics tier while staying above "toy" pricing. Pro at $79 prices at the top of the scheduler band but below Iconosquare's mid-tiers — defensible only because the job (creative decisions, not charts) is different; the pricing page must sell that difference.
- The #1 competitor complaint is **discovered real cost** (E3). → Transparency is a feature: every add-on price is public.
- Margin check (docs/10 unit economics): at target AI unit costs, Starter carries ~$9.20 blended variable cost → 68% marginal at $29 (below the 72% floor if AI costs slip). Fix: Starter analysis allowance trimmed (30→25/mo) and heavier assets priced in credits; floor restored with ~15% headroom. Pro/Agency comfortably above floor.

## 2. Changes from v1 (the decisions)

1. **Starter: 25 analyses/mo (was 30)** — margin floor protection; 25 ≈ 6/wk, still above the segment's posting cadence (**ASSUMPTION:** median 4–5 posts/wk; verify in interviews).
2. **Annual pricing displayed first** (2 months free, i.e. Starter $290/yr, Pro $790/yr, Agency $1,990/yr) with monthly toggle — corridor practice (E1) and churn defence. No fake "limited time" framing.
3. **Founding-user offer replaces any LTD** (see docs/24) — the audit's ARPU-cap warning (R3-4) stands; AppSumo remains a fallback lever only.

Unchanged: Free tier's real scores (5 Pre-Flight/mo) — free-value strength is a scorecard category we intend to win; Agency $199 incl. 15 accounts + $9/extra — the per-account marginal economics beat Iconosquare's per-profile pricing and we say so on the pricing page in neutral terms.

## 3. The full public price list (nothing hidden)

| Item | Price |
| --- | --- |
| Free | $0 — 1 account, 5 analyses/mo, weekly trend report |
| Starter | $29/mo or $290/yr — 25 analyses, Coach, daily trends, 2 competitors, 100 credits |
| Pro | $79/mo or $790/yr — 3 accounts, 150 analyses, 10 competitors + alerts, Higgsfield/Fable packs, 500 credits |
| Agency | $199/mo or $1,990/yr — 15 accounts incl., 600 pooled analyses, white-label reports, API, 2,000 credits |
| Extra account (Agency) | $9/mo |
| White-label add-on (Pro) | $49/mo (included in Agency) |
| Credit pack | $10 per 100, never expires while subscribed |
| Enterprise | from $1,500/mo, annual — published as "from" price, not "contact us" only |

## 4. Open items

Price localisation (AUD display for AU visitors) deferred until Stripe Tax setup; USD-first matches the global corridor. Willingness-to-pay split test ($29 vs $39 Starter) runs in the Phase-0 smoke test before any public launch — this document records the hypothesis, not a verdict.
