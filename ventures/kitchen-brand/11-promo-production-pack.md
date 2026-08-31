# Production & Promo Pack — Real Visuals + Post-Ready Material

This pack turns the playbook into publishable assets. Part A gets you the photoreal
sisters and real product imagery (≈1–2 hours of generation work). Part B is the
copy-paste posting material for the first 14 days. Part C is full production scripts
with per-scene AI-generation prompts for the first 10 videos.

Every image slot in the website mockup is labeled with an ID (W1, W2, P1…) that maps to
a prompt below — generate the image, drop it into the matching slot in Shopify.

---

## PART A — Getting the real visuals

### A1. Real product photos (no AI needed — 3 sources, in order)

1. **Supplier galleries (today, free):** every CJdropshipping/Zendrop listing includes
   a full photo pack (white-background + lifestyle + dimension shots) licensed for
   resellers. Download the full set for each of the 10 products when you list them.
   Use the white-background shots on product pages immediately.
2. **Your sample photoshoot (day samples arrive — this is what makes you not look like
   a dropshipper):** one hour, phone camera, near a window. Shot list per product:
   - Hero: product on a light timber board, cream backdrop (Kmart poster board, $4),
     one herb sprig for colour.
   - In-hand action shot (partner holds, you shoot).
   - The money moment: mid-action (dice falling, mist spraying, seal test).
   - Scale shot: product next to a hand/coffee cup.
   - "What's included" flat lay.
3. **AI cleanup (optional):** run supplier shots through a background replacer
   (Photoroom / Canva BG remover) onto your cream `#FFF6EC` backdrop so the whole
   catalogue looks like one brand.

### A2. Generating Lola & Mia (photoreal, consistent) — Midjourney workflow

**Step 1 — Create the master face for each sister.** Run each prompt ~4 times, pick THE
face you're committing to forever, upscale it, save it. This image is her identity.

**L-MASTER (Lola):**
```
Photorealistic editorial portrait of a stunning 23-year-old Australian woman, long
natural blonde hair in loose waves, warm honey-brown eyes, playful confident smirk with
one eyebrow slightly raised, gold hoop earrings, light natural makeup, natural skin
texture with visible pores, wearing an oversized white linen shirt, standing in a warm
modern kitchen with timber benchtops, golden hour window light from the left, shallow
depth of field, shot on 85mm f/1.8, food-creator lifestyle photography, candid energy
--ar 4:5 --style raw --v 7
```

**M-MASTER (Mia):**
```
Photorealistic editorial portrait of a beautiful 21-year-old Australian woman, dark
brunette hair in a sleek low bun with face-framing strands, soft green eyes, gentle
knowing smile, small gold pendant necklace, minimal clean-girl makeup, natural skin
texture, wearing a cream ribbed knit tank and sage linen apron, in a warm modern kitchen,
soft window light, shallow depth of field, 85mm f/1.8, lifestyle food photography,
approachable warm energy --ar 4:5 --style raw --v 7
```

**Step 2 — Lock consistency.** Every subsequent image uses the master as a character
reference: add `--cref <master image URL> --cw 100` (Midjourney) to keep the same face.
Keep wardrobe tokens identical ("oversized white linen shirt", "cream knit tank + sage
apron") — outfits are part of recognition. For both sisters in one frame, use both crefs.
(Alternative stack: train a Flux LoRA per sister on 15–20 master variations — better
long-term consistency, ~$5 per training run on Replicate/fal.ai.)

**Step 3 — Generate the website + content set.** Suffix every prompt below with
`--cref [master URL] --cw 100 --ar [as noted] --style raw --v 7`.

| ID | Slot | Prompt core |
|---|---|---|
| **W1** | Homepage hero | Two sisters (blonde + brunette, use both crefs) laughing at a kitchen island mid-cooking, blonde one pressing a vegetable chopper with theatrical energy, diced onion visible, brunette holding a stopwatch deadpan, flour dusted on the bench, golden hour, candid documentary style, 16:9 |
| **W2** | Lola meet-card | Lola leaning on kitchen bench, arms crossed, winking at camera, holding a vegetable chopper like a trophy, warm kitchen, 4:5 |
| **W3** | Mia meet-card | Mia at the bench examining a rolling knife sharpener closely with a small knowing smile, notebook beside her, soft light, 4:5 |
| **W4** | About page duo | Sisters back-to-back in aprons, playful, one holding a whisk and the other salt grinders, cream studio backdrop, brand campaign feel, 4:5 |
| **P1** | Chop Boss lifestyle | Lola's hands pressing chopper lid, perfect onion dice falling into container, kitchen bench, macro-ish 50mm, 1:1 |
| **P2** | RollSharp lifestyle | Mia's hands rolling a knife sharpener along a chef's knife on a timber board, tomato with paper-thin slices beside, 1:1 |
| **P3** | SnapStrain lifestyle | Hands tilting a pot with clip-on silicone strainer over a sink, steam, pasta visible, one-handed, 1:1 |
| **P4** | Garlic Grenade | Lola holding palm-sized electric mini chopper filled with minced garlic, delighted expression, 1:1 |
| **P5** | FlipGrind | Dinner table at dusk, hand flipping an electric salt grinder over a steak, LED light glowing, 1:1 |
| **P6** | SnipSnip | Herb scissors snipping basil confetti directly over a margherita pizza, overhead shot, 1:1 |
| **P7** | Stir Crazy | Automatic stirrer working alone in a saucepan of risotto, Lola visible blurred in background on the couch, 1:1 |
| **P8** | SnackLock | Hands sliding a mini bag sealer across a chip bag, fridge magnets visible, 1:1 |
| **P9** | ProbeMate | Instant-read thermometer in a golden roast chicken reading 74°, Mia's approving face soft-focus behind, 1:1 |
| **P10** | ScrubBot | Electric spin scrubber mid-action on a burnt pan, half restored to shine, dramatic before/after in one frame, 1:1 |

**Uncanny-valley checklist before using any image:** hands have five fingers and hold
things plausibly · skin has texture (reject plastic sheen) · eyes focus on the same
point · text/logos in frame are clean or absent · product in frame matches YOUR actual
product (swap in your sample photo via inpainting if not).

### A3. Making them move + talk (video stack)

- **Talking segments (hooks, punchlines):** Hedra or HeyGen — upload the sister image +
  an ElevenLabs voice line → lip-synced talking clip. This is 70% of your sister footage.
- **Action segments:** Kling / Runway image-to-video on the stills above. Motion prompt
  formula: `"[subject] [one small action], subtle handheld camera, natural kitchen
  lighting, realistic motion"` — e.g. for W2: *"she winks at the camera and smiles,
  subtle handheld movement, natural light"*. Keep actions SMALL (wink, laugh, lean,
  pour) — big actions (chopping) come from your real sample footage instead.
- **Voices (ElevenLabs, create once, never change):**
  - *Lola:* young adult female, Australian accent, bright, quick, expressive, slightly
    husky edge, playful emphasis, fast pace.
  - *Mia:* young adult female, Australian accent, calm, warm, lower pitch, precise
    articulation, dry delivery, unhurried.
- **The assembly formula per video (CapCut):** real product footage (your samples,
  60–70%) + sister talking clips (Hedra, 20–30%) + reaction stills with motion (Kling,
  10%) + auto-captions + trending-safe audio. First frame = the hook text + the most
  visual moment.
- **Label it:** toggle "AI-generated content" on TikTok posts and Meta's AI disclosure
  on ads. Non-negotiable (see `10-risks-roadmap.md`) — it protects the ad account.

---

## PART B — Post-ready promo material

### B1. Account setup copy (paste as-is)

- **TikTok/IG bio:** `Sisters. Gadgets. Zero boring dinners 😉` · `Kitchen tools that
  actually do the thing ↓` · link → store
- **Pinned comment (every viral-candidate post):** `Everything we test that survives
  Lola ends up in the shop — link in bio 😉 What should we break in next?`
- **Comment replies bank:** "she slammed it. she always slams it." · "Mia timed it,
  there's documentation" · "sir, this is a chopper demo" (for spicy comments) ·
  "real, tested, filmed in one take — check the pinned!"
- **DM auto-reply:** `Hey, it's the sisters 👯‍♀️ Orders & shipping: whiskandwink.com/track
  · Support: reply HELP and a real human answers within 24h · Everything else: Lola is
  ignoring her phone.`

### B2. Launch announcement posts (day 1)

**TikTok/Reels caption:**
```
POV: two sisters got sick of boring kitchen stores and opened their own 😉
Every gadget = tested by us, filmed in one take, sold only if it survives Lola.
First 500 orders get 15% off + a surprise gadget → link in bio
#kitchengadgets #kitchenhacks #kitchentok #newbusiness #australianbusiness
```
**Facebook/IG feed caption:**
```
We're open! 🎉 Whisk & Wink is live — kitchen gadgets that actually do the thing,
tested by two sisters with strong opinions and one stopwatch.
🧅 Choppers that end onion tears
🔪 A sharpener that resurrects $12 knives
🍝 The clip-on strainer your pasta deserves
First 500 kitchens: 15% off + surprise gift, code WINK15. Consider this your wink 😉
```

### B3. 14-day posting calendar (2 posts/day: TikTok + cross-post to Reels/Shorts)

Video numbers reference `06-video-content-60.md` (full scripts there; generation
prompts for the first 10 in Part C).

| Day | AM post | PM post | Notes |
|---|---|---|---|
| 1 | Launch announcement (B2) | **#47 Dice Rain** (ASMR) | Follow every commenter |
| 2 | **#1 One Press** | **#56 Which Sister Are You?** | #56 = follower engine |
| 3 | **#3 The Seal Test** | **#35 5 Things Under $20** | Boost #1 if >5k views |
| 4 | **#8 One Hand** (SnapStrain) | **#12 Smoothie Incident** (fail) | Fails humanize — post it |
| 5 | **#10 Sixty Seconds** (RollSharp) | **#37 Gadgets My Mum Stole** | Start Meta ads today w/ top 3 |
| 6 | **#2 Stopwatch** (Grenade) | **#48 The Glide** (ASMR) | Spark-boost best TikTok |
| 7 | **#17 40 Hours of Tears** | Week-1 recap stitch of top moments | Reply to comments w/ video |
| 8 | **#6 The Resurrection** (ScrubBot) | **#39 Sounds Fake** (SnackLock) | |
| 9 | **#4 Little Employee** (Gary) | **#33 Herb Rescue** (hack) | Gary = recurring character, lean in |
| 10 | **#9 Documentation** (ProbeMate) | **#50 Grind Macro** (ASMR) | |
| 11 | **#21 Week of Meals, 11 Min** | **#57 GRWM: pasta edition** | Push Meal Prep Bundle in caption |
| 12 | **#5 Guest Bait** (FlipGrind) | **#36 It Does WHAT** | |
| 13 | **#20 The $12 Knife** | **#58 trend-audio slot** (whatever's trending) | |
| 14 | **#23 Gift Tier List** | Best-of-week + "500 winks" counter update | Review week: double down on top 2 formats |

### B4. Caption + hashtag bank

**Caption formulas (rotate):**
1. Confession: "I used to [pain]. Then [product] happened. Character development."
2. Challenge: "Timed it. [X seconds]. Beat that with a knife, I'll wait."
3. Callout: "Tag the person who still [pain] in 2026."
4. Deadpan (Mia): "Tested so you don't have to. It works. That's the review."
5. Chaos (Lola): "I did NOT read the instructions and it STILL worked. As advertised."

**Hashtag sets (mix one from each tier, 4–6 tags total — more looks spammy):**
- Big reach: `#kitchentok #kitchenhacks #kitchengadgets #cookinghacks #foodtok`
- Mid niche: `#kitchenmusthaves #mealprepideas #kitchenfinds #gadgetreview #homehacks`
- Local/buyer: `#australianbusiness #aussiefinds #kitchenaustralia #giftideas #tiktokmademebuyit`

### B5. Story/engagement templates (IG Stories, 3–4/week)

- Poll: "Lola's method (chaos) vs Mia's method (instructions)?" over a demo clip
- Slider: "How dead are your knives? 🔪💀" → RollSharp swipe-up
- Quiz: "How long does the Grenade take? 1s / 3s / 10s" → answer video
- Countdown sticker: bundle drops · "Ask the sisters" question box Fridays

---

## PART C — First 10 videos: full production scripts with generation prompts

Format per video: **HOOK** (text on first frame) → shots with source
(`REAL` = your sample footage, `HEDRA` = talking sister clip, `KLING` = animated still)
→ VO lines → caption from B3/B4. All ≤ 25s unless noted. Concept numbers = `06` file.

### C1 — Video #1 "One Press" (Chop Boss)
- HOOK text: "therapy is expensive. this was $49."
- S1 `HEDRA` Lola close-up: **"Babe. BABE. Watch this."** (image W2; motion: leans in)
- S2 `REAL` whole onion into chopper, slam, dice rains (your money shot — 3 takes)
- S3 `HEDRA` Mia deadpan: **"You don't have to slam it."**
- S4 `HEDRA` Lola: **"It's for the *cinema*, Mia."** → wink
- S5 `REAL` container of perfect dice, drawer shot. CTA overlay: "Chop Boss — link in bio"

### C2 — Video #47 "Dice Rain" (Chop Boss, ASMR)
- HOOK: "sound ON 🔊" — S1–S3 `REAL` macro slow-mo dice falling, crisp audio, loop cut.
- No VO. End card: wink logo. (Generation-free — pure sample footage. Post day 1.)

### C3 — Video #3 "The Seal Test" (SnackLock)
- HOOK: "if this works, Mia owes me $20"
- S1 `HEDRA` Lola: **"If this works, Mia owes me twenty bucks. If not, I owe her an apology."**
- S2 `REAL` seal the chip bag, slide close-up
- S3 `REAL` shake bag violently upside down (over a wig on a stand if solo-filming — reads as Mia's head, comedic)
- S4 `HEDRA` Mia: **"…I hate that it works."**
- S5 KLING on P8 still: sealer magnets to fridge. CTA: "SnackLock — bio"

### C4 — Video #10 "Sixty Seconds" (RollSharp)
- HOOK: "your knives aren't bad. they're neglected."
- S1 `REAL` dull knife squashing a tomato (film with your worst knife)
- S2 `HEDRA` Mia: **"Your knives aren't bad. They're neglected. Watch."**
- S3 `REAL` rolling passes, angle-guide close-up, 60s timer overlay speedrun
- S4 `REAL` transparent tomato slice — hold 2 full seconds
- S5 `HEDRA` Lola: **"…okay, show-off."** CTA: "RollSharp — bio"

### C5 — Video #2 "Stopwatch" (Garlic Grenade)
- HOOK: "knife skills vs $32"
- S1 split-screen: `REAL` hands mincing garlic w/ knife (slow, sticky) vs `REAL` Grenade 3s
- S2 stopwatch overlay: 1:47 vs 0:03
- S3 `HEDRA` Mia (staring): **"I'd like the internet to forget my side of the screen."**
- S4 `HEDRA` Lola: **"I don't gatekeep, I girl-boss."** CTA: "Garlic Grenade — bio"

### C6 — Video #8 "One Hand" (SnapStrain)
- HOOK: "POV: you drain pasta with ONE hand now"
- S1 `REAL` POV one-handed drain, phone in other hand
- S2 `REAL` grainy "flashback" filter: old pot+colander juggle, penne into sink
- S3 `HEDRA` Mia holding card: **"In memory of three rigatoni. Lost, 2024."**
- CTA: "SnapStrain $16.95 — bio"

### C7 — Video #6 "The Resurrection" (ScrubBot)
- HOOK: "this pan has been 'soaking' since Tuesday"
- S1 `REAL` slow zoom on your worst pan (make one — burn some sugar)
- S2 KLING on P10 still: scrubber spins up, hero entrance vibe
- S3 `REAL` 4x-speed scrub → mirror reveal
- S4 `HEDRA` Mia: **"The soak was a lie."** CTA: "ScrubBot — bio"

### C8 — Video #35 "5 Things Under $20"
- HOOK: "5 kitchen things under $20 that outperform your $300 appliance"
- S1–S5 `REAL` rapid money-moments (SnapStrain drain / SnipSnip confetti / SnackLock
  seal / oil-spray mist / herb stripper), 4s each, price stamps
- S6 `HEDRA` Mia: **"Total: less than one delivery order."** CTA: "all in bio"

### C9 — Video #39 "Sounds Fake" (SnackLock)
- HOOK: "this sounds fake: you can reseal the ORIGINAL bag"
- S1 `REAL` seal + cut open + reseal cycle, no cuts, one take, timestamp running
- S2 `REAL` underwater shake test
- S3 `HEDRA` Mia: **"One take. No cuts. Watch it again."** CTA: "SnackLock — bio"

### C10 — Video #56 "Which Sister Are You?" (brand/follower engine)
- HOOK: "which sister are you? be honest."
- S1 `HEDRA` Lola: **"You plan the meal?"** / `HEDRA` Mia: **"Or you vibe the meal?"**
- S2 split stills (W2/W3 with KLING micro-motion): "reads instructions" vs
  "instructions are a vibe" · "preps Sunday" vs "prays Wednesday"
- S3 both (W1): **"Either way — you need the chopper."** wink
- Caption: "tag your sister 👯‍♀️" — no hard CTA; this one is for follows.

---

## Production order (do it in this sequence)

1. Generate L-MASTER + M-MASTER → lock faces (30 min)
2. Generate W1–W4 + P1–P10 stills (1–2 hrs incl. rerolls)
3. Create both ElevenLabs voices + render all VO lines above (30 min)
4. Hedra/HeyGen: render every `HEDRA` line as a clip (1 hr)
5. When samples arrive: one afternoon shooting every `REAL` shot on the C-list (batch!)
6. CapCut assembly: C2 and C8 first (no sister footage needed → postable immediately),
   then C1–C10 (one evening)
7. Drop W/P images into the Shopify slots, publish store, start the B3 calendar
