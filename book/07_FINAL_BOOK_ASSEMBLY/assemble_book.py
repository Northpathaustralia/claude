#!/usr/bin/env python3
"""
Rebuilds the full 32-page book PDF from book/pages_final/.

Run this again after real artwork for pages 23-30 (and the page-22
recolour and page-32 Birdie fix) has been dropped into pages_final/
as page-23.png ... page-30.png (replacing the *-PLACEHOLDER.png files).

Usage (from the book/ folder):
    python3 07_FINAL_BOOK_ASSEMBLY/assemble_book.py
"""
import glob
import re
import img2pdf

files = {}
for f in glob.glob("pages_final/page-*"):
    m = re.search(r"page-(\d+)", f)
    files[int(m.group(1))] = f

missing = [i for i in range(1, 33) if i not in files]
placeholders = [i for i in range(1, 33) if i in files and "PLACEHOLDER" in files[i]]

if missing:
    print(f"ERROR: missing pages {missing} — cannot assemble. Fix pages_final/ first.")
    raise SystemExit(1)

ordered = [files[i] for i in range(1, 33)]

if placeholders:
    print(f"WARNING: pages {placeholders} are still placeholders.")
    print("This build is NOT print-ready. Producing a labelled draft only.")
    out_name = "07_FINAL_BOOK_ASSEMBLY/The_Invisible_Backpack_DRAFT_flow_review_v2.pdf"
    ordered = ["07_FINAL_BOOK_ASSEMBLY/_warning_cover.png"] + ordered
else:
    print("All 32 pages are real artwork. Producing the clean master PDF.")
    out_name = "07_FINAL_BOOK_ASSEMBLY/The_Invisible_Backpack_Master.pdf"

with open(out_name, "wb") as out:
    out.write(img2pdf.convert(ordered))

print(f"Wrote {out_name} ({len(ordered)} pages)")
