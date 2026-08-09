# Compliance and privacy

LoanLoop touches two regulated areas in Australia: consumer credit (via the estimate) and personal
information (via the lead form). This document is the operator-facing policy the product is built
to. It is **not** a substitute for actual legal advice before onboarding paying customers — see the
explicit call-out in `MVP_LAUNCH_STEPS.md` step 5.

## Credit / finance positioning (National Consumer Credit Protection Act, ASIC RG 209)

- The widget only ever produces a **range**, never a single figure, and never a specific product or
  lender recommendation. That keeps it as general information rather than personal credit advice
  or a credit assistance service, consistent with how comparison-site calculators operate without
  holding an Australian Credit Licence.
- The disclaimer (`DISCLAIMER` in `widget/loanloop.js`) is **not optional** — it renders with every
  result, is not something a broker can remove or edit via the widget's configuration, and states
  plainly that the figure is not credit advice or a pre-approval.
- A broker's custom headline/subtext is passed through `sanitiseText()`, which rewrites known
  guaranteed-outcome phrasing ("guaranteed approval", "100% approval", "pre-approved for sure", …)
  before it can render. This mirrors the pattern already proven in this repo's own
  `src/utils/compliance.js` for NPAOS.
- **This scan is a safety net, not a legal review.** It catches known bad phrasings; it cannot
  catch every way a broker could misrepresent the tool. Any broker headline should still be
  spot-checked periodically (see `AUTOMATION_WORKFLOW.md`'s "where a human is still needed").

## Privacy (Privacy Act 1988, Australian Privacy Principles)

- **Collection is minimal and purpose-limited:** name, email, phone (optional), and the financial
  inputs needed to compute the estimate. Nothing else is asked for.
- **Consent is explicit and unbundled:**
  - The "contact me about this enquiry" checkbox is required and **never pre-ticked**.
  - Marketing consent is a **separate**, also-unticked checkbox — service consent and marketing
    consent are never bundled into a single tick, which is the main pattern regulators flag as
    non-compliant "consent."
- **A visible privacy policy link is required before go-live.** `site/signup.html` and the widget
  both reference a privacy policy page; the operator must publish a real one before onboarding real
  brokers (a placeholder is not sufficient once real personal information is collected).
- **Data minimisation in storage:** the reference webhook (`server/webhook-function.js`) stores
  only what was submitted — no additional tracking/enrichment fields are added silently.
- **Marketing email compliance (Spam Act 2003):** any nurture email sent to a lead who opted in via
  the marketing checkbox must include a functioning unsubscribe link (standard feature of Resend,
  EmailJS, and any mainstream ESP — must be configured, not assumed).

## Security posture (see `RED_TEAM_AUDIT.md` for the full adversarial review)

- All user-supplied text rendered into the DOM uses `textContent`, never `innerHTML`, eliminating
  the primary XSS vector for the widget itself.
- The reference webhook validates `brokerId` against a strict slug pattern and validates every
  field's type/shape server-side — the client-side widget validation is UX, not the security
  boundary.
- Lead submissions are rate-limited client-side (best-effort, `localStorage`-based) and must be
  rate-limited server-side too before go-live — the reference webhook's origin allow-list is the
  first layer; a request-volume limit (e.g. Cloudflare's built-in rate limiting) is the second and
  is called out as a launch-blocker in `RED_TEAM_AUDIT.md`.
