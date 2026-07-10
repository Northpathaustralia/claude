# ATLAS ONE — System Architecture

## Edition strategy

**V1 = Local Edition** (this codebase): a client-first application. Everything — data, keys, reasoning orchestration — lives in the owner's browser; model calls go directly from the browser to the AI provider the owner connects. Zero servers, zero hosting cost, zero ops burden for a non-technical owner, and it ships as one double-clickable HTML file.

**Cloud Edition** (future phase): Next.js + PostgreSQL + object storage + server-side auth, for multi-device sync, team access, server-side integrations and webhooks. The engine layer below is deliberately UI-and-storage agnostic so it ports.

## Layered design

```
┌──────────────────────────────────────────────────────────┐
│ UI (React + Tailwind)                                    │
│  Atlas shell · Chat · Projects · Studio · Council ·      │
│  Business/Finance centres · NorthPath workspace          │
├──────────────────────────────────────────────────────────┤
│ Stores (React context → localStorage)                    │
│  atlas.v1 (conversations, projects, memory, knowledge,   │
│  artifacts, businesses, finance, usage, activity, keys)  │
│  npaos.v1 (NorthPath leads/tasks/content/partners)       │
├──────────────────────────────────────────────────────────┤
│ Engines (pure JS modules, unit-tested, UI-free)          │
│  orchestrator (mode pipelines) · router · persona ·      │
│  council · memory · knowledge · studio · briefing ·      │
│  markdown (safe renderer) · integrations registry        │
├──────────────────────────────────────────────────────────┤
│ Provider adapters (one streamChat() contract)            │
│  anthropic (official SDK) · openaiCompat (OpenAI/xAI/    │
│  Mistral) · google (Gemini) — injected into engines      │
└──────────────────────────────────────────────────────────┘
```

Key property: **engines never import providers.** `runTurn`/`runCouncil`/`runStudio` receive `callModel` by dependency injection, so the whole intelligence layer is testable offline and the provider layer is swappable (this is also what makes the Cloud Edition port cheap — the engines run identically server-side).

## Turn pipeline

1. Memory commands ("remember/forget/what do you remember") short-circuit locally — never sent to a model.
2. Context assembly: Atlas persona + honesty rules + mode prompt + project instructions + selected memories + retrieved knowledge chunks.
3. Routing: mode tier × router profile × connected providers → model.
4. Execution: single pass (Fast/Smart/…), draft→critique (Deep Think), or plan→council specialists→synthesis (X10). Final pass streams to the UI; an AbortController gives a real Stop.
5. Accounting: token usage + cost estimate recorded to the usage log; meta (model, passes, specialists, knowledge used) attached to the message for the intelligence panel.
6. No provider connected → clearly-labelled Demonstration reply, zero model calls.

## Routing

- Modes: fast(4k tokens) / smart(16k) / deep(32k, 2 passes) / x10(64k, 2+N passes) / research / build(64k) / creative / executive.
- Profiles: Maximum Intelligence, Balanced (default), Low Cost — mapping mode tiers to provider tiers.
- Tiers per provider, e.g. Anthropic: fast→claude-haiku-4-5, balanced→claude-sonnet-5, max→claude-opus-4-8.
- Manual model override supported.

## NorthPath workspace integration

The original NPAOS app is mounted intact under the Atlas shell (routes `/northpath`, `/leads`, `/content`, `/referrals`, `/reports`, `/tasks` unchanged so the operations engine's deep links keep working). Its pure-function AI employees (lead scoring, sales assistant, ops assistant, analyst) also feed the Atlas home briefing and the Business Centre's live NorthPath card.
