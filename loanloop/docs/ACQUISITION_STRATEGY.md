# Acquisition strategy

Goal: get the first 20–50 brokers embedding the widget with as close to zero paid spend and zero
manual sales effort as the free-tier badge and existing NorthPath network allow.

## 1. The badge is the growth loop (primary channel)

Every Free-tier widget carries a small "Powered by LoanLoop" link. Every broker who embeds it puts
that link in front of every one of their site's visitors — including other brokers who stumble
across a competitor's site. This is the same mechanic that grew Calendly, Typeform and Intercom's
early embeds. No spend, compounds with each sign-up.

## 2. Warm network seeding (first 5–10 brokers)

James already operates in this exact market (NorthPath). The first cohort is:

- NorthPath's own referral network (`referralManager.js` already tracks accountants, brokers,
  planners, conveyancers — a ready-made warm list).
- Direct, personal outreach: "I built a free tool that turns your website into a lead source — try
  it, no cost." A personal ask from a known operator converts far better than cold outreach.

## 3. Broker communities (no-cost, scales past the warm list)

- MFAA and FBAA member Facebook groups and LinkedIn communities — brokers actively share tools
  that generate leads; a genuinely free, 2-minute-setup tool is exactly the kind of post that gets
  traction without looking like spam.
- Broker-focused subreddits/forums and AusFinance-adjacent communities, framed as "I built this,
  free to use" rather than an ad.

## 4. SEO surface, not SEO spend

The landing page (`site/index.html`) and a future `/blog` are written to rank for
long-tail terms brokers themselves search: "borrowing power calculator widget for my website",
"lead capture tool for mortgage brokers Australia". Low competition, high intent — no ad spend
required, just consistent publishing.

## 5. Paid acquisition (deliberately deferred)

No paid ads in the MVP phase. Once the free-tier badge loop and warm network prove a working
funnel (sign-up → embed → first lead → upgrade), a small always-on budget on LinkedIn (targeting
"mortgage broker" job title, Australia) becomes viable — but spending before the funnel is proven
would be optimising the wrong end of the problem.

## Success signal for "the MVP is working"

Not signups — **embeds that capture at least one real lead within 7 days.** A broker who pastes the
code and gets a lead is a broker who upgrades and refers others; a broker who signs up and never
embeds it is not a real conversion.
