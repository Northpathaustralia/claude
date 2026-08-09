# Red-Team Audit — Commission & Trail Reconciliation Checker (v1)

**Auditor stance:** hostile reviewer trying to make this tool give a broker a wrong answer,
leak data it promised not to leak, or fall over the first time it meets a real aggregator
export. **Method:** `code-review` skill (high effort) + `security-review` skill run against the
full diff, plus a manual pass focused on the specific claims made in `01-mvp-design.md` (zero
network calls, zero-install, reconciliation-not-advice). Every finding below was fixed in this
branch before merge — this is not a backlog, it's a record of what was wrong and what changed.

## Findings and resolutions

### 1. HIGH — "just double-click the file" was false in the most common browser

**Found by:** manual browser test (Playwright, Chromium) after the automated code-review pass,
following the repo convention of verifying UI changes in a real browser rather than trusting
unit tests alone.

`app/index.html` used `<script type="module">` with a relative `import … from '../lib/reconcile.js'`.
Chrome (and Chromium-based browsers — the majority of the market) block cross-file ES module
imports under the `file://` protocol with a CORS error. Opening the file directly, exactly the
"no install, just works" path this tool exists to offer, produced a blank results panel with a
silent console error and **zero indication anything had gone wrong** — the worst kind of failure
for a compliance-adjacent tool.

**Fix:** `lib/reconcile.js` stays the tested ES module (canonical source, `node --test` runs
unmodified). `app/index.template.html` is the UI source with an inline-marker instead of an
import. `build.mjs` inlines the library into a classic (non-module) `<script>` tag to produce the
real shippable artifact, `app/index.html` — a genuinely dependency-free single file, verified with
Chromium both via `file://` and would work identically over `https://`. Re-tested end-to-end
(sample data load → reconcile → export → reload-persistence → clear) with zero console errors.

### 2. HIGH — trail coverage-gap detection silently no-ops on real-world statement exports

**Found by:** `code-review` skill (high effort).

`reconcile()`'s trail coverage-gap check needs a reference "as of" date, and fell back to the
latest `payment_date` found in the statement lines. If an aggregator's actual CSV export uses a
column header the loader doesn't recognise (so every `payment_date` comes back blank) — a very
plausible real-world case, aggregator export formats aren't standardised — that fallback becomes
`''`, and the coverage-gap check is skipped for **every loan**, with nothing in the UI to say so.
The report would show "all OK" while genuinely masking months of unpaid trail — the exact failure
mode this tool exists to catch, silently defeated by its own date-parsing fallback.

**Fix:** the UI now always passes `options.asOfDate` as today's real date explicitly, rather than
relying on the library's fallback (`app/index.template.html`). `reconcile()`'s JSDoc now states
this requirement explicitly so a future integrator doesn't fall into the same trap. Added
`lib/reconcile.test.js` regression tests: one confirming the fallback-from-statement-dates path,
and one that pins the documented (not silently-wrong) skip behaviour when no dates are available
anywhere, so a future change can't quietly turn "skip" into "wrongly report OK" instead.

### 3. MEDIUM — CSV/formula injection in the exported discrepancy report

**Found by:** manual pass, prompted by the security-review checklist's injection category (the
automated security-review skill's git-diff capture failed in this sandbox — `origin/HEAD` wasn't
set — so this pass substituted a direct manual review against the same category list).

`toDiscrepancyCSV()` escaped commas/quotes/newlines but not a leading `=`, `+`, `-` or `@` —
the classic "CSV injection" pattern (OWASP). `client_name` and `lender` in the exported report
come from the broker's uploaded loan book, which may itself be populated from an upstream
untrusted source (a web lead form, a client-supplied intake elsewhere in the business). A crafted
name like `=cmd|'/c calc'!A1` would round-trip into the exported report and execute as a formula
if a broker or their aggregator opened it in Excel.

**Fix:** `esc()` now prefixes string-typed values starting with `=+-@\t\r` with a leading `'`
before quoting. Scoped to string fields only (loan ref, client, lender) — numeric fields
(`expected`/`paid`/`variance`) are computed internally, never raw text, and must stay real numbers;
an earlier version of this fix incorrectly caught legitimate negative variances (e.g. `-50`)
before a unit test caught the regression. Both the injection case and the negative-number
regression are now locked in by tests.

### 4. Reviewed and accepted — `lib/reconcile.js` duplicates `src/utils/csv.js`'s CSV parser

**Found by:** `code-review` skill.

`parseCSV`/`esc` in this new module are close to the existing NPAOS CSV helpers rather than
importing them. This is a deliberate tradeoff, not an oversight: this project folder is designed
to be a fully standalone, portable deliverable — same pattern as `project-north-harbour/` and the
TIDESTATE store, neither of which depends on `src/`. `build.mjs` inlines `lib/reconcile.js` by
stripping `export` keywords with a regex; reaching across to `src/utils/csv.js` would either break
that inlining (a second file to inline, with its own export surface) or reintroduce the exact
`import` dependency that finding #1 exists to eliminate. The duplication is small (≈15 lines), is
itself unit-tested, and drift risk is judged acceptable against the cost of re-coupling a
zero-dependency tool to the main app's build.

## What was NOT flagged, and why

- **No backend, no data collection.** Verified directly: `grep` for `fetch(`, `XMLHttpRequest`,
  `console.*`, and any `http` URL across `app/index.template.html` returns nothing. The privacy
  claim in `01-mvp-design.md` is enforced by the absence of the capability, not a policy.
- **Trail-balance approximation** (using original loan amount, not amortised balance) is a stated
  modelling limitation, not a bug — it's disclosed in-app and in `01-mvp-design.md`, and it biases
  toward *over-estimating* what's owed, which is the safer direction for a "verify with your
  aggregator before acting" tool.
- **NCCP Best Interests Duty** does not apply — this tool performs no product comparison and makes
  no recommendation; it reconciles arithmetic the broker already has the inputs for. This scope
  boundary is stated explicitly in the UI and in `01-mvp-design.md` and was the deciding factor in
  choosing this problem over the higher-scoring-but-riskier BID-generator candidate (see
  `00-problem-research.md`).

## Outcome

All four findings fixed on this branch. `node --test lib/reconcile.test.js` — 22/22 passing.
Browser-verified (Chromium, `file://` and reload/export/clear flows) with zero console errors
after every fix.
