// ---------------------------------------------------------------------------
// OpenAI-compatible provider adapter (OpenAI, xAI, Mistral) via fetch + SSE.
// These providers share the /chat/completions wire format.
// ---------------------------------------------------------------------------

const BASES = {
  openai: 'https://api.openai.com/v1',
  xai: 'https://api.x.ai/v1',
  mistral: 'https://api.mistral.ai/v1',
};

export async function streamChat({ providerId, apiKey, model, system, messages, maxTokens, onDelta, signal }) {
  const base = BASES[providerId];
  if (!base) throw new Error(`Unknown OpenAI-compatible provider: ${providerId}`);

  const body = {
    model: model.id,
    stream: true,
    max_completion_tokens: maxTokens || 16000,
    messages: [{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.content }))],
  };
  if (providerId === 'openai') body.stream_options = { include_usage: true };
  // Mistral/older shims use max_tokens
  if (providerId !== 'openai') {
    body.max_tokens = maxTokens || 16000;
    delete body.max_completion_tokens;
  }

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json())?.error?.message || '';
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) throw new Error(`${providerId} rejected the API key. Check it in Settings → AI Providers.`);
    if (res.status === 429) throw new Error(`${providerId} rate limit reached. Wait a minute and try again.`);
    throw new Error(`${providerId} error ${res.status}${detail ? `: ${detail}` : ''}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let usage = { inputTokens: 0, outputTokens: 0 };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;
      let json;
      try {
        json = JSON.parse(payload);
      } catch {
        continue;
      }
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) {
        text += delta;
        if (onDelta) onDelta(delta);
      }
      if (json.usage) {
        usage = {
          inputTokens: json.usage.prompt_tokens || 0,
          outputTokens: json.usage.completion_tokens || 0,
        };
      }
    }
  }

  return { text, usage, model: model.id, thinkingSummary: '' };
}
