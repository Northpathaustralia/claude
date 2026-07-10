# ATLAS ONE — Product Requirements (V1)

**Product:** ATLAS ONE · **AI:** Atlas · **Owner:** James Forycki (Australia)
**Tagline:** Think deeper. Build faster. Run everything.

## Vision

A premium personal and business AI operating system: chat-first intelligence with projects, user-controlled memory, document knowledge, a specialist agent council, creation studio, business/financial command centres, and (in later phases) live integrations, voice OS, and computer control. Not a chatbot; an operating partner.

## Non-negotiable product rules

1. **Honesty by construction.** Every feature is labelled Working / Beta / Demonstration / Planned. No fake integrations, dashboards, data, or progress. Demonstration output is always labelled.
2. **Owner-first simplicity.** James is non-technical. Every owner action ships as exact numbered plain-English steps. Powerful inside, simple outside.
3. **User-controlled memory.** Atlas remembers only what James asks it to; everything is reviewable, editable, deletable, exportable. Sensitive items require explicit confirmation.
4. **Confidence labels.** Verified fact / Strong evidence / Moderate evidence / Estimate / Assumption / Opinion / Prediction / Unverified.
5. **Financial safety.** No guaranteed-outcome claims, ever. Read-only before write. Confirmation before anything that moves money (future phases).
6. **Approval before external action.** Publishing, sending, and posting always require explicit approval (future integration phases).

## V1 scope (delivered)

| # | Requirement | Status |
|---|---|---|
| 1 | Premium chat with streaming, copy, regenerate, stop | Working |
| 2 | Intelligence modes: Fast, Smart, Deep Think, X10, Research, Build, Creative, Executive | Working |
| 3 | Multi-provider model layer (Anthropic, OpenAI, Google, xAI, Mistral) + router profiles | Working (Anthropic primary; xAI/Mistral browser access untested) |
| 4 | Projects with instructions steering attached conversations | Working |
| 5 | Memory system (chat commands + full management UI) | Working |
| 6 | Knowledge upload + retrieval + citation context | Working (text formats; PDF/Word planned) |
| 7 | Executive Decision Council (18 specialists, selective activation, synthesis) | Working (requires provider key) |
| 8 | AI Studio: document, presentation, spreadsheet, website, app, code, social, video-script engines | Working (text/code/html/csv artifacts; image/video planned) |
| 9 | Business Command Centre with live NorthPath card + venture tracking | Working |
| 10 | NorthPath workspace (full NPAOS: leads, scoring, content, referrals, reports, tasks) | Working |
| 11 | Financial Command Centre — manual tracking + honest roadmap | Working (manual) |
| 12 | Integration Centre registry with truthful statuses | Working (registry); connections Planned |
| 13 | Voice foundation: push-to-talk input, read-aloud replies, spoken briefing | Beta (browser Web Speech API) |
| 14 | Morning briefing from real local data | Working |
| 15 | Usage & cost dashboard, activity log, full data export/import | Working |
| 16 | Responsive mobile web | Working (responsive layout) |
| 17 | Zero-install distribution (single HTML file) + GitHub Pages deploy | Working |

## Explicitly deferred (see roadmap)

Authentication/multi-user (moot in Local Edition — single-device, data local), computer control agent, wake word/continuous voice, live web research, external platform OAuth integrations, plugin marketplace, native mobile apps, trading connections, Cloud Edition (Next.js + PostgreSQL).

## Acceptance tests

See `ATLAS_TEST_REPORT.md` — 49 unit tests + 21-check browser end-to-end suite, all passing, mapped to the directive's acceptance list.
