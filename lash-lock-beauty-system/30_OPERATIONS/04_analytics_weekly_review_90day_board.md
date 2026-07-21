# 30 · Analytics Dashboard, Weekly Operating Review & 90-Day Board

## Analytics dashboard structure (build in a sheet or the platform)
**Top-of-funnel:** reach, 3-sec hold, avg watch, completion, saves, shares, follows, profile visits.
**Mid:** link clicks, LP views, LP click-through, email signups, email open/click.
**Bottom:** add-to-cart, checkout starts, purchases, conversion %, AOV, bump/upsell attach, refund rate.
**Paid (later):** spend, CPM, CTR, CPC, LP-view cost, CPA, ROAS.
**Product:** support tickets, reaction reports (should be 0), NPS/recommend score.
One row per day/asset; link to the test log (`18_TESTING_DASHBOARD`).

## Weekly operating review (30–45 min, Fridays)
1. Numbers vs your baselines (no invented benchmarks).
2. Content: keep / iterate / recut / change-hook / retire (decision rules in `18_`).
3. Funnel: any drop-off to fix (ad→LP→cart→purchase).
4. Support/refund themes → product or copy fixes.
5. Gates: any external gate cleared this week? Update `23_OWNER_VERIFICATION`.
6. Next week: 1 A/B test, batch-edit plan, spend cap check.

## 90-day execution board (Kanban columns)
`Backlog → This week → In production → In review (QC/claims/compliance) → Scheduled → Live → Retired`
Swimlanes: Product(Gate A) · Supplier(Gate B) · Compliance(Gate C) · Course · Content · Funnel · Paid · Ops.
**WIP limit:** don't start paid until organic winners + margins known; don't ship bundle until Gates A/B/C clear.

## Monthly
Re-baseline metrics · re-score the "materially-better" scorecard (`02_POSITIONING`) with real data · re-run red-team lite on anything new.
