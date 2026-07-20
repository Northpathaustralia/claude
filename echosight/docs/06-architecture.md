# EchoSight AI — Technical Architecture

Council owners: CTO, Principal Software Engineer, Cloud Architect, DevOps Engineer, Cyber Security Architect. Red-teamed: rounds R1, R4.

---

## 1. Decision summary (with rationale)

| Concern | Choice | Rationale / rejected alternatives |
| --- | --- | --- |
| Frontend | **Next.js 15 + TypeScript + React**, Tailwind CSS + Radix primitives, TanStack Query, Recharts | App-router SSR for marketing + dashboard in one framework; huge hiring pool. Rejected: Remix (smaller pool), SvelteKit (team familiarity) |
| Backend API | **NestJS (Node 22 + TypeScript)**, REST + OpenAPI, Zod validation at edges | Structured DI for a growing team; single language with frontend. Rejected: Go (slower product iteration for this team), tRPC-only (public API needs REST anyway) |
| ML services | **Python 3.12 + FastAPI** microservices (feature extraction, scoring, clustering) | Python ML ecosystem; isolated scaling. Communicates via queue + internal REST |
| AI orchestration | **BullMQ** pipelines + internal "engine gateway" service; LLM = Anthropic Claude API (Sonnet default, Opus-class for coach plans/reports, Haiku-class for classification), batch API for offline work, prompt caching on | One LLM vendor to start = simpler evals/compliance; gateway abstracts vendor for portability |
| Database | **PostgreSQL 16 (Aurora)** + **pgvector** for embeddings | One database until scale demands more; pgvector avoids a separate vector DB. Rejected initially: Pinecone/Weaviate (extra moving part), MongoDB (relational fits) |
| Cache/queues | **Redis (ElastiCache)** — cache, rate limits, BullMQ backing | Standard |
| Object storage | **S3** (media, features, reports) with lifecycle policies | Standard |
| Data warehouse | **DuckDB→ClickHouse** path: Postgres read replicas + parquet exports first; ClickHouse when analytics volume demands (Phase 2/3) | Don't build a warehouse before the data exists |
| Auth | **Clerk** (user auth: email, Google, Apple, MFA; SAML/SSO on enterprise plan) + our own OAuth token vault for Meta tokens | Buys SOC2-supported auth velocity; Meta tokens are our own encrypted concern regardless. Rejected: Cognito (DX), roll-your-own (time + risk) |
| Payments | **Stripe** (Billing + Tax + Customer Portal); metered usage for credits | Standard; global tax handling |
| Hosting | **AWS ap-southeast-2** primary (AU company, AU data residency story), **eu-central-1** cell for EU customers (Phase 2); ECS Fargate for services, Vercel for the Next.js app (**ASSUMPTION**; CloudFront+ECS fallback documented) | Cell-based residency beats one-region-fits-none |
| IaC / deploy | **Terraform** + GitHub Actions (build → test → scan → staging → prod with manual gate); blue/green on ECS | Standard |
| Monitoring | **Datadog** (APM, logs, RUM) + Sentry (errors) + PagerDuty; OpenTelemetry throughout | One pane; OTel keeps vendor optional |
| Notifications | **Resend** (email), **Expo push** (mobile), Slack webhooks | Standard |
| Feature flags / experiments | **PostHog** (flags, product analytics, A/B) self-serve events | One tool for flags+analytics early |

## 2. System diagram

```
                      ┌───────────────────────────────────────────────┐
   Web (Next.js) ────▶│                API Gateway (NestJS)           │
   Mobile (Expo) ────▶│  authn (Clerk JWT) · authz (RBAC) · rate-lim  │
   Public API ───────▶│  OpenAPI · Zod validation · audit log         │
   Browser ext ──────▶└───────┬───────────────┬───────────────────────┘
                              │               │ enqueue
                    ┌─────────▼────────┐  ┌───▼─────────────────────────┐
                    │ Core services    │  │        Redis / BullMQ       │
                    │ accounts, teams, │  └───┬─────────────────────────┘
                    │ billing, reports │      │ workers (ECS, autoscale)
                    └─────────┬────────┘  ┌───▼─────────────────────────┐
                              │           │ Ingest & Sync (Graph API)   │
                    ┌─────────▼────────┐  │ Feature Extraction (Py/GPU) │
                    │  PostgreSQL 16   │◀─┤ Scoring (Py, LightGBM)      │
                    │  (+ pgvector)    │  │ Trend clustering (Py)       │
                    └─────────┬────────┘  │ Engine Gateway → Claude API │
                              │           │ Report/Digest builders      │
                    ┌─────────▼────────┐  └───┬─────────────────────────┘
                    │  S3 (media,      │◀─────┘
                    │  features, PDFs) │        Meta Graph API ▲ (sync, webhooks)
                    └──────────────────┘        Stripe ▲  Resend ▲  Datadog ▲
```

## 3. Multi-tenancy & permissions

- Tenant = workspace. Every row carries `workspace_id`; Postgres **row-level security** enforced as defence-in-depth beneath application-layer scoping (R1-5).
- RBAC roles: `owner`, `admin`, `manager`, `analyst`, `creator`, `billing`; agency workspaces add per-client-account grants. Public API keys are workspace-scoped with permission sets.
- Enterprise: SAML/SSO + SCIM via Clerk; audit log (append-only table + S3 export) for auth, data access, exports, deletions.

## 4. Meta integration layer (highest-risk dependency → most engineered)

- Single **Meta Gateway** service owns all Graph API traffic: central token vault (tokens encrypted with KMS envelope encryption, never logged), per-app + per-token rate budgeting, circuit breakers, API-version pinning with a tested upgrade runway (Meta versions sunset ~2 years), full request/response audit (metadata, not payloads).
- Webhooks (where available) reduce polling; sync jobs are idempotent snapshots.
- **Kill-switch degradation ladder** (drill quarterly, R4-1): API healthy → full product; rate-limited → stale-with-timestamp data; token revoked → user reconnect flow; app restricted → Studio mode (uploads + analysis, no sync) keeps the product alive.

## 5. AI pipeline architecture

Per-asset analysis is a resumable BullMQ flow: `ingest → normalise → scenes → frames(fan-out) → audio → narrative → features-assemble → score → narrate(LLM) → persist`. Every step writes to `analysis_steps` with version + hash; re-running a new feature-extractor version creates a new `feature_version`, never overwrites. GPU stages (vision embeddings, Whisper) run on a small GPU ASG with queue-depth autoscaling; LLM narration cached by (feature_hash, prompt_version). Cost telemetry per step per tenant flows to Datadog with per-tier ceilings alarmed (R4-2).

## 6. Environments & delivery

`dev` (per-PR preview: Vercel preview + ephemeral API namespace) → `staging` (prod-shaped, synthetic + consented mirror data) → `prod`. Trunk-based, PRs require review + green CI (typecheck, unit, integration, e2e smoke, SAST, dependency + secret scan). DB migrations via Prisma Migrate with expand/contract pattern; rollback = redeploy previous task-set + contract-phase deferral.

## 7. Scale posture

Designed-for targets (Y2): 50k workspaces, 200k connected accounts, ~1M analyses/mo (~0.4 QPS sustained, 30× burst on trend days), p95 API < 300ms, analysis p95 < 90s. Everything stateful is managed (Aurora, ElastiCache, S3) — the scaling work is worker autoscaling and Postgres partitioning of `metric_snapshots` (by month) + `content_features` (by workspace hash), both in the schema from day one.

## 8. Reliability

SLOs: API 99.9% monthly; analysis pipeline 99% within-SLA completion; RPO 15 min (Aurora PITR + cross-region snapshot copies), RTO 4h (Terraform re-provision runbook, drilled). Backups: automated daily + PITR; S3 versioning + replication for media/features. Incident process in [Operations Manual](14-operations-and-support.md).
