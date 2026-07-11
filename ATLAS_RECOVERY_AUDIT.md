# ATLAS_RECOVERY_AUDIT — session start 2026-07-11

## Recovery verification (performed before any changes)

- Git: HEAD `9dafadc` "Build ATLAS ONE v0.2", working tree clean, in sync with `origin/claude/atlas-one-master-directive-izaw1w`. The previous session ended **after** a complete, pushed release — nothing was left half-written.
- `npm test`: **49/49 pass**. `npm run build`: **clean**. `tests/e2e.smoke.mjs` against the production build: **21/21 pass, zero console errors**.
- Continuity files all present and accurate (MASTER_STATUS, DECISIONS, RESEARCH, TEST_REPORT, SECURITY_REPORT, OWNER_GUIDE, docs/01–10).

**Conclusion: no repair needed. This session continues forward, not backward.**

## Existing working systems (functional and tested)

Chat with streaming/stop/regenerate/copy + intelligence panel · 8 modes incl. Deep Think (draft→critique) and X10 (plan→council→synthesis) multi-pass pipelines · multi-provider router (Anthropic SDK / OpenAI-compat / Gemini) with profiles, live key Test, cost accounting · Executive Decision Council (18 specialists, selective activation, inspectable analyses) · Projects · user-controlled Memory with chat commands + sensitivity confirm · Knowledge upload/retrieval/citations (text formats) · AI Studio (8 engines → downloadable artifacts, sandboxed HTML preview) · Business Centre with live NorthPath card · full NorthPath workspace (NPAOS) · Financial Centre manual tracking · Integration Centre honest registry · voice push-to-talk + read-aloud + spoken briefing (Beta) · usage/cost dashboard, activity log, full backup/import · single-file build (`release/ATLAS-ONE.html`) + Pages deploy.

## Partially completed systems

| System | Exists | Remains |
|---|---|---|
| Research mode | Honest no-live-web behaviour + search plans | Real web search with cited sources (this session) |
| Security | Renderer injection defence, sandboxed artifacts, consent memory, key warnings | Encryption at rest + app lock (this session) |
| Voice OS | Phase-1 (PTT, TTS, indicators, stop) | Phase 2–4 (continuous, wake word, cloning) — roadmap |
| Chat experience | Core interactions | Edit-prompt, conversation search, save-reply-to-outputs (this session); branch/pin/export (next) |
| Knowledge | txt/md/csv/json/html up to 2 MB | PDF/Word extraction, IndexedDB capacity — roadmap |
| Mobile | Responsive web | PWA install, then native — roadmap |

## Broken systems

None found (all suites green; e2e run this session).

## Demonstration / placeholder systems (clearly labelled in-app)

No-key chat/council/studio replies (labelled Demonstration); platform integrations beyond AI providers (labelled Planned/Beta-manual); image & video generation (Planned); computer control (Planned, docs/05 contract only — no UI pretends).

## Missing vs directive (all labelled Planned, tracked in docs/10-roadmap.md)

Computer Control Agent · wake-word/continuous voice · plugin/skill marketplace · autonomous project manager stages · live platform integrations (HubSpot/Google/Xero…) · native mobile & watch · Cloud Edition (Next.js/PostgreSQL, real multi-user auth) · trading/broker connections.

## Current development stage

Directive phases 1–7 foundations delivered as V1 Local Edition (v0.2). Working through V1.x hardening list in `docs/10-roadmap.md`.

## Continuation order for this session (chosen)

1. **App lock + encryption at rest** (roadmap V1.x-1) — passphrase-derived AES-GCM (WebCrypto) wrapping both stores incl. provider keys, lock screen, auto-lock, lock-now. This is the Local Edition's authentication/secure-permissions item and closes the top open risk in `ATLAS_SECURITY_REPORT.md`.
2. **Live web research** (V1.x-2) — Tavily/Brave search adapters behind the provider pattern; Research mode gains real sources with dates + citation chips; honest failure states; Integration Centre entries + live Test.
3. **Chat polish** — edit & rerun a prompt, save reply to Outputs, conversation search.
4. Re-test everything (unit + extended e2e), update all status documents.
