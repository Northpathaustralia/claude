// ---------------------------------------------------------------------------
// ATLAS ONE model catalog and provider registry.
//
// Provider-independent by design: every provider exposes the same adapter
// contract (see src/atlas/providers/). Prices are USD per million tokens and
// power the usage/cost dashboard. Prices are only recorded where we know them
// with confidence (Anthropic published pricing); other providers report token
// usage without a cost estimate rather than a made-up number.
// ---------------------------------------------------------------------------

export const PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic (Claude)',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    browserSupport: 'official', // Anthropic officially supports direct browser access
    recommended: true,
  },
  openai: {
    id: 'openai',
    label: 'OpenAI (GPT)',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    browserSupport: 'works', // works from the browser; not officially promoted
  },
  google: {
    id: 'google',
    label: 'Google (Gemini)',
    keyPlaceholder: 'AIza...',
    keyUrl: 'https://aistudio.google.com/apikey',
    browserSupport: 'works',
  },
  xai: {
    id: 'xai',
    label: 'xAI (Grok)',
    keyPlaceholder: 'xai-...',
    keyUrl: 'https://console.x.ai',
    browserSupport: 'untested', // OpenAI-compatible API; browser CORS untested
  },
  mistral: {
    id: 'mistral',
    label: 'Mistral',
    keyPlaceholder: '...',
    keyUrl: 'https://console.mistral.ai/api-keys',
    browserSupport: 'untested',
  },
};

/**
 * Model catalog. `inPrice` / `outPrice` are USD per 1M tokens (null = unknown,
 * usage tracked in tokens only). `tier` feeds the router.
 */
export const MODELS = {
  'claude-opus-4-8': {
    id: 'claude-opus-4-8',
    provider: 'anthropic',
    label: 'Claude Opus 4.8',
    tier: 'max',
    inPrice: 5,
    outPrice: 25,
    supportsAdaptiveThinking: true,
    noSamplingParams: true, // temperature/top_p rejected — never send them
  },
  'claude-sonnet-5': {
    id: 'claude-sonnet-5',
    provider: 'anthropic',
    label: 'Claude Sonnet 5',
    tier: 'balanced',
    inPrice: 3,
    outPrice: 15,
    supportsAdaptiveThinking: true,
    noSamplingParams: true,
  },
  'claude-haiku-4-5': {
    id: 'claude-haiku-4-5',
    provider: 'anthropic',
    label: 'Claude Haiku 4.5',
    tier: 'fast',
    inPrice: 1,
    outPrice: 5,
    supportsAdaptiveThinking: false,
    noSamplingParams: false,
  },
  'gpt-5.2': {
    id: 'gpt-5.2',
    provider: 'openai',
    label: 'GPT-5.2',
    tier: 'balanced',
    inPrice: null,
    outPrice: null,
  },
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    provider: 'openai',
    label: 'GPT-5 mini',
    tier: 'fast',
    inPrice: null,
    outPrice: null,
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    tier: 'balanced',
    inPrice: null,
    outPrice: null,
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    provider: 'google',
    label: 'Gemini 2.5 Flash',
    tier: 'fast',
    inPrice: null,
    outPrice: null,
  },
  'grok-4': {
    id: 'grok-4',
    provider: 'xai',
    label: 'Grok 4',
    tier: 'balanced',
    inPrice: null,
    outPrice: null,
  },
  'mistral-large-latest': {
    id: 'mistral-large-latest',
    provider: 'mistral',
    label: 'Mistral Large',
    tier: 'balanced',
    inPrice: null,
    outPrice: null,
  },
};

/** Per-provider model shortlist used by the router when a provider is preferred. */
export const PROVIDER_TIERS = {
  anthropic: { fast: 'claude-haiku-4-5', balanced: 'claude-sonnet-5', max: 'claude-opus-4-8' },
  openai: { fast: 'gpt-5-mini', balanced: 'gpt-5.2', max: 'gpt-5.2' },
  google: { fast: 'gemini-2.5-flash', balanced: 'gemini-2.5-pro', max: 'gemini-2.5-pro' },
  xai: { fast: 'grok-4', balanced: 'grok-4', max: 'grok-4' },
  mistral: { fast: 'mistral-large-latest', balanced: 'mistral-large-latest', max: 'mistral-large-latest' },
};

export function getModel(id) {
  return MODELS[id] || null;
}

/** USD cost of a call, or null when pricing for the model is unknown. */
export function estimateCost(modelId, inputTokens = 0, outputTokens = 0) {
  const m = MODELS[modelId];
  if (!m || m.inPrice == null || m.outPrice == null) return null;
  return (inputTokens * m.inPrice + outputTokens * m.outPrice) / 1_000_000;
}
