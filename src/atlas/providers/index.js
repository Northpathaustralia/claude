// ---------------------------------------------------------------------------
// Provider dispatcher: one streamChat() contract across all providers.
// The orchestrator receives this via dependency injection so tests can swap
// in a mock model without any network.
// ---------------------------------------------------------------------------

import * as anthropic from './anthropic.js';
import * as openaiCompat from './openaiCompat.js';
import * as google from './google.js';

/**
 * @param {object} opts see individual adapters; requires opts.model (catalog
 *   entry with .provider) and opts.keys map {providerId: apiKey}
 */
export async function streamChat(opts) {
  const providerId = opts.model?.provider;
  const apiKey = opts.keys?.[providerId];
  if (!apiKey) throw new Error(`No API key configured for ${providerId}. Add one in Settings → AI Providers.`);
  const call = { ...opts, apiKey, providerId };

  switch (providerId) {
    case 'anthropic':
      return anthropic.streamChat(call);
    case 'openai':
    case 'xai':
    case 'mistral':
      return openaiCompat.streamChat(call);
    case 'google':
      return google.streamChat(call);
    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}

export function describeProviderError(providerId, err) {
  if (providerId === 'anthropic') return anthropic.describeAnthropicError(err);
  return err?.message || `Unknown error calling ${providerId}.`;
}
