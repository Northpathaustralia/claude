# ATLAS ONE — Technology Report

## Chosen stack (V1 Local Edition)

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 + Vite 5 | Already proven in this repo (NPAOS v0.1); instant dev server; single-file build plugin |
| Styling | Tailwind CSS 3 | Design tokens (deep navy / emerald) as config; consistent with existing pages |
| Language | JavaScript + JSDoc | Consistency with the existing tested codebase; engines run directly under `node --test` with zero toolchain. TypeScript remains the plan for the Cloud Edition rewrite |
| Routing | react-router 6 (HashRouter) | Works on GitHub Pages **and** double-clicked local files |
| State | React context + reducer → localStorage (versioned keys) | Zero-dependency persistence; whole state exportable as one JSON backup |
| AI (Anthropic) | `@anthropic-ai/sdk` (official) | Streaming helpers, typed errors, officially supported direct-browser access |
| AI (others) | fetch + SSE adapters | OpenAI-compatible wire format (OpenAI/xAI/Mistral) and Gemini SSE |
| Voice | Web Speech API | Real STT/TTS in Chromium browsers with no keys and no uploads |
| Tests | Node built-in test runner + Playwright (chromium) e2e | No test-framework dependency; e2e drives the actual built app |
| CI/CD | GitHub Actions → GitHub Pages | Tests gate deploys; single-file release artifact committed |

## Model catalog (recorded at build time, July 2026)

| Model | Provider | Tier | $/1M in | $/1M out |
|---|---|---|---|---|
| claude-opus-4-8 | Anthropic | max | 5.00 | 25.00 |
| claude-sonnet-5 | Anthropic | balanced | 3.00 | 15.00 |
| claude-haiku-4-5 | Anthropic | fast | 1.00 | 5.00 |
| gpt-5.2 / gpt-5-mini | OpenAI | balanced/fast | not tracked | not tracked |
| gemini-2.5-pro / flash | Google | balanced/fast | not tracked | not tracked |
| grok-4 · mistral-large | xAI · Mistral | balanced | not tracked | not tracked |

Costs are only estimated where prices are confidently known (Anthropic); other providers report tokens without a fabricated dollar figure. Anthropic API notes honoured by the adapter: current Claude models reject sampling parameters (none are sent); adaptive thinking is requested with summarized display for deep modes; usage is read from the final message including cache tokens.

## Why not Next.js + PostgreSQL for V1

The directive prefers that stack and it remains the Cloud Edition target. For V1 it fails the owner test: James would need hosting, a database, environment variables and deploy pipelines before the first conversation. The Local Edition gives a working product in minutes (open file → paste key), stores nothing on any server, and the dependency-injected engine layer was built so the same intelligence code lifts into a Next.js API layer without rewrite. This decision is recorded in `ATLAS_DECISIONS.md` (D2).

## Known trade-offs

- localStorage caps practical knowledge-library size (~2 MB/file guard, ~5 MB total browser quota) → IndexedDB migration listed on the roadmap.
- Browser CORS reality: Anthropic officially supports browser calls; OpenAI/Google work in practice; xAI/Mistral labelled "browser access untested" in the UI until verified.
- Single-device by design in V1; backups are the sync mechanism until the Cloud Edition.
