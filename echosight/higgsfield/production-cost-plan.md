# Higgsfield Production Cost Plan

Conservative planning figures in AUD. **Status note (truthful):** the Higgsfield toolchain was available earlier in this build session but disconnected before the generation phase; no videos have been generated yet. All 12 packages are complete and marked READY FOR HIGGSFIELD GENERATION. One-step resolution: reconnect the Higgsfield connector (or open higgsfield.ai in a browser) and work through each video folder's `higgsfield-prompts.md` in order.

## Assumptions (labelled, revisit against the live pricing page at generation time)

- Credit costs vary by model/duration/resolution; we plan on a conservative ~A$0.75–1.50 per 3–6s generated shot attempt, and assume **2.5 attempts per shot** on average (first pass + retries for hands/continuity) — the QC loop budget.
- Character reference sheets: ~6 images per character × 2 characters ≈ 12 image generations ≈ A$4–8 once, reused all month.
- Voiceover: recorded by the founder free (recommended for authenticity) or generated — if generated, budget ≈ A$1–2/video.
- Editing (CapCut/DaVinci free tiers): A$0 cash.

## Per-video planning envelope

| Item | Shots | Attempt budget | Est. cost (AUD) |
| --- | --- | --- | --- |
| Typical 6-shot video | 6 | 15 attempts | $11–22 |
| Heavy video (day 10 before/after, 8 shots) | 8 | 20 attempts | $15–30 |
| Light video (day 5 POV, 4 shots) | 4 | 10 attempts | $8–15 |

**Month total (12 videos):** ≈ **A$130–250** in generation credits + A$4–8 references. Each video folder's `cost-estimate.md` carries its own line-item version; treat the range's top end as the budget and stop-loss per video (5-cycle rule: if a shot fails QC after 5 attempts, mark it for real-footage capture instead — phone footage of the founder's actual desk is always the fallback, and often the better choice anyway).

## Cost controls

1. Generate the two reference sheets FIRST; every failed-continuity retry avoided pays for the sheets.
2. Generate hook shots (shot 1) for all 12 videos before generating middles — hooks decide whether a video ships; kill weak concepts before spending on their middles.
3. 3–5s per generation, never 10s takes — cut rhythm comes from the edit.
4. Log every attempt in the folder's `quality-control.md` (attempt #, defect, prompt change) — the 5-cycle rule needs the log.
