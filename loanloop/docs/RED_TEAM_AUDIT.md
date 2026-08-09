# Red-team audit — LoanLoop (v1)

**Auditor stance:** hostile penetration tester + ASIC/OAIC compliance reviewer + a broker's
sceptical accountant. Goal: find every reason this shouldn't be trusted with real personal and
financial data, or real money, before it touches either.

**Method:** manual adversarial review of every file in `loanloop/`, plus a scripted Playwright
attack pass (`tests/e2e.mjs`) driving a real Chromium instance against the actual code — not just
reading the source.

## Findings — fixed during this audit

| # | Severity | Finding | Fix |
| --- | --- | --- | --- |
| 1 | Low | Submit button read "Calculating…" while awaiting, but the borrowing-power maths already completed synchronously before that line ran — the label described the wrong pending work (network delivery, not calculation), which could make a user think their numbers weren't processed yet. | Relabelled to "Sending…" and commented why, in `widget/loanloop.js`. |
| 2 | Low | The result panel had no `aria-live` region, so screen-reader users would not be told an estimate had appeared after submitting. | Added `aria-live="polite"` to `.loanloop-result` in `widget/loanloop.js`. |
| 3 | N/A (test bug, not product bug) | The first attempt at the Playwright "demo page picks up broker customisation" assertion had an operator-precedence mistake (`string === bool` via a `&&` inside the comparison) that made it structurally incapable of passing regardless of app behaviour. | Rewritten with an explicit intermediate variable; the real assertion (headline matches the broker's sanitised custom text, not the default) now passes for the right reason. Kept in this doc as a reminder that a red-team pass must distrust its own harness, not just the app. |

## Findings — verified as non-issues (attacked, held up)

- **XSS via broker-supplied business name / headline.** Attempted `<img src=x onerror=alert(1)>`
  as a business name end-to-end through signup → embed snippet → demo page. No dialog fired, no
  script executed (`tests/e2e.mjs`, check #6). Every render path uses `textContent` or an escaped
  `data-*` attribute, never raw `innerHTML` of untrusted input.
- **Guaranteed-outcome language in a custom headline.** "We guarantee approval instantly!" was
  rewritten to "We estimated options (subject to lender assessment) instantly!" before ever
  reaching the DOM (`tests/e2e.mjs` check #3).
- **Bot / spam submission.** A filled honeypot field silently dropped the submission — zero leads
  recorded (`tests/e2e.mjs` check #5).
- **Malformed / adversarial API payloads to the reference webhook.** `../../etc/passwd` as a
  `brokerId`, missing fields, non-finite `estimate` values, and non-object bodies were all rejected
  with 400s and no side effects (`tests/webhook.test.js`).
- **CSS injection via the brand-colour field.** A `data-primary-color` value that isn't a clean hex
  code is ignored in favour of the default — confirmed by code inspection of the regex guard in
  `mountWidget`.
- **Financial-maths edge cases.** Zero/negative/`NaN`/`Infinity` income, debts that exceed income,
  and an unbounded dependents count were all fuzzed in `tests/core.test.js` — the estimator never
  returns a negative number and never throws.

## Findings — accepted limitations (not fixed; by design or out of MVP scope)

| # | Area | Risk | Why it's accepted for MVP, and the mitigation in place |
| --- | --- | --- | --- |
| 1 | **Compliance regex is a safety net, not a filter.** `sanitiseText` only catches known bad phrasings ("guaranteed", "instant approval", …). A broker could still write misleading copy that doesn't match any pattern (e.g. "get approved today"). | This is disclosed explicitly in `COMPLIANCE_AND_PRIVACY.md` and mitigated by the documented human spot-check step in `AUTOMATION_WORKFLOW.md` — an automated filter alone was never going to be a complete legal control. |
| 2 | **Client-side rate limiting is bypassable** (clear `localStorage`, use private browsing, or hit the webhook directly). | Documented as best-effort UX friction only; `RED_TEAM_AUDIT` and `MVP_LAUNCH_STEPS.md` both flag that a real server-side rate limit (e.g. Cloudflare's built-in limiter) is a **launch blocker**, not implemented in this repo since there is no deployed server to attach it to yet. |
| 3 | **No offline retry/queue if the lead-delivery webhook call fails.** The visitor still sees their estimate (good), but if their network drops mid-submit, that lead is not captured anywhere and the broker never sees it. | Acceptable for an MVP where failure is rare and the user is shown a message telling them to contact the broker directly; a durable queue is a reasonable v2 improvement, not a launch blocker. |
| 4 | **`isValidEmail` is a pragmatic client-side check, not a full RFC 5322 validator**, and is not itself proof an inbox exists. | By design — real validation (deliverability) belongs server-side or via a confirmation email, both out of scope for a static-file MVP with no backend deployed yet. |
| 5 | **The demo's "zero backend" lead storage lives in the visitor's own browser `localStorage`**, keyed by broker ID. It is never transmitted anywhere and cannot be read by anyone but that browser. This makes the demo fully self-contained but means, unlike production, a broker viewing `dashboard.html` on a *different* machine from the demo visitor sees nothing. | This is explicitly labelled in-page ("This demo reads leads captured locally…") and in `PRODUCT.md`/`AUTOMATION_WORKFLOW.md`. It is a demo convenience only — real leads in production flow through the server-side webhook, never client `localStorage`. |

## The one finding that actually matters

Everything else here is defence in depth around a tool that, structurally, cannot promise a
guaranteed loan outcome or leak data through its own UI. The one real risk is **positioning**:
Australian consumer-credit and privacy law is not something a red-team code review can fully clear
on its own. `MVP_LAUNCH_STEPS.md` and `COMPLIANCE_AND_PRIVACY.md` both say this outright — a human
compliance/legal review is required before any real broker collects real personal financial data
through this tool, and that step must not be skipped because the code passed its tests.

## Verification method (so this isn't just an assertion)

- `npm run test:loanloop` — 20 unit tests over the calculator, compliance sanitiser, email/HTML
  validators, and the reference webhook handler. All passing.
- `node loanloop/tests/e2e.mjs` — 12 checks driven by a real headless Chromium browser through the
  actual sign-up → embed → calculate → submit → dashboard → CSV-export flow, including the XSS and
  honeypot attack attempts above. All passing, zero console/page errors.
