// ---------------------------------------------------------------------------
// Google Gemini provider adapter via the Generative Language API (SSE).
// ---------------------------------------------------------------------------

export async function streamChat({ apiKey, model, system, messages, maxTokens, onDelta, signal }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:streamGenerateContent?alt=sse`;

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: maxTokens || 16000 },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
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
    if (res.status === 400 && /api key/i.test(detail)) throw new Error('Google rejected the API key. Check it in Settings → AI Providers.');
    if (res.status === 429) throw new Error('Google rate limit reached. Wait a minute and try again.');
    throw new Error(`Google error ${res.status}${detail ? `: ${detail}` : ''}`);
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
      let json;
      try {
        json = JSON.parse(trimmed.slice(5).trim());
      } catch {
        continue;
      }
      const delta = json.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
      if (delta) {
        text += delta;
        if (onDelta) onDelta(delta);
      }
      if (json.usageMetadata) {
        usage = {
          inputTokens: json.usageMetadata.promptTokenCount || 0,
          outputTokens: json.usageMetadata.candidatesTokenCount || 0,
        };
      }
    }
  }

  return { text, usage, model: model.id, thinkingSummary: '' };
}
