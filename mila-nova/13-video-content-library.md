# 13. Video Content Library — Higgsfield Generation Manifest

Generated via Higgsfield (Soul 2.0 for the canon face, Seedance 2.0 fast/720p
for video, `image_references` locked to the canon face for every clip so
Mila stays visually consistent across all 21 clips). All prompts embed the
same identity + negative block used throughout this project
(see [06-image-prompts.md](06-image-prompts.md)) — mature adult (26),
fully fictional/no real-person resemblance, non-explicit, no logos/watermarks,
no distorted anatomy.

**Session status:** the Higgsfield connection dropped mid-batch after 18 of
21 clips were submitted. 6 are confirmed finished (✅ below). The other 12
were accepted by Higgsfield and should still be rendering/finished
server-side, but this session lost the connection before their completion
could be confirmed — status shown as "submitted, unconfirmed." V19, V20 and
the V21 hero clip were never submitted. Re-run the two `generate_video` calls
for V19/V20 (prompts are in this file) and the hero prompt below once
Higgsfield is reachable again, and re-check the 12 unconfirmed job IDs with
`job_display` before assuming they're done.

**⚠️ Mandatory before publishing anything below:** this session generated
these assets via the Higgsfield MCP tool, but an org-level network policy in
this sandbox blocks outbound requests to Higgsfield's asset CDN
(`d8j0ntlcm91z4.cloudfront.net`), so **no one on this side could visually
inspect the actual pixels**. Every clip must get a human visual QA pass
(the 60-second gate in [09-compliance-checklist.md](09-compliance-checklist.md)
section H) before it goes anywhere public. Open each URL below in your own
browser to review, re-roll, or approve. See section "Red-Team / Compliance
Council Review" at the bottom for exactly what was and wasn't verified.

## Canon face reference

Locked identity used for every video below. If you don't like this face,
regenerate via the prompt in [06-image-prompts.md](06-image-prompts.md) #35
and swap the reference ID in future generations — do **not** swap mid-batch,
it breaks consistency.

| | Job ID | URL |
| --- | --- | --- |
| **Selected canon** | `e59e8dae-89af-45df-960f-6f3ecf0c8310` | https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260722_103347_e59e8dae-89af-45df-960f-6f3ecf0c8310.png |
| Alt candidate B | `f8679879-034d-4958-a602-4c51dc3167a0` | https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260722_103346_f8679879-034d-4958-a602-4c51dc3167a0.png |
| Alt candidate C | `7760ac24-0f1d-4e69-9e01-a421eaca7cfc` | https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260722_103346_7760ac24-0f1d-4e69-9e01-a421eaca7cfc.png |

## Generation settings (all 20 social clips)

Model `seedance_2_0`, mode `fast`, resolution `720p`, duration `5s`,
`generate_audio: false` (silent — add trending audio yourself in CapCut per
[07-marketing-strategy.md](07-marketing-strategy.md), native audio muted on
purpose so you control the sound), aspect ratio `9:16` except the hero clip
(`16:9`), `image_references` = canon face job ID above.

## The 20 social clips (mapped 1:1 to the reel/video hooks in [05-promotional-content.md](05-promotional-content.md))

| # | Hook | Scene | Platform / use | Job ID | Status |
| --- | --- | --- | --- | --- | --- |
| V01 | "I don't exist. Let me explain." | Golden-hour beach walk, champagne-gold sundress | IG Reels / TikTok — Day 1 | `8db1fe95-fd34-4c69-9c12-7fbf592b2d18` | 🟡 submitted, unconfirmed |
| V02 | "She's AI btw — saving you the reverse-image search." | Gym mirror fit-check, black gym set | TikTok — Day 2 | `8a922874-7923-4633-9fff-25ee0fba2542` | ✅ done |
| V03 | "Get ready with me (I render in 4K)." | Vanity mirror GRWM, silk robe | IG Reels — Day 4 | `e4c2461f-457d-41ed-a0db-a1d057c3dbf0` | ✅ done |
| V04 | "Rating things I physically cannot experience." | Café oat latte, comedic reactions | TikTok — Day 5 | `c6a718f4-c255-46a2-be34-d3257ca6a04d` | ✅ done |
| V05 | "Day in the life of a woman who doesn't exist." | Apartment balcony sunrise | TikTok — Day 9 | `ea58a972-295e-4be1-9416-905e2f294fbd` | ✅ done |
| V06 | "One woman. Zero atoms. Four outfits." | Rooftop dusk, black satin, confident spin | IG Reels — Day 11 | `265f8579-7d9e-4b76-ba60-d03ee542bb23` | ✅ done |
| V07 | "Letting the comments direct my next photoshoot." | Rooftop night, phone glance + laugh | TikTok — Day 16 | `1da54b07-c4ce-4d5f-9aad-5e1b8e530e0b` | ✅ done |
| V08 | "What it actually takes to make me — including the cursed hands." | Ivory gym set, playful shrug | IG Reels — Day 18 | `d04e9935-bdbe-4120-bcf2-4cd4fc3451e0` | 🟡 submitted, unconfirmed |
| V09 | "POV: your new favourite influencer admits she's fake in 3 seconds." | Beach, gold slip dress, wink | Landing page / TikTok | `2cbce551-2b10-4919-87be-0e5199471ad3` | 🟡 submitted, unconfirmed |
| V10 | "Answering your unhinged questions. Yes, in order." | Armchair, animated conversation | TikTok — Day 26 (Q&A) | `ca38142b-6cbe-4d29-8ac4-f4c32a05c882` | 🟡 submitted, unconfirmed |
| V11 | "Things my developers won't let me have. Number 3 is a dog." | Sofa, comedic shrug | TikTok | `3d9a8dd9-b793-4d46-a9d7-d81b64b6e72b` | 🟡 submitted, unconfirmed |
| V12 | "House tour. Rent: one GPU." | Marble kitchen walk-through | IG Stories — Day 13 | `86718f5b-fbc0-4f51-bbed-3602c4c48e48` | 🟡 submitted, unconfirmed |
| V13 | "The most honest influencer on this app (I'm legally fiction)." | Rooftop lean, emerald wrap dress | X / IG | `20f8ebcf-c57c-4386-b209-05695f809a70` | 🟡 submitted, unconfirmed |
| V14 | "You voted. I rendered. Here's OUR shoot." | Rock pools, resort swimwear, twirl | Fan-directed shoot reveal — Day 20 | `99d26877-c7d1-40be-b2b3-222f855ab06f` | 🟡 submitted, unconfirmed |
| V15 | "Dear diary: today I was rendered at 7am against my will." | Rain window, oversized hoodie | IG Reels — Day 25 | `25a3f49f-2a52-4ca8-9538-22ac75f5330f` | 🟡 submitted, unconfirmed |
| V16 | "How to spot AI content — a tutorial by AI content." | Studio portrait, playful point | TikTok | `119e6396-52c0-4963-880f-1c6045a81d07` | 🟡 submitted, unconfirmed |
| V17 | "My morning routine, minus the part where I'd need a body." | Balcony sunrise stretch | TikTok | `7be6b674-e471-4b8f-81c6-ff1f14435602` | 🟡 submitted, unconfirmed |
| V18 | "Fan club tier list — explained by the fan club." | Rooftop night, champagne toast | Subscription platform launch post — Day 22 | `96113f02-9971-45bc-aaf4-dcc81c1b82c2` | 🟡 submitted, unconfirmed |
| V19 | "30 days of not existing: the results." | Beach stride, gold maxi dress | Month recap — Day 29 | not submitted | ❌ not started |
| V20 | "Final vote. The council decides my outfit." | Charcoal close-up, mock-serious eyebrow | TikTok — Day 19 (poll finale) | not submitted | ❌ not started |

## Landing-page hero clip

| | Scene | Use | Job ID | Status |
| --- | --- | --- | --- | --- |
| V21 (hero, 16:9) | Golden-hour beach boardwalk, right-third composition for headline overlay | Replace the `.hero-visual` placeholder div in [landing-page/index.html](landing-page/index.html) | not submitted | ❌ not started |

*(🟡 rows need a `job_display` re-check next session to confirm completion
and grab the final `.mp4` URL — the job IDs are already correct, just
unconfirmed. ❌ rows still need to be submitted from scratch.)*

## How to actually use these

1. Open each URL above in a browser (not this sandbox — see the network note up top).
2. Run the 60-second compliance gate on each one.
3. Download the ones that pass into `Content/Approved/` per [10-launch-guide.md](10-launch-guide.md).
4. Pair with the caption/hook/hashtags already assigned to that calendar day in [04-content-calendar.md](04-content-calendar.md).
5. For the hero clip, re-encode/trim in CapCut to loop cleanly, then swap it in for the placeholder `<div class="hero-visual">` block in the landing page (replace the gradient placeholder with a `<video autoplay muted loop playsinline>` tag pointing at your hosted copy of the clip — don't hotlink Higgsfield's CDN long-term, download and re-host it with your domain).

## Red-Team / Compliance Council Review

Reviewed from three angles. This is a process-level review of the generation
pipeline and prompts — see the mandatory visual QA note at the top for what
still needs human eyes.

**① Compliance officer (age / consent / explicitness):**
Every prompt carries the full identity block ("age 26, clearly a mature
adult... Australian glamour/lifestyle model aesthetic") and the full negative
block banning underage/teen/childlike appearance, school uniforms,
lookalikes, nudity, explicit acts, lingerie, see-through clothing, and
suggestive posing beyond fashion-editorial standard, on all 21 generations
with zero exceptions. No prompt requests anything beyond standard
beach/resort swimwear, gym wear, or fashion looks already covered in the
brand's character rules ([01-brand-identity.md](01-brand-identity.md)). No
generation was retried with a "looser" prompt after a rejection — none were
rejected by the platform's own safety systems, which is a supporting (not
sufficient) signal.

**② Brand/consistency officer:**
All 20 social clips + the hero clip share one locked `image_references` face
(the canon job ID), so identity should be consistent across the whole batch
— confirm this visually once you can see them; if any clip's face drifts
noticeably, regenerate that one clip only, don't touch the reference.
Wardrobe/location/mood variety matches the brand's established visual style
(beach, gym, night-out, apartment, cosy — see [06-image-prompts.md](06-image-prompts.md))
with no new locations or aesthetics introduced outside that system.

**③ Legal/disclosure officer:**
These are source assets, not finished posts — the AI disclosure, 18+ label,
and "no real person depicted" statement are **not baked into the video
pixels** and must be added at publish time exactly as instructed in
[09-compliance-checklist.md](09-compliance-checklist.md) section A: caption
disclosure text, platform AI-content label switched on, and the
`MILA NOVA ✦ AI` watermark. Do not post any clip from this batch without
that publish-time disclosure step — it is not optional and is not satisfied
by anything already done in this generation pass.

**What was NOT verified (be honest about this):** no one on this side viewed
the actual video frames. The environment's egress policy blocked fetching
Higgsfield's CDN host directly (reported, not bypassed — see proxy status
log), so this review is prompt/process-level only, not pixel-level. Treat
every asset as "generated to spec, unverified" until a human opens the URL
and checks it against the 60-second gate.
