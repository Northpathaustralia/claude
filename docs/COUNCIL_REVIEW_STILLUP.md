# COUNCIL REVIEW — STILLUP (v1)

Sign-off record following the [red-team audit](RED_TEAM_AUDIT_STILLUP.md). Each perspective below
reviewed the same build and either signs off or lists a blocking condition.

**Scope:** `stillup/` (the app), `release/StillUp.html` (standalone build),
`docs/STILLUP_PRODUCT_SPEC.md`, `tests/stillup-monitor.test.js`.

---

## Product

**Sign-off: yes.** The free tier delivers on its own headline — a working uptime check, uptime %,
incident log, and a portable status-page export — without requiring signup or payment. The
free→paid boundary (5 monitors, tab-must-be-open checking) is disclosed *before* a user hits it,
on both the landing page and the pricing page, not discovered as a surprise. The user flow
(Section 2 of the product spec) matches what's actually built: verified end to end with
Playwright — landing → add monitor → check → auto-check → export → reload persistence — all pass.

*Condition for Pro launch:* every bullet on the Pro pricing card must be true in production
before the "Coming soon" label comes off. Partial delivery (e.g., alerts but no SSL checking)
should either ship as a renamed tier or wait.

## Engineering / QA

**Sign-off: yes.** 36/36 unit tests pass (`node --test tests/*.test.js`), covering URL
validation/scheme-rejection, the reachability check (success, failure, timeout, invalid-URL
short-circuit), history capping, uptime/response-time math, incident derivation, and the
mixed-content risk flag. Both the dev build (`npm run stillup:build`) and the standalone
single-file build (`npm run stillup:build:standalone` → `release/StillUp.html`) compile cleanly.
Manual browser testing (Playwright, real Chromium) confirmed: routing (including the HashRouter
fragment collisions that were the source of three of the five red-team findings), form
validation, the free-tier cap, XSS-safe status-page export, and no console/page errors during
normal use (the only console noise seen — `ERR_CONNECTION_RESET` pinging `example.com` from this
sandboxed environment — is expected network denial in this environment, not an app defect).

*Condition:* any change to `parseMonitorUrl()` or `statusPage.js`'s `escapeHtml()` must keep or
extend their existing test coverage — those two functions are the entire input/output trust
boundary of this app.

## Security & Compliance

**Sign-off: yes.** Independent `security-review` pass (separate from the code-review pass) found
zero findings at or above the confidence bar — see Round 2 of the red-team audit for exactly what
was checked (static-export XSS escaping, URL scheme-smuggling bypass attempts, reverse-tabnabbing
on external links). No fabricated testimonials, customer counts, or logos anywhere in the copy.
No fake checkout — the Pro tier explicitly refuses to collect payment or a "reserve your spot"
email framed as a purchase before the feature exists. Privacy policy content matches the actual
data flow (nothing leaves the browser except the direct check request to the monitored URL
itself) and commits to being rewritten before any account data is ever collected.

*Condition:* before Pro accepts its first signup, `stillup/src/pages/Legal.jsx`'s Privacy policy
must be rewritten to describe the real data collected (account identifier, monitor list, alert
email) — the current text already commits to this; it's a launch blocker, not a nice-to-have.

## Business / Monetization

**Sign-off: yes, with the revenue caveat stated plainly.** The pricing model (flat $7/mo, no
usage metering, free tier as genuine funnel rather than crippled trial) is sound and matches
proven competitors' pricing without their complexity. But — as the red-team audit's hostile
business review states outright — **Pro is not built, so current MRR is $0**. This build is the
acquisition + validation layer (does anyone actually use the free tool?), not the monetization
layer. Approving this build means approving "ship the funnel now," not "revenue starts now."

---

## Overall verdict

**Approved to merge and ship the free tier.** No blocking issues remain from any perspective.
Three conditions carry forward as launch gates for Pro specifically (not for this PR): full
feature parity before removing "Coming soon," test coverage kept current on the two trust-boundary
functions, and a rewritten privacy policy before Pro's first signup. None block the free tier
that's actually being shipped today.
