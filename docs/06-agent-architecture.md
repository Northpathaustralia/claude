# ATLAS ONE — Agent Architecture

## The Executive Decision Council (shipped, Working)

18 specialists defined in `src/atlas/council.js`, each with a role, skill set, and a
prompt that demands: concrete recommendations, discipline-specific risks, expected
disagreements, and a confidence label. COUNSEL and PSYCHOLOGIST carry mandatory
professional disclaimers.

ATLAS · FORGE (engineering) · SAGE (research) · PULSE (marketing) · VAULT (finance) ·
MUSE (writing) · ORBIT (projects/ops) · SENTINEL (security/quality) · COUNSEL (legal risk) ·
VISION (innovation) · ANALYST (data) · NEGOTIATOR · INVESTOR · PSYCHOLOGIST (behaviour) ·
ECONOMIST · GROWTH · OPERATOR · ARCHITECT (systems).

### Selective activation

`selectSpecialists(task)` scores keyword relevance and convenes at most 5 specialists
(+ Atlas). Substantial tasks with no keyword signal get the core business set
(SAGE, VAULT, ORBIT, SENTINEL). The directive's rule — never activate everyone
unnecessarily — is enforced in code, and the UI previews who will convene before spending tokens.

### Execution

- **Council page / X10 mode:** each specialist runs as a real, separate model pass with its own system prompt; Atlas then synthesises a decision brief with required sections (Executive Summary, Consensus, Evidence, Minority Opinions, Trade-offs, Risks, Opportunities, Recommended Action + confidence, Alternative, Next Step). Individual analyses stay inspectable in the UI.
- **Build/Creative modes:** lightweight persona overlay (FORGE / PULSE+MUSE) without full council cost.
- Hidden reasoning is never dumped verbatim; the model's summarized thinking is available in the intelligence panel, and the council output is a structured decision summary.

## Orchestration contracts

```js
runTurn({message, history, mode, settings, project, memories, chunks, onDelta, onStage, signal}, {callModel})
runCouncil({question, settings, onStage, onDelta, signal}, {callModel})
runStudio({engineId, brief, settings, onDelta, signal}, {callModel})
```

`callModel` is injected → agents are provider-independent and offline-testable (mocked in `tests/atlasOrchestrator.test.js`).

## Roadmap

- Parallel specialist passes (Promise.all) once per-provider rate-limit handling lands.
- Tool-using agents (knowledge search / NorthPath data as callable tools) via Anthropic tool-runner — the local stores already expose pure functions ready to become tools.
- Persistent per-specialist memory of prior positions per project.
- Cloud Edition: council passes move server-side unchanged (same engine module).
