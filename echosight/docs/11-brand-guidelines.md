# EchoSight AI — Brand Guidelines & Design System

Council owners: Brand Strategist, Senior UI Designer, Copywriter, CRO Expert.

---

## 1. Name

**EchoSight** — "echo" (the audience's response coming back) + "sight" (finally seeing why). Domain target: `echosight.ai` (**ASSUMPTION:** available/acquirable; verify). **Open action (blocking launch):** trademark clearance search AU/US/EU/UK, Nice classes 9, 35, 42. Fallback shortlist (pre-screened for pronounceability + .ai availability check needed): **Resonara**, **Clarivue**, **Signalcraft**.

## 2. Positioning & messaging

- **Category:** Content Intelligence (we name the category; "analytics" is the old thing).
- **One-liner:** *Know why. Before you post.*
- **Value pillars:** ① Understand (why content performs) ② Predict (before publishing) ③ Improve (exact next actions) ④ Create (evidence-based generation) ⑤ Trust (compliance-first — "we will never claim to show you who saved your post; no one legitimately can").
- **Voice:** a brilliant strategist who respects your time — confident, specific, numerate, never hypey. Says "we don't know yet" when confidence is low. Australian-English spelling in AU-market copy; US English on global site.
- **Tone rules:** verbs over adjectives; numbers with context ("3.1× your median", never bare "great"); no growth-hack slang ("hack", "explode", "go viral overnight" banned); honesty phrases encouraged ("estimate", "confidence", "based on N posts").

## 3. Visual identity

- **Logo concept:** wordmark "echosight" (lowercase, Inter Display SemiBold, custom 'o' rendered as a concentric echo-ring glyph that doubles as the app icon). Clear-space = height of the 'e'; min size 24px; mono + reversed variants. (Concept spec — production vectors are a design-phase deliverable.)
- **Iconography:** 1.5px stroke, rounded joins, 24px grid (Lucide-compatible so the product ships consistent from day one).
- **Illustration style:** data-as-light — dark fields with luminous signal lines/particles; no mascots, no isometric clip-art.
- **Photography:** real creators mid-process (not stock "influencer" clichés), shallow depth, warm-on-dark.

## 4. Colour — "Prism" palette

| Token | Hex | Use |
| --- | --- | --- |
| `ink-950` | `#07090F` | App/site background (dark-first) |
| `ink-900` | `#0C101A` | Raised surfaces |
| `ink-800` | `#141A29` | Cards |
| `ink-700` | `#1E2740` | Borders/dividers (low) |
| `mist-400` | `#8B94AD` | Secondary text |
| `mist-100` | `#E6E9F2` | Primary text on dark |
| `echo-500` | `#5B7CFF` | Primary brand / actions |
| `echo-400` | `#7C96FF` | Hover/active accents |
| `pulse-400` | `#3DD6C3` | Positive/insight highlights |
| `flare-400` | `#FFB86B` | Warnings/attention |
| `ember-500` | `#FF6B81` | Errors/negative deltas |
| Gradient `signal` | `#5B7CFF → #3DD6C3` (135°) | Hero moments, score rings only — never body UI |

Contrast: all text pairs ≥ 4.5:1 (AA); `echo-500` on `ink-950` = 5.6:1. Light theme derives by token inversion (defined in the design-token file, not ad hoc). Score colour scale (0–100) is a perceptually-uniform ramp `ember → flare → pulse` always paired with the numeral — never colour alone.

## 5. Typography

- **Display/UI:** Inter (variable). Display 600–700 tight (−2% tracking ≥ 32px); UI 400–500.
- **Numerals:** Inter tabular lining in all metrics/tables.
- **Mono (code/API):** JetBrains Mono.
- Scale (px): 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61 (1.25 ratio); line-height 1.5 body, 1.15 display.

## 6. Design system "Prism" (product)

- **Tokens first:** colour, space (4px base), radius (8/12/16/24; glass surfaces 16), elevation (shadow + 1px inner border), motion (durations 120/200/320ms; easing `cubic-bezier(.2,.8,.2,1)`; all motion gated by `prefers-reduced-motion`).
- **Glass rule:** `backdrop-blur(16px) + rgba(20,26,41,.6) + 1px rgba(255,255,255,.08) border` — only for overlays, nav, and hero cards; core data surfaces stay opaque for legibility (accessibility ruling, final).
- **Components (v1 set):** Button, IconButton, Input, Select, Tabs, Card, StatTile, ScoreRing, ScoreChip (with "why" popover), Timeline, RetentionCurve, TrendCard, EmptyState, Skeleton, Toast, Modal, Drawer, DataTable, ReportBlock. Every component ships with empty/loading/error states and keyboard/a11y spec.
- **Charts:** one system — axis/gridline/legend styles tokenised; baselines always shown as reference bands; deltas always signed and labelled.

## 7. Brand governance

Copy-lint (CI) enforces: banned claim patterns (private-data implications), banned hype terms, numeric-context rule for stats in marketing pages. Brand kit (logo files, tokens JSON, Figma library) versioned in-repo; changes via PR with Brand Strategist review.
