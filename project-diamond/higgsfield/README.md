# Higgsfield Marketing Kit — How to Connect Your Account to the Evenfall Engine
You have a Higgsfield account. This folder turns it into Evenfall's ad factory. There is no "plug-in" between Higgsfield and Shopify/Meta — the connection is a simple weekly workflow, and this kit gives you everything pre-written so each video takes ~20 minutes of your time.

## One-time setup (15 minutes)
1. Log into Higgsfield → create a project/workspace called **EVENFALL**.
2. Open `style-block.txt` in this folder. This is the brand look. You will paste it at the end of **every** prompt so all videos match (this is what makes it look like one brand, not random AI clips).
3. Bookmark this folder. The 8 files named `card-01` … `card-08` are your launch videos, already broken into scene-by-scene prompts.

## Making one video (the loop you'll repeat)
1. Open a card file (start with `card-01-47-tabs.txt`).
2. Copy **SCENE 1** into Higgsfield's prompt box. Paste the style block after it. Generate. Re-roll until it looks right (2–3 tries is normal). Download.
3. Repeat for each scene in the file (most cards are 4–6 scenes).
4. Open CapCut (free) → new 9:16 project → drop the scenes in order → add the caption lines from the card's CAPTIONS section (font: a serif like Fraunces, lowercase, bone-white, bottom third) → add music per the card's MUSIC line (use CapCut's licensed library) → end every video with the end-card: black jar, text "the night, reclaimed. — evenfall".
5. Export: 1080×1920, 30fps, highest quality. Name the file exactly as the card says (e.g. `2607-meta-M01-A.mp4`) — this naming is how you'll know which ad is winning later.

## Getting the videos out to market (the "connect" part)
- **Meta ads:** Meta Ads Manager → your campaign (set up in doc 19, step 16) → create ad → upload the mp4 natively → primary text/headline/CTA come from doc 16's ad construction table (each card file lists its matching hook ID). Never link to a video hosted elsewhere — always upload the file.
- **TikTok / Reels / Shorts:** upload natively in each app, never cross-post a watermarked file. Post organically first; any TikTok that passes ~50k views gets turned into a Spark Ad (Ads Manager → Spark → paste the video's code).
- **Pinterest:** export a still of the best frame + the loopable cut from card-02; pin with the titles from the Pinterest list (doc 07a).

## The weekly rhythm (1–2 hours total)
Monday: check the KPI email — kill any ad that spent $150 with no sale. Pick the 2 best performers. Make 3 new videos: 2 variations of the winners (each card lists its A/B VARIATIONS — those are your next prompts) + 1 new card. Upload. Done.

## If your Higgsfield plan includes API access
Check your account settings/plan page for API or integration options. If available, the same scene prompts in these files can be submitted programmatically to batch-render the week's variants — the automation architect's spec for that is one page: loop over scene blocks → render → collect files into the Drive folder. Don't build this until the manual loop has produced your first winning ad; automate what works, not what might.

## Rules that keep you out of trouble
- Never generate or imply a medical claim (no "cures insomnia", no "raises magnesium levels"). The scripts in these cards are already claim-safe — don't improvise new ones without checking doc 02's approved language.
- AI-generated "customer" faces must never be presented as real customers or reviews. UGC-style cards are clearly performances/demonstrations; real testimonials come from real customers only (doc 16 legal note).
- Disclose AI-generated content where the platform requires it (Meta and TikTok both have an AI-content toggle — switch it on for fully synthetic videos).
