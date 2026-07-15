# CODEX HANDOVER — BUILD INSTRUCTIONS
### Round 22 · Source: files 01–10 in this folder · July 2026

## Mission
Convert the completed written package into polished deliverable files. Content is final — do not rewrite substance; formatting, layout and asset generation only. Preserve every VERIFIED/ESTIMATED/ASSUMED/RRV label and every disclaimer verbatim. Deadline priority: presentation + letter first (needed 19 July 2026), everything else after.

## Required outputs

| # | Deliverable | Source | Build notes |
|---|---|---|---|
| 1 | `KAT_LASH_LOCK_ANNIVERSARY_PRESENTATION.pptx` | `09_ANNIVERSARY_PRESENTATION.md` | 28 slides exactly as scripted (title/subtitle/body/speaker notes per slide). 16:9. Fonts: Fraunces (headlines), Inter (body) — embed. Palette: porcelain #FAF5F0, espresso #2B1E1C, blush #F2C9C2, gold #C9A227, sage #AEBBA8. Speaker notes go in the PowerPoint notes pane. Use layout directions per slide; keep ≤80 body words/slide. |
| 2 | `KAT_LASH_LOCK_ANNIVERSARY_PRESENTATION.pdf` | Export of #1 | Include notes-pages version as appendix. |
| 3 | `LASH_LOCK_COMPLETE_BUSINESS_PLAN.pdf` | `01` + `02` + `05` merged, in that order | Cover page (brand style), table of contents, headers/footers, keep all tables; A4. |
| 4 | `LASH_LOCK_90_DAY_ACTION_PLAN.xlsx` | `06_90_DAY_ACTION_PLAN.md` | One sheet per phase + a master sheet. Columns: Task, Owner, Priority, Cost (AUD), Expected output, Completion test, Status (dropdown: Not started/In progress/Done), Date done. Conditional formatting on Status. Second workbook tab: budget tracker mirroring the three budgets in `05`. |
| 5 | `LETTER_TO_KAT.docx` | `10_FOUNDER_LETTER_TO_KAT.md` | A4, generous margins, serif body, no logos — it's a letter, not a brand asset. Leave the bracketed personalisation lines visible for James. |
| 6 | `LASH_LOCK_BRAND_GUIDE.pdf` | `04_BRAND_GUIDE.md` | Styled per its own rules; include swatch chips rendered in true colour; name-scoring table landscape. |
| 7 | `VISUAL_ASSETS/` folder | Briefs in `04` §7 + `08` | Generate via Higgsfield Soul 2.0 (or comparable image model) using the numbered prompts. File naming: `07-04_product-render_v1.png` (brief number_slug_version). Every AI render exports with "concept render" noted in file metadata/companion `.txt`. |
| 8 | `PRODUCT_MOCKUPS/` folder | Prompts 7.4–7.7, 7.11–7.12 + `03` §1.7 | Hero render, kit exploded, pro caddy, flatlay, in-use concept, studio lifestyle. 4:5 and 1:1 crops of each. |
| 9 | `LOGO_CONCEPTS/` folder | Prompts 7.1–7.3 | 3 concepts × (primary, secondary, icon) in espresso, black, porcelain-reverse; PNG + SVG where possible; 24 px legibility check screenshot per concept. |

## Build order
1 → 2 → 5 (anniversary-critical) → 9 → 7/8 → 6 → 3 → 4.

## Hard rules
- No invented facts, numbers, testimonials, or performance imagery presented as real. AI visuals are concepts and stay labelled.
- No trademark symbols beyond ™; never ® (nothing is registered).
- All currency AUD unless quoted otherwise in source.
- Kat-facing materials (1, 2, 5) contain no corporate boilerplate and keep the warm register of the source text.
- Any slide visual not yet generated: use a porcelain placeholder card with the brief number — never a stock photo of a stranger's product.
- Consistency checks before final export: brand = Katch Beauty (provisional) with Lash Lock™ as product; Duo Kit $34.95 / Single $19.95 / Pro Kit $59.95; budgets $594 / ~$2,490 / ~$7,386 within caps $1,000 / $2,500 / $7,500; verdict = GO AFTER VALIDATION; day-60 gate binding. If any generated file contradicts these, the file is wrong, not the plan.
