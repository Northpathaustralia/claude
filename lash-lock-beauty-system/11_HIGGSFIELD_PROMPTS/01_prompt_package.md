# 11 · Higgsfield Prompt Package

**Verify current models/credits/lengths in the account before generating (Owner Verification #6).** Build-time facts (July 2026, perishable): Higgsfield aggregates Kling 3.0, Veo 3 etc.; adds **Soul ID** (character consistency, ~20 photos), **LipSync Studio**, **Cinema Studio** (camera control), **Marketing Studio + Click-to-Ad**, and a **Claude MCP connector**.

## Human vs AI — the decision rule (real-footage-first)
| Shot type | Use | Why |
|---|---|---|
| Makeup application, near-eye, fine brush | **Human** | Accuracy/safety; AI mangles eye anatomy & hands |
| Lash Lock operation / hand holding tool | **Human** | Correct anatomy, product scale, real interaction |
| Kat speaking (talking-head) | **Human** (real voice) | Trust; lip-sync risk |
| Before/after & proof, split-face, catch reveal | **Human** | Proof must be genuine |
| Product beauty B-roll (non-interaction) | **AI image-to-video** (from real product photo) | Premium polish, geometry locked by reference |
| Lifestyle vanity / ambience B-roll (no fine interaction) | **AI** | Cheap, safe, no anatomy risk |
| Abstract transitions / textures | **AI** | Low risk, high polish |
| Kat in extra scenes (optional, later) | **AI Soul ID** — only with consent, B-roll, frame-checked | Scale; must pass lip/eye checks or replace |

**Model selection heuristic:** test a short low-cost clip first (e.g. Kling 2.6); reserve premium (Veo 3 / Kling 3.0) for hero assets where it commercially matters. Never default to the most expensive. One action per clip. Lock references. Test low-res before final.

---

## Prompt format (copy-paste template — use for every AI shot)
```
ASSET
Campaign: | Video: | Scene: | Platform: | Aspect: 9:16 | Duration: | Model: | Input type: | Reference assets:

SUBJECT LOCK
[Kat: only from approved refs / OR product: exact shape, colour, logo placement from real photo]
Must never change: [list]

SCENE
Environment | background | surfaces | props | time of day | depth | realistic imperfections

ACTION (one clear action)
Start → movement → end | speed | eye line | hand/product position | gravity | pause for edit

CAMERA
Shot size | lens feel | height | angle | movement | focus | DoF | framing | text-safe area | rig (tripod/slider/macro/orbit)

LIGHTING
Key | fill | hair | practical | colour temp | shadow softness | catchlights | highlight/reflection control

PERFORMANCE (if subject present)
Expression | emotion | energy | micro-expression | blink | breath | head movement | speaking style

DIALOGUE (only if essential; keep short)

AUDIO
Real/generated voice | accent | tone | pace | ambience | product sounds | music | silence

REALISM REQUIREMENTS
Natural skin texture · correct eye anatomy · 5 fingers/hand · realistic joints · correct product proportions · stable logo · stable identity · accurate reflections · realistic gravity · natural hair · no over-smoothing · no flicker/morphing/duplication/floating tools · no changing jewellery/nails · no warped pupils · no bad teeth · no accidental subtitles/watermarks

NEGATIVE CONSTRAINTS
[scene-specific failure list]

EDIT POINT
Cut at | handles | match next scene?

ACCEPTANCE CRITERIA
[objective pass/fail]
```

---

## READY PROMPT 1 — Lash Lock product beauty B-roll (image-to-video)
```
ASSET
Campaign: LLBS launch | Video: C29/ads | Scene: product hero | Platform: Reels | Aspect: 9:16 | Duration: 3–4s | Model: [Kling image-to-video, verify] | Input: image-to-video | Refs: refs/lashlock_front.jpg (+side)

SUBJECT LOCK
Lash Lock exactly as in reference photo — same shape, same [verified colour], same logo placement/size. No redesign, no extra parts.
Must never change: silhouette, colour, logo, proportions.

SCENE
Clean oat/stone surface, soft neutral background, a few out-of-focus brushes, morning light. Subtle real dust/texture on surface (not sterile).

ACTION
Product rests still; a slow 4-second parallax push-in with a gentle rack focus from background to product. No hand, no morphing.

CAMERA
Macro-leaning medium close-up; 50mm feel; slightly above; slow slider push-in; shallow DoF; product centred, text-safe top/bottom; slider rig.

LIGHTING
Soft key 45° upper-left; white fill right; champagne practical glow bg; ~5000K; soft shadows; controlled highlight so [material] reads real, no blown reflections.

AUDIO
No voice; soft warm bed; faint ambience; no product sound.

REALISM
Correct product proportions; stable logo; accurate soft reflection; no floating; no duplication; no flicker/morph; no watermark/subtitles.

NEGATIVE
warped shape, drifting/duplicated logo, wrong scale, extra fingers (none should appear), plastic sterile look, blown highlights, text artifacts.

EDIT POINT
Cut on the settled focus; 0.5s handles; match to macro catch shot.

ACCEPTANCE
Pass if shape/logo/colour match reference exactly, reflection realistic, motion smooth. Fail on any geometry/logo drift → regenerate or shoot real.
```

## READY PROMPT 2 — Lifestyle vanity ambience B-roll (text/image-to-video)
```
ASSET: Campaign: LLBS | Scene: Set-3 ambience | 9:16 | 3–4s | Model: [test Kling 2.6 first] | Input: image-to-video from refs/set3_vanity.jpg
SUBJECT LOCK: bright clean vanity; oat/cream/clay palette; eucalyptus sprig; a few real cosmetic bottles (generic, no fake brand logos). No people, or hands only from wrist with correct 5-finger anatomy if included.
SCENE: morning light through a window, soft curtains, faint steam/warmth, realistic minor clutter (one towel, a glass).
ACTION: slow drift/parallax across the vanity, gentle curtain movement. One motion only.
CAMERA: handheld-stable lifestyle; 35mm feel; eye-level; slow lateral drift; medium DoF; text-safe center.
LIGHTING: natural daylight, airy, ~5200K, soft shadows.
AUDIO: warm bed, faint room ambience.
REALISM: natural textures; no morphing bottles; no fake brand logos; no warped objects; no floating; no watermark.
NEGATIVE: extra/duplicated objects, warped labels, invented brand names, plastic look, flicker.
EDIT POINT: loopable 3s; match to talking-head cut.
ACCEPTANCE: Pass if calm, real, on-palette, no artifacts. Fail on warped objects/labels.
```

## READY PROMPT 3 — Abstract transition texture
```
ASSET: Campaign: LLBS | Scene: transition | 9:16 | 1–2s | Model: [cheapest that looks clean] | Input: text-to-video
SCENE: soft clay-and-cream powder/silk motion, macro, warm light. Abstract, premium, no faces/products.
ACTION: gentle billow/sweep left-to-right (matches edit wipe direction). One motion.
CAMERA: macro; slow; shallow DoF.
LIGHTING: warm soft; ~5000K.
REALISM/NEGATIVE: smooth motion; no flicker/banding; no text/watermark; no faces/hands.
EDIT POINT: use as 0.5–1s wipe between scenes.
ACCEPTANCE: clean, on-palette, no banding.
```

## Optional Soul-ID note (only if consent given)
Train Soul ID on approved Kat photos only; use for **non-speaking lifestyle B-roll** by default. Any speaking Soul-ID clip must pass the Voice Protocol lip-sync/eye checklist frame-by-frame or be replaced with real footage. Never publish a Soul-ID clip that reads uncanny.

## Cost control checklist
Storyboard first · short test clips · lock references · one action/clip · low-res test → final · save winning prompts · real footage for hard interactions · premium models for hero only · reuse approved B-roll.
