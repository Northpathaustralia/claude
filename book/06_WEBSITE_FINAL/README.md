# Website — Complete Static Site Package

**Status:** Built and ready to deploy. Not deployed anywhere yet — per
instructions, nothing goes live without James's approval.

## History (honest record)
No prior website existed anywhere in this repository or its branches —
this was verified three separate times across the project. The
instruction to "continue the existing website" could not be executed
because there was nothing to continue. Under the final production
directive ("If nothing exists: create a complete website package"),
this package was built new.

## What's in `site/`
- `index.html` — single-page site: hero with cover, "peek inside"
  (4 approved preview pages + the closing quote), character section,
  Parents & Teachers section (curriculum-connected wording — NOT
  "curriculum approved"), About the Author, FAQ, Contact
- `privacy.html`, `terms.html` — legal/trust pages
- `assets/` — compressed web images (print masters untouched),
  including `og-image.jpg` for social sharing previews

## Design/content decisions (documented)
- Purchase button reads **"Coming soon to Amazon"** and is
  deliberately not a link — no fake purchase links, per instructions.
  Swap in the real Amazon URL after publication.
- Contact is a `mailto:` to james@northpath.com.au — no backend, no
  form, nothing to break, no personal-data handling obligations.
- Only 4 interior pages + cover are previewed (within the 3–5 page
  limit set earlier; the complete book is not exposed online).
- No reviews (none exist yet), no ISBN, no fake anything.
- Mobile responsive (flex/grid + clamp), semantic headings, alt text
  on every image, high-contrast palette drawn from the book itself.

## How to deploy (beginner steps)
**Option A — Netlify (easiest, free):**
1. Go to https://app.netlify.com/drop
2. Drag the whole `site/` folder onto the page
3. Done — you get a live URL immediately (you can rename it in Site
   settings, or connect a custom domain like theinvisiblebackpack.com.au)

**Option B — GitHub Pages:**
1. Create a new repository (e.g. `invisible-backpack-site`)
2. Upload the contents of `site/` to it
3. Settings → Pages → deploy from branch `main`, folder `/ (root)`
4. Your site appears at `https://<username>.github.io/invisible-backpack-site/`

**After the book goes live on Amazon:** edit `index.html`, find the
"Coming soon to Amazon" button, and replace it with:
`<a class="btn" href="YOUR-AMAZON-URL">Buy on Amazon</a>`
(also update the FAQ answer about where to buy).
