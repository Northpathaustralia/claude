# Privacy Review (pre-launch)

Reviewer hat: Privacy Officer. Scope: the website as built this cycle + the planned beta data flows. Verdict at bottom.

## What the site does today (verified against the code)

| Behaviour | Finding |
| --- | --- |
| Cookies | None set. Local storage only for: consent choice, demo-mode form saves (visitor's own device). Cookie policy states exactly this — **accurate** |
| Analytics | None loaded. Consent banner exists and does nothing until a key is configured — banner copy says exactly this — **accurate** |
| Forms | No data leaves the browser in demo mode, and the UI says so explicitly. When connected (Tally/Formspree), those become subprocessors → add to data-processing page at that time — **action logged** |
| Third-party requests | Zero external requests (fonts system-stack, all assets local). Verified in browser network inspection during QA — **accurate and unusually clean** |
| Dark patterns | None found: no pre-ticked boxes, no fake urgency, consent has equal-weight buttons, cancel/deletion described without retention mazes |

## Planned beta flows (from docs/09 + site claims) — privacy-by-design check

- Minimal Meta scopes; read-only; plain-English scope explainer — consistent across product spec, meta-api-readiness, and site copy ✓
- Training opt-out without feature penalty — stated in 3 places consistently ✓
- 30-day purge on disconnect; deletion certificates — specified; must be built before beta, not after (**gate added to launch checklist**) ✓
- No follower-level personal data anywhere in the schema (docs/07 verified — no such table exists) ✓

## Gaps and actions

1. **AU legal review of the five legal pages** — drafted, banner-marked, not yet reviewed. BLOCKED EXTERNALLY (solicitor). Action: launch guide step 13; budget in month-one CSV.
2. **OAIC NDB readiness**: breach runbook exists (docs/09 §6) but contact tree has placeholder emails until the domain is live. Action: fill on domain day.
3. **Subprocessor list is 'planned at launch'** — accurate today; must be re-confirmed the week the beta ships (Tally/Formspree addition included).
4. **GPC signal**: cookie policy promises honouring Global Privacy Control; with zero tracking today this is trivially true; when analytics is added, verify the chosen tool (Cloudflare cookieless needs no consent; anything else must gate on the banner). Action noted in setup order §5–6.

## Verdict

Website as built: **compliant posture, no material privacy issues found.** Beta launch: conditional on actions 1–3 above. The strongest finding is structural: the product's central marketing claim (what we can't see) is also its privacy architecture — keep it that way.
