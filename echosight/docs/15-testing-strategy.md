# EchoSight AI — Testing Strategy

Council owners: Principal Software Engineer, CTO, Cyber Security Architect, ML Engineer.

---

## 1. Philosophy

Test the promises, not the plumbing: the product's promises are (a) tenant isolation, (b) score integrity & honesty, (c) compliance claims, (d) pipeline reliability, (e) money correctness. Coverage is budgeted against those promises; a % target is not a goal in itself (guideline: ≥ 80% on domain logic, enforced only on `core/` and `engines/` packages).

## 2. Layers

| Layer | Stack | Scope & signature cases |
| --- | --- | --- |
| **Unit** | Vitest (TS), pytest (Py) | Pure domain logic: score blending monotonicity; baseline math; credit metering arithmetic; playbook trigger conditions; feature extractors on fixture media (golden feature snapshots per `pipeline_version`) |
| **Contract** | OpenAPI schema tests + Pact between web↔API↔ML services | Response-schema allowlists (the "no follower-level fields" guarantee is a failing test, not a hope) |
| **Integration** | Testcontainers (Postgres+Redis), mocked Meta Gateway | Sync idempotency (same webhook twice = one snapshot); token-expiry paths; RLS: every tenant-scoped table has a cross-tenant read attempt test; Stripe webhook lifecycle (trial→paid→dunning→cancel) |
| **E2E** | Playwright (browser pre-installed in CI env) | Golden paths: signup→connect(mock)→teardown; Pre-Flight upload→scores→re-score iteration; agency report generate→edit→PDF; billing upgrade. Smoke suite on every deploy, full nightly |
| **ML evals** | Custom harness + golden sets | Per release: prediction AUC/calibration on held-out **accounts**; teardown factual-consistency (every cited number must exist in features JSON — automated checker); coach groundedness (LLM-judge + 10% human sample); banned-claims filter red-team suite (incl. prompt-injection fixtures: hostile captions/comments attempting to steer narration); generation originality guard tests |
| **Performance** | k6 | API p95 < 300ms at 30× expected burst; analysis pipeline p95 < 90s for 60s Reel; sync worker throughput; soak test 2h nightly on staging |
| **Security** | Semgrep + gitleaks + Trivy + `npm audit`/pip-audit in CI; ZAP baseline weekly; authz matrix suite (every route × every role, generated from the RBAC table); annual external pen test | Failing severity thresholds block merge |
| **Accessibility** | axe-core in Playwright + manual screen-reader pass per release on key flows | WCAG 2.2 AA; colour-only-encoding lint on chart components |
| **Chaos/resilience** | Staged fault injection quarterly | Meta API 5xx/429 storms; Redis loss; worker kill mid-pipeline (resume proof); region failover tabletop |

## 3. Regression suite & release gates

CI (every PR): typecheck, lint (incl. copy-lint banned-claims rule), unit, contract, integration, E2E smoke, security scans — < 12 min budget. Nightly: full E2E, soak, eval-suite quick set. Release gate (weekly train): green nightly + no open S1/S2 + eval scores ≥ previous release (score regression = automatic block; ML releases additionally require model card + rollback plan). Post-deploy: synthetic probes (signup, analysis, API) every 5 min from 3 regions.

## 4. Test data

Fixture media library (owned/licensed clips across niches, durations, edge cases: no-audio, single-frame, 10-min, corrupted); synthetic workspace generator (accounts with configurable history shapes); anonymised-consented staging mirror refreshed monthly with PII scrubbing verified by automated audit. Production data never leaves production; engineers debug via scoped, audited, time-boxed access.

## 5. Quality ownership

No separate QA silo: feature author writes the tests; release captain (rotating) owns the gate; ML engineer owns eval integrity; security architect owns the security lanes. Escaped defects get a 5-why and a new regression test — the suite only grows from real failures.
