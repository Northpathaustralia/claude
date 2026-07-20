# EchoSight AI — Security, Privacy & Platform Compliance

Council owners: Cyber Security Architect, Legal Counsel, Privacy Officer. Red-teamed: rounds R1, R2, R3 (this document is itself the primary control set; residual risks in [18-red-team-review.md](18-red-team-review.md)).

---

## 1. Platform compliance (Meta) — existential, therefore engineered

**Commitments (product-enforced, not policy-promised):**

1. **Authorised endpoints only.** All Instagram data flows through the Graph API (professional accounts via Facebook Login for Business), Business Discovery, and oEmbed. No scraping, no automation of the Instagram UI, no purchase of scraped datasets. The Meta Gateway service is the *only* code path with Meta credentials; egress rules block Instagram web hosts from all other services.
2. **No private-data claims, anywhere.** The product never states or implies knowledge of who saved/shared a post, DMs, private accounts, or any per-user activity. Enforced by: (a) UI copy-lint rule in CI scanning for banned claim patterns; (b) LLM output filter with the same banned-claims list; (c) marketing-copy review checklist. A public "What we will never do" page turns the constraint into brand equity.
3. **Permission minimalism.** Request only the scopes each feature needs (`instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`, business_management as required); incremental consent for later features; plain-English scope explainer at connect time.
4. **Standing compliance operations:** Meta App Review artefacts maintained; annual Data Use Checkup calendared with owner (Privacy Officer); API version upgrades rehearsed on staging within 30 days of each release; deletion callbacks (user deauthorises → we purge synced data for that account within 30 days, certificate logged).
5. **Data-sharing limits:** Platform data is never sold, never shared with third parties except processors under DPA, never used to build advertising audiences, and never merged across tenants at the individual level.

## 2. Privacy law compliance

| Regime | Key obligations | Implementation |
| --- | --- | --- |
| **Australian Privacy Act 1988 (APPs, incl. recent reforms)** | Open & transparent management (APP 1), collection minimisation (APP 3), use/disclosure limits (APP 6), security & destruction (APP 11), access/correction (APP 12–13); NDB scheme | Privacy policy in plain English; data inventory & ROPA maintained; retention schedule automated; breach response runbook with OAIC notification path (≤ 30 days assessment) |
| **GDPR** (EU customers) | Lawful basis, DPAs, DSRs, DPIA, international transfer safeguards | Lawful bases mapped per processing activity (contract for service, consent for model training on outcomes, legitimate interest + balancing test for product analytics); self-serve DSR portal (export + erasure ≤ 30 days, automated propagation to feature stores/backup exclusion lists); DPIA completed before launch; EU cell (eu-central-1) for EU data at Phase 2, SCCs meanwhile |
| **CCPA/CPRA** | Notice, deletion, opt-out of sale/share | No sale/share of personal information (attested); GPC signal honoured on the marketing site |
| **EU AI Act** (watchlist) | Transparency for AI systems | AI outputs labelled as AI-generated; scoring is not a prohibited/high-risk category, monitored by Privacy Officer |

**Data-subject principles baked in:** minimum-cohort thresholds (no audience slice under n=100), no follower-level records at all (see schema), pseudonymised training corpora, model-training opt-out per account without feature penalty, deletion certificates in the audit log.

## 3. Data classification & lifecycle

| Class | Examples | Controls | Retention |
| --- | --- | --- | --- |
| C4 Secrets | Meta tokens, API keys, webhook secrets | KMS envelope encryption, vault service, never logged, 90-day rotation where rotatable | Life of connection |
| C3 Platform/personal data | Synced metrics, media, emails | Encrypted at rest (AES-256) & transit (TLS 1.3), RLS, access-audited | Account life + 30-day purge |
| C2 Derived | Features, embeddings, scores | Tenant-scoped; pseudonymised in training snapshots | Account life + 30 days; training snapshots re-cut each cycle |
| C1 Aggregate | Niche benchmarks, trends | k-anonymous (n ≥ 50 accounts) | Indefinite |

## 4. Application & infrastructure security

**OWASP ASVS-mapped controls (top items):**

- **AuthN:** Clerk (MFA available, mandatory for admin roles); session tokens short-lived JWT + rotation; API keys hashed (SHA-256), shown once, scoped, revocable.
- **AuthZ:** central policy layer (workspace → role → resource) + Postgres RLS as second enforcement; IDOR tests in CI for every route (authz matrix test suite).
- **Input/output:** Zod validation on every boundary; parameterised queries only (Prisma); output encoding; CSP (no unsafe-inline), SRI, HSTS preload; SSRF: all outbound fetches through an egress proxy with allowlist (Meta, Stripe, Anthropic, Resend); file uploads: type sniffing, size caps, av-scan lambda, served from separate media domain.
- **Secrets:** AWS Secrets Manager + KMS; no secrets in env files or CI logs; gitleaks in CI.
- **Rate limiting & abuse:** per-IP + per-key + per-workspace budgets (Redis token buckets); signup friction ladder (email verify → captcha on anomaly); generation-credit abuse detection (velocity + similarity of briefs across workspaces); disposable-email + card-testing controls via Stripe Radar.
- **Fraud:** Stripe Radar rules + review queue; trial-abuse device fingerprinting (privacy-reviewed); refund/chargeback runbook.
- **Supply chain:** lockfiles + Renovate, `npm audit`/`pip-audit` gates, container base images pinned & scanned (Trivy), SBOM per release, SLSA-aligned build provenance in GitHub Actions.
- **Monitoring/detection:** CloudTrail + GuardDuty + Datadog security monitors (token-vault access, mass-export, RLS bypass attempts, impossible-travel admin logins); append-only audit log.
- **Pen testing:** external pen test before GA and annually; scoped bug-bounty (self-hosted disclosure policy → platform later).

## 5. Backups & resilience

Aurora PITR (RPO ≤ 15 min) + daily snapshots cross-region-copied; S3 versioning + replication; quarterly restore drills (evidence logged); Terraform-rebuildable infrastructure (RTO 4h drilled). Backup data honours deletion via exclusion-list rehydration filter (deleted tenants never restore).

## 6. Incident response

Severity matrix (SEV1: data breach/platform-wide outage → SEV4). On-call rotation via PagerDuty; IR runbook: detect → triage (15 min SLA SEV1) → contain → eradicate → recover → post-mortem (blameless, 5 days) → regulator/customer notification decision tree (Privacy Officer + Legal; OAIC/GDPR clocks pre-mapped). Tabletop exercise twice yearly, including the Meta-app-restricted scenario and the LLM-prompt-injection scenario (a hostile caption/comment attempting to steer LLM narration — mitigated by instruction/data separation in prompts and output filtering; tested in evals).

## 7. Compliance roadmap

SOC 2 Type I by month 9, Type II by month 18 (controls designed against Trust Services Criteria from day one — most controls above map directly); ISO 27001 consideration at enterprise demand; Meta App Review pre-GA; DPIA + privacy policy + ToS drafted by external counsel before beta (**ASSUMPTION:** budget A$60k Y1 legal).
