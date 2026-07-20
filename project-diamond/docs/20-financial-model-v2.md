# 20 — Financial Model v2 (Phase 2 additions)
Extends doc 11 (startup costs, unit economics, 12-month monthly forecast, 3y/5y, sensitivity — unchanged and still authoritative). This doc adds: software costs, ad-budget scenarios, 24-month projection, and consolidated cases with explicit assumptions.

## Monthly software & tooling costs (AUD, launch config)
| Tool | Plan | $/mo |
|---|---|---|
| Shopify | Basic → Grow at ~M6 | 56 → 149 |
| Klaviyo (email+SMS) | scales with list (≈5k profiles by M6) | 90 → 260 |
| Recharge / subscriptions | base + per-charge | 0 + ~1.25%/charge |
| Judge.me | Awesome | 23 |
| Gorgias | Starter → Basic | 15 → 90 |
| Slide-cart/bump app | — | 30 |
| Inventory Planner | — | 45 |
| Triple Whale | Growth (from M4) | 0 → 190 |
| Google Workspace | 2 seats | 18 |
| Canva Pro + CapCut Pro | — | 35 |
| Higgsfield credits | creative engine | 150 |
| Accounting (Xero + bookkeeper) | — | 340 |
| Domains/hosting extras | — | 10 |
| **Total** | | **≈ $812/mo at launch → ≈ $1,540/mo by M6** (inside the fixed-cost base in doc 11) |

## Advertising budget scenarios
| Scenario | Media $/mo (steady state) | Expected orders/mo | Blended CAC | Use when |
|---|---|---|---|---|
| Floor (survival) | $8k (retention + brand search + Spark on organic winners) | 350–450 (organic/CRM-heavy) | ~$30 effective | Worst-case cash preservation |
| Base | $28–34k | 850–1,050 | $55 | Likely plan (doc 11 forecast) |
| Aggressive | $55k (adds YouTube + broader Meta) | 1,500–1,700 | $62 (accepting diminishing returns) | Only if CAC ≤$55 held 8 straight weeks AND cash > $150k |
Ramp rule: change budget ≤20% per 72h; scenario shifts are a council decision, not a dashboard reaction.

## 24-month projection (quarterly, Base case)
| Quarter | Revenue | Marketing | Contribution after mktg | Fixed + payroll | Net | Active subs (exit) |
|---|---|---|---|---|---|---|
| Q1 (launch) | $90k | $44k | $3k | $30k | −$27k | 190 |
| Q2 (M. Day + winter) | $250k | $90k | $39k | $34k | +$5k | 600 |
| Q3 | $254k | $87k | $44k | $36k | +$8k | 850 |
| Q4 (Christmas) | $374k | $117k | $66k | $38k | +$28k | 1,150 |
| **Year 1** | **$968k** | **$338k** | **$152k** | **$138k** | **+$14k** | 1,150 |
| Q5 (US soft launch) | $340k | $122k | $58k | $58k | 0 | 1,500 |
| Q6 (US winter ≈ AU M.Day) | $560k | $180k | $101k | $62k | +$39k | 2,100 |
| Q7 (AU winter + UK dist.) | $700k | $210k | $130k | $68k | +$62k | 2,900 |
| Q8 (dual-hemisphere Q4) | $1,000k | $290k | $190k | $74k | +$116k | 3,800 |
| **Year 2** | **$2.6m** | **$802k** | **$479k** | **$262k** | **+$217k** ≈ **EBITDA $290k** incl. adjustments | 3,800 |
36-month: per doc 11 — Y3 $4.8m revenue, 13% EBITDA, 6,000 subs, hotel/spa channel live.

## Consolidated cases (Y1) — key assumptions stated
| Assumption | Conservative | Base | Best |
|---|---|---|---|
| Launch CVR | 2.0% | 2.8% | 3.6% |
| CAC | $75 | $55 | $42 |
| AOV | $88 | $96 | $104 |
| Sub take-rate | 18% | 32% | 40% |
| Monthly sub churn | 9% | 6% | 4.5% |
| Guarantee/refund rate | 5% | 2.5% | 1.5% |
| Y1 revenue | $520k | $968k | $1.40m |
| Y1 net | −$95k | +$14k | +$120k |
| Cash low point (month) | −$128k (M5) | −$96k (M4) | −$74k (M3) |
All cases keep the $30k minimum cash buffer except Conservative, which triggers the Floor ad scenario at M5 and defers hires — modelled cash floor then holds at +$21k. Kill/pivot criterion unchanged (doc 11).

## Cash-flow mechanics (reminder)
Inventory is the cash consumer: POs at 30% deposit / 70% on QC release, 6-week lead. Seasonal builds (Apr, Oct) pull ~$55–80k forward — both sit immediately before the two biggest revenue quarters, which is why the trough looks scary and isn't. Weekly cash sheet per SOP-10; 13-week rolling cash forecast maintained from M1.
