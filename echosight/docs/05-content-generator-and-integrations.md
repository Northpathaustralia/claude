# EchoSight AI — Creative Generator, Higgsfield & Fable Prompt Packs

Council owners: CPO, Principal AI Engineer, Copywriter, Brand Strategist. Red-teamed: round R2 (originality, IP, integration claims).

---

## 1. Creative Generator

**Purpose:** close the loop — the same evidence that explains performance drives generation. Everything generated is conditioned on (a) the account's **brand memory** (voice, structures, taboo list, distilled from its own top performers), (b) measured winning patterns for this account/niche, (c) optionally a trend brief.

### 1.1 Asset types

| Asset | Output structure |
| --- | --- |
| Hooks | 10 ranked variants across styles (question, pattern-interrupt, bold claim, curiosity gap, POV, stat-shock), each with predicted Hook Score band and rationale |
| Captions | 3 variants (short/medium/story), hook line first, CTA placement per account's measured best, hashtag set (specificity-mixed) |
| Reel scripts | Beat-sheet: hook (0–3s) → promise → beats with shot list + on-screen text → payoff → loop/CTA; timed to target duration |
| Carousels | Slide-by-slide: cover (thumb-stop test notes), narrative arc, per-slide copy + layout note, save-bait final slide |
| Stories | Sequenced frames with interaction stickers strategy |
| Ads | Hook/body/CTA variants mapped to awareness stage; policy-sensitive-claims flagged |
| Thumbnail concepts | 3 concepts: composition, text overlay, emotion, contrast notes + generation prompt |
| Storyboards | Scene table: shot, framing, action, dialogue/VO, duration, transition |
| Email / landing page / sales page / launch sequence | Conversion-structured long-form (PAS/AIDA selectable), section-by-section |

### 1.2 Quality & safety controls

- **Originality guard:** embedding-similarity ceiling vs. any referenced competitor/trend source content; near-copies regenerate automatically (R2-6).
- **Claims filter:** niche-aware compliance pass (health/finance claims, before/after promises, platform-policy phrases like engagement-bait wording).
- **Brand-fit score:** every output scored against brand memory; below-threshold outputs regenerate with the delta explained.
- **Feedback loop:** keep/edit/discard signals per output feed the account's brand memory and the global generation evals.
- Credits metering per [Product Spec §7](02-product-specification.md); heavy assets (scripts, storyboards, prompt packs) cost more credits than hooks/captions.

## 2. Higgsfield prompt packs

**Positioning (legal-reviewed):** EchoSight generates *prompt packs for* Higgsfield — structured text the user pastes into their own Higgsfield account. No API dependency, no partnership implied in v1 marketing (R2-7). If/when a Higgsfield API partnership exists, packs become one-click exports.

A **pack** is generated from a Reel script or storyboard and contains, per scene:

- **Camera prompts:** shot type, lens feel, camera movement (push-in, orbit, whip-pan, handheld energy), framing.
- **Lighting prompts:** key style (golden hour, hard rim, neon practicals), mood, contrast ratio guidance.
- **Movement prompts:** subject motion, speed ramps, motion intensity keywords matched to the niche's measured pacing preference.
- **Editing prompts:** cut rhythm (target cuts/10s from the account's winning pacing band), transition types per scene boundary.
- **Scene direction:** action, emotion, art direction, continuity notes.
- **Voice prompts:** VO tone, pace (words/sec matched to retention data), line reads.
- **B-roll prompts:** ranked b-roll list with search/generation phrasing.
- **Pack manifest:** ordered scene list, target duration, aspect, cover-frame note — so the pack round-trips into EchoSight Pre-Flight for scoring once rendered.

Pack templates are versioned per Higgsfield capability generation (**ASSUMPTION:** template maintenance is a standing content-ops task; templates degrade gracefully to generic video-model phrasing if Higgsfield changes syntax).

## 3. Fable prompt packs

Same positioning: *prompt packs for* Fable-style AI animation/story tools.

Per pack: **characters** (visual description sheets with consistency tokens, personality, voice notes), **scenes** (setting, palette matched to brand kit, blocking), **motion** (animation style, energy, camera), **dialogue** (script lines with emotional beats), **storyboards** (frame-by-frame), **animation prompts** (per-shot generation strings), **brand consistency block** (palette hex, type treatment, logo usage, recurring motifs) injected into every scene prompt.

## 4. Round-trip workflow (the differentiator)

```
Insight (why past content won)
  → Brief (trend + brand memory)
    → Script/Storyboard (Generator)
      → Higgsfield/Fable pack (production)
        → Rendered asset → Pre-Flight (scored before posting)
          → Publish → Outcomes reconcile → Insight improves
```

No competitor closes this loop; each stage is individually skippable so the workflow meets users where they are.
