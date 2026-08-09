# Council Review — Commission & Trail Reconciliation Checker (v1)

Four-perspective synthesis, each reviewer scoped to their lane, followed by a single verdict.
Written after the red-team fixes in `02-red-team-audit.md` were already applied — this council is
reviewing the corrected state, not the original draft.

## Product

**Take:** the problem choice holds up. "Find money you're already owed" is a sharper hook than
any of the other nine candidates in `00-problem-research.md` — it doesn't need the broker to trust
a recommendation, only to read a number. The zero-backend, zero-cost architecture is the right
call for a v1 aimed at organic/free distribution rather than a sales-led paid tool.

**Gaps for v2, not blockers for v1:** aggregator statement formats aren't standardised across the
industry (Connective, AFG, Loan Market, Finsure et al. all export differently) — the header-name
matching handles renamed columns but not restructured ones (e.g. one row per loan with monthly
columns instead of one row per payment). A "paste your actual export, we'll tell you what didn't
map" onboarding flow would reduce first-run friction. Not built here — flagged as the top v2 item.

## Compliance / Legal

**Scope check:** confirmed this stays outside NCCP Best Interests Duty (RG 273) — it's arithmetic
over the broker's own already-quoted commission terms, not a credit-assistance recommendation or a
product comparison. That boundary is stated in-app, not just in the docs, which is what makes it
enforceable rather than aspirational.

**Privacy Act 1988 (APPs):** client names are personal information. The tool's answer —
process everything client-side, never transmit, make persistence an explicit opt-in — is the
strongest available posture and was verified structurally in the red-team audit (no network calls
exist in the code, not merely disclaimed). The in-app suggestion to use loan/settlement references
instead of full names is a reasonable nudge but can't be enforced; that's an acceptable residual
risk for a v1 the broker runs entirely on their own device.

**Aggregator agreement risk:** flagged, not resolved, because it can't be resolved generically —
each broker's aggregator agreement is different. The in-app reminder to check re-disclosure terms
before forwarding exported statements to a third party is the correct scope of what this tool can
responsibly do.

**Verdict: compliant for v1's stated scope.** Would need a fresh review if v2 ever adds product
comparison, lender recommendation, or a shared/synced backend.

## Engineering / QA

**What changed this review cycle:** two real correctness bugs (silent coverage-gap skip, `file://`
module-loading failure) and one real injection vulnerability (CSV formula injection) were caught
and fixed — see `02-red-team-audit.md` for detail. All three were caught by process, not luck: the
first two by an independent code-review pass plus the "verify in a real browser" step this repo's
conventions require for UI changes; the third by working through the security-review category
checklist by hand after the automated tool's git-diff capture failed in this sandbox.

**Test posture:** 22 unit tests over the reconciliation engine (matching, missing/short/over,
coverage gaps, discharged-loan overpayment, unmatched lines, rounding, malformed/duplicate/
parenthesised-negative input, CSV round-trips, formula-injection neutralisation) plus an
end-to-end browser smoke pass (sample data → reconcile → verify computed numbers by hand →
export → reload-persistence → clear → malformed-input warning path) with zero console errors.
That's real coverage of the arithmetic, not just the happy path.

**Residual risk, accepted:** the trail-balance approximation (original loan amount vs. true
amortised balance) is a modelling simplification, not a defect — see the red-team audit's "what
was not flagged" section for why it's the safe-direction approximation to make.

## Growth / Monetization

Free v1 with no artificial limits is the right distribution bet — the CSV-in/CSV-out shape means
it's shareable as a link or a file with zero onboarding cost, and "free tool that finds you money"
is the kind of thing that gets forwarded in a broker Facebook group without any paid acquisition.
The natural paid tier is obvious and doesn't require touching this MVP's architecture: saved loan
books across sessions (currently single-browser localStorage only), native multi-format aggregator
import, and scheduled monthly re-reconciliation with email alerts — all of which cross the
"needs a backend" line this v1 deliberately stayed under.

## Verdict

**Ship v1 as-is.** All red-team findings resolved and test-locked. Scope boundary (reconciliation,
not advice) is both the compliance answer and the engineering answer for why this was buildable
safely in one pass — the two are the same decision. Next candidate for a v2 cycle, per
`00-problem-research.md`'s runner-up: the Best Interests Duty comparison/record generator — higher
value, but needs its own dedicated compliance-review cycle before build, not an extension of this
one.
