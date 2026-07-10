# Print Wrap Cover — Not Yet Buildable (Owner Decisions Required)

Per your own instructions: "calculate the cover only after the final
page count, colour choice and paper choice are locked." Those aren't
locked yet, so building the cover file now would guess at numbers that
directly change the spine width. I'd rather ask than hand you a wrong
file.

## What's blocking the cover file specifically

1. **Trim size is ambiguous.** Earlier project work assumed 8.5 × 8.5
   in. Your latest instructions say "if the final format remains
   8.25 × 8.25 inches." These are two different trim sizes and KDP's
   cover template dimensions differ between them. Which is correct?
2. **Interior page count for spine width.** The book is 32 pages, but
   KDP's spine-width formula depends on the *final* interior page
   count after any print-layout decisions (e.g., whether blank pages
   are added for correct left/right pagination — see the QA report's
   page-numbering section). Right now that's 32; flag if that should
   change.
3. **Paper/colour choice.** You noted "do not use standard colour if
   its minimum page count is not met" — KDP's premium color paper has
   no page-count minimum, but standard color paper requires 72+ pages
   for some trim sizes. At 32 pages, standard color is likely
   unavailable for a square trim regardless — this needs confirming
   against KDP's current page-count rules for your specific trim size,
   which I can't verify without you locking the trim size first.

## What IS ready
- The approved front cover art: `01_MASTER_SOURCE/page-01.jpeg`
- Once trim size, page count, and paper are confirmed, KDP's own
  Cover Calculator (inside your KDP paperback listing) will give the
  exact spine width in inches — I can then build the full wrap
  (front + spine + back) at those exact dimensions, with proper bleed
  and a clean barcode-safe area on the back cover, and no placeholder
  ISBN or barcode.

**This is the one piece I'm treating as a hard "needs owner decision"
rather than guessing** — a wrong spine width produces a cover that
doesn't fit the book when printed.
