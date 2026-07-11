# ATLAS_MASTER_STATUS — ATLAS ONE

**Version:** 0.3.0 (V1.x, Local Edition) · **Session:** 2026-07-11 · **Branch:** `claude/atlas-one-master-directive-izaw1w`

## Completed work

- **v0.1:** NorthPath AI OS (leads, scoring, content engine, referrals, reports, 6 rule-engine AI employees, single-file build, Pages deploy).
- **v0.2:** ATLAS ONE V1 — chat with 8 intelligence modes (Deep Think, X10 council pipelines), multi-provider AI router with cost accounting, 18-specialist Executive Decision Council, projects, user-controlled memory, knowledge retrieval, AI Studio (8 engines), Business/Financial centres, honest Integration Centre, voice foundation (Beta), morning briefing, usage/activity logs, full docs suite, NorthPath workspace absorbed intact.
- **v0.3 (this session):**
  - **App lock + encryption at rest (roadmap V1.x-1).** Passphrase-derived AES-GCM-256 (PBKDF2-SHA-256, 310k iterations, WebCrypto) wraps both stores including AI keys. Lock screen with honest forgot-passphrase story + last-resort erase, auto-lock on idle (5–60 min), "Lock now" in sidebar and Settings, change-passphrase re-keying, one-click removal. Both store providers now route through `src/atlas/secureStorage.js` (transparent passthrough when the lock is off).
  - **Live web research (roadmap V1.x-2).** Tavily + Brave adapters behind the provider pattern (`src/atlas/providers/search.js`) with live Test buttons; Research mode now searches the web, injects dated results as [Source n] context, and replies with citation chips + a Sources section. Failures are surfaced honestly (the reply says it ran without live sources). Integration Centre lists both with truthful statuses; intelligence panel shows research readiness.
  - **Chat polish.** Edit-and-resend any past prompt (truncates the thread honestly), save any reply to Saved Outputs, conversation search box.
  - Recovery audit (`ATLAS_RECOVERY_AUDIT.md`), all docs updated, version bump.

## Test results

`npm test`: **61/61 pass** (49 prior + 7 secure-storage + 5 research). Browser e2e: **33/33 pass** including the full lock lifecycle (enable → ciphertext-only storage → reload → wrong-pass rejection → unlock → data intact → removal) and the new chat/research/settings surfaces. Zero console errors. Details: `ATLAS_TEST_REPORT.md`.

## Current limitations / risks

- Real AI replies and live research need the owner's keys (2-minute steps each in `ATLAS_OWNER_GUIDE.md`); until then output is labelled Demonstration / "no live sources".
- Tavily/Brave adapters are structurally tested (mocks + error paths); the first real round-trip happens via the owner's Test button — CORS failure is caught and explained if a provider blocks browser calls.
- Backup exports remain readable JSON (owner-recoverable by design) and include keys — guide says store them privately.
- PDF/Word uploads, IndexedDB capacity, integrations beyond AI/search, computer control, wake word: Planned (labelled).

## Decisions

`ATLAS_DECISIONS.md` — new this session: D9 (crypto design), D10 (search provider choice), D11 (plaintext backups by design).

## Remaining work

`docs/10-roadmap.md` — next up: V1.x-3 (IndexedDB + PDF extraction), V1.x-4 remaining chat polish (branch/pin/export), V1.x-5 (auto-send voice + quiet mode, parallel council), then V2 connected integrations.

## Exact next action

**Owner:** (1) Settings → Security → turn on the app lock; (2) Settings → Research & web search → connect a free Tavily key and press Test; then ask Atlas something time-sensitive in Research mode and check the cited sources.
**Engineering:** roadmap V1.x-3 — move stores to IndexedDB (preserving one-file export + secureStorage encryption) and add PDF text extraction so PDFs stop being Planned.

## Continuation prompt

> Continue ATLAS ONE on branch `claude/atlas-one-master-directive-izaw1w`. Read `ATLAS_MASTER_STATUS.md` and `docs/10-roadmap.md` first — v0.3 shipped the app lock (encryption at rest) and live web research. Implement roadmap V1.x-3: migrate persistence to IndexedDB behind `src/atlas/secureStorage.js` (keep the encryption layer, the one-file backup export, and localStorage migration for existing data) and add client-side PDF text extraction to Knowledge (pdf.js, honest failure states, keep the single-file build working). Keep every quality rule: `npm test` + `tests/e2e.smoke.mjs` green, honest status labels, plain-English owner steps, update all continuity files before finishing.
