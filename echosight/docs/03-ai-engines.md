# EchoSight AI — AI Engine Specifications

Council owners: Principal AI Engineer, ML Engineer, Data Scientist, CTO. Red-teamed: rounds R1, R2, R4 (cold-start, leakage, cost).

---

## 1. System overview

Five model families behind one orchestration layer:

```
                          ┌────────────────────────────┐
 uploads / synced media ─▶│  Feature Extraction Layer  │─▶ content_features (versioned)
                          └────────────────────────────┘
                                        │
        ┌───────────────┬───────────────┼────────────────┬──────────────┐
        ▼               ▼               ▼                ▼              ▼
  Prediction      Recommendation   AI Coach        Trend Engine   Creative Gen
  (gradient-      (causal-ish      (LLM over       (time-series   (LLM + templates
  boosted +       feature attrib.  structured      + embedding    + brand memory)
  calibrated)     + playbooks)     insight JSON)   clustering)
```

Principles: (a) **features are the asset** — extraction is versioned and reproducible; (b) **LLMs narrate, models decide** — numeric scores come from trained models, language comes from LLMs grounded in those numbers; (c) **every output is evaluated** — golden sets, drift monitors, user feedback loops; (d) **cost is a design input** — model routing from cheap→expensive with early exits.

## 2. Content Analysis Engine (feature extraction)

Input: video (Reel), image set (carousel), single image, plus caption/hashtags/audio metadata. Output: `content_features` JSON (schema versioned, ~400 features) + human-readable teardown.

### 2.1 Pipeline stages

| Stage | Tech | Extracted |
| --- | --- | --- |
| Ingest & normalise | ffmpeg | fps-normalised frames, audio track, duration, aspect, loudness normalisation |
| Scene/cut detection | PySceneDetect + custom shot classifier | cut timestamps, cuts-per-10s (pacing), shot lengths distribution, transition types (cut/whip/zoom/morph) |
| Frame analysis (sampled + hook-dense: every frame 0–3s, then 2fps) | Vision model (multimodal LLM batch + CLIP-family embeddings) | subjects, faces + expression valence, text-on-screen (OCR), composition/visual hierarchy, colour palette & grading profile, motion magnitude (optical flow), brand elements (logo/palette match vs. brand kit) |
| Hook analysis (0–3s window) | Dedicated scorer over frame+audio+text features | pattern-interrupt presence, question/curiosity framing, motion onset, face presence, text hook, loudness onset — → Hook Score & Scroll-Stop factors |
| Audio | Whisper (transcript), audio embeddings, tempo/energy | speech rate, silence gaps, music energy curve, trending-audio match (against licensed/API-available audio metadata only), hook line text |
| Narrative | LLM over transcript + shot sequence | story arc type (problem→payoff, listicle, transformation, vlog…), payoff timing, loop potential (end-matches-start) |
| Caption/CTA/hashtags | LLM + classifiers | hook line strength, readability, CTA type & position, hashtag specificity mix, keyword/topic tags |
| Thumbnail/first frame | Vision scorer | legibility at feed size, face/emotion, text contrast, curiosity gap |

Perceptual hash (pHash + audio fingerprint) computed at ingest for pre-flight↔published matching and dedupe.

### 2.2 Teardown composition

An LLM (Claude Sonnet class; see [Prompt Library](19-prompt-library.md#teardown)) receives the feature JSON + account baselines and composes the narrative teardown. Guardrails: it may only cite numbers present in the JSON (schema-constrained citations, post-hoc validator rejects uncited claims); banned-claims list (anything implying private-data knowledge) enforced by output filter.

## 3. Prediction Engine

### 3.1 Targets

Per asset, relative to the posting account's own baseline (this normalisation is what makes a model trained across accounts transferable):

`P(save)`, `P(share)`, `P(comment)`, `P(follow-from-post)`, retention proxy (est. avg % watched band), reach multiplier band (vs. account median), and composite **Virality Score** (0–100, monotone blend of reach multiplier and share/save probabilities). Conversion probability only where the account has link-click/profile-activity data.

### 3.2 Models

- **v0 (launch, cold-start):** heuristic scorer from published research + expert rules (hook/pacing/caption weights), calibrated on the closed-beta corpus. Marketed honestly as "Content Score (beta)". Red-team R1-2 requires: no "prediction" language until v1 ships.
- **v1:** gradient-boosted trees (LightGBM) per target over `content_features` + account context (size band, niche, historical response profile). Trained on consented outcome data (opt-in-by-default with clear disclosure at account connect; opt-out honoured — see privacy). Calibrated (isotonic); grouped time-based CV by account to prevent leakage (R2-1).
- **v2:** multimodal embedding model (two-tower: content embedding × audience-context embedding) distilled into the production scorer; enterprise per-tenant fine-tune.

### 3.3 Confidence & honesty

Every score ships with a confidence grade (A–D) from: feature completeness, similarity of the account to training population (embedding distance), target base-rate stability. UI copy for D-grade: "Not enough similar data to predict reliably — here's the analysis instead." Weekly reconciliation job compares predicted vs. actual for every published asset; account-visible accuracy page ("how right have we been for you") — trust feature and churn defence.

### 3.4 Metrics & gates

Per-target AUC/PR-AUC on held-out accounts (not held-out posts — leakage), Brier score for calibration, and business-facing gate: top-quartile-flagged pre-flight posts must actually land in the account's top half ≥ 70% of the time before we market "prediction". Model cards for every release; drift monitors on feature distributions and score distributions.

## 4. Recommendation Engine

Turns feature attributions into ranked actions:

1. **Attribution:** SHAP values on the per-target models identify which features hurt/helped this asset vs. what the model would reward.
2. **Playbook mapping:** attributions map to a curated action library (~120 actions, each with: trigger conditions, instruction template, difficulty, expected-impact band, evidence tag). Curated by the Instagram Growth Specialist; versioned; per-action efficacy tracked (see 4.3).
3. **Ranking:** expected impact × feasibility × user's past adoption behaviour; max 5 per asset, max 3 on dashboard.
4. **Efficacy loop:** when a user adopts an action (self-reported or detected via feature diff between versions) and outcomes reconcile, the action's measured lift updates its expected-impact band. Actions that don't work get demoted — the playbook is self-correcting.

## 5. AI Coach

- **Form:** weekly plan + conversational interface. LLM (Claude Sonnet default, Opus-class for weekly plan composition) grounded exclusively in a structured **insight bundle**: account KPIs, baselines, recent teardowns, open experiments, trend matches, recommendation queue. The prompt contract ([Prompt Library §Coach](19-prompt-library.md#coach)) forbids claims beyond the bundle.
- **Experiment framework:** Coach proposes ≤3 experiments/week ("Hypothesis: question-hooks lift saves for you. Test: 2 posts this week. Measure: saves vs. 30-day median"). Tracker auto-evaluates when outcomes arrive. This converts coaching from vibes into measured iteration — the core retention loop.
- **Escalation honesty:** if the account's data contradicts a generic best practice, the bundle includes the contradiction and the Coach must side with the account's data, saying so explicitly.

## 6. Trend Detection Engine

- **Inputs (authorised only):** aggregate patterns across consenting EchoSight accounts (minimum cohort n ≥ 50 accounts per niche before a trend is derived from user data — privacy threshold), public data via Business Discovery / oEmbed for accounts users track, licensed trend/audio metadata feeds where commercially available (**ASSUMPTION:** at least one licensed data partner by Phase 2; until then trends derive from consenting-cohort + tracked-public-account data and are labelled with their evidence base).
- **Method:** content embeddings clustered per niche per week; clusters scored on growth rate (rising share of top-performing posts), novelty (distance from historical clusters), and breadth (number of distinct accounts). Lifecycle classifier: emerging → peaking → declining based on growth-curve shape.
- **Output:** daily report per niche: top trends with evidence ("seen across 34 tracked accounts, engagement quality 2.1× niche baseline"), lifecycle stage, an actionable brief, and expiry prediction. "Make this yours" hands the brief to the Creative Generator with the user's brand memory.

## 7. Creative Generator (model side)

See [05-content-generator-and-integrations.md](05-content-generator-and-integrations.md) for product spec. Model side: Claude-class LLM with (a) **brand memory** — a per-account style profile continuously distilled from the account's own top performers (voice, structures, topics, taboo list); (b) **evidence conditioning** — generation prompts embed the account's measured winning patterns and current trend briefs; (c) structured outputs (hook sets, scripts with shot lists, carousel frameworks) validated against JSON schemas; (d) compliance filter pass (claims, medical/financial advice flags per niche, platform-policy phrases).

## 8. Orchestration, cost & infra

- **Orchestrator:** queue-based pipeline (BullMQ) with step functions per analysis; every step idempotent, resumable, versioned. Feature extraction fans out; LLM narration is the final, cacheable step.
- **Model routing:** cheap-first: embeddings/classifiers → small multimodal calls batched → premium LLM only for narration/coach/generation. Prompt caching for system prompts and account context; nightly batch API for non-interactive work (reconciliation, trend clustering, report drafts) at 50% cost.
- **Cost budget (ASSUMPTION, monitored per-tenant):** target ≤ $0.18 marginal AI cost per Reel teardown at scale, ≤ $0.02 per generation credit; per-tier monthly AI-cost ceilings with alerting at 70% (margin protection, red-team R4-2).
- **Eval stack:** golden sets per engine (teardown factual-consistency, coach groundedness, generation quality rubric scored by LLM-judge + human sample), regression-gated deploys; user 👍/👎 with reasons feeds weekly triage.

## 9. Data governance for ML

Training on customer outcome data: disclosed in plain language at connection, contractual in ToS, **opt-out honoured without feature penalty** beyond personalisation itself; enterprise data excluded from cross-tenant training by default. All training corpora account-pseudonymised; no follower-level personal data is ever a feature (aggregates only). Deletion requests propagate to feature stores and the next training cycle (see [Security & Compliance §Data lifecycle](09-security-and-compliance.md)).
