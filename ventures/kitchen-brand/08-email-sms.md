# 14. Email & SMS Flows (Klaviyo)

**Global rules:** sender name alternates "Lola at Whisk & Wink" / "Mia at Whisk & Wink"
(matching each one's role — Lola sells, Mia helps). Every email: one job, one CTA button,
short paragraphs, plain-text feel with 1–2 images max. SMS only with explicit opt-in
(checkbox at checkout + welcome popup) and AU Spam Act compliance: identify the business,
working opt-out ("Txt STOP to opt out") on every message. Quiet hours: no SMS before 9am
or after 8pm local.

---

## Flow 1 — Welcome (trigger: popup signup "Get 10% + the weekly wink")

**Email 1 · immediately · Goal: deliver code, set the vibe, first purchase**
- Subject: "Your 10% is inside (plus a wink) 😉" · Preview: "We don't do boring welcomes."
- Body: "Hey, it's Lola & Mia. You're officially one of us now, which means: 10% off
  your first order (code **WELCOME10**), first dibs on new gadgets, and one genuinely
  useful kitchen hack a week. No daily spam — we have onions to dice.
  Start with the stuff everyone starts with → [The Starter Wink]"
- CTA: `Claim my 10%`

**Email 2 · day 2 · Goal: trust + story**
- Subject: "The rule we never break" · Preview: "If it doesn't gasp, it doesn't ship."
- Body: the brand story — every product must pass both sisters (Lola breaks it in, Mia
  verifies the claims); 30-day guarantee explained; honest shipping times stated plainly.
  One customer review featured. CTA: `See what survived us` → Best Sellers.

**Email 3 · day 4 · Goal: convert with social proof**
- Subject: "Bought as a joke. Used every day." · Preview: "The review section is a comedy
  section."
- Body: 4 real reviews + the products they're about; reminder WELCOME10 expires in 72h
  (real expiry). CTA: `Use my code before it goes`

**SMS (only if opted in) · day 5:** "Mia here 🌿 your WELCOME10 expires tomorrow —
quietly, like a responsible code. [link] Txt STOP to opt out"

## Flow 2 — Abandoned cart (trigger: checkout started, no purchase)

**Email 1 · 1 hour · Goal: recover without discount**
- Subject: "You left this behind 👀" · Body: cart contents pictured; "No pressure — your
  cart's safe with us. One thing worth knowing: 30-day guarantee, so the only risk is
  liking it too much." CTA: `Finish checkout (takes 40 seconds)`

**Email 2 · 24 hours · Goal: kill the objection**
- Subject: "Okay, real talk — what's holding you back?" · Body: Mia answers the top 3
  objections for the product in cart (cleaning/shipping/quality), one review, guarantee
  badge. CTA: `Back to my cart`

**Email 3 · 48 hours · Goal: close with incentive**
- Subject: "We'll sweeten it. 10% for 48 hours." · Body: "Lola says you were 'basically
  already ours.' Prove her right: **WINKBACK10**, expires in 48 hours (really)."
  CTA: `Claim 10% and check out`

**SMS · 25 hours (between emails 2–3):** "Lola here 👋 the Chop Boss is still in your
cart looking gorgeous. Want it? [link] Txt STOP to opt out"

## Flow 3 — Post-purchase (trigger: order placed)

**Email 1 · immediately — Order confirmed**
- Subject: "Order confirmed. Excellent taste, by the way." · Body: order summary, what
  happens next (tracking within X days), support email, "reply to this email and a real
  human answers." CTA: `Track my order`

**Email 2 · on fulfilment — It's moving**
- Subject: "It's on the way 🚚 (cue montage music)" · Body: tracking link, honest ETA,
  "while you wait" → 60-second setup video for their product. CTA: `Watch the 60-second
  setup`

**Email 3 · delivery + 2 days — Get the win fast**
- Subject: "Do this first (takes 2 minutes)" · Body: Mia's quick-start for their exact
  product (the fastest 'wow' use), care tip, link to hacks blog. Sets up the review ask.
  CTA: `Get the perfect first use`

**SMS · on out-for-delivery:** "📦 Today's the day! Your Whisk & Wink order is out for
delivery. Camera ready — we want to see the first chop. Txt STOP to opt out"

## Flow 4 — Review request (trigger: delivery + 7 days, skip if support ticket open)

**Email 1 · Subject:** "Be honest. We can take it. 🥲"
- Body: "Quick favour — how's the [product]? Two sentences helps more than you'd think.
  Photo/video reviews get 15% off the next order (VIBECHECK15)." CTA: `Leave a review
  (60 seconds)`
**Email 2 · +5 days if no review · Subject:** "Mia said not to nag. This isn't nagging.
This is *checking in*." Same offer, lighter touch, last ask.

## Flow 5 — Win-back (trigger: 60 days since last purchase)

**Email 1 · day 60 · Subject:** "We've been chopping without you 🥺"
- Body: what's new since they left (new arrivals, top hack), no discount yet.
  CTA: `See what's new`
**Email 2 · day 75 · Subject:** "This says 15% but it means 'come back'"
- Body: **COMEBACK15**, 7-day expiry, plus bestseller they don't own (Klaviyo product
  exclusion). CTA: `Use my 15%`
**SMS · day 76:** "It's the sisters 👯‍♀️ 15% welcome-back inside, 7 days: [link]
Txt STOP to opt out"

## Campaign 6 — Launch campaign (to pre-launch/waitlist list)

- **T-7 days:** "Something's cooking 👀" — teaser, sisters intro video, waitlist gets
  first access.
- **T-1:** "Doors open tomorrow. Founding 500 get the good stuff." — explain First 500
  Winks offer (15% + surprise gift + founder status).
- **Launch day:** "We're OPEN. You're first. Go. 🏃‍♀️" — big button, live counter of
  founder spots. CTA: `Claim founder spot`
- **Launch +3:** "412 of 500 founder spots gone" (real number only) — last-call framing.

## Campaign 7 — Bundle promotion (monthly rhythm)

- Subject options: "Math, but delicious: the bundle breakdown" / "Buying twice is a
  choice. The bundle is a lifestyle."
- Body: one bundle featured/month, itemised savings shown, one review per included item,
  sister banter intro ("Lola wanted to call it the Chaos Box. We compromised.").
- CTA: `Get the bundle, save A$30` · SMS on final day: "Last day: Meal Prep Bundle at
  launch price [link] Txt STOP to opt out"

## Campaign 8 — Holiday/gift campaigns (Q4 skeleton, reuse for Mother's/Father's Day)

- **Nov 1 — Gift Guide:** "The gift guide that ends gift stress" → guide by recipient
  ("for the dad", "for the new lease", "for the one who has everything").
- **Nov mid — BFCM:** "Our only real sale of the year. We mean it." (One honest sitewide
  sale/year keeps pricing integrity; 20% sitewide + free gift over A$100.)
- **Dec 1 — Shipping deadline:** "Order by Dec X = under the tree. After that, gift
  cards save heroes." Countdown = real carrier cutoff, not fake urgency.
- **Dec 26 — Treat yourself:** "You survived hosting. Buy the thing YOU wanted."
- SMS: deadline day only — "Final call for pre-Christmas delivery 🎄 order by midnight:
  [link] Txt STOP to opt out"

---

**Benchmarks to expect (kitchen/impulse niche):** flows = 15–25% of total revenue once
list >2k; abandoned-cart recovery 8–15% of abandons; welcome-flow conversion 3–8% of
signups; SMS click rates 3–5× email. If welcome email 1 open rate <45%, fix the subject
line and sender reputation before anything else.
