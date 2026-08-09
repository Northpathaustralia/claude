# Trustloop — micro-SaaS reference build

A working reference prototype of the "Trustloop" feedback-and-review-funnel concept
described in [`docs/microsaas/MICROSAAS_CONCEPT.md`](../docs/microsaas/MICROSAAS_CONCEPT.md).
Adversarially reviewed in [`docs/microsaas/RED_TEAM_AUDIT.md`](../docs/microsaas/RED_TEAM_AUDIT.md)
and [`docs/microsaas/COUNCIL_REVIEW.md`](../docs/microsaas/COUNCIL_REVIEW.md).

## Run it

No build step — plain ES modules served as static files.

```bash
npx serve microsaas         # or: python3 -m http.server 8080 --directory microsaas
```

Open the printed URL, complete Setup (business name, Google review link, PIN), then
try the Get feedback and Dashboard tabs. All data is stored in this browser's
`localStorage` only — nothing is sent anywhere.

## Test it

```bash
npm run test:microsaas      # from the repo root — 12 unit tests over the pure logic
```

The logic in `src/logic.js` has no DOM dependency, so it runs unmodified under both
the browser (as a native ES module, `<script type="module">`) and `node --test`.

## What this is (and isn't)

This is a **reference prototype** demonstrating the product's core mechanism —
compliant review routing, private feedback capture, an owner dashboard — end to end,
with the input-handling and data-integrity bugs found during development fixed (see
the red-team audit for the list). It is **not** production-ready: there is no real
backend, the dashboard PIN is not real authentication, and no privacy policy or data
retention/deletion path exists. Both are explicit, tracked blockers before this could
hold a real customer's data — see the red-team audit's "deliberately not fixed"
section for why, and the concept doc's launch plan for what comes before that point.

## Structure

```
microsaas/
  index.html        Entry point, loads src/app.js as a module
  src/
    logic.js         Pure functions: validation, sentiment, stats, CSV/XSS-safe rendering
    app.js            DOM wiring, localStorage persistence
    style.css
  tests/
    logic.test.js     node --test suite over src/logic.js
```
