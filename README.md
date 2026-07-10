# ATLAS ONE

**Think deeper. Build faster. Run everything.**

ATLAS ONE is a premium personal and business AI operating system built for James Forycki. Atlas — the intelligence at its core — chats, reasons in multiple depths, convenes an 18-specialist decision council, creates documents/decks/sites/spreadsheets/code, remembers what you ask it to, reads your documents, briefs you each morning from real data, and runs the complete NorthPath lead-generation workspace. All of it ships as a single HTML file you can double-click.

**Non-technical? Start here → [`ATLAS_OWNER_GUIDE.md`](ATLAS_OWNER_GUIDE.md)** (open the app, connect a key in 2 minutes, five things to try).

## What's inside (V1, Local Edition)

| Area | Highlights | Status |
|---|---|---|
| **Chat** | Streaming, Stop, regenerate, copy, per-message model/token/cost provenance, right-hand intelligence panel | Working |
| **Intelligence modes** | Fast · Smart · Deep Think (draft→self-critique) · X10 (plan→specialist council→synthesis) · Research · Build · Creative · Executive | Working |
| **Multi-provider AI** | Anthropic (recommended, official SDK), OpenAI, Google, xAI, Mistral behind one router with Maximum/Balanced/Low-Cost profiles; live key **Test** button; cost tracking | Working |
| **Executive Decision Council** | ATLAS + FORGE, SAGE, PULSE, VAULT, MUSE, ORBIT, SENTINEL, COUNSEL, VISION, ANALYST, NEGOTIATOR, INVESTOR, PSYCHOLOGIST, ECONOMIST, GROWTH, OPERATOR, ARCHITECT — only relevant specialists convene; individual analyses inspectable | Working |
| **Projects · Memory · Knowledge** | Project instructions steer conversations; memory is 100% user-controlled ("Remember/Forget/What do you remember"); document upload with retrieval + citations | Working |
| **AI Studio** | Document, presentation, spreadsheet (CSV), website, app prototype, code, social pack, video script engines → downloadable artifacts | Working |
| **Business Command Centre** | Live NorthPath card (real pipeline data) + venture tracking | Working |
| **NorthPath workspace** | The full NPAOS v0.1: lead scoring (A+–D), sales/CRM/ops/marketing/analyst engines, content packs, referrals, reports, CSV import/export | Working |
| **Financial Centre** | Manual monthly tracking with honest totals; account/trading connections are Planned and say so | Working (manual) |
| **Voice** | Push-to-talk dictation, read-aloud replies, spoken morning briefing (Web Speech, Chrome/Edge) | Beta |
| **Integrations** | ~50-item registry with truthful statuses; AI providers connect today, platforms roll out per roadmap | Registry working |

**The quality rule:** every feature is labelled Working / Beta / Demonstration / Planned. No fake dashboards, no invented numbers, no demo output pretending to be real.

## Zero-install use

Download [`release/ATLAS-ONE.html`](release/ATLAS-ONE.html) and double-click it. Data persists in that browser (localStorage, keys `atlas.v1` + `npaos.v1`); export a backup weekly from Settings.

## Developer setup

```bash
npm install
npm run dev               # http://localhost:5173
npm test                  # 49 unit tests (engines + NorthPath AI employees)
npm run build             # production build to dist/
npm run build:standalone  # regenerate release/ATLAS-ONE.html
# e2e (needs Chromium): npm run preview -- --port 4173 &
npm i --no-save playwright-core && node tests/e2e.smoke.mjs
```

## Architecture in one paragraph

React + Vite + Tailwind UI over pure, unit-tested JS engines (`src/atlas/`): a mode/pass **orchestrator** with dependency-injected model calls, a **router** mapping modes×profiles to models, the **council**, user-controlled **memory**, lexical **knowledge retrieval**, a **safe markdown renderer**, **studio** engines and the **briefing** builder. Provider adapters (`src/atlas/providers/`) speak Anthropic (official SDK, browser-supported), OpenAI-compatible (OpenAI/xAI/Mistral) and Gemini. Persistence is two versioned localStorage stores exported as one backup. The NorthPath workspace (`src/ai`, `src/pages`) is the original NPAOS, mounted intact. Full docs: [`docs/`](docs/) 01-PRD → 10-roadmap; session continuity in `ATLAS_MASTER_STATUS.md`.

## Project structure

```
src/atlas/        Atlas engines (router, orchestrator, council, memory, knowledge,
                  studio, briefing, voice, markdown, integrations, providers/)
src/pages/atlas/  Atlas UI (Home, Chat, Projects, Studio, Council, Business,
                  Finance, Knowledge, Memory, Integrations, Settings, NP shell)
src/store/        atlas.v1 + npaos.v1 context stores
src/ai|pages|…    NorthPath workspace (unchanged NPAOS v0.1)
docs/             PRD, architecture, tech report, voice, computer-control,
                  agents, integrations, data schema, security, roadmap
ATLAS_*.md        Master status, decisions, research, tests, security, owner guide
release/          ATLAS-ONE.html — the zero-install build
```
