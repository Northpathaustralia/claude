# ATLAS_TEST_REPORT — ATLAS ONE v0.2

**Date:** 2026-07-10 · **Result: ALL GREEN** — 49/49 unit tests, 21/21 e2e checks, production build clean.

## Unit suites (`npm test`, Node test runner)

| Suite | Covers | Result |
|---|---|---|
| tests/atlasEngines.test.js | Router (profiles, override, no-provider), cost estimation, council selection + disclaimers, memory commands (remember/forget/recall, sensitivity, selection caps), knowledge chunking/retrieval/file-support honesty, markdown safety (script/`javascript:` injection, tables, code) | ✅ |
| tests/atlasOrchestrator.test.js | Mocked-model pipelines: Smart 1-pass, Deep Think 2-pass w/ draft fed to critique, X10 plan+council+synthesis pass math, context injection (project/memory/knowledge in system prompt), demo-mode zero-call honesty, council run, studio artifact + fence cleaning, briefing from seed data, research-mode honesty text | ✅ |
| tests/aiEmployees.test.js, leadScoring, compliance, csv (from v0.1) | NorthPath engines unchanged | ✅ |

## End-to-end (`tests/e2e.smoke.mjs`, Playwright/Chromium on the production build)

Home brand + real-data briefing + honest system map + provider warning · chat memory round-trip (store → recall) · demonstration labelling with no key · memory page CRUD surface · all 8 mode chips · project creation · council roster + specialist preview · studio engines · NorthPath leads table + lead detail (profile + next action) · dashboard under Atlas shell · integrations truthful statuses · settings/finance/business render · **zero console/page errors**.

## Directive acceptance tests — mapping

| Directive test | Status |
|---|---|
| 1 Normal question → fast natural response | ✅ pipeline verified (mock + streaming path e2e); real-model reply pending owner key |
| 2 Current research with sources/dates | ⚠ Honest partial: Research mode labels the no-live-web limit and gives search plans; live sources arrive with V1.x-2 |
| 3 Multi-document comparison | ✅ multi-doc retrieval + citation context (unit) |
| 4 Business plan w/ research+agents+finance+risks | ✅ X10 council pipeline verified with mocks; needs key for real content |
| 5 Application build → working files | ✅ Studio app/website engines output runnable HTML artifacts (verified artifact hygiene) |
| 6 Memory request → storage + controls | ✅ end-to-end in browser |
| 7/8 Voice conversation + interruption | ⚠ Beta: push-to-talk + read-aloud + stop work (feature-detected); continuous+barge-in is V2 |
| 9/15 Computer task + emergency stop | Planned (docs/05); chat Stop verified as the current emergency stop for generation/speech |
| 10 Sensitive action confirmation | ✅ sensitive-memory confirm; pattern defined for future actions |
| 11 Integration install → clear permissions | ✅ registry honesty; permission screen contract documented (no live installs yet by design) |
| 12 Business dashboard accuracy | ✅ NorthPath card cross-checked against store data |
| 13 Project automation structure | ✅ projects + instructions steering (unit + e2e) |
| 14 Malicious document / prompt injection | ✅ renderer injection tests; document-wrapping instructions; standing red-team item |

## How to re-run

`npm test` · e2e: `npm run build && npm run preview -- --port 4173 &` then `npm i --no-save playwright-core && node tests/e2e.smoke.mjs`.
