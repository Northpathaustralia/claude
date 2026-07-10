// ---------------------------------------------------------------------------
// Model router: maps (intelligence mode, router profile, availability) to a
// concrete model choice plus execution parameters. Pure function — the UI and
// orchestrator both call route(); tests exercise it directly.
// ---------------------------------------------------------------------------

import { MODELS, PROVIDER_TIERS, getModel } from './models.js';

/** Intelligence modes per the ATLAS ONE directive. */
export const MODES = {
  fast: {
    id: 'fast',
    label: 'Fast',
    description: 'Everyday questions and quick tasks.',
    tier: 'fast',
    maxTokens: 4096,
    passes: 1,
  },
  smart: {
    id: 'smart',
    label: 'Smart',
    description: 'Default balanced mode with context, reasoning and verification.',
    tier: 'max',
    maxTokens: 16000,
    passes: 1,
    adaptiveThinking: true,
  },
  deep: {
    id: 'deep',
    label: 'Deep Think',
    description: 'Complex problems, strategy and important decisions. Drafts, critiques, then improves its own answer.',
    tier: 'max',
    maxTokens: 32000,
    passes: 2, // draft -> critique+improve
    adaptiveThinking: true,
  },
  x10: {
    id: 'x10',
    label: 'X10 Mode',
    description: 'Maximum depth: objective, research, specialist council, options, risk, verification, execution plan.',
    tier: 'max',
    maxTokens: 64000,
    passes: 3, // plan -> council analysis -> synthesis
    adaptiveThinking: true,
  },
  research: {
    id: 'research',
    label: 'Research',
    description: 'Evidence-first answers with explicit sources, dates, and confidence labels.',
    tier: 'max',
    maxTokens: 16000,
    passes: 1,
    adaptiveThinking: true,
  },
  build: {
    id: 'build',
    label: 'Build',
    description: 'Software, websites, automations — plans then produces working code.',
    tier: 'max',
    maxTokens: 64000,
    passes: 1,
    adaptiveThinking: true,
  },
  creative: {
    id: 'creative',
    label: 'Creative',
    description: 'Branding, content, scripts, design concepts.',
    tier: 'max',
    maxTokens: 16000,
    passes: 1,
    adaptiveThinking: true,
  },
  executive: {
    id: 'executive',
    label: 'Executive',
    description: 'Priorities, business decisions, summaries, recommendations.',
    tier: 'max',
    maxTokens: 16000,
    passes: 1,
    adaptiveThinking: true,
  },
};

/** Router profiles the owner can pick in Settings. */
export const PROFILES = {
  maximum: { id: 'maximum', label: 'Maximum Intelligence', map: { fast: 'fast', balanced: 'max', max: 'max' } },
  balanced: { id: 'balanced', label: 'Balanced', map: { fast: 'fast', balanced: 'balanced', max: 'max' } },
  lowcost: { id: 'lowcost', label: 'Low Cost', map: { fast: 'fast', balanced: 'fast', max: 'balanced' } },
};

export const DEFAULT_PROFILE = 'balanced';

/**
 * Choose a model for a turn.
 * @param {object} opts
 * @param {string} opts.mode        mode id (fast|smart|deep|x10|research|build|creative|executive)
 * @param {string} [opts.profile]   router profile id
 * @param {string} [opts.provider]  preferred provider id (must have a key configured)
 * @param {string} [opts.modelOverride] explicit model id override
 * @param {string[]} [opts.availableProviders] providers with keys configured
 * @returns {{model: object|null, mode: object, reason: string}}
 */
export function route({ mode = 'smart', profile = DEFAULT_PROFILE, provider, modelOverride, availableProviders = [] }) {
  const modeDef = MODES[mode] || MODES.smart;

  if (modelOverride && MODELS[modelOverride]) {
    return { model: MODELS[modelOverride], mode: modeDef, reason: 'manual override' };
  }

  const prof = PROFILES[profile] || PROFILES[DEFAULT_PROFILE];
  const tier = prof.map[modeDef.tier] || modeDef.tier;

  // Preferred provider first, then any provider with a key, Anthropic first.
  const order = [];
  if (provider) order.push(provider);
  for (const p of ['anthropic', 'openai', 'google', 'xai', 'mistral']) {
    if (!order.includes(p)) order.push(p);
  }

  for (const p of order) {
    if (!availableProviders.includes(p)) continue;
    const id = (PROVIDER_TIERS[p] || {})[tier];
    const model = id && getModel(id);
    if (model) {
      return { model, mode: modeDef, reason: `${prof.label} profile → ${tier} tier on ${p}` };
    }
  }

  return { model: null, mode: modeDef, reason: 'no provider connected' };
}
