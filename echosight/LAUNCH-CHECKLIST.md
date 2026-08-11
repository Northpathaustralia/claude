# LAUNCH CHECKLIST

Three gates. A gate opens only when every box above it is ticked. (Compliance detail: `compliance/launch-compliance-checklist.md`; this is the operational master.)

## Gate 1 — Site + content launch (day 1 of the 30-day system)

- [ ] Domain live, HTTPS, www + apex both resolve
- [ ] All 31 pages verified on the live URL (run `sitetest.mjs` against production; 0 broken links/errors/overflow)
- [ ] Security headers live (`_headers`: CSP, HSTS, X-Frame-Options, Referrer-Policy)
- [ ] Forms live end-to-end (test submission received) OR demo-mode honestly displayed
- [ ] hello@/privacy@/security@ receiving; test emails confirmed
- [ ] Live Lighthouse ≥ 90 perf / ≥ 95 a11y, best-practices, SEO (expect 100s; investigate any drop)
- [ ] OG cards render correctly in a real chat app paste
- [ ] Videos day-01 + day-16 generated, QC ≥ 88, edited, captioned
- [ ] Founder video F1 shot (phone)
- [ ] Days 1–7 scheduled; engagement hour blocked in calendar
- [ ] Compliance Stage-1 checklist all green

## Gate 2 — Founding seats open (≈ day 30)

- [ ] ≥ 150 waitlist signups (or a conscious, written decision to open anyway)
- [ ] Pty Ltd registered; ABN live; "(in formation)" removed sitewide
- [ ] Trademark clearance done (or renamed via the fallback list — before taking money, not after)
- [ ] AU solicitor review complete; draft banners removed from all 5 legal pages
- [ ] Stripe products = pricing page exactly; refunds operationalised; test purchase + refund executed
- [ ] Founding-offer page numbers re-verified (seats, price, lock, refund windows)
- [ ] Onboarding-call calendar actually has 200 bookable slots over the cohort window (the cap's honesty depends on it)
- [ ] Compliance Stage-2 checklist all green

## Gate 3 — Product beta (when the build is ready)

- [ ] Studio mode functional on real uploads (analysis pipeline v0 live)
- [ ] Scores labelled "Content Score (beta)" until the accuracy gate (docs/18 R1-2) is met — no "prediction" marketing before it
- [ ] Data-deletion callback + 30-day purge tested end-to-end
- [ ] Subprocessor list updated to actuals
- [ ] Meta App Review approved OR beta opens Studio-mode-only (both are honest launches)
- [ ] Support inbox staffed for the SLA the site states
- [ ] Compliance Stage-3 checklist all green

## The standing rule

If a box can't be ticked, the launch waits or the claim changes — never the truth.
