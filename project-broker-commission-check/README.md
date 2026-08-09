# Commission & Trail Reconciliation Checker

Free, offline-first MVP built from the "find a profitable problem → design an MVP" exercise,
applied to the niche NorthPath already serves: Australian mortgage/finance brokers.

## Package index

| File | Contents |
|---|---|
| [`00-problem-research.md`](00-problem-research.md) | 10 candidate problems, scored on demand/competition/ease/monetization, winner selected |
| [`01-mvp-design.md`](01-mvp-design.md) | Full MVP spec: inputs, reconciliation logic, output, compliance/privacy posture, limitations |
| [`lib/reconcile.js`](lib/reconcile.js) | The reconciliation engine — pure functions, no DOM/network, canonical source of truth |
| [`lib/reconcile.test.js`](lib/reconcile.test.js) | 18 unit tests (`node --test`) covering matching, missing/short/over payments, coverage gaps, rounding, malformed input |
| [`app/index.template.html`](app/index.template.html) | UI source (references the library by name; not runnable directly) |
| [`app/index.html`](app/index.html) | **The shippable app** — built by `build.mjs`, fully self-contained, zero dependencies |
| [`build.mjs`](build.mjs) | Inlines `lib/reconcile.js` into the template to produce `app/index.html` |
| [`02-red-team-audit.md`](02-red-team-audit.md) | Adversarial review: what breaks, what's non-compliant, what's a regulatory or reputational risk |
| [`03-council-review.md`](03-council-review.md) | Multi-perspective (Product / Compliance / Engineering / Growth) go/no-go synthesis |

## Run it

```bash
# Run the tests
node --test project-broker-commission-check/lib/reconcile.test.js

# Rebuild the app after editing lib/reconcile.js or app/index.template.html
node project-broker-commission-check/build.mjs

# Use it — either works, $0 either way:
open project-broker-commission-check/app/index.html      # just double-click it, no install
# or push app/index.html to GitHub Pages for a shareable link
```

## Why this exists

`app/index.html` is the only file a broker needs. It never talks to a network — parsing,
matching and the reconciliation math all run in the tab. `lib/reconcile.js` is the tested
source of truth; `build.mjs` inlines it into the template so the shipped file has no ES-module
`import` (which Chrome blocks under the `file://` protocol — caught in the red-team pass, see
`02-red-team-audit.md`). **Never hand-edit `app/index.html` directly** — edit the template or
the library and rebuild, or your fix will be silently overwritten by the next build.
