# ATLAS_TEST_REPORT — ATLAS ONE v0.3

**Date:** 2026-07-11 · **Result: ALL GREEN** — 61/61 unit tests, 33/33 e2e checks, production + single-file builds clean.

## Unit suites (`npm test`, Node test runner)

| Suite | Covers | Result |
|---|---|---|
| tests/atlasEngines.test.js | Router/profiles/override, cost estimation, council selection + disclaimers, memory commands + sensitivity + selection caps, knowledge chunking/retrieval/file honesty, markdown injection safety | ✅ |
| tests/atlasOrchestrator.test.js | Mocked-model pipelines (Smart/Deep/X10 pass math), context injection, demo-mode honesty, council, studio artifacts, briefing, research-honesty prompt | ✅ |
| tests/atlasSecure.test.js | Encryption at rest: enable removes plaintext + stores ciphertext, encrypted persistence of new writes, lock drops memory, wrong-pass rejected (GCM auth), unlock restores data, disable restores plaintext, re-keying (old fails/new works), short-pass rejection, no writes while locked, auto-lock metadata, erase hatch | ✅ |
| tests/atlasResearch.test.js | Search provider pick (preference/fallback/none), research mode injects [Source n] + URLs into context and meta, honest search-failure path, no search outside research mode or without keys, citation instructions in prompt | ✅ |
| tests/aiEmployees, leadScoring, compliance, csv (v0.1) | NorthPath engines unchanged | ✅ |

## End-to-end (`tests/e2e.smoke.mjs`, Playwright/Chromium on the production build) — 33 checks

Everything from v0.2 (branding, briefing, memory round-trip, demonstration labelling, modes, projects, council, studio, NorthPath workspace incl. lead detail, integrations honesty, settings/finance/business) **plus**:
Research & web search settings section · Security section (honest "Not encrypted" default) · Tavily honest Not Connected in Integration Centre · conversation search box · edit button on user messages · save-reply lands in Saved Outputs · **full app-lock lifecycle:** enable → localStorage holds ciphertext only (verified: `enc.atlas.v1` present, `atlas.v1` gone) → reload shows lock screen → wrong passphrase rejected → correct passphrase unlocks → memory data intact → removal restores plaintext and clears metadata · zero console/page errors.

## Directive acceptance tests — mapping

| Directive test | Status |
|---|---|
| 1 Normal question | ✅ pipeline verified; real reply needs owner key (labelled demo until then) |
| 2 Current research with sources/dates | ✅ **implemented** — with a search key connected, Research mode cites dated live sources; without one it says so honestly (adapter round-trip verified by the owner's Test button; mocked in CI) |
| 3 Multi-document comparison | ✅ |
| 4 Business plan (research+agents+finance+risks) | ✅ X10 council pipeline (mock-verified) |
| 5 Application build → working files | ✅ Studio artifacts |
| 6 Memory storage + controls | ✅ e2e |
| 7/8 Voice conversation + interruption | ⚠ Beta phase 1 (PTT/read-aloud/stop); continuous + barge-in is roadmap |
| 9 Computer task | Planned (docs/05 contract) |
| 10 Sensitive action confirmation | ✅ sensitive memory confirm; lock removal + erase double-confirm |
| 11 Integration install → clear permissions | ✅ registry honesty + live Test gating for AI/search keys |
| 12 Business dashboard accuracy | ✅ |
| 13 Project automation structure | ✅ |
| 14 Malicious document / prompt injection | ✅ renderer tests + wrapped excerpts (standing red-team item) |
| 15 Emergency stop | ✅ chat Stop halts generation + speech (e2e-covered surfaces) |

## How to re-run

`npm test` · e2e: `npm run build && npm run preview -- --port 4173 &` then `npm i --no-save playwright-core && node tests/e2e.smoke.mjs`.
