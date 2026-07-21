# 19 · Red-Team v2 (post-finalisation)

Re-run against the whole system incl. new security/privacy/ops/compliance. Sev/Likelihood H/M/L. "Blocks?" = must clear before that thing goes live.

## New findings this pass + fixes applied
| # | Finding | Sev | Likely | Consequence | Fix (this build) | Residual / owner | Blocks? |
|---|---|---|---|---|---|---|---|
| N1 | Course access granted on client-side "success" redirect | H | M | Free access / revenue loss | Blueprint mandates **server-side webhook** entitlement (`27_...01`) | Implement at build | Blocks paid course |
| N2 | Unsigned webhooks spoofable | H | L | Fake "paid" events | Require signature verification | Config at build | Blocks |
| N3 | Secrets committed to git | H | L | Key leak | Hardened `.gitignore`, `.env.example`, scan clean | Enable secret scanning | No (clean now) |
| N4 | PII/consents/supplier docs in repo | M | M | Privacy breach | `.gitignore` excludes; store on secure drive | Discipline | No |
| N5 | Card data stored | H | L | PCI breach | Blueprint: hosted checkout, never store cards | At build | Blocks payments |
| N6 | Marketing pixels fire pre-consent | M | M | Privacy breach | Consent-mode rule (`28_`) | Config | No |
| N7 | Testimonial without release / fake | H | M | ACL + trust | Release required; real-only policy (`26_...03`) | Discipline | Blocks that asset |
| N8 | AI clip implies real customer / fake proof | H | M | Deceptive conduct | Hard prohibition + QC (`29_`) | Per-asset QC | Blocks that asset |
| N9 | Skin reaction from unverified product | H | M | Harm + liability | Gate A T8 + incident/recall (`30_...03`); no sale pre-verify | Owner (Gate A) | **Blocks product** |
| N10 | Refund wording waives ACL rights | M | M | Unlawful term | Draft preserves consumer guarantees (`26_...02`) | Legal review | Blocks copy |
| N11 | Dev-dependency vuln (root app) | L | L | Dev-server risk only | Documented; not force-upgraded (out of scope) | Fix on that app's branch | No |
| N12 | Fulfilment can't scale / stockout | M | M | Bad CX | Manual fulfilment low-volume; bundle hidden till ready | Ops | No |
| N13 | Owner burnout / single point | M | H | Cadence collapse | Batch + templates + trackers (`30_`) | Ongoing | No |
| N14 | Support overwhelm at launch | M | M | Slow replies | Macros + SLA (`30_...01`) | Ops | No |
| N15 | Analytics/no baselines → bad decisions | L | M | Misreads | Baseline-first framework (`18_`) | Ongoing | No |

## Re-test of v1 launch-blockers
- Product testing (Gate A) — **still open**, now with a full protocol + incident/recall + interim-safe copy so parallel work proceeds.
- Supplier evidence (Gate B) — **still open**, now with outreach + scorecard + fallback.
- AU compliance (Gate C) — **still open**, now with a complete reviewer pack + provisional wording.

## Stop condition
No *fixable* critical/high issue remains unaddressed in the docs: each is either fixed-in-blueprint (implement at build) or converted to a named gate with an exact action. **Three external gates remain (A/B/C) — human/qualified-party actions, not bypassable.** Residual risks all have owners + actions.
