# EchoSight AI — Red Team Review Log

Independent Red Team charter: attack every deliverable for legal, security, technical, commercial, UX and honesty failures. Findings are numbered R{round}-{n}; every finding carries a resolution or an explicit residual-risk acceptance. Four rounds were run across the document set; the final section lists constraints that **cannot** be engineered away, with the best available alternatives.

---

## Round 1 — Concept & product (attacked: 00, 01, 02)

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| R1-1 | Original concept brief gravitates toward "reveal who saved/shared" — flatly impossible via authorised APIs and policy-fatal | Critical | Product redefined around *predicting and explaining* saves/shares from creative features. Mission text, product spec §4.1, marketing trust block all updated; "What we will never do" made a brand pillar |
| R1-2 | Marketing "prediction" claims before a trained model exists = overclaiming, trust-fatal for a product whose brand is honesty | High | v0 ships as "Content Score (beta)" heuristic, marketed as analysis; "prediction" language gated on measured top-quartile hit-rate ≥ 70% (roadmap Phase 2 gate) |
| R1-3 | Cold-start: predictions for a new account with no history are weak | High | Account-relative normalisation + confidence grades A–D with honest D-grade copy; Studio mode delivers analysis value with zero history |
| R1-4 | UI copy could accidentally imply identity-level knowledge ("See who your savers are"-style drift over time) | High | Banned-claims copy-lint rule in CI over UI strings, LLM output filter with same list, marketing checklist — enforcement, not guidelines |
| R1-5 | Multi-tenant leak between agency clients would be existential | High | RLS beneath app-layer authz; authz-matrix test suite per route; cross-tenant read attempts as standing CI tests |
| R1-6 | Dashboard sprawl (5 dashboards) risks 5× build cost | Med | One component system, role-configured defaults; dashboards differ by config, not codebase (product spec §3) |

## Round 2 — Data, legal & AI integrity (attacked: 03, 04, 05, 08, 09)

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| R2-1 | Train/test leakage risk: holding out posts (not accounts) inflates reported accuracy | High | Grouped time-based CV by account mandated; eval harness enforces account-level holdout (03 §3.2, 15 §2) |
| R2-2 | Trend Engine implied data sources it doesn't legitimately have | High | Evidence-base labelling on every trend; cohort threshold n ≥ 50; licensed-feed dependency marked ASSUMPTION with degraded-mode behaviour defined |
| R2-3 | Auto-posting expands Meta API risk surface at the worst time (pre-review) | Med | Cut from v1; Phase 3 evaluation behind its own risk review |
| R2-4 | Public API could leak follower-level fields added carelessly later | High | Response-schema allowlists with CI contract tests — additive fields fail closed |
| R2-5 | Browser extension is the classic compliance loophole (background scraping temptation) | High | Extension constrained to annotating pages the user visits, own accounts + visited public pages, no background collection; constraint written into spec and store listing |
| R2-6 | Competitor teardowns + generator could produce near-plagiarism of competitor content | Med | Embedding-similarity originality guard with auto-regeneration; framing as craft-learning |
| R2-7 | "Higgsfield/Fable integration" marketing implies partnerships that don't exist | Med | Renamed "prompt packs for…"; integration language reserved for actual API relationships |
| R2-8 | Prompt injection via hostile captions/comments could steer LLM narration | Med | Instruction/data separation in prompt contracts, output filtering, injection fixtures in eval suite (15 §2) |

## Round 3 — Commercial & financial (attacked: 01, 10, 12, 13, 17)

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| R3-1 | Original growth curve assumed 12% free→paid — not credible for prosumer | High | Re-based to 6% base / 4% bear / 8% bull; projections rebuilt; bear case shown to remain default-alive |
| R3-2 | AI inference cost could silently destroy gross margin | High | Unit-cost targets, per-tier ceilings, 72% margin floor alarm, weekly cost dashboard (10 §4, 06 §5) |
| R3-3 | Churn assumption (Starter 5.5%/mo) makes retention the whole model — but no feature was explicitly tasked with it | High | Coach experiment loop + report automation designated as retention owners with the sensitivity table making the dependency explicit (10 §5) |
| R3-4 | AppSumo/LTD could permanently cap ARPU and flood support | Med | LTD gated as a fallback only, capped 1,000 codes, Starter-tier features only |
| R3-5 | TAM slide risked "0.5% of huge number" hand-waving | Med | Bottom-up SOM added; every market figure ASSUMPTION-flagged with a validation program attached |
| R3-6 | Trademark risk on "EchoSight" unexamined | Med | Clearance search made a launch-blocking action; fallback names shortlisted |

## Round 4 — Technical resilience & scale (attacked: 06, 07, 15, 16)

| # | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| R4-1 | Meta dependency was a risk-register line, not an engineered failure mode | High | Kill-switch degradation ladder specified and drilled quarterly; Studio mode as terminal fallback keeps the company alive with zero API access |
| R4-2 | Cost blowout from analysis abuse (free-tier upload spam, API loops) | Med | Credit metering on free tier, per-workspace budgets, anomaly detection on usage events |
| R4-3 | Unbounded tables would force emergency partitioning later | Med | `metric_snapshots`, `usage_events`, `audit_log` partitioned from day one (07) |
| R4-4 | Single-region deployment vs. AU+EU privacy story mismatch | Med | Cell-based residency design; EU cell scheduled Phase 3 with SCCs interim — residual risk accepted and disclosed in DPA until then |
| R4-5 | Pipeline steps not resumable → one failed frame batch re-runs entire analysis (cost + latency) | Med | Idempotent, resumable step design with per-step versioning (06 §5) |

## Final validation pass — residual constraints (cannot be engineered away)

These are disclosed, not hidden; each ships with its best available alternative:

1. **The API ceiling.** Instagram will never expose who saved/shared, DMs, or private accounts — to anyone. *Alternative shipped:* calibrated probabilities and causal explanation from creative features + aggregate counts, plus public honesty about the ceiling (which converts a constraint into brand trust).
2. **Metric availability drift.** Meta renames/retires insight metrics with each API version. *Alternative:* `metric_availability` per account, immutable snapshots preserving history, 30-day staging rehearsal per version.
3. **Competitor data is estimate-grade.** Hidden like counts and no third-party insights mean engagement quality is modelled, not measured. *Alternative:* everything labelled Exact/Estimate/AI-derived; comments-only model where likes are hidden.
4. **Prediction is probabilistic.** Distribution algorithms are non-stationary; accuracy has a ceiling and will drift. *Alternative:* confidence grades, per-account accuracy pages, drift monitors, and the marketing gate tying claims to measured performance.
5. **Third-party prompt-pack fragility.** Higgsfield/Fable can change syntax at will. *Alternative:* versioned templates, graceful degradation to generic video-model phrasing, partnership discussions as the durable fix.
6. **Assumption-based financials.** No real cohort data exists pre-launch. *Alternative:* every input flagged, sensitivity table identifies which assumptions matter, validation program (Phase 0) replaces the riskiest ones first.

**Verdict after Round 4 re-review:** no known material issue remains unaddressed within available information and constraints. The document set is internally consistent (cross-references verified), legally conservative, and honest about its assumptions. Next review trigger: end of Phase 0 with real validation data.
