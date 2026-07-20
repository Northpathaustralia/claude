# EchoSight AI — Roadmap & Launch Checklist

Council owners: CPO, CTO, CEO. Gates are exit criteria — dates are planning **ASSUMPTIONS**, gates are not.

---

## 1. Phased roadmap

### Phase 0 — Validate (M0–M2)
Problem interviews (30/segment) · smoke-test landing page + waitlist + price test · concierge MVP (manual teardowns for 50 creators) · Meta app registration + dev-mode Graph API integration spike · trademark clearance · seed close.
**Gate:** ≥10 paying concierge customers; API spike proves metric availability matches spec.

### Phase 1 — Wedge product (M2–M7)
Web app: onboarding, account connect + sync, Analytics baseline, Content Analysis Engine v1, heuristic scorer ("Content Score (beta)"), teardown UX, Coach v1 (plans + experiments), Pre-Flight, billing (Free/Starter/Pro), help centre, status page. Closed beta M5 (200 creators) → public launch M7 (Product Hunt).
**Gate to launch:** activation ≥ 60%, wk-4 retention ≥ 40%, analysis p95 < 90s, security review + pen test complete, Meta App Review approved, privacy docs live.

### Phase 2 — Expansion (M7–M14)
Prediction Engine v1 (trained, calibrated, accuracy page) · Trend Engine daily reports · Competitor Intelligence · Creative Generator + Higgsfield/Fable packs · Agency workspace: multi-account, roles, white-label reports, Agency plan · referral + affiliate programs · mobile app (Expo) beta · browser extension beta · SOC 2 Type I.
**Gate:** prediction top-quartile hit-rate ≥ 70% before "prediction" marketing switches on; agency tier ≥ 10% of new MRR.

### Phase 3 — Platform (M14–M24)
Public API + webhooks GA · Enterprise workspace (SSO/SAML, audit, custom benchmarks, per-tenant tuning) · marketing automation suite · desktop app · EU data cell · SOC 2 Type II · publishing-via-API evaluation (own risk review) · TikTok/Shorts ingestion decision point.
**Gate:** $3M ARR, NRR ≥ 105% → Series A optionality.

## 2. Launch checklist (GA, M7)

**Product/eng:** all Phase-1 gate metrics green · load test at 30× · on-call rota + runbooks staffed · rollback drill done · feature flags default-safe · synthetic probes live.
**Compliance:** Meta App Review approved + scopes minimal · privacy policy/ToS/DPA published (counsel-reviewed) · DSR portal tested end-to-end · data-deletion callback verified · DPIA signed off · cookie/GPC handling verified.
**Commercial:** pricing page + Stripe live-mode tested (upgrade/downgrade/dunning) · refund policy published · support macros + help centre (60 articles) live · SLAs configured.
**Marketing:** PH assets ready (video, sandbox, hunter) · 15 case studies staged · partner creators briefed with embargo · newsletter announcement drafted · press list warm · Report Card share loop QA'd.
**Ops:** status page public · incident comms templates · war-room schedule for launch week · daily metric review cadence set.

## 3. Post-launch review

Day 7 and Day 30 retros: funnel actuals vs. targets, top friction from support tags, infra cost vs. model, first churn interviews. Roadmap re-planned at M8 with real data — this document is versioned and expected to change.
