// ---------------------------------------------------------------------------
// Anthropic provider adapter (official @anthropic-ai/sdk).
// Runs in the browser with the owner's own key — Anthropic officially
// supports direct browser access; the key never leaves this device except to
// api.anthropic.com. Streaming by default. Current Claude models reject
// sampling params (temperature etc.), so none are ever sent.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';

/**
 * Stream a chat completion from Claude.
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {object} opts.model     catalog entry from models.js
 * @param {string} opts.system
 * @param {Array<{role:'user'|'assistant', content:string}>} opts.messages
 * @param {number} opts.maxTokens
 * @param {boolean} [opts.adaptiveThinking]
 * @param {(delta:string)=>void} [opts.onDelta]
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{text:string, usage:{inputTokens:number, outputTokens:number}, model:string, thinkingSummary:string}>}
 */
export async function streamChat({ apiKey, model, system, messages, maxTokens, adaptiveThinking, onDelta, signal }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const params = {
    model: model.id,
    max_tokens: maxTokens || 16000,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };
  if (adaptiveThinking && model.supportsAdaptiveThinking) {
    params.thinking = { type: 'adaptive', display: 'summarized' };
  }

  const stream = client.messages.stream(params, { signal });

  let thinkingSummary = '';
  stream.on('text', (delta) => {
    if (onDelta) onDelta(delta);
  });
  stream.on('thinking', (delta) => {
    thinkingSummary += delta;
  });

  const final = await stream.finalMessage();

  const text = final.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return {
    text,
    thinkingSummary,
    model: final.model,
    usage: {
      inputTokens:
        (final.usage?.input_tokens || 0) +
        (final.usage?.cache_creation_input_tokens || 0) +
        (final.usage?.cache_read_input_tokens || 0),
      outputTokens: final.usage?.output_tokens || 0,
    },
    stopReason: final.stop_reason,
  };
}

/** Map SDK errors to a plain-English message for the owner. */
export function describeAnthropicError(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    return 'Anthropic rejected the API key. Open Settings → AI Providers, check the key, and save it again.';
  }
  if (err instanceof Anthropic.RateLimitError) {
    return 'Anthropic rate limit reached. Wait a minute and try again.';
  }
  if (err instanceof Anthropic.BadRequestError) {
    return `Anthropic rejected the request: ${err.message}`;
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return 'Could not reach Anthropic. Check your internet connection.';
  }
  if (err instanceof Anthropic.APIError) {
    return `Anthropic error ${err.status}: ${err.message}`;
  }
  return err?.message || 'Unknown error calling Anthropic.';
}
