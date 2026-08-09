# LoanLoop — a 24/7 lead machine for mortgage &amp; finance brokers

A self-contained micro-SaaS built end-to-end in this repo: an embeddable borrowing-power
calculator that turns a broker's website into an automated lead source, running with no ongoing
human effort once it's pasted onto a page.

Built in response to the brief: *"Create a simple software business that can operate 24/7 with
minimal human involvement. Use free or freemium tools wherever possible. Give me the product,
target market, automation workflow, pricing, acquisition strategy, and exact steps to launch the
MVP."* — see `docs/` for each of those, plus a red-team audit and a multi-perspective council
sign-off.

## Run it locally (no install, no build step)

```bash
# from the repo root
npx serve loanloop        # or: python3 -m http.server 8000 --directory loanloop
```

Then open:

- `/site/index.html` — marketing/pricing landing page
- `/site/signup.html` — self-serve "get your embed code" flow (demo: stores locally, no backend)
- `/site/demo.html` — a simulated broker website with the real widget embedded
- `/site/dashboard.html` — the leads dashboard + CSV export

Try the loop end-to-end: sign up on `signup.html` → open the generated demo link → submit the
calculator → check `dashboard.html` for the captured lead.

## Tests

```bash
npm run test:loanloop          # 20 unit tests: calculator, compliance guard, webhook validation
node loanloop/tests/e2e.mjs    # 12 real-browser checks via Playwright/Chromium — see below
```

The end-to-end script needs `loanloop/` served over HTTP (module scripts don't load from
`file://`). Example:

```bash
npx serve loanloop -l 8934 &
LOANLOOP_TEST_PORT=8934 node loanloop/tests/e2e.mjs
```

## Structure

```
widget/loanloop.js    Embeddable widget — calculator, compliance guard, validation, DOM mounting.
                       Pure functions are exported and unit-tested; DOM code only runs in a browser.
widget/loanloop.css   Scoped styles for the embed (no external fonts/CDNs).
site/                 Landing page, signup flow, live demo, leads dashboard.
server/               Framework-agnostic reference lead-intake webhook (not deployed — see docs).
tests/                Node unit tests (core.test.js, webhook.test.js) + Playwright e2e (e2e.mjs).
docs/                 Product, market, automation, pricing, acquisition, launch steps, compliance,
                       red-team audit, council review.
```

## Docs

| Doc | Covers |
| --- | --- |
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | What it is, why this and not something else, MVP scope |
| [`docs/TARGET_MARKET.md`](docs/TARGET_MARKET.md) | Who it's for and why they'd say yes |
| [`docs/AUTOMATION_WORKFLOW.md`](docs/AUTOMATION_WORKFLOW.md) | The free-tool chain that keeps it running with minimal human involvement |
| [`docs/PRICING.md`](docs/PRICING.md) | Free / Pro / Growth tiers and the reasoning behind them |
| [`docs/ACQUISITION_STRATEGY.md`](docs/ACQUISITION_STRATEGY.md) | How the first brokers are acquired at ~$0 spend |
| [`docs/MVP_LAUNCH_STEPS.md`](docs/MVP_LAUNCH_STEPS.md) | The exact remaining steps to go from this repo to a live product |
| [`docs/COMPLIANCE_AND_PRIVACY.md`](docs/COMPLIANCE_AND_PRIVACY.md) | NCCP/credit positioning, Privacy Act consent design, security posture |
| [`docs/RED_TEAM_AUDIT.md`](docs/RED_TEAM_AUDIT.md) | Adversarial review — what was attacked, what broke, what got fixed |
| [`docs/COUNCIL_REVIEW.md`](docs/COUNCIL_REVIEW.md) | Legal, security, growth and engineering sign-off with launch blockers |

## What's real vs. what's documented-but-not-provisioned

Everything under `widget/`, `site/`, `server/` and `tests/` is real, working code, verified by the
test suites above. What is **not** done — because it requires the operator's own third-party
accounts (Stripe, a hosting domain, an email sender) — is spelled out precisely in
`docs/MVP_LAUNCH_STEPS.md` rather than assumed or faked.
