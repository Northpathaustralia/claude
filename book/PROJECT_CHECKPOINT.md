# PROJECT CHECKPOINT — The Invisible Backpack
**Saved:** 9 July 2026 · **Last updated: 11 July 2026 — see UPDATE 4** · **Status: production complete pending James's final proof review; Kindle KPF + optional 300DPI upscale are the only outside-environment steps**
**Read this file first. Do NOT restart the project. Do NOT rewrite the story.**

## UPDATE — what got built since the audit
- `book/pages_final/` now holds all 32 pages in correct printed order:
  24 real approved/repaired page images + 8 clearly-labeled
  "ARTWORK PENDING" placeholder pages (23–30) carrying the exact
  approved text, so the story can be read in full sequence.
- `The_Invisible_Backpack_DRAFT_flow_review.pdf` (full quality, ~17.6MB)
  and `..._SMALL.pdf` (~3.9MB, downscaled) — full 32-page flow-review
  PDFs. **These are NOT print-ready or publishable** — 8 pages are
  placeholders, not final art. They exist so the author/editor can see
  the whole book in order and read every word.
- `The_Invisible_Backpack_Final_Manuscript.docx` — the real, verified
  manuscript (all 32 pages' exact approved text, built from this
  checkpoint's table, not the old superseded draft).
- `The_Invisible_Backpack_KDP_Metadata.txt` — rewritten to match the
  real story (no storm). Description, keywords, categories, pricing,
  bio, and an updated launch checklist that names the still-open items.
- `The_Invisible_Backpack_Page_Order.md` — rewritten to reflect the
  real book and current per-page status.
- `BEGINNER_KDP_PUBLISHING_GUIDE.md` — new step-by-step KDP walkthrough
  (account setup, upload, previewer, common errors, paperback proof,
  royalties, pricing, KDP Select, AU tax reminder).
- Two cosmetic fixes applied and verified visually: stray page-number
  numerals removed via inpainting from page 1 (cover) and page 3
  (title page) — both now clean.
- `The_Invisible_Backpack_Final_Manuscript.md` (the old pre-PDF draft)
  is marked SUPERSEDED at the top, not deleted, per no-data-loss rule.

## UPDATE 2 — replacement-art production package built
A full numbered folder structure now exists in `book/`:
`01_APPROVED_EXISTING_PAGES` (copies of the 24 good pages, originals
untouched in `pages_final/`/`pages_fixed/`/`pages_uploaded/`),
`02_PAGES_23_TO_30_ART_BRIEFS` (all 20 required fields per page, for
all 8 pages, in one document), `03_CHARACTER_CONTINUITY` (Pip/Birdie
continuity sheet built only from inspecting approved art, plus a
review checklist), `04_IMAGE_GENERATION_PROMPTS` (copy-paste .txt
prompt+negative-prompt pairs per page), `05_GENERATED_ART_TO_REVIEW`
(currently holds the 8 placeholder images — this is where James's new
generated candidates should land), `06_APPROVED_REPLACEMENT_ART`
(empty, awaiting approvals), `07_FINAL_BOOK_ASSEMBLY` (draft PDF with
an internal-only red warning cover page — "DRAFT FOR STORY FLOW REVIEW
ONLY. NOT FOR PRINTING, SALE OR KDP UPLOAD." — plus `assemble_book.py`,
a reusable script that rebuilds the book from `pages_final/` and
auto-detects whether any placeholders remain), `08_KDP_EXPORTS` (empty
by design, with a README explaining why). `WIX_HANDOVER_NOTE.md` lists
what the separate Wix project will eventually need — nothing has been
sent there.

**Next action for James:** generate the 8 replacement images using the
prompts in `04_IMAGE_GENERATION_PROMPTS/`, drop candidates into
`05_GENERATED_ART_TO_REVIEW/`, review each against
`03_CHARACTER_CONTINUITY/CONTINUITY_REVIEW_CHECKLIST.md`, move
approved ones into `06_APPROVED_REPLACEMENT_ART/` and into
`pages_final/` as `page-23.png` … `page-30.png` (replacing the
placeholders), then re-run `python3 07_FINAL_BOOK_ASSEMBLY/assemble_book.py`
from the `book/` folder — it will detect no placeholders remain and
produce `The_Invisible_Backpack_Master.pdf` automatically. Only then
should the KDP exports in `08_KDP_EXPORTS/` be built.

## UPDATE 3 — Pages 23–30 approved and assembled (10 July 2026)
James supplied genuinely correct replacement art for all 8 pages
(zip: `The_Invisible_Backpack_Pages_23_to_30_Claude_Ready.zip`).
Independently reviewed against the continuity sheet and brief — 8 of 8
passed (2 with minor notes, see `08_QA_REPORTS/QA_REPORT_FULL_BOOK.md`).
Flattened, typeset with the exact verified wording (Liberation Serif,
approximate match to established typography — exact original font
file still unknown), and placed into `pages_final/` and
`01_MASTER_SOURCE/`, replacing all 8 placeholders. **No placeholder
pages remain.** Backup branch
`backup/invisible-backpack-pre-pages23-30-final` (commit `5893178`)
preserves the pre-this-pass state. New proof PDF:
`02_FINAL_PRINT_INTERIOR/THE_INVISIBLE_BACKPACK_FINAL_PROOF_FOR_JAMES_REVIEW.pdf`
(the old draft-with-placeholders PDF was NOT overwritten, per
instruction — both exist side by side).

**Open owner decisions (blocking true print-readiness only, not
Kindle):** page 22's khaki backpack (never actually fixed — conflicts
with "don't alter 1–22" since it was a known defect, not a sign-off),
trim size (8.5in vs 8.25in — inconsistent across instructions), true
300 DPI (current art is 1254×1254, no AI upscaler in this
environment), true print bleed (no page in the whole book, old or
new, has bleed margin built in). Full detail in the QA report.

**No website exists anywhere in this project** — confirmed again by
checking all branches. `06_WEBSITE_FINAL/README.md` explains this and
asks James to confirm whether a separate Wix project exists elsewhere.

**No Kindle Create tool exists in this environment** — sequential
source package built (`04_KINDLE_SOURCE/`), beginner instructions
provided for the manual KCB/KPF step.

## UPDATE 4 — FINAL PRODUCTION PASS COMPLETE (11 July 2026)
Under the master finalization directive: page 22 backpack fully fixed
(body+strap teal, from original art), page 32 Birdie recoloured blue,
pages 23–30 re-typeset in Bitstream Charter (verified closest match),
press-ready bleed interior built (8.625×8.75in verified), full KDP
cover wrap built (spine 0.0751in, 32pp premium colour, 8.5in trim —
documented decision), Kindle source rebuilt, complete static website
package built (NOT deployed), full marketing pack + Teacher Kit DOCX
created, QA REPORT v2 added. Remaining genuine limitations (documented
in QA v2): true-300DPI upscale (needs Real-ESRGAN outside this
environment), KPF (needs Kindle Create on desktop), CMYK/PDF-X (only
for IngramSpark/offset). Nothing published, nothing deployed.

## STILL BLOCKED — the one real dependency (HISTORICAL — resolved by Update 3)
Pages 23–30 need new illustrations. This environment has no image
generation capability, only image editing (recolour, inpaint, crop).
Character species swaps (dog/human/mouse/wallaby-child/teddy-creature
→ echidna; kookaburra/owl/cockatoo → blue bird) cannot be done by
pixel editing — they need to be regenerated by the author's image tool
using the spec already in this file (see "REPLACEMENT PAGE SPEC"
section below) or hand-illustrated. Once those 8 files land in
`book/pages_final/` named `page-23.png` … `page-30.png` (replacing the
placeholders), the build is a re-run of the same assembly script to
produce real KDP/Kindle exports — no other work is blocking.
Page 22's backpack recolour also still has a faint halo — same fix path.

## What this project is
A 32-page square (1254×1254 px) AI-illustrated Australian watercolour children's picture book, *The Invisible Backpack* by James Forycki, being prepared for Amazon KDP (paperback + Kindle). The author is a beginner — explain simply, work honestly, never invent ISBNs/barcodes.

## CRITICAL DECISIONS ALREADY MADE (do not relitigate)
1. **The uploaded PDF is the canonical story and art.** An earlier session drafted a DIFFERENT 32-page manuscript (with a storm scene, "I'm here", etc.). That draft is **SUPERSEDED**. The files `QUALITY_AUDIT_REPORT.md`, `The_Invisible_Backpack_Final_Manuscript.md`, `The_Invisible_Backpack_Page_Order.md`, `The_Invisible_Backpack_KDP_Metadata.txt` in `book/` describe the OLD draft — treat them as historical; their *story content* must not be reimposed on the real book. (The KDP metadata pack's Amazon description references a storm that does not exist in the actual book — it must be rewritten before use.)
2. Copyright page final wording: "Copyright © 2026 James Forycki / Text & concept by James Forycki / First edition • 2026 / All rights reserved." — NO ISBN, NO barcode, NO "Prototype edition".
3. Author name spelling: **Forycki** (as on cover).
4. Koala's solid-teal heavy backpack on printed pages 15–16 vs translucent on 18 was judged an acceptable intentional metaphor (heavier = more visible). Keep.
5. Story has NO storm. Arc: Pip intro → invisible backpacks discovered → Kangaroo light / Birdie tiny / Koala heavy → Pip checks on Koala → Pip helps Wombat (berries) → Pip encourages Birdie (scared to sing) → "Kindness makes backpacks lighter" → Kangaroo's too-bright smile (subtle foreshadow, resolved thematically by final message) → parents page → closing message page.

## FILE LOCATIONS (repo `northpathaustralia/claude`, branch `claude/optimistic-babbage-gr2c3q`, PR #3)
- Source PDF (uploaded, 32 pages, shuffled): `/root/.claude/uploads/ef0b4bb5-af06-51cd-858d-3d1ff803d5c8/43a4f0b3-book_merged_compressed_under_30MB.pdf` (ephemeral — extracted copies are canonical now)
- `book/pages_uploaded/pdfpage-NN.jpeg` — all 32 pages extracted losslessly, in PDF (shuffled) order
- `book/pages_fixed/page-02-copyright-FIXED.png` — copyright page repaired (approved wording, page numeral removed) ✔ good
- `book/pages_fixed/page-32-barcode-removed-PARTFIX.png` — fake ISBN/barcode cleanly patched out ✔ good; Birdie still wrong species (kookaburra) → page still needs re-illustration eventually
- `book/pages_fixed/page-22-teal-recolour-DRAFT.png` — khaki→teal backpack recolour; bag reads teal but a soft teal halo remains around silhouette → NOT print-ready; prefer regeneration, or one more mask-tightening pass

## PDF ORDER → PRINTED PAGE MAPPING (printed number is bottom corner of artwork)
pdf01→31, pdf02→32, pdf03→27, pdf04→28, pdf05→30, pdf06→23, pdf07→26, pdf08→29,
pdf09→24, pdf10→25, pdf11→21, pdf12→22, pdf13→13, pdf14→14, pdf15→15, pdf16→16,
pdf17→17, pdf18→18, pdf19→19, pdf20→20, pdf21→11, pdf22→12, pdf23→4, pdf24→5,
pdf25→6, pdf26→7, pdf27→8, pdf28→9, pdf29→10, pdf30→1, pdf31→2, pdf32→3.
All 32 printed pages present exactly once. No duplicates. No missing pages.

## PER-PAGE STATUS (by printed page number)
| Page | Text (exact, verified) | Status |
|---|---|---|
| 1 | Cover: The Invisible Backpack / subtitle / James Forycki | ✅ KEEP (minor: tiny baked "1" numeral bottom-right) |
| 2 | Copyright | ✅ FIXED — use `pages_fixed/page-02-copyright-FIXED.png` |
| 3 | Title page "Written by James Forycki" | ✅ KEEP (minor: stray comma artifact after "The", tiny "3" numeral) |
| 4 | "For every little heart carrying big feelings." | ✅ KEEP |
| 5 | "In a warm little forest lived a tiny echidna named Pip." | ✅ KEEP |
| 6 | "Pip noticed things others sometimes missed." | ✅ KEEP |
| 7 | "One morning, all the animals walked to the clearing." | ✅ KEEP |
| 8 | "Kangaroo bounced. Koala wandered. Wombat shuffled. Birdie fluttered." | ✅ KEEP |
| 9 | "Then Pip noticed something strange." | ✅ KEEP |
| 10 | "Everyone was carrying a backpack." | ✅ KEEP (background wallaby + cockatoo = acceptable extras) |
| 11 | "Not a backpack you could touch." | ✅ KEEP |
| 12 | "These backpacks were invisible." | ✅ KEEP |
| 13 | "Kangaroo's backpack looked light. She laughed and leaped." | ✅ KEEP |
| 14 | "Birdie's backpack looked tiny. He sang sweet songs." | ✅ KEEP |
| 15 | "But Koala's backpack looked very heavy." | ✅ KEEP |
| 16 | "Koala sat alone under the gum tree. He did not climb. He did not play." | ✅ KEEP |
| 17 | "Pip asked softly, 'Are you okay, Koala?'" | ✅ KEEP (minor: single quotes vs double elsewhere) |
| 18 | "'I think so,' said Koala. But his voice sounded small." | ✅ KEEP (same quote note) |
| 19 | "At lunch, Wombat dropped his berries. They rolled into the dirt." | ✅ KEEP (berries blue here, red on p20 — minor) |
| 20 | "Pip helped pick them up, one by one." | ✅ KEEP |
| 21 | "Thank you," whispered Wombat. "And just like that, his backpack looked a little lighter." | ✅ KEEP |
| 22 | "Pip blinked. 'Kindness makes backpacks lighter,' he whispered to himself." | ⚠️ Pip's backpack khaki-green, not teal. Draft recolour exists; REGENERATE preferred |
| 23 | "Near the river, Birdie sat quietly on a branch. He was not singing." | ❌ REPLACE — Pip drawn as a DOG (red bandana) |
| 24 | "'Why aren't you singing today?' asked Pip." | ❌ REPLACE — Pip = HUMAN BOY, Birdie = KOOKABURRA |
| 25 | "Birdie looked at his little feet. 'Yesterday someone laughed when I sang the wrong note.'" | ❌ REPLACE — Birdie = brown owl-like bird + stray second bird; Pip absent |
| 26 | "Pip climbed onto a rock below him. 'I like your song,' said Pip. 'Even the wobbly parts.'" | ❌ REPLACE — Pip = HUMAN BOY, Birdie = KOOKABURRA |
| 27 | "Birdie looked surprised. Then he sang one tiny note. Tweet." | ❌ REPLACE — Pip drawn as a MOUSE (Birdie correct blue) |
| 28 | "Pip felt something warm grow inside his chest. Maybe helping did not have to be big." | ❌ REPLACE — Pip = clothed WALLABY child (orange t-shirt) |
| 29 | "Then Pip saw Kangaroo. She was bouncing higher than anyone. Boing. Boing. Boing." | ❌ REPLACE — Pip = teddy/dog creature in striped shirt (Kangaroo correct) |
| 30 | "Everyone clapped. 'You're amazing!' called Birdie. 'You're so brave!' said Wombat. Kangaroo's smile was a little too bright." | ❌ REPLACE — Birdie = COCKATOO, Pip missing (young kangaroo w/ bandana instead), Kangaroo has uncanny human-teeth grin |
| 31 | For Parents & Teachers (5 discussion questions + "Small acts of kindness can make a big difference.") | ✅ KEEP |
| 32 | "We may not see what someone is carrying, but we can always choose to be kind." | ⚠️ Fake ISBN/barcode REMOVED in `pages_fixed`; Birdie still kookaburra → regenerate when possible |

## REPLACEMENT PAGE SPEC (for regenerating 22–30, 32)
Style for every regen: gentle premium Australian-bush watercolour, cream/gold/eucalyptus palette, soft light, uncluttered; text large dark-brown serif, exact wording from table above, same placement pattern (text block top-left/top-centre), printed page number bottom-right corner.
Characters: **Pip** = small brown echidna, cream-brown fur, natural brown spikes, large expressive brown eyes, SOLID TEAL backpack with gold button; **Birdie** = small blue bird (blue back/wings, pale cream chest) with faint white-dashed translucent backpack outline; **Wombat** = round brown, translucent backpack outline; **Kangaroo** = warm golden-brown female, friendly natural muzzle smile (no human teeth), translucent backpack; **Koala** = grey, gentle. NO humans, dogs, mice, kookaburras, cockatoos-as-Birdie, clothing, ISBNs, barcodes.
Match reference pages: Pip as on printed 5/6/9; Birdie as on printed 8/14; scene continuity: 23–27 at the river gum tree; 28 bush path golden light; 29–30 clearing.

## REMAINING TASK LIST (in order)
1. Author to regenerate the 9–10 replacement illustrations (23–30, 32, ideally 22) with his image tool using the spec above, at **2550×2550 px if possible** (see resolution note), and drop them into `book/pages_final/` named `page-NN.png` — OR author approves shipping Kindle-first with a smaller fix set.
2. Assemble `book/pages_final/` = fixed p2 + kept pages + replacements, in printed order 1–32.
3. Build deliverables: Master PDF, KDP paperback interior PDF (8.5×8.5 in; pages 4–31 as interior; cover page 1 & closing page 32 handled per KDP cover flow), separate KDP wraparound cover (front = p1 art, back = p32-style art SPACE for KDP's own barcode bottom-right — leave that corner clear), fixed-layout Kindle file (PDF + EPUB3 fixed-layout), preview PDF, compressed share PDF.
4. Rewrite Amazon description/metadata to match the REAL story (no storm). Keep: no ISBN for Kindle; KDP assigns free ISBN for paperback.
5. Publishing guide + 30-day organic marketing plan (started in old metadata file; needs revision pass).

## RESOLUTION NOTE (print)
Current pages are 1254×1254 px = ~147 DPI at 8.5×8.5 in. Fine for Kindle. KDP paperback accepts it with a quality warning — print will be slightly soft. Ideal: regenerate/upscale all pages to 2550×2550 (300 DPI). Bleed: art is full-square; for KDP full-bleed interior, export at 8.625×8.75 in canvas per KDP spec or submit no-bleed 8.5×8.5. Decide at build time; no crop marks ever.

## TOOLING THAT WORKS IN THIS ENVIRONMENT
`pymupdf (fitz)`, `pypdf`, `img2pdf`, `opencv-python-headless`, `numpy`, `PIL`, `poppler-utils` installed. No image *generation* capability — replacements must come from the author's tool. Repair scripts patterns: see git history of this branch (hue-shift recolour, Telea inpaint rejected for large areas, feathered patch-copy worked for barcode).
