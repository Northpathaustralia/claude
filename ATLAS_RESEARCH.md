# ATLAS_RESEARCH — ATLAS ONE

Findings that shaped V1 (sources: current Anthropic API reference at build time, provider docs, and the existing codebase).

## AI provider layer

- **Anthropic (July 2026):** current models `claude-opus-4-8` ($5/$25 per MTok), `claude-sonnet-5` ($3/$15), `claude-haiku-4-5` ($1/$5); 1M context on Opus/Sonnet tiers. Current models **reject** `temperature/top_p/top_k` and `budget_tokens`; adaptive thinking is `thinking:{type:'adaptive'}` with `display:'summarized'` to receive readable reasoning summaries. Streaming via SDK `messages.stream` + `finalMessage()`; usage fields include cache tokens (summed into our accounting). Direct browser access is officially supported (`dangerouslyAllowBrowser`), which is what makes the serverless Local Edition legitimate rather than a hack.
- **OpenAI-compatible surface** (`/chat/completions` + SSE) is shared by OpenAI, xAI and Mistral → one adapter serves three providers; OpenAI wants `max_completion_tokens` + `stream_options.include_usage`, the others take `max_tokens`. Browser CORS: OpenAI and Google work in practice; xAI/Mistral unverified → labelled "browser access untested" in the UI rather than assumed.
- **Gemini:** `v1beta/models/{model}:streamGenerateContent?alt=sse` with `systemInstruction`, `contents[role:user|model]`, `usageMetadata` on the final chunk; key via `x-goog-api-key` header.

## Retrieval

TF×rarity scoring with phrase bonus over ~1200-char overlapping chunks is honest and effective at V1 scale (tested: correct doc ranks first on natural questions). Embeddings deferred: they'd add a network dependency + cost per upload and imply "semantic" quality we can't verify offline — revisit with the web-research phase.

## Voice

Web Speech API: recognition (Chromium; may use vendor speech service — disclosed) + synthesis (universal). en-AU voices selected when present. Wake word requires local detection (Porcupine-class WASM) to honour "never secretly record" — deferred, not faked.

## Compliance/safety posture carried over from NPAOS

The compliance guard (no guaranteed-outcome language, educational disclaimers, nothing auto-sent) already existed and remains active in the NorthPath workspace; ATLAS persona rules extend the same stance platform-wide (confidence labels, no invented facts, financial-safety language).

## Open questions (tracked on roadmap)

xAI/Mistral CORS verification; best local PDF text extraction (pdf.js worker size vs single-file build); search-API choice for Research mode (Brave vs Tavily pricing/latency); IndexedDB migration pattern that preserves one-file export.
