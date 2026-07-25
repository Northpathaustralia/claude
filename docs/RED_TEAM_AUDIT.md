# RED TEAM AUDIT — TIDESTATE (v1)

**Auditor stance:** hostile investor + creative director who wants to kill this project.
**Date:** 2026-07-12. **Method:** every file in the repo reviewed against best-in-class
(Aimé Leon Dore, Represent, Fear of God Essentials, LSKD, Gymshark-2015, Vuori, Nike,
Apple). Scores are out of 100, where **90+ = would ship under a $500k brand**, 75–89 =
strong but beatable, 60–74 = average/AI-smelling, <60 = replace.

> Rule for the rebuild: **nothing is overwritten unless the replacement is objectively
> better.** Most of the strategy docs score well and stay; the customer-facing *product*
> (the website look, product imagery, page depth) is where the gap to "iconic" lives.

---

## Scorecard

| # | Category | Score | One-line verdict |
|---|---|---|---|
| 1 | Brand strategy & positioning | **88** | "Climate-built" is a genuinely ownable category. Strong. |
| 2 | Name & architecture | 84 | TIDESTATE + Coastform + First Light lock together. Pending TM. |
| 3 | Colour palette | 82 | Ink/Bone/Cobalt/Signal is disciplined but under-used — too safe on-screen. |
| 4 | Typography | 74 | Archivo + Space Grotesk is fine, not *distinctive*. No display face with a signature. |
| 5 | Logo & icon system | 72 | Tide-bar mark is a real idea; SVG execution is competent, not award-winning. |
| 6 | Website — visual craft | **61** | Clean, but reads "well-built template," not "expensive." The core gap. |
| 7 | Website — motion / life | **48** | Near-static. A ticker + countdown. No scroll choreography, no micro-interactions. |
| 8 | Product imagery | **42** | Flat vector garments. Biggest single weakness. Kills desire on the PDP. |
| 9 | Product pages (PDP) | 78 | Structurally excellent (measurements, fit tool, honest stock). Looks average. |
| 10 | Homepage | 76 | 10 sections, right story order. Hero is atmospheric but not arresting. |
| 11 | Copywriting | **86** | Genuinely good — specific, Australian, proof-led. A real asset. |
| 12 | Founder story | 82 | Authentic, un-corporate. Needs depth as a *content series*, not one page. |
| 13 | Pricing & margins | 85 | 74–81% GM, honest ladder $54–$179. Defensible. |
| 14 | Packaging | 70 | Concept sheet exists; not yet "keep-forever" (no magnetic box, numbering, foil). |
| 15 | Email/SMS flows | 84 | 17 flows, real copy. Strong. Under-automated. |
| 16 | Mobile UX | 79 | Sticky ATC, drawer nav, all responsive. Solid; not delightful. |
| 17 | Desktop UX | 72 | Functional. No hover richness, no depth, no motion reward. |
| 18 | Conversion architecture | 77 | Free-ship bar, fit tool, bundles. Missing urgency-of-belonging & social proof. |
| 19 | SEO | 68 | Per-product titles/desc exist. No structured data, no blog depth, no OG images. |
| 20 | Social / content system | 80 | 100 hooks + calendar. Needs a 365 engine + a repeatable visual signature. |
| 21 | Community | 74 | First Light Club is a great seed. Only one page-section deep. |
| 22 | Revenue model | 73 | 12-month model only. No 5/10yr, no ecosystem revenue, no exit thesis. |
| 23 | Manufacturing | 83 | Spec-grade brief, measurement charts, QC. Strong. |
| 24 | Customer journey | 71 | Good parts, not yet a designed end-to-end *experience* (post-purchase thin). |
| 25 | Retention | 69 | Flows exist; no rewards tiers, no membership, no garment-passport loop live. |
| 26 | Virality | 62 | Honesty angle is shareable; no engineered share loops or referral mechanics live. |
| **—** | **WEIGHTED AVERAGE** | **≈ 73** | **Strong skeleton. Average skin. Not yet iconic.** |

## The three findings that actually matter

Everything else is noise next to these:

1. **Product imagery (42).** Vector garments are honest placeholders but they *destroy
   desire*. No one screenshots a flat SVG tee. This is the #1 revenue leak. Fix path:
   real sample photography → AI on-model generation (Botika/Modelia) → a proper art-
   directed lookbook. Until then, the renders must at least look intentional and moody,
   not like clip-art.
2. **Motion & craft (48/61).** The difference between "template" and "expensive" is almost
   entirely *motion and restraint*: scroll-reveals, weight in the type, generous space,
   one or two moments of delight. This is buildable now, in code, with zero new assets.
3. **Depth (revenue 73 / community 74 / virality 62).** The strategy is a launch plan, not
   an empire. Missing: 5–10yr model, the ecosystem (membership, book, events, accessories),
   rewards/referral loops, and the founder-as-builder content architecture.

## What must NOT be touched (already 82+)

Positioning, copywriting, pricing/margins, manufacturing brief, email flow *copy*, product
*structure*. Overwriting these would be vandalism. Improve around them.

## Rebuild order (impact-ranked)

- **P1 — Website craft + motion** (fixes 6, 7, 10, 17): a real motion system, refined type
  scale, hover/press states, page choreography. Ships now.
- **P2 — Imagery direction** (fixes 8): upgrade the render system to look art-directed +
  wire real photo slots so AI/real photos drop in; write the photography + AI-model guide.
- **P3 — Design system / brand book** (fixes 4, 5, 24): codify tokens, components, motion,
  voice — the thing an agency actually hands over.
- **P4 — Ecosystem & long-range model** (fixes 22, 25, 26): 5/10yr forecast, revenue
  multipliers, rewards/membership/referral, community expansion.
- **P5 — Content engine + founder brand** (fixes 12, 20): 365-day system architecture
  (not 365 lines of filler) + founder-as-builder arc.
- **P6 — New pages** (fixes conversion/retention surface): lookbook, VIP/rewards,
  wholesale, affiliates, events.

Progress against this list is tracked by re-scoring in future revisions of this file.
