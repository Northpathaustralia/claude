# START HERE — The Complete Beginner's Launch Guide

Written for someone working mostly from an iPhone, with no technical background. Short words, numbered steps, no assumed knowledge. Where a laptop genuinely helps, the step says so. Nothing in this guide requires coding.

**The one rule that matters most:** anything called a *key*, *token*, or *secret* is a password. Never share it, never screenshot it, never paste it into social media or AI chat tools. Keep them in a password manager (iPhone's built-in Passwords app is fine).

---

## Part 1 — Get the website live (about one afternoon)

### Step 1. Buy the domain
- **What it is:** your address on the internet (echosight.ai).
- **Essential?** Yes. **Cost:** about A$90/year (.ai domains cost more than .com).
- **How:** go to `porkbun.com` or `namecheap.com` → search "echosight.ai" → buy it. Make an account with your email. Turn ON auto-renew. Turn ON "WHOIS privacy" (usually free).
- **If echosight.ai is taken:** stop. Check `echosight.com.au` and the fallback names in `echosight/brand/brand-system-v2.md` (Resonara, Clarivue, Signalcraft), and also read the trademark note in the same file before falling in love with any name.
- **Success looks like:** the registrar dashboard shows the domain as yours.

### Step 2. Cloudflare account (free — this does three jobs)
- **What it is:** the service that will host the site, route your email, and count visitors.
- **How:** `cloudflare.com` → Sign up → "Add a site" → type your domain → choose the **Free** plan. Cloudflare shows you two "nameserver" addresses. Go back to your registrar's dashboard → find "Nameservers" → replace what's there with Cloudflare's two. Wait up to a few hours.
- **Success looks like:** Cloudflare says "Active" next to your domain.

### Step 3. Email addresses (free)
- **What it is:** hello@echosight.ai etc., forwarding to your normal inbox.
- **How:** in Cloudflare → Email → Email Routing → Enable → create addresses: `hello@`, `privacy@`, `security@`, `press@` → set them all to forward to your personal email → Cloudflare asks to add DNS records — click Approve.
- **Test it:** email hello@yourdomain from another account. It should arrive in your inbox.

### Step 4. Put the site online (free)
- **What it is:** publishing the website files in this project folder.
- **Laptop recommended** for this one step (15 minutes).
- **How:** in Cloudflare → Workers & Pages → Create → Pages → "Connect to Git" → sign in to GitHub → pick this repository → settings: Framework preset **None**, Build command **(leave empty)**, Build output directory **`echosight/site`** → Deploy. Then Pages → Custom domains → add your domain.
- **Success looks like:** your domain opens the EchoSight homepage on your phone.
- **If it fails:** the deploy log (shown on screen) says why; 9 times out of 10 the output directory field is wrong — it must be exactly `echosight/site`.

### Step 5. Make the forms real (free)
- **What it is:** right now the waitlist/contact forms save answers on the visitor's own device and say so. This step connects them for real.
- **How:** go to `tally.so` → make a free account → create a form with fields Name, Email, Instagram handle, "Which sounds most like you" → in Tally, get the form's share link. Simplest path: open `echosight/site/build/pages.mjs`, and for the waitlist/contact/free-review pages replace the demo form with a link-button to your Tally form — or ask any developer (or Claude) to "wire data-endpoint to my Tally/Formspree endpoint," which is a one-line change per form.
- **Test it:** submit the form yourself; check the response appears in Tally.

### Step 6. Count visitors without cookies (free)
- In Cloudflare → Analytics → Web Analytics → add your site → it gives you one line of code to add before `</body>` — ask for it to be added to `site/build/build.mjs`'s footer template and rebuilt, or paste into each page. Cookieless = the site's cookie policy stays truthful.

---

## Part 2 — Social accounts and content (about one day)

### Step 7. Instagram professional account (free)
- Create the @echosight account (or your chosen handle) → Settings → "Switch to professional account" → choose **Business**. Fill the bio: one line of promise + the free-review link. Connect it to a Facebook Page (create one — it's required plumbing for Meta tools; nobody needs to see it).

### Step 8. Meta Business Suite scheduling (free)
- `business.facebook.com` on your phone or laptop → it shows your IG account → Planner lets you schedule Reels and carousels. Schedule week 1 from `echosight/marketing/30-day-content-calendar.csv`.
- TikTok and YouTube Shorts: post manually each morning (10 minutes; the calendar lists which days).

### Step 9. Make the videos (Higgsfield)
- **What it is:** the AI video tool the 12 video packages are written for. **Cost:** see `echosight/higgsfield/production-cost-plan.md` (~A$45 for the first two videos; ~A$130–250 for all 12).
- **How:** create an account at `higgsfield.ai` → buy the smallest credit pack → open `echosight/higgsfield/README-BEGINNER-GUIDE.md` and follow it exactly. Start with the character reference sheets, then day-01, then day-16.
- **What must never happen:** generating videos of you (the founder) — days 7, 14, 27 are you, on your phone camera, on purpose.
- **Editing:** download CapCut (free) on the phone; each video folder's `edit-decision-list.csv` is the assembly order and `captions.srt` imports as subtitles.

### Step 10. The daily hour
- Follow `echosight/marketing/community-engagement-plan.md`: reply to comments for 25 minutes after posting, comment on 15 creators' posts midday, answer DMs in the evening. This hour is the actual marketing.

---

## Part 3 — The product beta (only when you're ready to onboard people)

### Step 11. Meta developer app (free, but slow — start early)
- **What it is:** the official registration that lets EchoSight (the product) read a user's own Instagram insights with their permission. The marketing site does NOT need this; the beta does.
- **How:** `developers.facebook.com` → create developer account (verify with your Facebook account) → Create App → type "Business" → add the **Instagram Graph API** product → in App Review, request only these permissions: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement` → for each one, paste the plain-English justification from `echosight/compliance/meta-api-readiness.md` → submit and wait (days to weeks).
- **What never to share:** the App Secret shown in app settings. Password manager, nothing else.
- **If rejected:** the rejection email says which permission and why; fix the described gap (usually a screencast demonstrating the feature) and resubmit. This is normal and takes a few rounds.

### Step 12. Payments — only when seats open (Stripe)
- `stripe.com` → create account → activate with your business details (ABN needed — see Step 13) → create Products matching the pricing page exactly → use Stripe Payment Links (no code) for founding seats.
- **Never** type card numbers you receive by DM/email — send people the Stripe link instead, always.

### Step 13. Company + legal (before taking money)
- Register the Pty Ltd (accountant or online agent, ~A$600 with ASIC fee) → get the ABN → send the five legal pages (privacy, terms, cookies, acceptable use, data processing — they're drafted and marked for review) to an Australian solicitor for a fixed-fee review (~A$800–1,500). The drafts are not final legal advice until this happens; the site's banners say so and come off after review.

---

## Part 4 — Running things

### Step 14. Support: reply from hello@ within 24 hours. Saved replies live in `echosight/docs/14-operations-and-support.md`. Honesty rule: if something's broken or late, say exactly that.
### Step 15. Backups: the website lives in GitHub (already backed up). Export Tally responses to CSV weekly. Keep phone videos backed up to iCloud/Drive.
### Step 16. Security basics: password manager for everything; two-factor ON for registrar, Cloudflare, Meta, GitHub, Stripe (these five above all); never install "Instagram growth" apps; never enter your Instagram password anywhere but Instagram itself — which is exactly what EchoSight promises its users, so live it.
### Step 17. When something on the site needs changing: edit the text in `echosight/site/build/pages.mjs`, run `node build.mjs` in `site/build/` (or ask Claude to), push to GitHub — Cloudflare redeploys automatically.
### Step 18. Watching the numbers: fill one row of `echosight/marketing/content-measurement-dashboard.csv` per post each Sunday; the column meanings match Instagram's insights screens.
### Step 19. When Higgsfield/AI tools change: the packs' prompts are tool-version-tolerant (plain descriptive language); if an interface renames things, the intent of every field is written out in `higgsfield-prompts.md`.
### Step 20. Launch day: follow `echosight/LAUNCH-CHECKLIST.md` top to bottom. Don't launch on a Friday.

---

## DO THESE STEPS IN THIS EXACT ORDER (the one-page version)

1. ☐ Buy domain (Step 1)
2. ☐ Cloudflare + nameservers (Step 2)
3. ☐ Email routing + test email (Step 3)
4. ☐ Site live on your domain (Step 4)
5. ☐ Forms connected to Tally + test submission (Step 5)
6. ☐ Cookieless analytics on (Step 6)
7. ☐ IG professional account + bio + link (Step 7)
8. ☐ Week-1 content scheduled in Business Suite (Step 8)
9. ☐ Higgsfield: reference sheets → day-01 → day-16 videos made and QC'd (Step 9)
10. ☐ Daily engagement hour begins with day-1 post (Step 10)
11. ☐ (In parallel, unhurried) Meta developer app submitted (Step 11)
12. ☐ At 100+ waitlist: email tool + first update sent (setup order §9)
13. ☐ Before charging: company, Stripe, legal review done (Steps 12–13)
14. ☐ Day 30: founding cohort opens per the launch checklist

Stuck on any step? The specific file named in that step has the detail; failing that, the error message plus the step number is exactly what to paste into a Claude session for help.
