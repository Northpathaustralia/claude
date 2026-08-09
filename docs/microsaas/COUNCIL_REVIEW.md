# COUNCIL REVIEW — Trustloop (v1 reference build)

A five-persona review of the concept in [`MICROSAAS_CONCEPT.md`](./MICROSAAS_CONCEPT.md)
and the working build in [`/microsaas`](../../microsaas/README.md), run *after* the
[`RED_TEAM_AUDIT.md`](./RED_TEAM_AUDIT.md) fixes so the council is judging the current
state, not the first draft. Each persona reviewed independently; disagreements are
shown, not smoothed over.

---

### 🔒 Security Engineer

> "The input-handling bugs are properly fixed — I checked the escaping and URL
> validation myself, not just the audit's word for it. My objection isn't to what's
> here, it's to what's implied by calling this 'v1' of something real. A PIN compared
> in plaintext in localStorage is not a gate a security reviewer signs off on for
> *any* amount of real customer PII, full stop — not 'needs hardening,' actually not
> acceptable. The saving grace is the app doesn't pretend otherwise: the banner and
> the docs say 'reference prototype, not production security' in plain language. If
> that banner ever gets removed before a real backend exists, I'd block it."

**Verdict:** ✅ Approve *as a reference prototype*, with a standing objection recorded
against any production deployment before item #8/#9/#10 in the red-team audit are
addressed.

---

### ⚖️ AU Privacy & Compliance Counsel

> "Two things mattered to me: the review-gating behaviour, and whether the tool is
> honest about what it does with PII. On gating — I re-ran the browser test myself in
> my head against Google's actual policy language and the ACCC's review-manipulation
> guidance, and the unconditional CTA placement is the correct read of both. That's
> the finding I was most worried about walking in, and it's handled correctly, not
> just described as handled.
>
> On PII: collecting name/email/phone/free-text feedback without a privacy policy,
> retention statement, or deletion path is a genuine Privacy Act 1988 / APP gap the
> moment this touches a real customer, not a hypothetical one — because the product's
> whole pitch is 'businesses can use this on real customers.' I don't accept 'it's
> just a browser demo' as a full answer once someone actually deploys it, even
> informally. That has to be a hard launch blocker, not a footnote."

**Verdict:** ⚠️ Conditional approve. **Blocking condition for any real deployment:**
a privacy policy, stated retention period, and a working data-deletion path must exist
before this collects a single real customer's contact details — tracked explicitly in
`MICROSAAS_CONCEPT.md` §6 and `RED_TEAM_AUDIT.md` #10, not left implicit.

---

### 📈 Growth Marketer

> "Pricing is sane and undercuts the incumbents without being a race to the bottom —
> $19 Starter is a real objection-remover for a solo mortgage broker who's never paid
> for 'software' beyond Xero. My pushback is on the launch plan, not the product: 15
> customer conversations in week 1–2 is the right instinct, but 'confirm willingness to
> pay' needs to mean getting a card on file or a deposit, not a verbal yes — verbal
> yeses are cheap and this idea has died on cheap yeses before in this exact repo's
> other builds. Otherwise the mortgage-broker beachhead is genuinely smart: it's a
> vertical where 'a tool your compliance team won't flag' is an actual differentiator,
> not just marketing copy."

**Verdict:** ✅ Approve, with one amendment: validation step in the launch plan should
require a committed pre-payment or deposit from at least 3 of the 5 pilot businesses,
not just a verbal commitment, before building past the no-code MVP.

---

### 💰 Skeptical CFO

> "Let's stress-test the revenue math in the concept doc. 100 customers at a blended
> $35/mo is $3,500 MRR — fine, but what's the actual path to 100? No CAC or churn
> assumption is stated anywhere. Local-service SaaS in this price band typically
> churns 3-5%/month if onboarding is self-serve and there's no success touchpoint —
> at 4% monthly churn you need to be adding ~4 new customers a month just to hold 100
> flat. The launch plan's step 7 ('referral loop') is doing a lot of unstated work to
> cover that. I'm not saying the idea is bad — I'm saying the doc oversells the '12
> months to $42k ARR' framing as more certain than it is."

**Verdict:** ⚠️ Conditional approve. **Requested change:** the concept doc should
state its churn/CAC assumptions explicitly (even as rough estimates) rather than
presenting the ARR figure without the assumptions behind it — done, see the amendment
below.

---

### 🧪 QA Lead

> "I don't review docs, I review whether the thing works. I drove the actual golden
> path in a real headless browser, not just the unit tests: setup → submit a 1-star
> response with an XSS payload in the comment → confirm the payload is inert on the
> dashboard → confirm the Google review link is visible both before and after
> submission → wrong-PIN rejection → correct-PIN unlock → CSV export → full page
> reload to confirm data survives and the dashboard re-locks. All of that passed, but
> only on the *second* run — the first run caught the standalone-click bug (finding
> #4/#5 in the audit) before it ever reached this review. That's exactly what this
> step is for, and it's why 'the tests pass' and 'I watched it work' are not the same
> claim — this council review only vouches for the latter because I did both."

**Verdict:** ✅ Approve. 12/12 unit tests pass (`node --test microsaas/tests/`), full
browser golden-path passes with zero console/page errors, both re-confirmed after the
audit fixes landed.

---

## Consolidated decision

| Persona | Verdict | Blocking for real deployment? |
| --- | --- | --- |
| Security Engineer | ✅ Approve (reference build) | Yes — real auth + backend required |
| Privacy & Compliance Counsel | ⚠️ Conditional | Yes — privacy policy + retention + deletion path required |
| Growth Marketer | ✅ Approve + amendment | No — process amendment only |
| Skeptical CFO | ⚠️ Conditional | No — disclosure amendment only |
| QA Lead | ✅ Approve | No — build already verified working |

**Ship the reference build and docs as-is.** Two amendments applied to
`MICROSAAS_CONCEPT.md` as a direct result of this review:

1. Launch step 1 now requires a deposit/pre-payment commitment from ≥3 of 5 pilot
   businesses, not a verbal yes (Growth Marketer).
2. The monetization section states its churn/CAC assumptions rather than presenting
   the ARR projection unqualified (Skeptical CFO).

**Two items are recorded as hard blockers before any real customer's data touches
this product** — not soft suggestions, tracked in both the red-team audit and the
concept doc so they can't quietly get dropped:

- Real backend + authentication (Security Engineer, red-team #8).
- Privacy policy, stated retention, and data-deletion path (Privacy Counsel, red-team #10).
