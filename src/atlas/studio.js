// ---------------------------------------------------------------------------
// AI Studio: one prompt box, multiple creation engines. Each engine defines
// how the brief becomes a system prompt and what artifact type comes back
// (markdown document, standalone HTML, CSV spreadsheet, or code). Image
// generation is intentionally absent from V1 rather than faked — it's on the
// roadmap behind a provider with a tested browser-safe image API.
// ---------------------------------------------------------------------------

import { ATLAS_PERSONA, HONESTY_RULES } from './persona.js';
import { route } from './router.js';
import { estimateCost } from './models.js';

export const STUDIO_ENGINES = {
  document: {
    id: 'document',
    label: 'Document',
    hint: 'Reports, proposals, business plans, policies, manuals',
    output: 'markdown',
    ext: 'md',
    system: `Produce a complete, polished, professional document in Markdown. Use a clear title, structured headings, and tight business writing. Include every section the document type demands (e.g. a proposal needs scope, deliverables, pricing structure, terms summary, next steps). Mark any figure you were not given as [ASSUMPTION] rather than inventing it.`,
  },
  presentation: {
    id: 'presentation',
    label: 'Presentation',
    hint: 'Pitch decks, business presentations, training decks',
    output: 'markdown',
    ext: 'md',
    system: `Produce a complete slide deck as Markdown. Format: "## Slide N — Title" followed by 3-5 tight bullet points and a "Speaker notes:" line. Open with a hook, close with a call to action. 8-15 slides unless the brief says otherwise.`,
  },
  spreadsheet: {
    id: 'spreadsheet',
    label: 'Spreadsheet',
    hint: 'Financial models, budgets, calculators, trackers',
    output: 'csv',
    ext: 'csv',
    system: `Produce a spreadsheet as raw CSV only — no prose, no markdown fences. First row is the header. Use formulas written as plain values with an explicit "Notes" column explaining each calculated column's formula in words. Mark assumed numbers as such in the Notes column. The CSV must open cleanly in Excel or Google Sheets.`,
  },
  website: {
    id: 'website',
    label: 'Website / Landing page',
    hint: 'Landing pages, simple business sites',
    output: 'html',
    ext: 'html',
    system: `Produce ONE complete, self-contained HTML file (inline CSS, no external assets, no JS frameworks) — production-quality, responsive, and visually distinctive. No placeholder lorem ipsum: write real copy from the brief. Output only the HTML document, starting with <!doctype html>.`,
  },
  app: {
    id: 'app',
    label: 'App prototype',
    hint: 'Interactive tools, calculators, dashboards',
    output: 'html',
    ext: 'html',
    system: `Produce ONE complete, self-contained interactive HTML file (inline CSS + vanilla JS, no external dependencies) implementing the requested tool. It must actually work when opened in a browser. Output only the HTML document, starting with <!doctype html>.`,
  },
  code: {
    id: 'code',
    label: 'Code',
    hint: 'Scripts, components, automations',
    output: 'code',
    ext: 'txt',
    system: `Produce working, complete code for the brief with brief setup/run instructions for a non-technical owner at the top as comments. State what is tested vs untested.`,
  },
  social: {
    id: 'social',
    label: 'Social & marketing pack',
    hint: 'Posts, campaigns, email sequences, ad copy',
    output: 'markdown',
    ext: 'md',
    system: `Produce a ready-to-use content pack in Markdown: platform-specific posts (with hooks and hashtags where appropriate), an email version, and 2-3 headline/creative variations. Compliance: never promise guaranteed outcomes; keep claims supportable.`,
  },
  storyboard: {
    id: 'storyboard',
    label: 'Video script & storyboard',
    hint: 'Video concepts, scripts, shot lists, voiceovers',
    output: 'markdown',
    ext: 'md',
    system: `Produce a video package in Markdown: concept summary, full script with timestamps, shot-by-shot storyboard table (Shot | Visual | VO/Text | Duration), plus a short-form (30-60s) cutdown version.`,
  },
};

/**
 * Run a studio generation. Injected callModel keeps this testable offline.
 * @returns {{text, artifact:{title,type,ext,content}, usage, cost, meta}}
 */
export async function runStudio({ engineId, brief, settings = {}, onDelta, signal }, deps) {
  const engine = STUDIO_ENGINES[engineId] || STUDIO_ENGINES.document;
  const availableProviders = Object.entries(settings.keys || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  const routed = route({ mode: 'build', profile: settings.profile, provider: settings.provider, availableProviders });

  if (!routed.model) {
    const text = `**[Demonstration — no AI provider connected]**\n\nThe ${engine.label} engine is ready, but Atlas needs an AI provider to create for real. Open **Settings → AI Providers**, connect Anthropic (about two minutes), and run this brief again.`;
    if (onDelta) onDelta(text);
    return { text, artifact: null, usage: { inputTokens: 0, outputTokens: 0 }, cost: null, meta: { demo: true, engine: engine.id } };
  }

  const system = [ATLAS_PERSONA, HONESTY_RULES, `You are working in the ATLAS ONE AI Studio, ${engine.label} engine.`, engine.system].join('\n\n');

  const res = await deps.callModel({
    model: routed.model,
    keys: settings.keys,
    system,
    messages: [{ role: 'user', content: brief }],
    maxTokens: 64000,
    adaptiveThinking: true,
    onDelta,
    signal,
  });

  const title = deriveTitle(brief, engine);
  const artifact = {
    title,
    type: engine.output,
    ext: engine.ext,
    content: cleanArtifact(res.text, engine),
    engine: engine.id,
  };
  const cost = estimateCost(routed.model.id, res.usage.inputTokens, res.usage.outputTokens);
  return { text: res.text, artifact, usage: res.usage, cost, meta: { demo: false, engine: engine.id, model: routed.model.id } };
}

function deriveTitle(brief, engine) {
  const words = (brief || '').trim().split(/\s+/).slice(0, 8).join(' ');
  return `${engine.label}: ${words}${(brief || '').trim().split(/\s+/).length > 8 ? '…' : ''}`;
}

/** Strip a stray markdown fence when an engine demands raw output. */
export function cleanArtifact(text, engine) {
  let t = (text || '').trim();
  if (engine.output === 'html' || engine.output === 'csv' || engine.output === 'code') {
    const fence = t.match(/^```[a-z]*\n([\s\S]*?)\n```$/);
    if (fence) t = fence[1];
    if (engine.output === 'html') {
      const start = t.indexOf('<!doctype');
      const startUpper = t.indexOf('<!DOCTYPE');
      const idx = start >= 0 ? start : startUpper;
      if (idx > 0) t = t.slice(idx);
    }
  }
  return t;
}

/** Download helper metadata per artifact type. */
export function artifactMime(type) {
  switch (type) {
    case 'html':
      return 'text/html';
    case 'csv':
      return 'text/csv';
    case 'markdown':
      return 'text/markdown';
    default:
      return 'text/plain';
  }
}
