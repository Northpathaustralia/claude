// TIDESTATE catalogue — single source of truth for the prototype.
// Mirrors /data/products.csv (Shopify import) and docs/PRODUCT_RANGE.md.
// Stock numbers are honest prototype inventory; the UI only surfaces counts ≤ 10.

import { RIVIERA_PRODUCTS } from './riviera.js';

export const COLOURS = {
  'Washed Ink': { hex: '#1d1d1b', text: '#F1EEE6' },
  Bone: { hex: '#F1EEE6', text: '#090909' },
  Cobalt: { hex: '#1747FF', text: '#F1EEE6' },
  'Signal Orange': { hex: '#FF4A1F', text: '#090909' },
  'Ink/Cobalt': { hex: '#12122a', text: '#F1EEE6', accent: '#1747FF' },
  'Bone/Concrete': { hex: '#E9E5DA', text: '#090909', accent: '#BFC0BA' },
};

export const PRODUCTS = [
  {
    id: 'heatform-tee',
    sku: 'TS-T01',
    name: 'HEATFORM TEE',
    kind: 'tee',
    price: 89,
    drop: 'first-light',
    tagline: 'Heavyweight look. Warm-climate physics.',
    short: '240gsm compact-knit oversized tee. Pre-shrunk, enzyme washed, reinforced neck.',
    description:
      'Our answer to the oversized tee that can’t handle an Australian summer. 240gsm compact-knit cotton gives it heavyweight drape; the open knit structure and pre-shrunk, enzyme-washed finish keep it wearable at 30 degrees and the same shape at wash thirty. Reinforced neck rib, taped shoulders, side-seamed so it never twists.',
    details: [
      '240gsm compact-knit combed cotton',
      'Pre-shrunk — size L stays size L',
      'Enzyme washed for broken-in hand feel',
      'Reinforced 2cm neck rib, shoulder-to-shoulder tape',
      'Internal Bone half-moon collar panel',
      'Side-seamed, anti-twist construction',
      'Tide-table back graphic · chest wordmark',
    ],
    gsm: 240,
    fit: 'Boxy oversized — size down for a regular fit',
    colours: ['Washed Ink', 'Bone', 'Cobalt'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'Washed Ink': { XS: 12, S: 50, M: 60, L: 60, XL: 40, XXL: 14 },
      Bone: { XS: 10, S: 40, M: 50, L: 50, XL: 30, XXL: 9 },
      Cobalt: { XS: 0, S: 8, M: 35, L: 35, XL: 6, XXL: 0 },
    },
    measurements: {
      cols: ['Half chest', 'Length', 'Shoulder', 'Sleeve'],
      rows: {
        XS: [55, 68, 52, 22], S: [58, 70, 54, 22.5], M: [61, 72, 56, 23],
        L: [64, 74, 58, 23.5], XL: [67, 76, 60, 24], XXL: [70, 78, 62, 24.5],
      },
    },
    model: { height: 184, weight: 82, chest: 101, waist: 84, wears: 'L', prefers: 'Relaxed' },
    styling: { mens: 'With the TRANSIT short and cap — the daytime uniform.', womens: 'Size M worn oversized with bike shorts, or S French-tucked.' },
  },
  {
    id: 'transit-short',
    sku: 'TS-S01',
    name: 'TRANSIT SHORT',
    kind: 'short',
    price: 119,
    drop: 'first-light',
    tagline: 'Pool to lunch to training. Phone stays put.',
    short: '320gsm terry short with secure zip phone pocket and metal-tipped drawcord.',
    description:
      'Built for days that don’t stay in one place. 320gsm enzyme-washed loopback terry with real structure, a relaxed straight cut that reads intentional rather than “gym”, and the detail that sells it: a zipped, phone-sized pocket that keeps your phone secure from the carpark to the flight.',
    details: [
      '320gsm loopback terry (80/20 cotton-rich)',
      'Zip phone pocket, right hip, 17×9cm',
      'Metal-tipped flat drawcord',
      'Bar-tacked stress points',
      'Hidden waistband coin pocket',
      'Tonal TS monogram embroidery at hem',
    ],
    gsm: 320,
    fit: 'Relaxed straight, mid-thigh (17cm inseam in M)',
    colours: ['Washed Ink', 'Bone'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'Washed Ink': { XS: 8, S: 35, M: 45, L: 45, XL: 25, XXL: 7 },
      Bone: { XS: 0, S: 12, M: 30, L: 30, XL: 10, XXL: 0 },
    },
    measurements: {
      cols: ['Waist (relaxed)', 'Hip', 'Inseam', 'Leg opening'],
      rows: {
        XS: [34, 58, 16, 32], S: [36, 61, 16.5, 33], M: [38, 64, 17, 34],
        L: [40, 67, 17.5, 35], XL: [42, 70, 18, 36], XXL: [44, 73, 18.5, 37],
      },
    },
    model: { height: 184, weight: 82, chest: 101, waist: 84, wears: 'M', prefers: 'True to size' },
    styling: { mens: 'HEATFORM tee on top; AFTERDARK over the shoulders for the flight.', womens: 'High-rise sits naturally; pairs with a cropped HEATFORM in S.' },
  },
  {
    id: 'afterdark-hoodie',
    sku: 'TS-H01',
    name: 'AFTERDARK HOODIE',
    kind: 'hoodie',
    price: 179,
    drop: 'first-light',
    tagline: 'Structure you can feel. A hood that stands.',
    short: '420gsm structured hoodie. Double-layer hood, ribbed side panels, embroidered.',
    description:
      '420gsm of structure. A double-layer hood that stands on its own, ribbed side panels that keep the boxy shape boxy, and a brushed fleece interior for 5am starts and 11pm flights. Embroidered, not printed. Pre-shrunk, enzyme washed, built to be the hoodie you reach for for years.',
    details: [
      '420gsm brushed-back French terry, 100% cotton face',
      'Double-layer self-fabric hood with collar stand',
      'Ribbed side panels for shape retention',
      'Kangaroo pocket with interior phone sleeve',
      'Tonal embroidered wordmark · signal chip on hood',
      'Pre-shrunk + enzyme washed',
    ],
    gsm: 420,
    fit: 'Structured oversized — true to size',
    colours: ['Washed Ink', 'Bone'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'Washed Ink': { XS: 6, S: 25, M: 35, L: 35, XL: 20, XXL: 5 },
      Bone: { XS: 0, S: 10, M: 20, L: 15, XL: 8, XXL: 0 },
    },
    measurements: {
      cols: ['Half chest', 'Length', 'Shoulder', 'Sleeve'],
      rows: {
        XS: [60, 66, 56, 54], S: [63, 68, 58, 55], M: [66, 70, 60, 56],
        L: [69, 72, 62, 57], XL: [72, 74, 64, 58], XXL: [75, 76, 66, 59],
      },
    },
    model: { height: 178, weight: 74, chest: 96, waist: 79, wears: 'M', prefers: 'Relaxed' },
    styling: { mens: 'Over the full uniform for flights and first light.', womens: 'Worn as a dress-length layer in M with the BREAKLINE cap.' },
  },
  {
    id: 'breakline-cap',
    sku: 'TS-C01',
    name: 'BREAKLINE CAP',
    kind: 'cap',
    price: 54,
    drop: 'first-light',
    tagline: 'Three bars. Falling tide. First light.',
    short: 'Garment-washed heavy twill cap. Raised breakline embroidery, metal buckle.',
    description:
      'The BREAKLINE Cap carries the mark: three bars, falling tide — the hours before first light. Heavy garment-washed twill that already feels like your favourite cap, a firm pre-curved peak, metal closure. The quiet flag of the uniform. Signal Orange is a numbered run of 150.',
    details: [
      '285gsm garment-washed heavy cotton twill',
      'Raised breakline embroidery (front) · wordmark (rear)',
      'Pre-curved firm-flex peak',
      'Sliding metal buckle, embroidered eyelets',
      'Signal Orange: numbered edition of 150',
    ],
    gsm: 285,
    fit: 'One size — 56–60cm adjustable',
    colours: ['Washed Ink', 'Bone', 'Signal Orange'],
    sizes: ['OS'],
    stock: {
      'Washed Ink': { OS: 80 },
      Bone: { OS: 70 },
      'Signal Orange': { OS: 150 },
    },
    measurements: {
      cols: ['Crown circumference', 'Peak length', 'Crown height'],
      rows: { OS: ['56–60 (adjustable)', 7, 10] },
    },
    model: { height: 178, weight: 74, chest: 96, waist: 79, wears: 'OS', prefers: '—' },
    styling: { mens: 'Every outfit in the range. That’s the point.', womens: 'Washed Ink with Bone tee; orange as the statement.' },
  },
  {
    id: 'airline-jersey',
    sku: 'TS-J01',
    name: 'AIRLINE JERSEY',
    kind: 'jersey',
    price: 129,
    drop: 'first-light',
    tagline: 'A jersey for no team. Plate 001.',
    short: 'Breathable 180gsm piqué jersey. Transit livery, flatlock seams, mesh gussets.',
    description:
      'The AIRLINE Jersey runs on coastal-transit energy: cobalt speed block, route codes, race-plate 001 — a jersey for no team but ours. 180gsm breathable piqué with mesh gussets and flatlock seams, so it works at the gym, the race, the airport and the table afterwards.',
    details: [
      '180gsm recycled-poly piqué mesh',
      'Flatlock seams · breathable underarm gussets',
      'Stitched twill wordmark appliqué',
      'Route strip: GC · BNE · SYD · MEL',
      'Race plate 001 · side vents',
    ],
    gsm: 180,
    fit: 'Relaxed unisex, drop shoulder',
    colours: ['Ink/Cobalt', 'Bone/Concrete'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'Ink/Cobalt': { XS: 5, S: 25, M: 35, L: 35, XL: 20, XXL: 4 },
      'Bone/Concrete': { XS: 0, S: 8, M: 20, L: 15, XL: 6, XXL: 0 },
    },
    measurements: {
      cols: ['Half chest', 'Length', 'Shoulder', 'Sleeve'],
      rows: {
        XS: [56, 70, 53, 23], S: [59, 72, 55, 23.5], M: [62, 74, 57, 24],
        L: [65, 76, 59, 24.5], XL: [68, 78, 61, 25], XXL: [71, 80, 63, 25.5],
      },
    },
    model: { height: 184, weight: 82, chest: 101, waist: 84, wears: 'L', prefers: 'Relaxed' },
    styling: { mens: 'TRANSIT short + cap for the full transit look.', womens: 'Half-tucked over bike shorts; sleeves cuffed once.' },
  },
];

export const BUNDLES = [
  {
    id: 'double-tee', name: 'DOUBLE TEE', items: ['heatform-tee', 'heatform-tee'],
    solo: 178, price: 160, blurb: 'Two HEATFORMs. Rotate them and both last twice as long.',
  },
  {
    id: 'tee-cap', name: 'TEE + CAP', items: ['heatform-tee', 'breakline-cap'],
    solo: 143, price: 130, blurb: 'The entry uniform: HEATFORM + BREAKLINE.',
  },
  {
    id: 'first-light-uniform', name: 'FIRST LIGHT UNIFORM', items: ['heatform-tee', 'transit-short', 'breakline-cap'],
    solo: 262, price: 235, blurb: 'Tee, short, cap — the full daytime state.',
  },
  {
    id: 'full-state', name: 'FULL STATE', items: ['heatform-tee', 'transit-short', 'afterdark-hoodie', 'breakline-cap'],
    solo: 441, price: 390, blurb: 'First light to late night. Everything but the jersey.',
  },
];

// Drop configuration — countdown may only point at a REAL event and can be disabled.
export const DROP = {
  id: 'first-light',
  name: 'DROP 001: FIRST LIGHT',
  countdownEnabled: true,
  // Prototype value: public launch datetime (AEST). Set countdownEnabled=false to hide.
  launchesAt: '2026-09-01T06:00:00+10:00',
  vipNote: 'VIP list gets 48 hours of early access before this goes public.',
};

export const FREE_SHIPPING_THRESHOLD = 150;

export const fmt = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);

// Merged with the Riviera capsule catalogue (docs/RIVIERA_CAPSULE.md) so both
// resolve through the same cart/checkout lookup. riviera.js does not import this
// file, so this stays a one-way, non-circular dependency.
export const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || RIVIERA_PRODUCTS.find((p) => p.id === id);
export const stockFor = (p, colour, size) => p?.stock?.[colour]?.[size] ?? 0;
export const totalStock = (p) =>
  Object.values(p.stock).reduce((a, sizes) => a + Object.values(sizes).reduce((x, y) => x + y, 0), 0);

export const JOURNAL = [
  {
    id: 'why-five-products', date: '2026-07-01', tag: 'THE BUILD',
    title: 'Five products. That’s the whole launch.',
    excerpt: 'Everyone said launch with thirty. Here’s why DROP 001 is five pieces, and why each one had to fight for its place.',
    body: 'A range is a promise you have to keep in every size, every colour, every restock. Thirty products means thirty promises kept badly. Five means every seam gets argued over. HEATFORM earned its place by surviving three wash tests. TRANSIT earned it with a zip pocket we re-patterned twice. The hoodie almost didn’t make it — the first hood collapsed like a wet paper bag, and we binned six weeks of work. That’s the standard. The range grows when a sixth product beats one of these five.',
  },
  {
    id: 'the-8mm-argument', date: '2026-06-18', tag: 'CONSTRUCTION',
    title: 'We argued for three weeks over eight millimetres.',
    excerpt: 'Neck ribs fail first. The difference between ours and the one on your dead tee is 8mm and a strip of tape.',
    body: 'Most tees use a 12mm rib because it’s cheap and fast. Ours is 20mm with elastane recovery and shoulder-to-shoulder taping. The extra 8mm is where the recovery lives — it’s why the collar sits flat at wash thirty instead of flaring like a lettuce leaf. It costs more per unit. You can see exactly where the money went, which is the whole idea.',
  },
  {
    id: 'designed-at-28-south', date: '2026-06-02', tag: 'CLIMATE',
    title: 'Australian streetwear is designed for Melbourne. We live at 28° south.',
    excerpt: 'Why “climate-built” isn’t a slogan — it’s a fabric decision you can feel in February.',
    body: 'Heavyweight streetwear reads premium because of drape and structure. The usual way to get it is dense, hot fabric — fine in a Melbourne winter, brutal in a Gold Coast summer. COASTFORM goes the other way: compact-knit yarns for structure, an opener knit for airflow, enzyme washing for hand feel. Heavyweight look, warm-climate physics. That’s the category we’re building: climate-built premium streetwear.',
  },
];

export const FAQS = [
  { q: 'When does DROP 001 ship?', a: 'Orders ship from the Gold Coast within 1–2 business days. Express available at checkout. VIP early-access pre-orders show their exact dispatch date on the product page and in checkout — no vague promises.' },
  { q: 'Is shipping free?', a: 'Free standard shipping Australia-wide over $150. Under $150 it’s a flat $9.95. International: calculated at checkout as we open regions.' },
  { q: 'What if my size is wrong?', a: 'First exchange is free for first-time customers — we send the new size with a prepaid return label. Use the fit tool and the exact garment measurements on every product page to get it right first go.' },
  { q: 'What is your returns policy?', a: '30 days change-of-mind on eligible full-price items (unworn, tags on), plus your Australian Consumer Law rights on faulty items, always.' },
  { q: 'Is it unisex?', a: 'Yes. Every piece is cut on a unisex block and fitted on real bodies of both. The men’s and women’s pages show the same products styled differently, with model measurements listed.' },
  { q: 'What does “climate-built” actually mean?', a: 'Construction choices for warm Australia: compact-knit structure instead of dense hot fabric, pre-shrunk and enzyme-washed, breathable panels where they matter. It’s a construction standard (COASTFORM), not a technology claim.' },
  { q: 'Are your stock counts real?', a: 'Yes. We only show a number when it’s true, and we never run fake countdowns or fake sales. If it says 12 left, there are 12 left.' },
  { q: 'Do you restock?', a: 'Core pieces restock; numbered editions (like the Signal Orange cap) don’t. Hit “Notify me” on any sold-out size and you’ll get first access when it returns.' },
];
