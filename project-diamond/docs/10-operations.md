# 10 — Operations
## SOPs (numbered, owned, versioned)
- SOP-01 Production order: forecast → PO to blender → batch sheet → QC release (scent panel, moisture, fill weight) → GRN into 3PL.
- SOP-02 QC release: retained sample per batch; fail = quarantine + founder sign-off to destroy/rework. Record in QC log.
- SOP-03 Pick/pack (3PL spec): unboxing build order (tissue → card → jar orientation label-up), photo audit 1-in-50.
- SOP-04 Dispatch: 1pm AEST cutoff; same-day scan target 99%; exceptions escalated to #ops-alerts.
- SOP-05 CS: "fix first, ask later" — replacements sent on photo evidence; refunds within 24h; tone guide = brand voice doc; escalation matrix (product safety → founder + insurer same day).
- SOP-06 Returns: change-of-mind 30d unopened; 60-Night Guarantee = refund without return, flag account (1 claim lifetime); weekly guarantee-rate report (alert >3%).
- SOP-07 Review management: day-10 ask; reply to every review <48h; negative review = CS ticket auto-opened.
- SOP-08 Influencer/UGC rights: outreach template → usage terms (organic + paid whitelist 90d) → asset log.
- SOP-09 Ad account hygiene: $150 kill rule; weekly creative council (30 min); naming convention `YYMM-platform-hookID-cut`.
- SOP-10 Finance: weekly cash sheet; monthly P&L vs model; inventory reconciliation monthly.

## Automation map
| Trigger | Automation | Tool |
|---|---|---|
| Order placed | Confirmation + ritual-prep email; CAPI event | Shopify/Klaviyo |
| Dispatch scan | Tracking SMS + delivery-day "tonight's the night" | Klaviyo SMS |
| Day 10 post-delivery | Review ask + photo incentive (entry to monthly draw) | Klaviyo/Judge.me |
| Day 24 (jar 80% depleted) | Refill/subscribe flow | Klaviyo |
| Sub upcoming charge | 3-day heads-up + skip/pause link (churn saver) | Recharge/Shopify Subs |
| Cancel intent | Pause-instead offer + cadence change | Recharge flow |
| Ticket keywords (rash, reaction) | Auto-escalate P1 to founder + template response | Gorgias |
| Stock < 8 weeks cover | Reorder alert + draft PO | Inventory Planner |
| Review ≤3 stars | CS ticket + founder digest | Gorgias/Judge.me |
| Ad set > $150 no purchase | Auto-pause + Slack alert | Meta rules |
| Weekly | KPI dashboard email to founders | Triple Whale/Sheets |

## Inventory flow
Supplier (flakes, oils) → contract blender (VIC) → QC release → 3PL (Melbourne) → customer / wholesale. Reorder point = 8 weeks cover at trailing 4-week velocity; safety stock 8 weeks; production lead 6 weeks. Kunzea oil: 12-month contracted volume + 20% buffer held at blender. Seasonal build: +150% stock entering April (Mother's Day + winter) and October (Christmas).

## Customer support flow
Channels: email + IG DM (Gorgias unified). SLA: first response <4 business hours. Macro library mirrors objection matrix (doc 04). Weekly voice-of-customer digest feeds copy/product backlog.

## Supplier management
Dual-source flakes (2 distributors); single-source kunzea (risk logged; second distiller identified, sample-approved). Quarterly supplier scorecards: OTIF, QC pass rate, price variance. Annual audit visit to blender.

## Hiring roadmap
M0 founders (2): CEO/brand + COO/growth. M3: PT customer support (contract). M6: content producer/editor (PT→FT). M9: growth marketer (retention + paid). M12: operations coordinator. Y2: head of retail/wholesale, US market manager (contract). Agencies: bookkeeping from M1, TM attorney (project), CRO audit (project, M8).

## Scaling roadmap (ops view)
Phase 1 (0–6m): 3PL from day one (no garage phase), single production partner. Phase 2 (6–12m): second production slot reserved, wholesale pilot 10 doors, NZ shipping on. Phase 3 (12–24m): US 3PL node (counter-seasonal balancing), UK via distributor, hotel/spa channel, morning-line SKUs.

## KPIs & dashboards
North star: **nights reclaimed** (jars × 12, cumulative — public counter) · Weekly: revenue, blended CVR (≥2.8%), AOV (≥$95), MER (≥3.0), CAC (≤$55), sub take-rate (≥30%), sub churn (<6%/mo), 60-day repeat rate (≥25%), guarantee claims (<3%), dispatch same-day (≥99%), CS first response (<4h), review rating (≥4.8). Dashboards: Triple Whale (commerce), Klaviyo (retention), Sheets exec roll-up (auto-emailed Monday 7am).
