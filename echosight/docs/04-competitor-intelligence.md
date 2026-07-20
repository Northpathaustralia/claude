# EchoSight AI — Competitor & Audience Intelligence Specification

Council owners: Meta API Specialist, Data Scientist, Legal Counsel, Privacy Officer. Red-teamed: round R2 (data-source legitimacy audit).

---

## 1. Non-negotiable data rules

1. **Sources:** Instagram Graph API **Business Discovery** (public professional accounts' public media and public counts), **oEmbed** (public post rendering), and data the user's own account is authorised to see. Nothing else. No scraping, no headless browsers, no third-party scraped datasets, no private accounts, ever.
2. Business Discovery returns only what Meta exposes: public profile info, follower counts, media with like/comment counts (where the target hasn't hidden them). **We design to this ceiling** and label every derived metric as an estimate.
3. If a target account is private or non-professional, we say "not trackable" — we never suggest workarounds.
4. Rate-limit stewardship: tracked-account refresh cadence adapts to plan and account activity (default 2×/day) and is centrally throttled far below platform limits.

## 2. What users can track (per competitor)

| Insight | Derivation | Label |
| --- | --- | --- |
| Posting frequency & mix | Public media timeline | Exact |
| Content categories | Our classifiers on public media | AI-classified |
| Estimated engagement quality | (likes+comments)/followers, format-adjusted, hidden-likes handled via comments-only model | **Estimate** |
| Growth trend | Follower-count time series (our snapshots from tracking start) | Exact from tracking start |
| Visual style profile | Vision embeddings: palette, grading, composition clusters | AI-derived |
| Hook styles | Hook classifier on public Reels | AI-derived |
| Audio usage | Audio fingerprint vs. known-audio index | AI-derived |
| Posting times | Public timestamps | Exact |
| Winning formats | Top-decile public posts by engagement estimate, clustered | Estimate |
| Weaknesses / opportunities | Gap analysis: categories/hooks the competitor under-serves vs. niche demand | AI-derived narrative |

## 3. Product surfaces

- **Competitor board:** tracked accounts as cards (trend arrows, cadence, top post this week). Tier limits per [Product Spec §7](02-product-specification.md).
- **Head-to-head:** user account vs. competitor across cadence, engagement quality estimate, format mix, hook styles; "what they do that you don't" panel.
- **Breakout alerts:** competitor post exceeding 3× their typical engagement estimate triggers an alert with a teardown of the public creative.
- **Opportunity report (weekly):** unserved topics/formats in the niche = demand signals from trends minus competitor coverage.

## 4. Ethical envelope

- All competitor analysis is framed as *craft learning*, not surveillance. No alerts on individuals; targets are professional public accounts.
- Teardowns of competitor content analyse the public creative only, and generation features produce *original* content briefs — the generator's plagiarism guard (embedding-similarity ceiling vs. source) blocks near-copies (red-team R2-6).
- A tracked account that converts to private is automatically dropped with history frozen and a notice to the user.

## 5. Audience Intelligence (companion module)

- **Sources:** Graph API audience aggregates for the user's own account (age/gender/geo/active-times, only above Meta's own minimum thresholds) + our content-interaction analysis.
- **Method:** we segment *content*, not people: topic/format clusters of the user's library scored by which aggregate outcomes they drive (saves-heavy vs. comments-heavy vs. reach-heavy). Output: "audience appetite map" — what this audience rewards, with evidence.
- **Privacy floor:** no individual-follower features anywhere in the product; minimum cohort n ≥ 100 for any displayed slice; no cross-account identity joins.
