# Visual Direction v2

Amends docs/11. The Prism token palette stays (it tested well in the rendered site), but usage rules tighten to avoid the "generic AI SaaS" look the market is punishing (E5).

## What changes from v1

1. **Glass is rationed further.** Glass surfaces only on: nav, the hero product card, and modal overlays. Everything else is opaque `ink-800/900` panels. No page may have more than two glass surfaces in a viewport.
2. **Gradient discipline.** The signal gradient appears only in: score rings, the logo 'o', and one hero accent per page. Never on buttons, never as section backgrounds, never on body text.
3. **Texture over glow.** Introduce a subtle 2% noise texture on `ink-950` backgrounds and hairline (1px `ink-700`) section rules — print-like restraint instead of neon bloom. No drop-shadow glows on cards.
4. **Screenshot treatment.** Product UI shown in flat "browser-frame" cards with a visible **Example data** chip in the frame itself (not a caption that can be cropped out). Slight 1° rotation max — no floating-in-space perspective mockups.
5. **Iconography stays Lucide-style** (1.5px stroke) but decorative glyphs (◉ ◈ ✦) are replaced with real line icons in the build for consistency.
6. **Photography/video direction:** practical creator environments — ring light half in frame, messy desk edge, phone tripods, daylight windows. Natural skin, visible pores, mild colour grade (film-warm, slightly lifted blacks). Banned: neon-cyberpunk sets, floating holograms, stock "influencer pointing at phone," excessive teal-orange.
7. **Motion rules:** 200ms fades and 12–22px rises only; one hero animation per page may run longer (score ring). Nothing loops forever except the aurora, which drops to static under `prefers-reduced-motion` and on the app's data screens (focus > delight there).
8. **Data visuals:** every chart carries its baseline band and axis labels even in marketing shots — accuracy is the aesthetic.

## Accessibility requirements (unchanged, now with checks)

WCAG 2.2 AA contrast on all pairs; focus-visible rings (`2px echo-400 offset 2px`) on every interactive element; touch targets ≥ 44px; reduced-motion honoured; score colours always paired with numerals; skip-to-content link on every page. Verified in Phase 12, results in `qa/accessibility-review.md`.
