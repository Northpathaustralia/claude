# REVENUE FORECAST — FIRST 12 MONTHS

**AUD. Assumption-driven scenarios, not guarantees.** Built on Model 1 → Model 2 path
(UNIT_ECONOMICS.md). Month 1 = public launch month (Day 71+ of the 90-day plan).
GST-inclusive revenue shown; margins ex-GST. Machine-readable version:
`/data/financial-model.csv`.

## Shared assumptions (all scenarios)

- AOV $138 growing ~1%/month (bundle adoption).
- Gross margin: 70% ex-GST (Model 1 months 1–3) → 76% (Model 2 from month 4).
- Variable order costs (ship/pack/payment/returns/discounts): ~22% of ex-GST revenue.
- Operating expenses (tools, subscriptions, accounting, events, contingency): $1,200/mo
  rising to $3,500/mo by month 12. No salaries, office or warehouse until month 9+ 3PL.
- Ad spend as stated per scenario; blended CAC assumes 25–35% of orders organic/repeat.
- Repeat rate: 12% of prior customers repurchase per drop cycle (2 drops per quarter
  after launch).
- Inventory purchased 2 months ahead at next-quarter demand; cash-flow pressure noted.

## Scenario summaries (12-month totals)

| Scenario | Monthly orders M1 → M12 | Revenue Y1 | Ad spend Y1 | Net profit Y1 | Peak extra cash needed |
|---|---|---|---|---|---|
| **Conservative** | 90 → 260 | $285k | $54k | ≈ $18k | $15k (M4 Model-2 buy) |
| **Expected** | 150 → 520 | $520k | $96k | ≈ $62k | $28k (M4) |
| **Strong** | 220 → 900 | $880k | $158k | ≈ $128k | $55k (M5, M8 buys) |
| **Breakout** | 350 → 1,800 | $1.72m | $300k | ≈ $265k | $120k+ (needs finance facility) |

### Monthly shape — Expected scenario (illustrative)

| Month | Orders | Revenue | Ads | Gross profit | Opex | Net |
|---|---|---|---|---|---|---|
| 1 | 150 | $20,700 | $5,500 | $9,400 | $1,200 | $2,700 |
| 2 | 165 | $22,900 | $6,000 | $10,400 | $1,400 | $3,000 |
| 3 | 190 | $26,600 | $7,000 | $12,100 | $1,500 | $3,600 |
| 4 (Drop 002, Model 2) | 240 | $33,800 | $8,500 | $17,600 | $1,800 | $7,300 |
| 6 | 310 | $44,200 | $9,500 | $23,000 | $2,200 | $11,300 |
| 9 (Drop 004) | 420 | $60,600 | $11,000 | $31,500 | $2,800 | $17,700 |
| 12 | 520 | $76,000 | $12,500 | $39,500 | $3,500 | $23,500 |

*(Full 12×4 scenario grid in /data/financial-model.csv.)*

## Inventory requirements

| Scenario | Q1 buy | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| Conservative | $6k (M1 blanks) | $18k | $22k | $28k |
| Expected | $6k + $23k (M2 batch) | $30k | $42k | $55k |
| Strong | $10k + $35k | $55k | $75k | $95k |
| Breakout | requires staged buys + supplier terms/finance | | | |

## Cash-flow pressure points

1. **Month 3–4:** Model 2 production deposit lands before Drop 002 revenue — the single
   most dangerous month. Mitigate with VIP pre-orders (honest dates) + holding 40% of
   M1–M3 profit in reserve.
2. **Month 8–9:** doubling inventory while ad spend scales; consider supplier 30/70
   terms or a small facility before this, not during.
3. GST remitted quarterly — never treat GST collected as cash available.

## Explicit assumptions & caveats

- CACs of $30–$36 are assumed from paid + organic blend; if true blended CAC exceeds
  ~$45 at Model 1 margins, pause scaling (see PAID_AD_PLAN.md guardrails).
- No wholesale revenue assumed (upside only).
- No international sales assumed until month 6+ (upside only).
- Returns assumed at 6%; oversized fits can run higher until fit content matures.
- **These are models to steer decisions, not promises.** Update monthly with actuals.
