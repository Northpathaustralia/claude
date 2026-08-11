# EchoSight AI — Executive Summary

**One line:** EchoSight AI tells creators, agencies and brands *why* their Instagram content performs, predicts how the next post will perform before it's published, and generates the content most likely to win — all from authorised data.

## The problem

Instagram is the primary revenue channel for 200M+ business and creator accounts, yet the native tooling answers only *what* happened (views, likes, reach). It never answers the three questions that actually drive growth:

1. **Why** did this Reel work and that one die?
2. **What should I post next**, and how will it perform?
3. **What exactly do I change** — hook, pacing, caption, audio, CTA — to improve?

Existing analytics tools (Later, Hootsuite, Iconosquare, Sprout Social) report metrics. None of them explain causality, none predict pre-publication performance from the creative itself, and none close the loop by generating the improved content.

A parallel market failure: a wave of grey-market tools claims to reveal "who saved / shared your post" or stalks private activity. These violate Meta policy, get users banned, and poison trust. The demand signal is real; the supply is illegitimate. EchoSight captures that demand legitimately: we *predict and explain* saves, shares and follows from creative and engagement patterns — we never claim to expose private actions.

## The product

A multi-tenant SaaS platform with five tailored workspaces (Creator, Agency, Brand, Enterprise, plus a unified AI Dashboard) built on eight engines:

- **Content Analysis Engine** — computer vision + audio + language analysis of every Reel, carousel and post: hook strength, first frame, pacing, cuts, storytelling arc, caption, CTA, audio/trending sounds, colour, motion, facial emotion, brand consistency.
- **Prediction Engine** — pre-publication scores with confidence intervals: Virality, Hook, Scroll-Stop, Retention, Save/Share/Comment/Follow/Conversion probabilities.
- **Recommendation Engine + AI Coach** — ranked, concrete improvements ("re-cut the first 1.4s", "move the CTA to the caption's first line") with plain-English *why*.
- **Trend Detection Engine** — emerging formats, audio, hooks and niches from authorised public data; daily reports.
- **Competitor Intelligence** — public-data monitoring of competitor accounts: cadence, formats, estimated engagement quality, opportunities.
- **Creative Generator** — hooks, captions, scripts, carousels, storyboards, ads — plus complete **Higgsfield** (AI video) and **Fable** (AI animation/character) production prompt packs, so insight becomes finished content.
- **Analytics Engine** — first-party Instagram Graph API analytics, unified across accounts and clients.
- **Marketing Automation & API Platform** — scheduled reports, alerts, webhooks, and a public API for agencies and enterprises.

## Why now

- Short-form video decides commercial outcomes, and creative quality — not posting time — is the dominant ranking factor in Instagram's recommendation systems.
- Multimodal AI (vision + audio + language) has just become good enough and cheap enough to analyse creative at scale.
- Meta's API regime has stabilised around the Graph API for professional accounts, making a compliant data foundation durable.
- The creator economy is professionalising: agencies and brands now budget for creative intelligence the way they budget for SEO tools.

## Market

**ASSUMPTION (documented, revisit with primary research):** ~200M business/creator accounts on Instagram; serviceable market of ~15M English-speaking professional accounts actively investing in growth tooling; beachhead of ~1.5M creators/agencies spending $30–$300/mo on social tools. At a blended $55/mo ARPU, a 0.5% beachhead share is ~$50M ARR.

## Business model

Freemium SaaS: Free → Starter $29 → Pro $79 → Agency $199 → Enterprise (custom, from $1,500/mo) → White-label add-on. Expansion revenue from seats, managed accounts, API usage and add-ons. Target blended gross margin ≥ 78% at scale (AI inference is metered and cached aggressively).

## Moat

1. **Outcome data flywheel** — every published post with consented analytics becomes labelled training data linking creative features → real outcomes. Prediction accuracy compounds with users; competitors can't shortcut this.
2. **Compliance-first architecture** — scraping-based rivals face platform bans; we're built to survive audits.
3. **Insight-to-asset loop** — analysis → recommendation → generated content → measured result in one product; single-purpose tools capture only a slice.
4. **Workflow lock-in** for agencies (client reporting, white-label, API).

## Traction plan (first 12 months)

Closed beta with 200 hand-recruited creators → public launch (Product Hunt + creator-influencer partnerships) → 10,000 free / 1,200 paid by month 12 → agency tier push in months 6–12. Detail: [Marketing Playbook](12-marketing-playbook.md).

## Financial headline

**ASSUMPTION-based model** (full detail in [Financial Model](10-financial-model.md)): Year 1 exit ARR ≈ $0.8M, Year 3 ≈ $8.4M, Year 5 ≈ $28M; break-even in Year 3; CAC payback < 9 months on self-serve tiers; LTV:CAC > 4:1 blended.

## The ask

**ASSUMPTION:** Seed round of **A$2.5M** for 24 months' runway: ship GA product, reach $1M ARR, prove the prediction-accuracy flywheel. Structure and use of funds in the [Investor Deck](17-investor-deck.md).

## Legal posture

Australian company (EchoSight AI Pty Ltd, **ASSUMPTION**: to be incorporated). Compliant by design with Meta Platform Terms, Instagram/Facebook Terms of Use, Australian Privacy Act 1988 (incl. 2024 reforms), GDPR, and CCPA/CPRA. No scraping. No private-data claims. Full analysis: [Security & Compliance](09-security-and-compliance.md).
