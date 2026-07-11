# 0. The Dummy Guide — Launch This For Real, Step by Step

No jargon. No skipped steps. If you can create an email address and copy-paste
text, you can do this. Do the steps **in this exact order**. Each one has a
checkbox — don't skip ahead.

Total cost to get live: **roughly $30–50** (mostly a domain name + one AI
image tool). Time: a focused weekend, or a couple of evenings.

---

## STEP 1 — Get your basic accounts sorted (30 minutes)

- [ ] **1.1** Go to Gmail (or your email provider) and make ONE new email address just for this business. Example: `hello.milanova@gmail.com`. Use this email for every single sign-up below — never your personal email.
- [ ] **1.2** Open a free password manager (Bitwarden is free) and save every login you create today in it, as you go. Don't skip this — you'll create 6+ accounts today.
- [ ] **1.3** Turn on two-factor authentication (2FA) on the new email account itself, right now, before anything else.

---

## STEP 2 — Buy your domain name (10 minutes, ~$15/year)

- [ ] **2.1** Go to Namecheap.com (or Cloudflare Registrar — slightly cheaper, more technical).
- [ ] **2.2** Search for `milanova.ai` first. AI domains are trendy but pricier — if it's too expensive or taken, try `getmilanova.com`, `milanovaofficial.com`, or `heymilanova.com`.
- [ ] **2.3** Buy it. Skip every upsell (SSL, privacy protection can stay if it's free, hosting add-ons — say no).
- [ ] **2.4** Save the login in your password manager.

You now own your web address. Nothing is "live" on it yet — that's step 4.

---

## STEP 3 — Set up your social accounts (45 minutes)

Do these in order, using the SAME username everywhere so people can find you
across platforms. Suggested handle: `milanova.ai` or `itsmilanova`.

- [ ] **3.1** Create an Instagram account. Go to Settings → switch to a Professional/Creator account (free) so you get insights later.
- [ ] **3.2** Set the bio using the text in [01-brand-identity.md](01-brand-identity.md) under "Instagram bio" — copy it exactly, it already has the required 18+/AI disclosure baked in.
- [ ] **3.3** Create a TikTok account, same username, same bio pattern (TikTok version is in the same file).
- [ ] **3.4** Create an X (Twitter) account, same username, X bio version.
- [ ] **3.5** In every single bio, make sure these three things are visible: **AI-generated**, **18+**, and your future website link (you'll add the real link in step 6).

---

## STEP 4 — Generate Mila's first images (1–2 hours)

- [ ] **4.1** Pick ONE AI image tool that supports "character consistency" or "character reference" (a feature that keeps the same face across images). Check its terms of service for commercial-use rights before paying — this matters, don't skip it.
- [ ] **4.2** Open [06-image-prompts.md](06-image-prompts.md) in this folder. Start with **Prompt #35 — Canon beauty portrait**. Generate it 4–6 times and pick the ONE face you like best. This is now Mila's permanent face.
- [ ] **4.3** Reverse-image-search that exact picture: go to images.google.com, click the camera icon, upload it, and check nothing similar to a real celebrity/person comes up. Also try a face-search tool like PimEyes. Take a screenshot of the clean results and save it — this is your proof.
- [ ] **4.4** Using your tool's "character reference" / "seed" / "consistent character" feature with that same face, generate prompts **#1, #7, #13, and #19** from the same file. That's your first 4 real images.
- [ ] **4.5** Save everything into a folder on your computer called `MilaNova/Content/Raw`, named by prompt number and date.
- [ ] **4.6** Run each image through the 60-second checklist in [09-compliance-checklist.md](09-compliance-checklist.md), section H. If any image fails even one question — delete it, don't post it, regenerate instead.

---

## STEP 5 — Brand the images (30 minutes)

- [ ] **5.1** Go to Canva.com (free account, same new email).
- [ ] **5.2** Open [assets/logo.svg](assets/logo.svg) in a browser — right-click, save the image — then upload it into Canva as a brand asset.
- [ ] **5.3** Add a small text watermark "MILA NOVA ✦ AI" to the bottom corner of every image before posting (Canva → add text box → export). This takes 2 minutes per image and protects you.
- [ ] **5.4** Save your 4 branded images into `MilaNova/Content/Approved`.

---

## STEP 6 — Put the landing page online (30–60 minutes, free–$19/year)

You already have a finished, working landing page file:
[landing-page/index.html](landing-page/index.html). You just need to host it.

**Easiest option — Cloudflare Pages (free):**
- [ ] **6.1** Go to pages.cloudflare.com, sign up with your new email.
- [ ] **6.2** Choose "upload assets" (not the Git option — simpler for one file), and upload `landing-page/index.html` as `index.html`.
- [ ] **6.3** Cloudflare gives you a free `yourproject.pages.dev` link immediately — test it, click around, make sure the age gate and buttons work.
- [ ] **6.4** In Cloudflare Pages settings, add your custom domain from Step 2 and follow its instructions to point your domain at the page (it will tell you what DNS records to add back in Namecheap — copy-paste exactly what it shows you).
- [ ] **6.5** Wait 10–30 minutes for it to connect, then open your real domain in a browser and confirm the page loads there too.

**Simpler alternative if step 6 feels technical:** use Carrd.co ($19/year) —
you paste the page's text/sections into their builder instead of uploading
raw HTML, and it handles hosting + domain connection with no DNS steps.

---

## STEP 7 — Connect your email list (20 minutes, free)

- [ ] **7.1** Go to MailerLite.com, sign up free with your new email.
- [ ] **7.2** Create one "group" called `Mila Nova Fans`.
- [ ] **7.3** Create a simple sign-up form (MailerLite has a template) and grab its embed link.
- [ ] **7.4** Open [landing-page/index.html](landing-page/index.html) and find the email form (search for `email-box`). Replace the `onsubmit="event.preventDefault()..."` placeholder with the real MailerLite form action — MailerLite's "embed" instructions show you exactly what to paste. If this step feels too technical, just link the button straight to your MailerLite hosted sign-up page instead — much simpler, still works.
- [ ] **7.5** Re-upload the updated file to Cloudflare Pages (Step 6.2 again) to publish the change.

---

## STEP 8 — Set up where the money actually lands (30–45 minutes)

- [ ] **8.1** Go to Fanvue.com, sign up with your new email, and select the **AI Creator** option during onboarding — this is important, it's what makes disclosed-AI content compliant on their platform.
- [ ] **8.2** Complete their verification steps (they'll ask for ID — this is Fanvue verifying the real human running the account, not Mila; totally normal and required).
- [ ] **8.3** Fill in your Fanvue profile using the bio in [01-brand-identity.md](01-brand-identity.md) ("Fanvue / subscription platform" version).
- [ ] **8.4** Set up your three tiers exactly as written in [03-subscription-tiers.md](03-subscription-tiers.md) — $5 / $10 / $20, copy the inclusions in as the tier descriptions.
- [ ] **8.5** Turn ON Fanvue's AI-content disclosure setting/label — it's required by their rules, and it's free brand-building for you anyway.
- [ ] **8.6** Upload your 4 approved images from Step 5 as your first posts, using captions from [05-promotional-content.md](05-promotional-content.md).
- [ ] **8.7** Leave the club "stocked but not announced yet" for now — don't blast it publicly until Step 10.

---

## STEP 9 — Post your first week (spread over 7 days)

- [ ] **9.1** Open [04-content-calendar.md](04-content-calendar.md) — Day 1 through Day 7 are already written for you: what to post, where, the caption, the hashtags. Just follow it.
- [ ] **9.2** Each day, post the one thing listed, on the platform listed. Reply to every comment you get within the first hour if you can.
- [ ] **9.3** Every image needs the AI-label toggle ON (Instagram/TikTok both have one in the post settings) plus the disclosure text in the caption.

---

## STEP 10 — Open the doors (Day 22 of the calendar, but the mechanics are here)

- [ ] **10.1** Post the "fan club is open" announcement (already written for you, Day 22 in the calendar file) on Instagram, TikTok and X on the same day.
- [ ] **10.2** Put your real domain link in every bio (replace any placeholder link).
- [ ] **10.3** Send one email to your list (Free Render Friday template + "doors are open now") via MailerLite.
- [ ] **10.4** Reply to every single new subscriber within 12 hours using a welcome message from [05-promotional-content.md](05-promotional-content.md) — remember it must include the AI-assist disclosure line.

---

## STEP 11 — Keep it running (ongoing, ~1 hour/day)

- [ ] **11.1** Every Sunday: batch-generate next week's images (Step 4's process, repeated).
- [ ] **11.2** Every day: post that day's content, reply to comments, welcome new subs.
- [ ] **11.3** Every Friday: send the email, check the numbers using [11-tracking-and-analytics.md](11-tracking-and-analytics.md), fill in the revenue tracker from [10-launch-guide.md](10-launch-guide.md).
- [ ] **11.4** Once a month: redo the reverse-image-search on Mila's face (Step 4.3) and re-read whatever platform's current AI policy (Fanvue/Instagram/TikTok/X) — these rules change, and you must stay current. See [09-compliance-checklist.md](09-compliance-checklist.md).

---

## If you get stuck

- **"The domain/hosting step is too technical"** → use Carrd.co instead of Cloudflare Pages (Step 6 alternative above). It costs $19/year and removes all the DNS steps.
- **"I don't know which AI image tool to pick"** → pick any tool that (a) explicitly allows commercial use in its terms and (b) has a character-consistency or character-reference feature. That second feature matters more than image quality — it's what keeps Mila looking like the same woman every time.
- **"A platform rejected/flagged a post"** → don't argue with the automated moderation. Delete or edit per their message, re-read [09-compliance-checklist.md](09-compliance-checklist.md), and move on. One rejection is normal; a pattern means you need to re-read the rules for that specific platform.
- **"I'm not sure if something is too explicit"** → if you have to ask, it's too much. Pull it back to standard beach/gym/fashion level and re-read [01-brand-identity.md](01-brand-identity.md)'s character rules.

That's the whole launch. Steps 1–8 get you live. Steps 9–10 get you your
first customers. Step 11 is the rest of the business, forever, on repeat.
