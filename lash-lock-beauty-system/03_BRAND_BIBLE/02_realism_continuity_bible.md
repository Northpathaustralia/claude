# 03 · Realism & Continuity Bible

Master reference so Kat looks consistent, Lash Lock looks consistent, and AI B-roll never drifts. **Real-footage-first**, so most continuity here is *shooting discipline*; the AI section covers only B-roll/product/polish.

---

## A. Kat — continuity reference
Fill the bracketed fields once, from approved photos, then never deviate within a campaign.

| Attribute | Locked value | Reference file |
|---|---|---|
| Face reference (neutral, well-lit, front + 3/4) | [add] | `refs/kat_face_front.jpg`, `refs/kat_face_34.jpg` |
| Hair (length/colour/style) | [add] | `refs/kat_hair.jpg` |
| Signature makeup (the clean method she wears) | warm neutral eye, soft liner, glowy skin, groomed brow | `refs/kat_makeup.jpg` |
| Wardrobe (per-batch outfit) | [add — 1 outfit per shoot day] | `refs/kat_wardrobe_[date].jpg` |
| Jewellery | small studs + 1 thin necklace (constant per batch) | `refs/kat_jewellery.jpg` |
| Nails | neutral, short (constant per batch) | `refs/kat_nails.jpg` |
| Skin finish | real texture, glowy not greasy, no heavy smoothing | — |
| Voice / accent / energy | Australian, warm, calm-confident (see Voice Protocol) | — |
| Mannerisms to keep | direct eye-line to lens on hooks; hands lead demos | — |

**Must never change within a campaign:** face identity, hair colour/style, signature makeup register, nail colour, jewellery, the set dressing.

### If (and only if) Soul ID is used later for B-roll
- Requires **Kat's explicit written consent** (Owner Verification #5).
- Train **only** on approved, well-lit Kat photos.
- Use for **non-speaking B-roll / lifestyle only** by default; any speaking avatar must pass the frame-by-frame lip-sync + eye check in the Voice Protocol, or be replaced with real footage.

## B. Lash Lock — continuity reference
**All fields BLOCKED until product testing/spec sheet complete (`04_PRODUCT_VERIFICATION`, Owner Verification #1–2).** Do not generate AI product shots from guesses — use real photos as references.

| Attribute | Locked value | Reference file |
|---|---|---|
| Front view | [from real photo] | `refs/lashlock_front.jpg` |
| Back view | [from real photo] | `refs/lashlock_back.jpg` |
| Side view | [from real photo] | `refs/lashlock_side.jpg` |
| Scale reference (next to a coin/finger) | [add] | `refs/lashlock_scale.jpg` |
| Colour (neutral-light photo) | [verify] | `refs/lashlock_colour.jpg` |
| Material appearance | [verify: silicone?] | — |
| Logo (placement/colour/emboss?) | [verify] | `refs/lashlock_logo.jpg` |
| Packaging | [add] | `refs/lashlock_pack.jpg` |
| How it's held | [demonstrate in real footage] | `refs/lashlock_hold.jpg` |
| Verified functions | **only ✅ rows from checklist** | — |
| Prohibited claims | see checklist §C | — |

**AI rule for the product:** Lash Lock only appears in AI shots when a strong real reference image locks its geometry (image-to-video), and even then, prefer real footage for any hand-interaction. Reject any generation with warped shape, drifting logo, wrong scale, or floating product.

## C. The three sets

### Set 1 — Kat's beauty station (teaching / talking-head)
- **Layout:** seated at makeup station, mirror out of frame or softly behind; brushes in a holder, a few curated products (not clutter).
- **Lighting:** soft key 45° from window/LED, white reflector fill; catchlights visible.
- **Colours:** oat/cream/clay palette; one plant (eucalyptus/sage) for the AU nod.
- **Camera positions:** (a) eye-level medium for talking-head; (b) over-shoulder for mirror work.
- **Continuity photos to take:** wide of full set, product layout, Kat's seat mark.

### Set 2 — Clean product demo table (top-down + macro)
- **Layout:** clean oat/stone surface, minimal props, product + tool + brush laid intentionally.
- **Lighting:** even, shadow-controlled so texture/fallout reads truthfully.
- **Camera:** top-down phone mount (for flat-lay/demo) + macro side angle.
- **Continuity photos:** exact prop placement, surface, mount height.

### Set 3 — Premium lifestyle vanity/bathroom (lifestyle B-roll)
- **Layout:** bright, clean vanity; towel, glass, a few real products; morning light.
- **Lighting:** natural window daylight, airy.
- **Camera:** handheld-stable lifestyle framing; good AI-B-roll candidate (no fine interaction).
- **Continuity photos:** wide + detail of vanity dressing.

## D. Export standards (verify current platform specs before final export — Owner Verification)
- **Default:** vertical **9:16**, high resolution (1080×1920 min).
- Deliver a **clean master** (no captions) + a **captioned social version**.
- **No platform watermark** (don't export straight from TikTok/CapCut with logo).
- Clear voice; music ducked below dialogue.
- All text inside platform-safe areas (not under top/bottom UI, never over the eye area).
- Separate **thumbnail/cover frame** exported.
- Separate **editable caption file** (.txt/.srt) kept per asset.
- File naming: `LLBS_[pillar]_[assetID]_[version].mp4` (e.g. `LLBS_split_A012_v2.mp4`).
