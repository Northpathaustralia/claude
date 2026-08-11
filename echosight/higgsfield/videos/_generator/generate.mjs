#!/usr/bin/env node
/* Emits the 14-file production package for each video in videos-data.mjs.
   Usage: node generate.mjs   (from this directory)
   Idempotent: re-running overwrites generated files. Hand-edits belong in videos-data.mjs. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { videos, GLOBAL } from './videos-data.mjs';

const out = (slug, file, content) => {
  const dir = new URL(`../${slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL(file, dir), content);
};
const srtTime = (s) => {
  const ms = Math.round((s % 1) * 1000), t = Math.floor(s);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)},${String(ms).padStart(3, '0')}`;
};
const csv = (v) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);

for (const v of videos) {
  const S = v.slug;
  const beats = v.beats;
  const shots = beats.map((b, i) => ({ n: i + 1, ...b }));

  // 1. concept.md
  out(S, 'concept.md', `# Day ${v.day} — ${v.title}

**Status: READY FOR HIGGSFIELD GENERATION** (no footage generated yet — see ../../production-cost-plan.md for why and the one-step fix)

- **Objective:** ${v.objective}
- **Audience / funnel:** ${v.audience} / ${v.funnel}
- **Promise to the viewer:** ${v.promise}
- **Duration / aspect:** ${v.duration}s / ${v.aspect}
- **Character:** ${v.character} · **Environment:** ${v.environment} · **Wardrobe lock:** ${v.wardrobe}
- **Success metric:** ${v.successMetric}
- **A/B hook alternative (TikTok variant):** ${v.abHook}

## Why this concept earns its day
${v.rationale}

## Compliance check
${v.compliance || 'All numbers shown are example data and labelled on-screen. No private-data implications. No result promises.'}
`);

  // 2. final-script.md
  out(S, 'final-script.md', `# Final script — Day ${v.day}: ${v.title}

Total ${v.duration}s · VO pace ~3.8 words/sec · ON-SCREEN = burned text overlay

| Time | VO (spoken) | ON-SCREEN | Visual |
| --- | --- | --- | --- |
${beats.map((b) => `| ${b.t[0]}–${b.t[1]}s | ${b.vo || '—'} | ${b.os || '—'} | ${b.visual} |`).join('\n')}

**VO delivery:** ${v.voNotes}
`);

  // 3. storyboard.md
  out(S, 'storyboard.md', `# Storyboard — Day ${v.day}: ${v.title}

${shots.map((s) => `## Shot ${s.n} (${s.t[0]}–${s.t[1]}s) — ${s.cam}
**Frame:** ${s.visual}
**Action:** ${s.action}
**Composition:** ${s.comp}
${s.os ? `**Text overlay:** “${s.os}” (enters 250ms ease, text-safe margins)` : '**Text overlay:** none'}
`).join('\n')}`);

  // 4. shot-list.csv
  out(S, 'shot-list.csv',
    'shot,start_s,end_s,duration_s,camera,description,text_overlay,generation_status\n' +
    shots.map((s) => [s.n, s.t[0], s.t[1], (s.t[1] - s.t[0]).toFixed(1), s.cam, s.visual, s.os || '', 'READY FOR HIGGSFIELD GENERATION'].map(csv).join(',')).join('\n') + '\n');

  // 5. higgsfield-prompts.md
  out(S, 'higgsfield-prompts.md', `# Higgsfield prompts — Day ${v.day}: ${v.title}

Paste one shot at a time. Attach the reference images from image-reference-brief.md to every shot. HOUSE STYLE = ../../global-style-bible.md. Max 5 attempts per shot (log in quality-control.md), then fall back to phone footage.

${shots.map((s) => `## Shot ${s.n} — ${s.t[0]}–${s.t[1]}s (generate ${Math.max(3, Math.ceil(s.t[1] - s.t[0]))}s, trim in edit)

**PROMPT:**
> ${v.character !== 'none' ? GLOBAL.characters[v.character] + ' ' : ''}${s.visual}. Action: ${s.action}. Location: ${v.environment} (${GLOBAL.environments[v.environment]}). Time of day: ${v.timeOfDay || 'mid-morning'}, motivated practical light: ${s.light || GLOBAL.defaultLight}. Composition: ${s.comp}. Camera: ${GLOBAL.camera[s.cam]}. Lens feel: ${s.lens || '28mm equivalent, natural perspective'}. Wardrobe: ${v.wardrobe}. Performance: ${s.perf || v.perfDefault}. Pacing: intended for a fast-cut edit; stable framing. Background: ${s.bg || 'environment as locked, natural depth, mild believable mess'}. Product visibility: ${s.product || 'none'}. Texture: natural skin texture, film-warm grade, lifted blacks. Aspect ${v.aspect}. Keep upper and lower 12% clear of key action (text-safe).

**AVOID:** ${['NEG-CORE', ...(s.negs || [])].join(' + ')} (blocks in ../../negative-prompt-library.md)

**Continuity ref:** ${s.continuity || `${v.character} sheet + ${v.environment} stills (see continuity-notes.md)`}
`).join('\n')}`);

  // 6. image-reference-brief.md
  out(S, 'image-reference-brief.md', `# Image reference brief — Day ${v.day}

Attach to every shot generation:

1. ${v.character !== 'none' ? `**${v.character} reference sheet** (6 images — see ../../character-continuity.md; generate once, reuse all month).` : '**No character** — environment references only.'}
2. **Environment stills:** 2–3 images of “${v.environment}” (${GLOBAL.environments[v.environment]}). Generate once per environment with an image model, or photograph the real equivalent (better).
${v.extraRefs ? v.extraRefs.map((r, i) => `${i + 3}. ${r}`).join('\n') : ''}

Screen-content note: any phone/laptop screens are generated dark/blank and the real UI (demo page screen-recordings) is composited in the edit — never generate fake UI.
`);

  // 7. continuity-notes.md
  out(S, 'continuity-notes.md', `# Continuity notes — Day ${v.day}

- **Character:** ${v.character}${v.character !== 'none' ? ` — token in ../../character-continuity.md. Wardrobe locked: ${v.wardrobe}.` : ''}
- **Environment:** ${v.environment} — same props in every shot (${GLOBAL.environments[v.environment]}).
- **Light direction:** ${v.timeOfDay || 'mid-morning'} window from camera-left in all shots.
${(v.continuityExtra || []).map((c) => `- ${c}`).join('\n')}

Between-shot check: face structure · wardrobe colour+garment · light direction · prop positions · hands.
`);

  // 8. voiceover.md
  out(S, 'voiceover.md', `# Voiceover — Day ${v.day}: ${v.title}

Record dry (phone in quiet room, 20cm from mouth) or generate. Delivery: ${v.voNotes}

${beats.filter((b) => b.vo).map((b) => `**[${b.t[0]}–${b.t[1]}s]** ${b.vo}`).join('\n\n')}

Timing check: read aloud at ~3.8 words/sec; each line must fit its window with ≥0.3s air. If a line runs long, cut words — never speed the read.
`);

  // 9. captions.srt
  out(S, 'captions.srt', beats.filter((b) => b.vo).map((b, i) =>
    `${i + 1}\n${srtTime(b.t[0])} --> ${srtTime(b.t[1])}\n${b.vo}\n`).join('\n') + '\n');

  // 10. edit-decision-list.csv
  out(S, 'edit-decision-list.csv',
    'order,source,in_point_s,duration_s,text_overlay,audio,notes\n' +
    shots.map((s) => [s.n, `shot-${s.n} (generated) `, 0, (s.t[1] - s.t[0]).toFixed(1), s.os || '', s.vo ? 'VO line ' + s.n : (s.audio || 'ambience only'), s.editNote || 'hard cut in'].map(csv).join(',')).join('\n') +
    `\n${shots.length + 1},captions.srt,0,${v.duration},,,import subtitles; Inter SemiBold; scrim under text\n`);

  // 11. thumbnail-prompt.md
  out(S, 'thumbnail-prompt.md', `# Thumbnail — Day ${v.day}

**Concept:** ${v.thumb.concept}
**Text overlay (max 6 words):** “${v.thumb.text}”
**Source:** ${v.thumb.source}

**Generation prompt (if generating rather than framegrabbing):**
> ${v.thumb.prompt || 'Framegrab preferred — no generation needed.'}

Rules: readable at 110px; 12% text-safe margins; Prism palette accent; passes the banned-aesthetics list.
`);

  // 12. quality-control.md
  out(S, 'quality-control.md', `# Quality control — Day ${v.day}: ${v.title}

Gate: **≥88/100** on the Creative Authenticity rubric (below). Below 88 = fix the failing shot or swap to phone footage. Never ship on schedule pressure.

## Rubric (score each /10; total /100 = sum × (10/14) rounded)
human realism · body movement · lip sync (if VO on camera) · hands · facial consistency · lighting consistency · wardrobe continuity · location believability · typography readability · pacing · emotional authenticity · product relevance · creator-native feel · absence of AI artefacts

## Video-specific risks (check hardest)
${v.qcRisks.map((r) => `- [ ] ${r}`).join('\n')}

## Attempt log (fill during generation — required by the 5-cycle rule)
| Shot | Attempt | Defect found | Prompt change | Result |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Final score: ___/100 · Shipped: yes/no · If no, fallback used: ___
`);

  // 13. platform-exports.md
  out(S, 'platform-exports.md', `# Platform exports — Day ${v.day}

| Platform | Spec | Notes |
| --- | --- | --- |
| Instagram Reels (master) | ${v.aspect} 1080×1920, H.264, 30fps, -14 LUFS audio | Burned captions ON; cover frame from thumbnail-prompt.md |
| TikTok | Re-export master WITHOUT IG elements | Use A/B hook variant: “${v.abHook}”; native text tool for overlays where feasible |
| YouTube Shorts | Master as-is, title = spoken hook | Add #shorts; end-screen ignored under 60s |
${v.linkedin ? `| LinkedIn | Master + first-person professional caption | ${v.linkedin} |` : ''}

Caption + hashtags: see ../../..//marketing/30-day-content-calendar.csv row ${v.day} and captions-and-cta-library.md.
`);

  // 14. cost-estimate.md
  const n = shots.length, low = (n * 2 * 0.75).toFixed(0), high = (n * 2.5 * 1.5).toFixed(0);
  out(S, 'cost-estimate.md', `# Cost estimate — Day ${v.day}

- Shots: ${n} · attempt budget: ${Math.round(n * 2.5)} generations (2.5×/shot)
- **Estimated credits cost: A$${low}–${high}** (conservative band; see ../../production-cost-plan.md assumptions)
- Stop-loss: A$${high} — beyond this, switch failing shots to phone footage
- VO: A$0 (founder-recorded) or ~A$1–2 generated
- Edit: A$0 (CapCut/DaVinci free)
`);

  console.log(`generated ${S} (14 files, ${n} shots)`);
}
console.log('done:', videos.length, 'video packages');
