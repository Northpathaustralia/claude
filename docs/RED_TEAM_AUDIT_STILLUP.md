# RED TEAM AUDIT — STILLUP (v1)

**Auditor stance:** hostile investor + skeptical engineer trying to kill this before it ships.
**Date:** 9 August 2026. **Method:** automated adversarial code review (`code-review` skill,
effort: high) against the full diff, a separate automated security review (`security-review`
skill) against the same diff, and manual click-through testing (Playwright) of every page and
flow in a real browser. Every finding below was either fixed before this doc was written or is
explicitly accepted with a reason.

---

## Round 1 — code-review skill findings (all fixed)

| # | Finding | Severity | Fix |
| --- | --- | --- | --- |
| 1 | Accessibility "Skip to content" link used `href="#main"`, which under this app's `HashRouter` is read as a navigation to a nonexistent `/main` route (404) instead of an in-page jump — breaking the one feature that exists for keyboard/screen-reader users. | Medium | Replaced with a click handler that `preventDefault()`s and focuses/scrolls the `#main` landmark directly. Same class of bug had already been worked around in `Nav.jsx` and `Pricing.jsx`; this instance was missed in the first pass. |
| 2 | The "Up to 5 monitors" free-tier limit advertised on the Pricing page and in the product spec was never enforced in `MonitorsContext.addMonitor` — a user could add unlimited monitors on the free tier, silently invalidating both the stated limit and "unlimited monitors" as the Pro differentiator. | Medium | Added a `FREE_TIER_MONITOR_LIMIT = 5` guard in `addMonitor`, plus UI that disables the add form and shows the limit message once reached. Covered by Playwright click-through (5 adds succeed, 6th is blocked, message shown) and doesn't affect existing unit tests. |
| 3 | `pingUrl` reports legitimate `http://` sites as "down" whenever the dashboard itself is served over `https` (browser mixed-content blocking) — a false outage with no disclosure. | Medium | Added `isMixedContentRisk()` (pure, unit-tested) and a visible warning badge on any `http://` monitor card explaining the check may be blocked and to use the `https://` URL if one exists. |
| 4 | The "Features" nav link used a raw `<a href="/" onClick={...}>` — correct only when the `onClick` handler fires. Middle-click / Ctrl-click (opens in a new tab, bypassing `onClick`) followed the literal `href="/"`, which in the standalone single-file build (opened via `file://`) resolves to the filesystem root, exiting the app entirely. | Low–Medium | Switched to react-router's `<Link to="/">`, which renders a correct `href="#/"` under `HashRouter` even when `onClick` doesn't run — new-tab opens now land back on the app's home page instead of leaving it. |
| 5 | `formatTime(ms)` used `if (!ms) return ''`, treating a valid `0` timestamp as absent (falsy-zero bug) — same class of bug `formatDuration` right above it correctly avoided with `== null`. | Low | Changed to `if (ms == null) return ''`. Not currently reachable (`Date.now()` is never 0) but fixed for consistency and to remove the latent trap. |

All five are unit-tested where the fix is a pure function (`isMixedContentRisk`, the cap check
via `MonitorsContext`) and verified live via Playwright screenshots for the UI-only fixes
(skip-link focus, cap message, mixed-content badge).

## Round 2 — security-review skill findings

**Zero findings at or above the confidence bar.** Specifically checked and cleared:

- `stillup/src/lib/statusPage.js` — the exported static status-page HTML is built via raw
  string interpolation (outside React, so React's auto-escaping doesn't apply). Verified
  `escapeHtml()` is applied to every user-controlled field (`m.name`, `m.url`) before
  interpolation. Confirmed live: a monitor named `<script>alert(1)</script>My"Site'` exports to
  HTML containing `&lt;script&gt;`, not a live `<script>` tag.
- `stillup/src/lib/monitor.js` `parseMonitorUrl()` — traced the scheme-detection regex against
  `javascript:`, `data:`, `vbscript:`, `file://`, protocol-relative, and whitespace/newline
  scheme-splitting bypass attempts. All rejected, either by regex or by the WHATWG `URL` parser's
  own normalization. Confirmed live: `javascript:alert(1)` is rejected with a visible error and
  never reaches `fetch()`.
- `stillup/src/pages/Dashboard.jsx` monitor links — `rel="noreferrer noopener"` present on the
  `target="_blank"` link (no reverse-tabnabbing); `href` is always the validated `parsed.url`
  from `MonitorsContext`, never the raw user-typed string, so it can never carry a non-http(s)
  scheme even from a future code path that forgets to re-validate.
- No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `document.write` anywhere in `stillup/src`.

## Round 3 — hostile business review

The three findings that would actually matter to an investor, ranked:

1. **The paid tier doesn't exist.** Pro is $7/mo of copy and zero lines of server code. This is
   disclosed on purpose (see [Compliance notes](STILLUP_PRODUCT_SPEC.md#6-compliance-notes)) —
   better to under-promise than run a fake checkout — but it means **current revenue is $0** and
   stays $0 until someone builds the architecture in Section 4 of the product spec. Free traffic
   without a live upgrade path doesn't compound into MRR by itself.
2. **Distribution is thin.** The only built-in growth loop is the "Built with StillUp" credit on
   exported status pages — a real mechanic, but it only fires once a free user actually exports
   and hosts a status page, which is one of the least-used features in the funnel (add monitor →
   check → maybe export). No SEO content engine, no directory listings, no comparison pages
   against UptimeRobot/Better Uptime exist yet.
3. **The free tier's core promise — "know the moment something goes down" — is only true while a
   tab is open.** That's disclosed honestly (Section 4 of Landing.jsx, the pricing page, the
   dashboard footnote), which protects against a false-advertising complaint, but it also means
   the headline value prop undersells itself to anyone who reads past the hero. This is the
   correct trade for compliance; it is a real conversion-rate cost.

## What must NOT be touched (already solid)

Input validation, XSS escaping in the static export, the honest "what free can/can't do" framing,
the flat (non-usage-metered) Pro pricing model, and the no-fake-checkout stance. These are the
parts a future contributor should extend, not rewrite.

## Verdict

**Ship the free tier as-is.** It is bug-free against the checks run (36/36 unit tests, full
click-through, two independent adversarial review passes, zero unresolved findings), makes no
false claims, and is genuinely useful at $0 cost to run. **Do not** advertise Pro as available,
take payment for it, or remove the "Coming soon" labeling until the architecture in
`docs/STILLUP_PRODUCT_SPEC.md` §4 is actually built.
