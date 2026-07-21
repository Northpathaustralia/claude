# Anti-AI Content Checklist

Release gate for every major written asset (web page, video script, carousel, email). An asset ships only when every line is checked. Applied to all Phase 4–7 outputs of this cycle; spot-check evidence in `qa/test-results.md`.

## The checklist

- [ ] Sentence lengths vary (read aloud test: no metronome rhythm, no three same-shaped sentences running).
- [ ] Transitions are earned, not "Moreover/Furthermore/In today's landscape."
- [ ] At least one concrete example with a specific number or scenario per major section.
- [ ] Uses at least two phrasings from the customer language bank where audience-facing.
- [ ] Zero words from the prohibited list (brand-system-v2) — grep-checkable.
- [ ] No "AI will transform/revolutionise" framing anywhere.
- [ ] Jargon only where the audience uses it themselves (hook, retention = fine; "multimodal inference" = product docs only).
- [ ] No testimonial or quote that isn't clearly labelled as an example scenario (until real, consented case studies exist).
- [ ] Every claim maps to a claim-register row with status VERIFIED, QUALIFIED, DEMO ONLY, or ESTIMATE.
- [ ] No conclusion paragraph that merely restates the page.
- [ ] Bullets only where enumeration genuinely beats prose.
- [ ] One honest limitation stated somewhere on the page/script (the "honest aside").
- [ ] CTA follows verb+outcome formula and links somewhere real.
- [ ] Read-aloud test passed: could a sharp human have plausibly written this exact text?

## Grep-check pattern (used in QA)

`revolutionary|game.chang|cutting.edge|supercharge|unleash|unlock your|10x your|guaranteed|seamless|empower|fast-paced world|look no further|Imagine a world` → must return zero hits on public assets. (The pattern list lives here as source of truth; QA runs it verbatim.)
