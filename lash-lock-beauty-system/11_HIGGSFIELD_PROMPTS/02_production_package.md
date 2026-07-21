# 11 · Higgsfield Production Package (per priority video)

Expands the 3 base prompts (`01_...`) into a per-asset production sheet for the launch calendar. **Rule from `29_AI_RIGHTS_QC`:** all technique/proof/interaction = REAL footage; AI = B-roll/product/lifestyle/transition only. Verify current models/credits in-account (Owner Verification #6).

## Classification of the 30 calendar assets
| Class | Assets | AI role |
|---|---|---|
| **Real only** (technique/proof/talking-head) | C01,C02,C03,C04,C06,C07,C08,C09,C10,C11,C12,C13,C15,C16,C17,C18,C19,C20,C22,C23,C24,C25,C29 | none (maybe AI transition/opener B-roll) |
| **Hybrid** (real technique + AI B-roll/product) | C04,C05,C21,C29 + ads AD1–AD5 | AI product beauty shot / lifestyle opener only |
| **AI-supported B-roll** | Set-3 lifestyle openers, product hero, transitions | AI |
| **Not suitable for AI** | any fallout/mascara/longevity **proof**; hands near eye | real only, always |

## Per-AI-shot sheet (fill for each AI clip used)
```
Asset ID:            | Calendar day:        | Real/Hybrid/AI-Broll:
Final prompt:        (from 01_ template, filled)
Negative prompt:     (scene-specific failures)
Reference assets:    (real photos required)
Aspect / duration:   9:16 / __s
Camera movement:     | Lighting:            | Performance (if any):
Dialogue:            (usually none for B-roll) | Voice method: real VO / none
Continuity reqs:     (identity/product locks)
Acceptance criteria: (objective pass/fail — see QC checklist)
Regeneration rule:   max __ attempts, then simplify/split/replace-with-real
Cheaper fallback:    (lower-cost model / test clip)
Real-filming fallback: (exact shot to film instead if AI fails)
```

## Three ready AI shots mapped to assets (reuse `01_` prompts)
1. **Product hero** (`01_` Prompt 1) → opener for C04, C29, AD2, AD4, landing page. Fallback: film the real product on the demo table.
2. **Lifestyle vanity** (`01_` Prompt 2) → openers for C07, C19, Set-3 B-roll. Fallback: film real vanity.
3. **Transition texture** (`01_` Prompt 3) → wipes across all series. Fallback: simple crossfade.

## Priority order (what to generate first)
1. Product hero (highest reuse). 2. 2–3 transition textures. 3. 1–2 lifestyle openers. **Stop there for launch** — everything else is real footage. Cap AI spend per `21_BUDGET/02_...`.

## Regeneration discipline (avoid burning credits)
Simplify shot → split into shorter shots → improve reference → remove dialogue → voice-over instead → replace complex interaction with real footage. Max {3} attempts per shot, then fall back. Never re-roll endlessly for cosmetic perfection.

## Acceptance gate
Every clip passes `29_AI_RIGHTS_QC/02_visual_qc_checklist.md` **and** contains no ❌/⚠️ claim from `04/03_claim_register.md`, or it is not used.
