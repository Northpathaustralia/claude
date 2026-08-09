# RED TEAM AUDIT — Trustloop (v1 reference build)

**Auditor stance:** hostile security reviewer + AU privacy counsel + a customer who
wants to break the form. **Method:** every user-controlled input traced end to end
(setup form → localStorage → dashboard render → CSV export), every claim the app makes
about itself checked against what the code actually does, and the golden path driven
in a real headless browser (not just unit tests) to catch what static reading misses.

**Verdict up front:** the core product idea and the review-routing mechanism are sound
and were designed compliant from the start. Four real bugs and one compliance-adjacent
design risk were found and fixed during this audit; three structural limitations
remain and are called out below as **not fixed, and why not**, rather than silently
left for someone else to discover.

---

## Findings — fixed

### 1. Stored XSS via the feedback comment field — **CRITICAL, fixed**
Every customer-submitted field (comment, name) was headed straight for the owner's
dashboard. Before the fix, a comment like `<img src=x onerror="...">` would have
executed arbitrary JS in the business owner's browser the moment they opened the
dashboard — a classic stored-XSS attack against the one person with legitimate access
to every other customer's PII in that dataset.
**Fix:** `escapeHtml()` in `microsaas/src/logic.js`, applied to every user-controlled
field before it touches `innerHTML`. Verified with an automated browser test
(`verify.mjs`) that injects `<img src=x onerror="window.__xss=true">` as a real
customer would, confirms it renders as inert text, and confirms the handler never
fires.

### 2. CSV formula injection on export — **HIGH, fixed**
The CSV export is explicitly for opening in Excel/Sheets. A comment beginning with
`=`, `+`, `-`, or `@` is a live formula in most spreadsheet apps — e.g.
`=cmd|'/c calc'!A1` — letting a malicious "customer" plant a payload that executes
when the owner opens their own export.
**Fix:** `csvSafeCell()` prefixes any cell starting with a formula-trigger character
with a leading `'`, in addition to standard quote-escaping. Covered by a unit test
(`toCSV neutralises formula-injection payloads...`).

### 3. Open-redirect / script-URI injection via the Google review link — **MEDIUM, fixed**
The Google review URL is owner-configurable. Without validation, a `javascript:` URI
saved into that field (by mistake or via a compromised setup session) would have
turned a trusted "Leave a review" button into a script-execution vector for every
customer who clicked it.
**Fix:** `isValidHttpsUrl()` rejects anything that isn't a well-formed `https://` URL,
enforced both in `validateBusinessConfig` and covered by a dedicated unit test with a
`javascript:alert(1)` payload.

### 4. Standalone Google-review clicks were silently discarded — **HIGH (product-metric bug), fixed**
The most common real-world path — a happy customer clicks "Leave a Google review"
*without* ever filling in the private feedback form — had no feedback entry to attach
the click to, so `trackGoogleClick()` was a no-op and that click vanished from the
dashboard entirely. That's not a cosmetic bug: it undercounts the exact number
(review conversions) the product exists to prove out to a paying customer.
**Fix:** split into `trackStandaloneGoogleClick()` (a persisted counter independent of
any entry) and `trackAttributedGoogleClick()` (marks the just-submitted entry), summed
by `totalGoogleClicks()`. Caught a **second**, more basic bug while fixing this one —
see #5.

### 5. `standaloneGoogleClicks` was `undefined` on first-ever visit, corrupting to `NaN` — **HIGH, fixed**
While fixing #4, `loadData()`'s three return branches (no data yet / parsed data /
corrupt data) were updated in two of three places but the "no data yet" early return
was missed. Result: on a brand-new browser, `state.data.standaloneGoogleClicks` was
`undefined`; incrementing it (`undefined + 1`) produced `NaN`, which
`JSON.stringify` silently serialises as `null` — so the very first standalone click
on a fresh install would have vanished with no error anywhere.
**How it was actually caught:** not by reading the code, but by driving the real
browser flow end to end and asserting the dashboard showed the expected click count —
the assertion failed, which is what surfaced the bug. This is the argument for why
§"Playwright golden-path verification" is a required step, not an optional one, for
any UI change to this app going forward.
**Fix:** the missing branch now returns `{ config: null, entries: [], standaloneGoogleClicks: 0 }`
like the other two. Re-verified end to end after the fix.

### 6. Unhandled localStorage write failure could tell a customer "thanks!" while losing their feedback — **HIGH, fixed**
`saveData()` called `localStorage.setItem` with no error handling. A full quota
(realistic after enough long comments, or a browser already near its per-origin
limit) throws — which, uncaught, would have either crashed the submit handler or
(if a catch existed higher up) shown the thank-you screen despite the write failing,
permanently losing that customer's feedback with no trace.
**Fix:** `saveData()` now returns a success boolean; both the setup-save and
feedback-submit paths check it, roll back the in-memory change on failure, and show
the customer/owner an explicit "couldn't save, try again" message instead of a false
success.

---

## Findings — deliberately not fixed (and why)

### 7. Review-gating risk — verified compliant by design, not by afterthought
Google's Business Profile policy and equivalent ACCC guidance on manufactured/curated
reviews both prohibit tools that show a public review path to happy customers while
diverting unhappy ones to a private channel only. The obvious "smart" implementation
of this product — branch on the star rating the customer is about to give, before
they've given it — is the single most tempting design mistake in this entire category
of product, and it's explicitly what most competitors' "smart" funnels quietly do.
Trustloop's flow never branches on rating: the Google review button is rendered
unconditionally, before the star selector even appears, and again on the thank-you
screen regardless of what was submitted. This is asserted in the automated browser
test (`ASSERT google link visible on thank-you (1-star, not gated)`), not just
described in a doc — a future refactor that reintroduces gating will fail that
assertion.

### 8. Dashboard PIN is not real authentication
The PIN is compared client-side against a value stored in plaintext in the same
browser's `localStorage` — trivially readable via devtools by anyone with access to
that device. **This is not fixed, and can't meaningfully be** without a real backend:
any client-only "fix" (hashing the PIN, obfuscating the comparison) would be security
theatre, giving a false sense of protection while remaining just as bypassable. The
app displays an explicit on-screen and in-doc notice that this is a reference-UX gate,
not production auth, and `MICROSAAS_CONCEPT.md` §7 puts a real backend + auth
provider on the critical path before this product can hold a single real customer's
data.

### 9. No rate limiting or bot protection on the public feedback form
Nothing stops a script from submitting thousands of fake entries. A client-side rate
limit (e.g. a localStorage timestamp check) would be bypassed by clearing storage or
using a private window in seconds — again, theatre, not protection. Real rate
limiting needs a backend with IP/device-level throttling and likely a CAPTCHA on
suspicious traffic patterns. Flagged as a hard blocker before public deployment, not
attempted here.

### 10. All customer PII lives unencrypted in one browser's localStorage
No backup, no encryption at rest, gone if the browser's site data is cleared, and — for
Privacy Act 1988 / APP purposes — not something a real business could point to as a
compliant place to store customer feedback long-term. This is the single biggest gap
between "reference prototype" and "sellable product," and it's why the launch plan
in `MICROSAAS_CONCEPT.md` puts a real, AU-hosted backend before the first paying
customer, not after.

### 11. No true click-through rate (clicks ÷ visits)
The dashboard reports total Google-review clicks but not a rate, because computing one
requires counting anonymous page visits — which, done without a stated purpose and
retention period, is its own small privacy problem. Rather than ship a
half-implemented visit counter to make one stat look more sophisticated, the app says
plainly why the rate isn't there and what adding it correctly would require.

---

## Scorecard

| # | Category | Verdict |
| --- | --- | --- |
| 1 | Product idea / market fit | Sound — real problem, underserved price tier, believable beachhead vertical. |
| 2 | Compliance-by-design (review gating) | Pass — enforced unconditionally, covered by an automated assertion. |
| 3 | Input handling (XSS, CSV injection, URL validation) | Pass, after fixes #1–3. |
| 4 | Data-integrity bugs (#4–6) | Pass, after fixes — all three would have shipped silently without end-to-end browser testing. |
| 5 | Production security posture (auth, PII storage, abuse protection) | **Not production-ready — by design and by disclosure**, not by oversight. Explicit blockers listed for the real build. |
| 6 | Honesty of the artifact about its own limits | Pass — every unfixed gap is stated in-app, not just in a doc nobody reads. |

**Net:** as a reference prototype proving the mechanism and demonstrating a compliant,
bug-checked UX, this ships. As a system holding real customer data for paying
customers, it does not — and says so, in the product itself.
