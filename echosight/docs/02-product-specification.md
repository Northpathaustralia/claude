# EchoSight AI — Product Specification

Council owners: CPO, Senior UX Designer, Senior UI Designer, Instagram Growth Specialist, Meta API Specialist. Red-teamed: rounds R1, R2.

Related: [AI Engines](03-ai-engines.md) · [Competitor Intelligence](04-competitor-intelligence.md) · [Creative Generator](05-content-generator-and-integrations.md) · [API Spec](08-api-specification.md).

---

## 0. Product principles

1. **Explain, don't just report.** Every number ships with a *why* and a *what to do*.
2. **Authorised data only.** If it isn't available via Graph API, first-party upload, or user consent, it isn't in the product. A visible "Where this data comes from" affordance exists on every insight.
3. **Time-to-value < 10 minutes.** Connect account → first content teardown in one session.
4. **Honest AI.** Every prediction shows a confidence score; low-confidence outputs say so.
5. **One loop.** Analyse → understand → generate → publish → measure → learn. Every feature must sit on this loop or it's cut.

## 1. Personas

| Persona | Snapshot | Primary jobs-to-be-done |
| --- | --- | --- |
| **Cara — Creator** | 85k followers, fitness, monetises via brand deals + course | "Tell me why my Reels flop or fly; help me make the next one better, fast." |
| **Ahmed — Agency lead** | 12-person social agency, 40 client accounts | "Prove value to clients monthly without burning analyst hours; scale creative quality across juniors." |
| **Bianca — Brand social manager** | DTC skincare, 3-person team | "Hit engagement + conversion targets; keep the feed on-brand; watch competitors." |
| **Enterprise — Regional marketing org** | Multi-brand, multi-market | "Governance, benchmarks across brands, SSO, API into our BI." |

## 2. Information architecture

```
EchoSight AI
├── Home (AI Dashboard — role-aware)
├── Content
│   ├── Library (published, synced via Graph API)
│   ├── Pre-Flight (uploads analysed before publishing)
│   └── Teardowns (full analysis view per asset)
├── Predict (Prediction Engine workspace)
├── Coach (AI Coach — weekly plan, experiments)
├── Trends (daily trend reports, saved trends)
├── Competitors (tracked accounts, comparisons)
├── Audience (audience intelligence)
├── Create (Creative Generator + Higgsfield/Fable packs)
├── Automations (reports, alerts, digests)
├── Reports (agency/brand reporting, white-label)
├── Settings (accounts, team, billing, data & privacy)
└── Developer (API keys, webhooks, docs) [Agency+]
```

## 3. Dashboards

All dashboards share one component system (see [Brand Guidelines §Design System](11-brand-guidelines.md)); they differ by default cards, KPIs and permissions — not by codebase.

### 3.1 AI Dashboard (universal home)

The first screen after login. Answers "what should I know and do today?" in one viewport:

- **Today's Brief** (LLM-composed, 3–5 bullets): notable performance changes with explanations, e.g. "Tuesday's Reel is outperforming your median by 3.1× — the 0.8s pattern-interrupt hook is the main driver (Hook Score 91)."
- **Priority Actions** (max 3, ranked by expected impact): from the Recommendation Engine.
- **Pre-Flight queue**: assets awaiting analysis or improvement.
- **Trend radar**: top 3 trends relevant to the user's niche today.
- Empty states double as onboarding: each card explains what will appear and offers the action that populates it.

### 3.2 Creator Dashboard

KPIs: follower growth, reach, saves, shares, profile visits→follows conversion, estimated content grade. Cards: content scoreboard (best/worst this month + why), retention curve of latest Reel, coach's weekly plan, next-post recommendation (format, topic, hook style, predicted range).

### 3.3 Agency Dashboard

- Client portfolio grid: every client account with health status (green/amber/red on growth, engagement quality, posting consistency), sortable.
- Cross-client insights: "hook styles working across your fitness clients this month."
- Report centre: white-label monthly reports (auto-generated commentary, editable), scheduled delivery.
- Team management: roles (Owner, Manager, Analyst, Creator-seat), per-client access control, approval workflows for generated content.

### 3.4 Brand Dashboard

- Brand consistency tracker: visual/tonal consistency score across the grid (vision embedding distance from brand centroid; on-brand palette/logo/type detection on uploads).
- Funnel view: reach → engagement → profile visit → link click (Graph API metrics) with content attribution.
- Campaign workspaces: group posts into campaigns; campaign-level scores and lift vs. account baseline.
- Competitor panel pinned by default.

### 3.5 Enterprise Dashboard

Everything in Brand, plus: multi-workspace rollups, cross-brand benchmarks, governance (SSO/SAML, SCIM, audit log, data-retention controls), API usage console, custom model tuning status (enterprise fine-tuning on own history — opt-in).

## 4. Core module specifications

### 4.1 Analytics Engine

- **Source:** Instagram Graph API for professional accounts (insights for reach, impressions/views, saves counts, shares counts, comments, likes, profile activity, audience aggregates, Stories metrics within their availability windows). Metric availability varies by API version; the sync layer records `metric_availability` per account so UI never shows dead tiles.
- **Sync:** initial backfill (up to 90 days or API limit), then webhook-driven + scheduled incremental sync (hourly for active accounts, adaptive back-off). All metrics stored as immutable time-series snapshots (see [DB schema](07-database-schema.md)) so trends survive API metric renames.
- **Derived metrics:** engagement quality index (weights saves & shares over likes), velocity (engagement in first N hours vs. account baseline), consistency score, baseline bands (p25–p75 per format) used everywhere as context ("above your typical range").
- **Aggregate counts only:** saves/shares/etc. are used strictly as counts from the API. The UI never implies identity-level knowledge ("Who saved this" does not exist anywhere, including in generated copy — enforced by a copy-lint rule in CI; see red-team R1-4).

### 4.2 Prediction Engine

Spec in [03-ai-engines.md §3](03-ai-engines.md). Product surface: Pre-Flight (upload → scores + ranges before posting), Predict workspace (compare up to 4 candidate assets), Score badges across the app. Every score shows: value, confidence, top 3 contributing factors, and "based on N similar posts from accounts like yours."

### 4.3 Recommendation Engine & AI Coach

Spec in [03-ai-engines.md §4–5](03-ai-engines.md). Product surface: Priority Actions, per-asset improvement lists (each item: what → why → how → expected impact band), weekly Coach plan (3 experiments max, each with a hypothesis and a measurable target), experiment tracker that closes the loop ("You tested question-hooks: +38% median saves across 4 posts — adopting as default").

### 4.4 Content Analysis Engine

Spec in [03-ai-engines.md §2](03-ai-engines.md). Product surface: Teardown page per asset — score header, frame-by-frame timeline (hook window highlighted), retention-risk markers, caption/CTA/hashtag analysis, audio analysis, visual style panel, "why" narrative.

### 4.5 Trend Detection Engine

Spec in [03-ai-engines.md §6](03-ai-engines.md). Product surface: daily trend report (email + in-app), trend cards (what, evidence, lifecycle stage: emerging/peaking/declining, "make this yours" → one-click brief into Creative Generator), saved trends with alerts.

### 4.6 Competitor Intelligence

Full spec: [04-competitor-intelligence.md](04-competitor-intelligence.md).

### 4.7 Audience Intelligence

From Graph API audience aggregates (demographics, geography, active hours — only where the API provides them and thresholds are met) plus behavioural inference from content interactions: which topics/formats each *segment of content* (not person) attracts. Explicitly aggregate: minimum-cohort thresholds (n ≥ 100) before any audience slice renders (privacy by design).

### 4.8 Creative Generator, Higgsfield & Fable packs

Full spec: [05-content-generator-and-integrations.md](05-content-generator-and-integrations.md).

### 4.9 Marketing Automation

Scheduled white-label reports; alert rules (metric crosses band, competitor posts breakout content, trend matches saved topics) delivered via email/push/Slack webhook; weekly digest. **Not** auto-posting to Instagram in v1 (reduces API surface/risk; publishing via API is roadmap Phase 3 behind its own review — red-team R2-3).

### 4.10 API Platform

Public REST API (Agency+): read analytics, submit assets for analysis, retrieve scores/recommendations, manage webhooks. Full spec: [08-api-specification.md](08-api-specification.md).

### 4.11 Apps beyond web

| Surface | Scope (phase) | Notes |
| --- | --- | --- |
| **Mobile app** (Phase 2) | React Native/Expo. Capture → Pre-Flight on device, push alerts, Today's Brief, coach chat. Not full dashboards. | Creators live on mobile; Pre-Flight-at-capture is the killer use |
| **Desktop app** (Phase 3) | Tauri wrapper of web app + local batch upload watcher | Low build cost; agency editors drag exports in |
| **Browser extension** (Phase 2) | Overlay scores/notes on instagram.com *for the user's own connected accounts and public pages they visit*, reading the DOM they already see; adds "save as inspiration" clipper | Extension never scrapes in background, never collects pages the user doesn't visit, never accesses private data — it annotates the user's own browsing (red-team R2-5 constraints) |

## 5. Key user flows

### 5.1 Onboarding (Creator)

1. Sign up (email/Google/Apple) → 2. Connect Instagram professional account via Facebook Login for Business (permission explainer screen with plain-English scopes; skippable) → 3. Pick niche + goals (2 screens) → 4. **Instant value moment:** backfill runs in background; meanwhile user drags any video/image into Pre-Flight and gets a full teardown in <60s → 5. AI Dashboard populated as backfill completes; first Coach plan generated at first-week mark.
- Skipped connection = "Studio mode": full Pre-Flight analysis on uploads, generic benchmarks instead of personal baselines. (Also the zero-API-risk fallback mode — strategic hedge.)

### 5.2 Pre-Flight

Upload (drag-drop, mobile capture, or API) → analysis pipeline (target p95 < 90s for a 60s Reel) → teardown + scores + ranked fixes → user iterates (each new cut re-scored, diff view shows score movement) → export caption/hashtags/cover-frame recommendation → post natively → EchoSight auto-links the published post to its pre-flight versions (matching by perceptual hash) and later reconciles predicted vs. actual — which feeds both the user's trust and the training flywheel.

### 5.3 Agency monthly report

Report centre → select client + month → engine drafts full report (KPIs, wins with *why*, losses with *why*, next-month plan) → analyst edits in report editor (blocks are regenerable individually) → white-label PDF/web link → schedule for auto-delivery next month.

## 6. UX / UI standards

- **Design system:** "Prism" — tokens, components and motion defined in [11-brand-guidelines.md](11-brand-guidelines.md). Dark-first with full light mode; glass surfaces reserved for elevated/overlay layers; density toggle for agency power users.
- **Accessibility:** WCAG 2.2 AA. All score information encoded redundantly (colour + number + label). Full keyboard nav; charts have data-table fallbacks; motion respects `prefers-reduced-motion`.
- **Performance budgets:** LCP < 1.8s p75, INP < 200ms, initial JS < 250KB gzipped on dashboard routes.
- **Empty/loading/error triad** specified for every card in the component library — no dead ends; every error state names the cause (e.g. "Instagram token expired — reconnect") and the fix.
- **Explainability affordance:** every score chip opens "Why this score" popover; every AI output carries an AI-generated badge and a feedback control (👍/👎 + reason) feeding the eval pipeline.

## 7. Tier gating (product view)

| Capability | Free | Starter | Pro | Agency | Enterprise |
| --- | --- | --- | --- | --- | --- |
| Connected IG accounts | 1 | 1 | 3 | 15 (then per-account) | Custom |
| Pre-Flight analyses /mo | 5 | 30 | 150 | 600 pooled | Custom |
| Prediction + Coach | Scores only | ✓ | ✓ | ✓ | ✓ |
| Trend reports | Weekly | Daily | Daily + alerts | Daily + alerts | Custom feeds |
| Competitor tracking | — | 2 accounts | 10 | 25/client | Custom |
| Creative Generator credits /mo | 10 | 100 | 500 | 2,000 pooled | Custom |
| Higgsfield/Fable packs | — | — | ✓ | ✓ | ✓ |
| White-label reports | — | — | — | ✓ | ✓ |
| API + webhooks | — | — | — | ✓ | ✓ (higher limits) |
| SSO/SAML, audit log | — | — | — | — | ✓ |

## 8. Out of scope (v1) — explicit

Auto-publishing; DM management; follower "audit" of individual followers; any per-user activity claims; TikTok/YouTube ingestion (roadmap); engagement pods/growth automation of any kind (never — policy).
