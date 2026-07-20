# EchoSight AI — Database Schema (PostgreSQL 16)

Owner: Principal Software Engineer. Conventions: `uuid` PKs (v7), `timestamptz` everywhere, soft-delete only where legally required (else hard delete for privacy), every tenant-scoped table carries `workspace_id` with RLS policy `USING (workspace_id = current_setting('app.workspace_id')::uuid)`.

```sql
-- ============ Identity & tenancy ============
CREATE TABLE workspaces (
  id            uuid PRIMARY KEY,
  name          text NOT NULL,
  kind          text NOT NULL CHECK (kind IN ('creator','agency','brand','enterprise')),
  plan          text NOT NULL DEFAULT 'free',        -- free|starter|pro|agency|enterprise
  stripe_customer_id text UNIQUE,
  settings      jsonb NOT NULL DEFAULT '{}',          -- branding, defaults, data-residency cell
  created_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz                            -- grace-period soft delete, purged by job
);

CREATE TABLE users (
  id            uuid PRIMARY KEY,
  clerk_user_id text UNIQUE NOT NULL,
  email         citext UNIQUE NOT NULL,
  display_name  text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('owner','admin','manager','analyst','creator','billing')),
  PRIMARY KEY (workspace_id, user_id)
);

-- Agencies: which members may access which client social accounts
CREATE TABLE account_grants (
  workspace_id  uuid NOT NULL,
  user_id       uuid NOT NULL,
  social_account_id uuid NOT NULL,
  PRIMARY KEY (workspace_id, user_id, social_account_id)
);

-- ============ Social accounts & sync ============
CREATE TABLE social_accounts (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform      text NOT NULL DEFAULT 'instagram',
  ig_user_id    text NOT NULL,                        -- Graph API IG User ID
  username      text NOT NULL,
  kind          text NOT NULL CHECK (kind IN ('owned','competitor')),
  niche         text,
  connected_by  uuid REFERENCES users(id),
  token_ref     text,                                 -- vault key, owned accounts only; token itself in KMS-encrypted vault
  token_status  text NOT NULL DEFAULT 'none',         -- none|active|expired|revoked
  metric_availability jsonb NOT NULL DEFAULT '{}',    -- which insight metrics this account/API version exposes
  training_opt_out boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, ig_user_id, kind)
);

CREATE TABLE sync_runs (
  id            uuid PRIMARY KEY,
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  workspace_id  uuid NOT NULL,
  kind          text NOT NULL,                        -- backfill|incremental|webhook
  status        text NOT NULL,                        -- queued|running|ok|failed|rate_limited
  window_from   timestamptz, window_to timestamptz,
  error         jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============ Content ============
CREATE TABLE assets (                                  -- one creative work (pre-flight and/or published)
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE SET NULL,
  origin        text NOT NULL CHECK (origin IN ('upload','synced','api')),
  media_type    text NOT NULL CHECK (media_type IN ('reel','carousel','image','story')),
  ig_media_id   text,                                  -- when published/synced
  perceptual_hash text,                                -- pre-flight ↔ published matching
  storage_key   text,                                  -- S3; NULL for synced-metadata-only
  caption       text,
  posted_at     timestamptz,
  campaign_id   uuid,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON assets (workspace_id, posted_at DESC);
CREATE INDEX ON assets (perceptual_hash);

CREATE TABLE asset_versions (                          -- pre-flight iterations of one asset
  id            uuid PRIMARY KEY,
  asset_id      uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  workspace_id  uuid NOT NULL,
  version_no    int  NOT NULL,
  storage_key   text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_id, version_no)
);

-- ============ Analysis & ML ============
CREATE TABLE analyses (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  asset_id      uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  asset_version_id uuid REFERENCES asset_versions(id),
  pipeline_version text NOT NULL,                     -- e.g. 'fx-2.3.0'
  status        text NOT NULL,                        -- queued|running|ok|failed
  features      jsonb,                                -- content_features payload
  feature_hash  text,
  teardown_md   text,                                 -- LLM narrative (cache by feature_hash+prompt_version)
  cost_cents    numeric(8,3),
  created_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);
CREATE INDEX ON analyses (workspace_id, asset_id, created_at DESC);

CREATE TABLE content_embeddings (
  analysis_id   uuid PRIMARY KEY REFERENCES analyses(id) ON DELETE CASCADE,
  workspace_id  uuid NOT NULL,
  embedding     vector(1024) NOT NULL,
  niche         text
);
CREATE INDEX ON content_embeddings USING hnsw (embedding vector_cosine_ops);

CREATE TABLE predictions (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  analysis_id   uuid NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  model_version text NOT NULL,
  scores        jsonb NOT NULL,   -- {virality, hook, scroll_stop, retention_band, p_save, p_share, p_comment, p_follow, p_conversion, confidence_grade, top_factors[]}
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outcomes (                                -- reconciled actuals for published assets
  asset_id      uuid PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
  workspace_id  uuid NOT NULL,
  horizon_hours int NOT NULL DEFAULT 168,
  metrics       jsonb NOT NULL,                        -- reach, views, saves, shares, comments, likes, follows_attributed, link_clicks…
  vs_baseline   jsonb NOT NULL,                        -- multipliers vs account p50 per format
  reconciled_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recommendations (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  analysis_id   uuid REFERENCES analyses(id) ON DELETE CASCADE,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE CASCADE,
  action_key    text NOT NULL,                         -- playbook action id
  payload       jsonb NOT NULL,                        -- rendered instruction, expected impact band, rank
  status        text NOT NULL DEFAULT 'open',          -- open|adopted|dismissed|expired
  adopted_at    timestamptz,
  measured_lift jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE experiments (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  hypothesis    text NOT NULL,
  metric        text NOT NULL,
  target        jsonb NOT NULL,
  status        text NOT NULL DEFAULT 'active',        -- active|won|lost|inconclusive|abandoned
  result        jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  closed_at     timestamptz
);

-- ============ Time-series metrics (partitioned by month) ============
CREATE TABLE metric_snapshots (
  social_account_id uuid NOT NULL,
  workspace_id  uuid NOT NULL,
  asset_id      uuid,                                  -- NULL = account-level snapshot
  captured_at   timestamptz NOT NULL,
  metrics       jsonb NOT NULL,
  PRIMARY KEY (social_account_id, captured_at, asset_id)
) PARTITION BY RANGE (captured_at);

-- ============ Trends ============
CREATE TABLE trends (
  id            uuid PRIMARY KEY,
  niche         text NOT NULL,
  week          date NOT NULL,
  cluster_key   text NOT NULL,
  title         text NOT NULL,
  evidence      jsonb NOT NULL,                        -- counts, growth rate, example public refs, evidence_base label
  lifecycle     text NOT NULL,                         -- emerging|peaking|declining
  brief_md      text,
  UNIQUE (niche, week, cluster_key)
);

CREATE TABLE trend_follows (
  workspace_id  uuid NOT NULL,
  trend_id      uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  alert         boolean NOT NULL DEFAULT true,
  PRIMARY KEY (workspace_id, trend_id)
);

-- ============ Generation ============
CREATE TABLE brand_memories (
  social_account_id uuid PRIMARY KEY REFERENCES social_accounts(id) ON DELETE CASCADE,
  workspace_id  uuid NOT NULL,
  profile       jsonb NOT NULL,                        -- voice, structures, palette, taboo list, updated_by version
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE generations (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE SET NULL,
  kind          text NOT NULL,                         -- hooks|caption|script|carousel|story|ad|thumbnail|storyboard|email|landing|higgsfield_pack|fable_pack
  brief         jsonb NOT NULL,
  output        jsonb NOT NULL,
  credits       int NOT NULL,
  feedback      text CHECK (feedback IN ('kept','edited','discarded')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============ Reports, automations, campaigns ============
CREATE TABLE campaigns (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  name text NOT NULL, starts_on date, ends_on date, goal jsonb
);

CREATE TABLE report_templates (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  name text NOT NULL, branding jsonb NOT NULL DEFAULT '{}', sections jsonb NOT NULL
);

CREATE TABLE reports (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  template_id uuid REFERENCES report_templates(id),
  social_account_id uuid REFERENCES social_accounts(id),
  period daterange NOT NULL, status text NOT NULL DEFAULT 'draft',
  content jsonb, pdf_key text, delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE automation_rules (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  kind text NOT NULL,                                  -- scheduled_report|metric_alert|competitor_breakout|trend_match|digest
  config jsonb NOT NULL, channel jsonb NOT NULL,       -- email|push|slack_webhook
  enabled boolean NOT NULL DEFAULT true,
  last_fired_at timestamptz
);

-- ============ Billing & usage ============
CREATE TABLE subscriptions (
  workspace_id uuid PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE NOT NULL,
  plan text NOT NULL, seats int NOT NULL DEFAULT 1,
  status text NOT NULL, current_period_end timestamptz,
  addons jsonb NOT NULL DEFAULT '{}'                   -- white_label, extra_accounts, credit packs
);

CREATE TABLE usage_events (                            -- metering source of truth → Stripe usage records
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  kind text NOT NULL,                                  -- analysis|generation_credit|api_call
  quantity int NOT NULL DEFAULT 1,
  ref_id uuid, created_at timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- ============ Platform ============
CREATE TABLE api_keys (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  name text NOT NULL, key_hash text UNIQUE NOT NULL,   -- SHA-256; plaintext shown once
  scopes text[] NOT NULL, last_used_at timestamptz,
  revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE webhook_endpoints (
  id uuid PRIMARY KEY, workspace_id uuid NOT NULL,
  url text NOT NULL, secret_ref text NOT NULL, events text[] NOT NULL,
  status text NOT NULL DEFAULT 'active', failure_count int NOT NULL DEFAULT 0
);

CREATE TABLE audit_log (                               -- append-only; INSERT-only role
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  workspace_id uuid, actor_user_id uuid, actor_api_key_id uuid,
  action text NOT NULL, target jsonb, ip inet,
  created_at timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);
```

## Design notes

- **Privacy by construction:** there is no table for follower-level individuals; audience data lives only as aggregates inside `metric_snapshots.metrics`. Deletion: workspace delete cascades; a purge job hard-deletes after the 30-day grace window and emits deletion certificates to `audit_log`.
- **Flywheel tables:** `analyses.features` + `outcomes` joined on `asset_id` is the training corpus; `social_accounts.training_opt_out` filters it at extraction time.
- **JSONB where schemas evolve fast** (features, scores, metrics) with versioned payloads (`pipeline_version`, `model_version`) — migrations stay rare while models iterate weekly.
- **Partitioning** on the three unbounded tables (`metric_snapshots`, `usage_events`, `audit_log`) from day one; monthly partitions auto-managed by pg_partman.
