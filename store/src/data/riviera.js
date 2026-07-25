// THE RIVIERA SET — capsule catalogue, sourced separately from the core TIDESTATE
// range (see docs/RIVIERA_CAPSULE.md). Kept in its own file deliberately: different
// sourcing tier, different claims rules (no COASTFORM/construction language — see
// RIVIERA_CAPSULE.md §5), different margin profile. Additive, not a replacement.
//
// `photo` fields are real AI-generated editorial photography (Higgsfield Soul 2.0),
// hosted on Higgsfield's CDN. PRODUCTION NOTE: before permanent launch, download and
// re-host these as proper store assets (Shopify CDN / your own bucket) rather than
// depending on a third-party generation service's URL staying live indefinitely.

export const RIVIERA_COLOURS = {
  'Ink Stripe': { hex: '#12131a', text: '#F1EEE6', swatch: 'linear-gradient(90deg,#12131a 0 50%,#F1EEE6 50% 100%)' },
  'Terra Weave': { hex: '#b5603c', text: '#F1EEE6' },
  'Tide Check': { hex: '#1747FF', text: '#F1EEE6', swatch: 'linear-gradient(90deg,#1747FF 0 50%,#F1EEE6 50% 100%)' },
};

export const RIVIERA_PRODUCTS = [
  {
    id: 'riviera-stripe',
    sku: 'RV-01',
    name: 'RIVIERA STRIPE SET',
    kind: 'campshirt',
    pattern: 'stripe',
    colour: 'Ink Stripe',
    price: 109,
    shirtPrice: 69,
    shortPrice: 59,
    tagline: 'Breakfast to beach club, one set.',
    short: 'Fine ink/bone stripe camp-collar shirt with tailored matching shorts.',
    description:
      'The easiest set in the capsule: a fine ink-and-bone stripe, camp collar, short sleeve, worn open or buttoned. Tailored shorts to match — not baggy, not tight. Built for the exact sequence your weekend actually runs: breakfast, the pool, lunch somewhere with a view, out again by sunset.',
    details: [
      'Camp collar, short sleeve, chest pocket',
      'Fine ink-navy / bone vertical stripe',
      'Tailored matching short, side-seam pockets',
      'Relaxed-through-body, true-to-size fit',
      'Sold as a set or separately',
    ],
    colours: ['Ink Stripe'],
    fit: 'Relaxed camp-collar shirt, tailored (not baggy) short to just above the knee',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'Ink Stripe': { S: 22, M: 40, L: 40, XL: 24, XXL: 10 } },
    photo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260725_230305_7644c8c8-854e-42c1-859c-9afef3e1b32e.png',
    model: { height: 183, weight: 80, wears: 'M', prefers: 'True to size' },
  },
  {
    id: 'terra-weave',
    sku: 'RV-02',
    name: 'TERRA WEAVE SET',
    kind: 'campshirt',
    pattern: 'solid',
    colour: 'Terra Weave',
    price: 109,
    shirtPrice: 69,
    shortPrice: 59,
    tagline: 'The colour nobody else in this category is wearing.',
    short: 'Solid warm terracotta camp-collar shirt with tailored matching shorts.',
    description:
      "A warm terracotta that reads considered, not costume — the piece that stands out in a category saturated with white and navy stripe. Textured weave look, camp collar, worn open over a plain tee or buttoned for dinner. This is the set that gets a photo taken of it.",
    details: [
      'Camp collar, short sleeve, textured-weave look',
      'Solid warm terracotta',
      'Tailored matching short, side-seam pockets',
      'Relaxed-through-body, true-to-size fit',
      'Sold as a set or separately',
    ],
    colours: ['Terra Weave'],
    fit: 'Relaxed camp-collar shirt, tailored (not baggy) short to just above the knee',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'Terra Weave': { S: 14, M: 28, L: 28, XL: 16, XXL: 6 } },
    photo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260725_230316_cd54a10e-4748-4150-ab76-43da49f07916.png',
    model: { height: 181, weight: 78, wears: 'M', prefers: 'True to size' },
  },
  {
    id: 'tide-check',
    sku: 'RV-03',
    name: 'TIDE CHECK SET',
    kind: 'campshirt',
    pattern: 'check',
    colour: 'Tide Check',
    price: 109,
    shirtPrice: 69,
    shortPrice: 59,
    tagline: 'The capsule\'s signature — ties back to the tide-bar mark.',
    short: 'Micro-check cobalt/bone camp-collar shirt with tailored matching shorts.',
    description:
      'A fine micro-check in TIDESTATE cobalt and bone — the one piece in the capsule that ties directly back to the brand\'s own tide-bar identity. Sharper than a stripe, still relaxed enough for a beach lunch. Buttoned to the top for dinner, open over a tee for everything before it.',
    details: [
      'Camp collar, short sleeve, fine micro-check',
      'Cobalt / bone — the TIDESTATE signature colourway',
      'Tailored matching short, side-seam pockets',
      'Relaxed-through-body, true-to-size fit',
      'Sold as a set or separately',
    ],
    colours: ['Tide Check'],
    fit: 'Relaxed camp-collar shirt, tailored (not baggy) short to just above the knee',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'Tide Check': { S: 12, M: 24, L: 24, XL: 14, XXL: 4 } },
    photo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3GiLJ140oRU6OsglOq1lkwVP0tR/hf_20260725_230318_264da873-15f8-41e8-a191-b4ef342c5905.png',
    model: { height: 182, weight: 79, wears: 'M', prefers: 'True to size' },
  },
];

export const getRiviera = (id) => RIVIERA_PRODUCTS.find((p) => p.id === id);
