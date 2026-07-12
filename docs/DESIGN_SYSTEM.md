# TIDESTATE DESIGN SYSTEM & BRAND BOOK

The single source of truth for how TIDESTATE looks, moves and speaks. If it's not in here,
it's not brand. Fixes RED_TEAM_AUDIT findings #4, #5, #24. Codebase tokens live in
`store/tailwind.config.js` + `store/src/index.css`; this doc is the human-readable law.

---

## 1. Brand idea (the north star)

**Climate-built premium streetwear.** Design language = Australian coastal *infrastructure*:
tide charts, coordinates, road markings, transit signage, sunrise/sunset data. Industrial,
precise, warm. Never surf-souvenir, never US-collegiate, never generic-luxury.
Governing question for every decision: *"If Nike or Aimé Leon Dore made this, is this how?"*

## 2. Colour

| Token | Hex | Role | Usage ceiling |
|---|---|---|---|
| **Ink** | `#090909` | Primary dark ground, type, garments | 40–85% of any surface |
| **Bone** | `#F1EEE6` | Primary light ground, type on dark | 40–85% |
| **Concrete** | `#BFC0BA` | Secondary neutral, dividers, muted type | ≤20% |
| **Cobalt** | `#1747FF` | "Data" accent — CTAs, tide lines, progress | ≤10% |
| **Signal** | `#FF4A1F` | "Alert" accent — drop tags, low stock, numbering | ≤5% |

**Laws:** Ink + Bone carry every layout. Cobalt is the *data* colour, Signal is the
*signal* colour — never at equal weight in one frame. Bone is warm-white; rendering it
blue-white is a bug. Contrast: Ink-on-Bone and Bone-on-Ink both pass WCAG AA; Cobalt/Signal
only for large text or non-text UI. Never introduce a new colour without amending this table.

## 3. Typography

| Role | Face | Weight | Tracking | Case |
|---|---|---|---|---|
| Display / H1–H2 | **Archivo Expanded** | 800 | tight (−0.01em) | UPPERCASE |
| Subhead / H3 | Archivo | 700 | normal | UPPERCASE or Sentence |
| Body / UI | Archivo | 400–500 | normal | Sentence |
| Data / kickers / labels | **Space Grotesk** (mono feel) | 400–700 | wide (0.2–0.3em) | UPPERCASE |

Both **SIL OFL** (free commercial, embeddable). Type scale (rem): 0.69 / 0.75 / 0.81 / 0.875
/ 1 / 1.25 / 1.5 / 2 / 3 / 4.5 / 6+. Rules: display always uppercase + tight; mono for any
number, coordinate, size, price-adjacent label; generous line-height (1.5–1.7) on body;
never justify; never more than two faces in one comp.

## 4. Logo & marks

- **Primary wordmark** (`assets/primary-logo.svg`) — horizontal, with coordinate lockup +
  state-line + tagline. Clear space = cap-height on all sides. Min width 120px digital.
- **Stacked/secondary** (`secondary-logo.svg`) — square, tide-bars over wordmark. Garment
  backs, packaging, social avatar backup.
- **TS monogram** (`monogram.svg`) — embroidery/favicon-scale, pure geometry (font-independent).
- **Breakline icon** (`favicon.svg`) — three falling tide-bars = the hours before first
  light. The most-used flag: caps, app icon, story highlights.
- **Never:** stretch, rotate, recolour outside the palette, add effects/shadows, place on
  busy imagery without a scrim, or reconstruct the wordmark in a different font.

## 5. Motion (codified in index.css)

Motion is **deliberate and restrained** — one system, honoured everywhere, fully disabled
under `prefers-reduced-motion`.

| Token | Value | Use |
|---|---|---|
| `--ease-out-expo` | cubic-bezier(0.16,1,0.3,1) | Reveals, lifts, hovers (the signature ease) |
| `--ease-out-soft` | cubic-bezier(0.22,0.61,0.36,1) | Opacity, page-enter |
| Reveal | fade + 22px rise, 0.8–0.9s | Sections entering viewport (once) |
| Stagger | 60ms steps | Grid children within a revealed group |
| Lift | translateY(−4px) + soft shadow, 0.5s | Cards, tiles on hover |
| Link underline | 0→100% draw, 0.4s | Text links |
| Page-enter | 8px rise + fade, 0.5s | Every route change |
| Scroll-progress | cobalt hairline, top | Quiet premium signal |

**Laws:** nothing bounces, nothing spins gratuitously, no parallax gimmicks, durations
150–900ms only, one thing moves at a time in the eye's focus. Motion rewards scrolling; it
never blocks reading or interaction.

## 6. Layout & space

- Max content width 1152px (`max-w-6xl`); full-bleed only for hero/imagery.
- Section rhythm: 4rem mobile / 6rem desktop vertical padding.
- 4px base grid. Generous margins are a premium signal — when unsure, add space.
- Borders: 1px `ink/10` hairlines for structure; 2px Ink for emphasis blocks.
- Corners: **square by default.** Rounded only for pills/avatars/wallet chips.

## 7. Components (built in `store/src/components`)

Buttons (`Btn`: ink/bone/outline/cobalt), `Kicker`, `H2`, `Section` (auto-reveal),
`TideBars`, `StateLine`, `CountdownBanner` (real events only), `EmailSignup`, `Reveal`,
`ScrollProgress`, `ProductCard`/`ProductGrid`, `CartDrawer`, `Header`/`Footer`, `FitTool`,
`OutfitBuilder`, `GarmentArt` (photo-or-render). Extend this set; don't fork one-off styles.

## 8. Iconography & illustration

Line icons, 2px stroke, square terminals, currentColor. Motifs drawn from infrastructure:
tide-bars, coordinate crosshairs, route strips, signage chips. No cutesy mascots, no
gradients-in-icons, no emoji as brand elements.

## 9. Voice (the words)

Short sentences. Concrete nouns. Millimetres, grams, wash counts — proof over adjectives.
Australian rhythm, no slang cosplay. Founder-personal, never corporate.
**Banned:** "be the best version of yourself", "never give up", "hustle harder", "dream
big", "elevate", "curated", "effortless", "game-changer", "unlock", em-dash-driven hype.
Every claim is checkable. Mistakes are published, not buried.

## 10. Photography

Governed in full by `docs/PHOTOGRAPHY_AND_AI_MODELS.md`. One-liner: warm golden-hour light,
real Gold Coast infrastructure, garments as objects of value, people mid-life not mid-pose,
one LUT across everything.

## 11. Do / Don't (the fast filter)

**Do:** whitespace, warm neutrals, precise data details, restraint, proof, motion that
rewards. **Don't:** neon, drop-shadows on type, stock photos, fake urgency, more than two
fonts, palm trees, rounded-everything, gradient logos, adjective-stacked copy, anything
that looks like a default Shopify theme.
