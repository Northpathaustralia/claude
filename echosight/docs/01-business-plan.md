# EchoSight AI — Business Plan

Council owners: CEO, CPO, Financial Controller, Growth Marketing Director. Red-teamed in [18-red-team-review.md](18-red-team-review.md) (rounds R1, R3).

---

## 1. Company

- **Name:** EchoSight AI Pty Ltd (**ASSUMPTION**: Australian proprietary company, to be incorporated; name/trademark validation in §9 and [Brand Guidelines](11-brand-guidelines.md)).
- **Mission:** Make world-class content intelligence available to every professional creator — legitimately.
- **Vision:** The system of record for *why* short-form content performs, across platforms, starting with Instagram.
- **HQ:** Australia (**ASSUMPTION**: Brisbane/remote-first). Data residency: AWS ap-southeast-2 primary, EU region for EU customers.

## 2. Problem and demand evidence

1. Native Instagram Insights and incumbent schedulers report *what* happened, not *why*, and offer no pre-publication prediction from the creative itself.
2. Creators systematically over-index on posting time and hashtags — low-leverage factors — because those are the only levers their tools expose. The high-leverage factors (hook, first-frame, pacing, watch-time retention drivers) are invisible to them.
3. Grey-market "who viewed/saved my profile" apps demonstrate huge latent demand for deeper insight; they are policy-violating and get accounts banned. The demand is legitimate; the supply isn't.
4. Agencies burn analyst hours writing "why it worked" commentary for client reports by hand.

**Demand-validation plan (pre-build, weeks 1–6):** 30 problem interviews per segment (creator / agency / brand), landing-page smoke test with waitlist + price-point split test, concierge MVP (manual analysis of 50 creators' content delivered as a report) to validate willingness-to-pay before full engineering spend. Success gates: ≥ 40% of interviewees rank "why did this perform" as a top-2 pain; ≥ 5% waitlist→paid-intent conversion; ≥ 10 concierge customers at $49+.

## 3. Market

**ASSUMPTIONS** (each to be replaced with primary data during validation):

| Layer | Definition | Size |
| --- | --- | --- |
| TAM | Professional (business + creator) Instagram accounts globally | ~200M accounts; social-media management software market ≈ US$25B by 2027 |
| SAM | English-first professional accounts actively paying for social tooling | ~15M accounts; ≈ US$6B |
| SOM (5-yr) | Creators/agencies/brands reachable via our channels at our price points | ~1.5M accounts; ≈ US$1B; our 5-yr target ≈ US$28M ARR (~0.03% of SAM $) |

**Segments and buying dynamics**

| Segment | Who | Pays | Cares about | Tier |
| --- | --- | --- | --- | --- |
| Creator | 10k–500k followers, monetising | Personal card, $29–79 | Growth, saves/shares, time saved | Starter/Pro |
| Agency | 3–50 staff, 5–200 client accounts | Company card/invoice, $199+ | Client reporting, white-label, margins | Agency |
| Brand | In-house social team | Procurement, $79–1,500 | Conversions, brand consistency, competitor intel | Pro/Enterprise |
| Enterprise | Multi-brand, multi-region | Procurement + security review, $18k+/yr | SSO, API, SLAs, data governance | Enterprise |

## 4. Competition

| Competitor | What they do | Gap we exploit |
| --- | --- | --- |
| Later, Buffer, Hootsuite | Scheduling + descriptive analytics | No creative analysis, no prediction, no generation |
| Iconosquare, Sprout Social | Deeper analytics + listening | Still descriptive; no pre-publication scoring; enterprise pricing |
| Metricool, NotJustAnalytics | Cheap analytics | Surface metrics only |
| VidIQ/TubeBuddy (YouTube) | Proof the "creator intelligence" category works | Instagram-first equivalent is unclaimed |
| Grey-market "insight" apps | Claim private-data access | Policy-violating; we convert their demand legitimately |
| ChatGPT/Claude used ad-hoc | Generic caption/script help | No account data, no outcome feedback loop, no scores tied to real performance |

**Positioning:** "Analytics tells you what happened. EchoSight tells you why — and what to make next."

## 5. Product strategy

Sequenced to compound the data moat (full spec: [02-product-specification.md](02-product-specification.md)):

1. **Wedge (months 0–6):** Content Analysis + Prediction + AI Coach for creators. Single-player value in minutes; every connected account starts feeding the outcome flywheel.
2. **Expand (6–18):** Competitor Intelligence, Trend Engine, Creative Generator with Higgsfield/Fable packs, Agency workspace + white-label reporting.
3. **Platform (18–36):** Public API, Enterprise workspace, mobile app, browser extension, marketing automation; TikTok/YouTube Shorts as adjacent surfaces (**strategic option, not commitment**).

## 6. Revenue model

Full model in [10-financial-model.md](10-financial-model.md). Summary: freemium SaaS, monthly/annual (annual = 2 months free), usage-metered AI generation credits above tier allowances, white-label and API as paid add-ons, Enterprise custom. Expansion levers: seats, managed social accounts, credit packs, add-ons.

## 7. Go-to-market

Detail in [12-marketing-playbook.md](12-marketing-playbook.md) and [13-sales-playbook.md](13-sales-playbook.md).

- **PLG core:** free tier analyses a limited number of posts/month with real scores (not teasers); shareable "content report cards" create viral loops.
- **Creator-led launch:** 50 mid-tier creator partners given Pro free for case studies; Product Hunt launch; "Why did this Reel work?" teardown content engine.
- **Agency motion:** outbound + partnerships from month 6; white-label reports are the hook.
- **Enterprise motion:** founder-led sales year 1–2; security/compliance posture as differentiator.

## 8. Operations & team

**ASSUMPTION — hiring plan** (detail in [14-operations-and-support.md](14-operations-and-support.md)): founding team of 6 (CEO, CTO, founding full-stack ×2, founding ML, product designer) → 14 by end of Y1 (adds: growth lead, 2 eng, ML eng, customer success ×2, ops/finance contract) → ~30 by end of Y2 gated on ARR milestones.

## 9. Legal & regulatory posture

- **Meta compliance is existential**, therefore engineered, not promised: Graph API only, permission-scoped OAuth, no scraping, no private-data claims, App Review + Data Use Checkup maintained as a standing operational process. See [09-security-and-compliance.md](09-security-and-compliance.md).
- Privacy: Australian Privacy Act 1988 (APPs), GDPR (EU customers), CCPA/CPRA (California). DPO/Privacy Officer appointed from day one (fractional initially — **ASSUMPTION**).
- **Name/trademark:** "EchoSight" requires clearance search in AU/US/EU/UK classes 9, 35, 42 before launch (**open action**; fallback names shortlisted in [11-brand-guidelines.md](11-brand-guidelines.md)).
- Higgsfield/Fable integrations are **prompt-pack generation** (text we produce for the user to use in those tools) — no partnership required for v1; formal API partnerships are a later commercial discussion (**red-team finding R2-7**: do not market as "integration" until an API relationship exists; marketed as "prompt packs for").

## 10. Risks (top 10) and mitigations

| # | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| 1 | Meta API access restricted/revoked | Med | Existential | Strict compliance; first-party upload analysis works with zero API access; multi-platform roadmap |
| 2 | Prediction accuracy underwhelms early (cold start) | High | High | Ship *explanation* value first (defensible without prediction); publish honest confidence intervals; concierge feedback loop |
| 3 | Incumbent (Later/Sprout) copies feature set | Med | Med | Data flywheel + speed; category positioning; agency lock-in |
| 4 | AI inference costs erode margin | Med | High | Tiered model routing, caching, batch processing, credit metering; margin floor alarms |
| 5 | Grey-market association ("is this another spy app?") | Med | Med | Compliance-first brand pillar; "What we'll never do" page; Meta app review badge |
| 6 | Churn from novelty-wear-off | High | High | Weekly coach cadence, measurable improvement loops, report automation (habit), annual plans |
| 7 | Privacy regulation change (AU reforms, EU AI Act) | Med | Med | Privacy Officer owns watchlist; data minimisation by default |
| 8 | Trademark conflict on name | Low-Med | Med | Clearance search pre-launch; fallback names ready |
| 9 | Key-person dependency (founding ML) | Med | Med | Documented pipelines, model cards, pairing |
| 10 | Fundraising window closes | Med | High | Revenue-first plan viable at reduced scope; 24-month runway target |

## 11. Milestones

| When | Milestone | Gate |
| --- | --- | --- |
| M2 | Validation complete, concierge revenue | ≥10 paying concierge customers |
| M5 | Closed beta (200 creators) | Activation ≥ 60%, weekly retention ≥ 40% |
| M7 | Public launch | 5,000 signups in 30 days |
| M12 | $0.8M ARR run-rate | 1,200 paying, NRR ≥ 100% |
| M18 | Agency tier at 15% of MRR | 80 agency accounts |
| M24 | $3M ARR, Series A ready | Prediction AUC ≥ 0.78 on held-out accounts |
