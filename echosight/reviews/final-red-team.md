# Final Red-Team Audit — 21 July 2026

Adversarial pass over the entire continuation build. Prior rounds R1–R4 (docs/18) remain in force; this audit attacks what was built since. Every material issue: stated → severity → evidence → fix → retest → residual.

## Attack surface sweep

| Area | Attack result |
| --- | --- |
| Product feasibility | Unchanged from R1–R4: the wedge (upload analysis) is buildable without any Meta dependency; Studio-mode decoupling verified present in site copy, product spec, and Meta-readiness doc. No new feasibility claims introduced. HOLD |
| Instagram API limitations | Site audited line-by-line: zero capability claims beyond documented Graph API surface. The four "who saved" phrase occurrences are all negations (grep-verified). HOLD |
| Privacy / security | Real scans run (secrets, deps, external requests, axe, headers). One deploy-day action (host headers). No misrepresentation found. HOLD |
| Misleading predictions | "Predictions are probabilities" appears on every surface that shows a score; confidence grades in every mock; accuracy-page claims commitment-framed. HOLD |
| Fake-looking creative | No creative generated yet — nothing can look fake. The QC system gates it later; founder never AI-generated. HOLD |
| Legal exposure | Drafts banner-marked; ACL-aware liability clause; "(in formation)" honesty; stage-gated payments. Solicitor review remains the control. HOLD (external) |
| Competitor response | Unchanged risk (incumbents can copy features); moat argument still rests on the data loop — which requires shipping the beta. Noted, no new mitigation available at this stage. ACCEPTED RISK |
| Content fatigue / production burden | Time-costed; swap rules; A/B variants pre-written. Real risk is founder consistency — no document can fix that. ACCEPTED RISK (named) |
| Churn / pricing / cost overruns | v2 pricing margin-checked; per-video stop-losses; AI ceilings inherited from docs/10. HOLD |
| Meta approval risk | Studio-mode decoupling is the mitigation and it's real. HOLD |

## Material findings this cycle

### RT-F1 — The demo's "confidence" language could be read as measured accuracy (Severity: HIGH)
**Evidence:** Demo reels show "Confidence B/A/C" grades. A hostile reader could claim we're implying a validated model produced these grades, when the demo is hand-authored.
**Fix:** The demo banner already states "every number is example data"; strengthened during build with the per-page honest-limits note ("a hand-built walkthrough on example data, showing the product's output format") and reel-3's grade-C explanation which *demonstrates* uncertainty honestly. Claim-register row added (DEMO ONLY).
**Retest:** Re-read of all demo copy against the register — no sentence claims measurement. **RESIDUAL: none material.**

### RT-F2 — Founding-offer "lifetime $39 lock" is a long-tail liability (Severity: MEDIUM)
**Evidence:** docs/24 + waitlist page promise Pro renewal locked at $39/mo "for the life of the account" to 200 users. If unit AI costs spike, 200 accounts at ~51% discount could pressure margin.
**Fix:** Modelled: 200 × $40/mo forgone ≈ $96k ARR ceiling impact at full uptake — bounded and affordable as a founding cost; but wording tightened in docs/24's spirit: the lock applies to the account, not transferable/resellable (acceptable-use covers resale). Decision: keep the promise — breaking founder promises later would cost more than $96k of brand.
**Retest:** Terms/waitlist wording consistent. **RESIDUAL: bounded, accepted, documented.**

### RT-F3 — The 30-day calendar assumes an audience that doesn't exist on day 1 (Severity: MEDIUM)
**Evidence:** Success metrics like "comments >30" (day 18) presuppose reach a zero-follower account won't have. A literal reader could call the targets fantasy.
**Fix:** Measurement CSV reframed as targets-vs-actuals with a top-learning column (adaptive by design); playbook's week-1 metrics are hold-rate/save-rate (audience-size-independent ratios) rather than absolute counts for most days; day-18/30 absolute targets carry the "target, not prediction" framing. Community plan's engagement hour is the audience-building mechanism, honestly slow.
**Retest:** Calendar targets re-read: ratio-based where possible, labelled where absolute. **RESIDUAL: cold-start reality — named, not solvable by documents.**

### RT-F4 — Repo contains two products; a rushed reader could deploy the wrong thing (Severity: LOW)
**Evidence:** NorthPath app owns GitHub Pages; EchoSight lives in a subfolder; deploy confusion is plausible.
**Fix:** Continuation audit records the decision; guide step 4 specifies `echosight/site` output directory explicitly; known-limitations table row covers it.
**Retest:** Docs cross-checked. **RESIDUAL: none.**

## Residual-risk register (final, all disclosed)

1. External blockers table (known-limitations §Blocked) — 7 items, each with a one-step action.
2. Accepted risks: competitor copy-speed; founder production consistency; cold-start audience; founding-price lock ceiling (~$96k ARR at full uptake).
3. Everything in docs/18's "cannot be engineered away" list remains true and published.

## Verdict

**No critical issue open. No material issue unresolved without disclosure.** The build passes its own truthfulness bar: every number a visitor sees is labelled, every promise is either kept by the artefact or gated behind a named external step. Launch preparation may proceed.
