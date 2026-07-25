# PHOTOGRAPHY & AI-MODEL DIRECTION

Fixes RED_TEAM_AUDIT finding #8 (imagery, 42/100) — the single biggest revenue leak.
This is the art-direction bible + the exact production workflow. Imagery is what makes a
customer's money follow; treat this as non-negotiable spec, not suggestion.

---

## 1. The look (one sentence)

**Warm, low, golden-hour Australian light on real texture — garments shot like objects of
value, people shot mid-life not mid-pose.** If a frame could belong to Aimé Leon Dore or
Vuori, it's right. If it looks like a white-cyclorama catalogue shot, it's wrong.

## 2. Non-negotiable rules

- **Light:** natural, directional, warm (golden hour or soft window light). One dominant
  source. Never flat ring-light. Shadows are allowed and wanted — they ground the garment.
- **Backdrops:** real Gold Coast surfaces — raw concrete, brushed steel, Bone-painted
  render walls, sand, tide-line rock, car parks at dawn. Coastal *infrastructure*, never
  palm-tree postcard.
- **Colour grade:** lifted blacks slightly, warm midtones, restrained. Ink stays rich,
  Bone stays warm-white (never blue-white), Cobalt and Signal pop but are never boosted
  into neon. One LUT across everything for consistency.
- **Framing:** generous negative space. Rule-of-thirds or dead-centre, nothing fussy.
  Garment detail shots get macro depth-of-field (the neck rib, the stitch, the drawcord tip).
- **People:** caught, not posed — walking, sitting, reaching, mid-laugh. Multiple real
  body types (this is a brand promise, not a diversity checkbox). Faces relaxed.
- **Consistency:** every product photographed on the same 3 backdrops, same light window,
  same crop ratios (1:1 grid, 4:5 PDP hero, 9:16 story). Predictability = premium.

## 3. The four shot types every product needs

| Type | Ratio | Purpose | Notes |
|---|---|---|---|
| **Studio/product** | 1:1 | Grid card, honest colour | Garment on a hanger or flat, grounded shadow, Bone/concrete backdrop |
| **On-model hero** | 4:5 | PDP desire shot | Real person, real setting, garment doing its job |
| **Macro detail** | 4:5 or 1:1 | Prove the construction | Neck rib, embroidery, zip garage, drawcord — the "proof" money shot |
| **In-motion / life** | 9:16 | Social, hero video stills | The 18-hour-day uniform in a real moment |

## 4. The AI-model workflow (do this before spending on a photoshoot)

You do **not** need a $3–5k shoot to launch. Photograph the real sample once, let AI put it
on diverse models. Rough cost: **$0.10–$1.00 per image**, whole range on-model for
**under ~$150** vs thousands. Workflow:

1. **Shoot the real garment** — flat-lay OR on a ghost/invisible mannequin, even on a phone,
   in the light described above. Clean, sharp, true colour. This input quality caps the
   output quality — get it right.
2. **Generate on-model images** with a tool below. Prompt the model type, pose, and a
   *real Gold Coast setting* matching §2 (not a generic studio).
3. **Curate hard.** Reject anything with warped logos, wrong garment colour, extra fingers,
   melted text, or "AI sheen." One bad frame breaks trust for the whole brand.
4. **Grade** every keeper through the one LUT for consistency.
5. **Drop into the site** — the store already supports it (see §6).

### Tool shortlist (July 2026)

| Tool | Why | Best for |
|---|---|---|
| **Botika** (botika.io) | Shopify-native, generate in store admin | The default once on Shopify |
| **Modelia** (modelia.ai) | Flat-lay → describe model/background → photo + video | Fast PDP + social |
| **WearView** (wearview.co) | Large diverse model library, ~15s output | Body-diversity promise |
| **FASHN.ai** (fashn.ai) | Strongest garment-on-person realism / try-on | Hero shots, tricky drape |
| **Photoroom** (photoroom.com/tools/virtual-model) | Cheap, simple | Quick volume |

### Hard honesty line (brand-critical)

AI **models** are fine — that's efficient photography of a *real* garment. But per
BRAND_BLUEPRINT §10, **never** AI-generate "customers," reviews, testimonials, or fake UGC.
On-model marketing imagery = yes. Fabricated social proof = never. The moment it's found
out, the honesty positioning — the whole moat — is dead. Label nothing as a real customer
that isn't one. As real UGC and shoots arrive, they *replace* AI models on PDPs.

## 5. When to shoot for real

Move from AI to a real shoot once DROP 001 proves demand (post day-71). Priorities for the
first real shoot: the founder, the "18-hour uniform" hero film, macro construction proof,
and 3–5 real community faces from First Light Club. Budget it into Model-2 profits, phone +
one hired shooter, natural GC locations — no studio hire (COST_CONTROL discipline).

## 6. How the site consumes imagery (already wired)

`store/src/components/GarmentArt.jsx` accepts a `photo` prop. When a product has a real
image it renders that `<img>` (lazy-loaded, object-cover); with no image it falls back to
the art-directed vector studio render. **To go live with real/AI photos:**

1. Add an `images` map to each product in `store/src/data/products.js`, e.g.
   `images: { 'Washed Ink': '/img/heatform-ink.jpg', Bone: '/img/heatform-bone.jpg' }`.
2. Pass `photo={product.images?.[colour]}` where `GarmentArt` is rendered (ProductCard,
   Product gallery, cart, search).
3. Export at: 1:1 grid 1200×1200, 4:5 PDP 1200×1500, 9:16 story 1080×1920. WebP, ≤200KB
   each (SHOPIFY_HANDOFF §7 performance budget). Name `sku-colour-type.webp`.
4. On Shopify, these become the product media; the CSV in `/data/products.csv` maps by SKU.

## 7. Reject list (auto-fail any frame with these)

Blue-white "Bone", neon Cobalt, flat frontal flash, seamless-white cyclorama, palm trees,
posed thumb-in-pocket catalogue stances, warped/duplicated logos, AI hand artefacts,
mismatched garment colour, motion blur on product shots, or anything that looks like stock.
