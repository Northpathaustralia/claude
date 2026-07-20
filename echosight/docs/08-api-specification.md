# EchoSight AI — API Specification

Owner: Principal Software Engineer. Public API available on Agency and Enterprise plans; the first-party web/mobile apps consume the same API surface (dogfooding guarantee).

---

## 1. Fundamentals

- **Base URL:** `https://api.echosight.ai/v1`
- **Auth:** `Authorization: Bearer <key>` — workspace-scoped API keys (public API) or Clerk-issued JWT (first-party apps). Keys carry scopes: `analytics:read`, `assets:write`, `analysis:read`, `generate:write`, `webhooks:manage`, `reports:read`.
- **Format:** JSON; errors follow RFC 9457 Problem Details (`type`, `title`, `status`, `detail`, `instance`, plus `request_id`).
- **Versioning:** URL major version; additive changes are non-breaking; deprecations announced ≥ 6 months with `Sunset` headers.
- **Rate limits:** per key: Agency 300 req/min, Enterprise custom; `429` with `Retry-After`; limits surfaced in `X-RateLimit-*` headers.
- **Pagination:** cursor-based: `?limit=50&cursor=…` → `{data: [...], next_cursor}`.
- **Idempotency:** `Idempotency-Key` header honoured on all POSTs for 24h.

## 2. Resources

### 2.1 Accounts & analytics

```
GET  /accounts                                  # connected social accounts
GET  /accounts/{id}                             # incl. metric_availability, token_status
GET  /accounts/{id}/metrics?from=&to=&granularity=day
                                                # account-level time series (reach, follows, profile_views…)
GET  /accounts/{id}/baselines                   # p25/p50/p75 per format + engagement quality index
GET  /accounts/{id}/media?from=&to=             # synced posts with per-post metrics + vs_baseline
```

### 2.2 Assets & analysis (Pre-Flight)

```
POST /assets                                    # register upload → returns S3 presigned upload URL
POST /assets/{id}/analyses                      # start analysis {version_id?} → 202 {analysis_id}
GET  /analyses/{id}                             # status | features summary | teardown_md | scores
GET  /analyses/{id}/recommendations             # ranked actions
POST /analyses/{id}/feedback                    # {rating: up|down, reason}
```

Analysis completion is asynchronous: poll or subscribe to the `analysis.completed` webhook.

### 2.3 Predictions & outcomes

```
GET  /assets/{id}/prediction                    # latest scores + confidence_grade + top_factors
GET  /assets/{id}/outcome                       # reconciled actuals + predicted-vs-actual delta
GET  /accounts/{id}/accuracy                    # rolling prediction accuracy for this account
```

### 2.4 Competitors & trends

```
POST /competitors                               # {username} → validated via Business Discovery; 422 if private/non-professional
GET  /competitors                               # tracked list with latest snapshots
GET  /competitors/{id}/insights?window=30d      # cadence, format mix, engagement estimates (labelled), breakouts
GET  /trends?niche=fitness&date=2026-07-20      # daily trend report
```

### 2.5 Generation

```
POST /generate                                  # {kind, account_id?, brief{...}} → 202 {generation_id}
GET  /generations/{id}                          # structured output + credits charged
POST /generate/packs                            # {kind: higgsfield|fable, source: script|storyboard, source_id}
```

### 2.6 Reports & automations

```
GET/POST /report-templates
POST /reports                                   # {template_id, account_id, period} → draft
GET  /reports/{id}                              # content blocks + pdf_url when rendered
GET/POST/DELETE /automations
```

### 2.7 Webhooks

```
GET/POST/DELETE /webhooks
```

Events: `analysis.completed`, `analysis.failed`, `outcome.reconciled`, `competitor.breakout`, `trend.matched`, `report.ready`, `account.token_expired`. Delivery: HMAC-SHA256 signature (`X-EchoSight-Signature`, timestamped to block replay), 3 retries with exponential backoff, auto-disable after 20 consecutive failures with email notice.

## 3. Representative payload

`GET /analyses/{id}` (completed):

```json
{
  "id": "0198c9b2-…",
  "status": "ok",
  "asset_id": "0198c9a1-…",
  "pipeline_version": "fx-2.3.0",
  "scores": {
    "virality": 74, "hook": 88, "scroll_stop": 81,
    "retention_band": "45-60%",
    "p_save": 0.062, "p_share": 0.031, "p_comment": 0.019, "p_follow": 0.008,
    "confidence_grade": "B",
    "top_factors": [
      {"feature": "hook.pattern_interrupt", "direction": "up", "note": "Motion + text hook within 0.8s"},
      {"feature": "pacing.cuts_per_10s", "direction": "down", "note": "1.9 vs your winning band 3.0–4.5"},
      {"feature": "caption.cta_position", "direction": "down", "note": "CTA buried at line 6"}
    ]
  },
  "teardown_md": "## Why this Reel scores 74…",
  "recommendations_url": "/v1/analyses/0198c9b2-…/recommendations"
}
```

## 4. API governance

- OpenAPI 3.1 document is the source of truth; SDKs (TypeScript, Python) generated from it each release.
- All endpoints scoped by workspace from the key — cross-workspace access is structurally impossible (key → workspace join, plus RLS beneath).
- Public API never exposes any field that could identify an individual follower — enforced by response-schema allowlists, tested in CI (red-team R2-4).
- Usage metered to `usage_events` per call for billing and abuse detection; anomaly alerts on key-level spikes.
