// ---------------------------------------------------------------------------
// Web search adapters for Research mode: Tavily and Brave, behind one
// searchWeb() contract, mirroring the AI provider pattern. Results are
// normalised to {title, url, snippet, published}. Errors surface honestly —
// including the possibility that a provider blocks browser calls (CORS),
// which we state plainly instead of guessing.
// ---------------------------------------------------------------------------

export const SEARCH_PROVIDERS = {
  tavily: {
    id: 'tavily',
    label: 'Tavily Search',
    keyPlaceholder: 'tvly-...',
    keyUrl: 'https://app.tavily.com/home',
    note: 'Built for AI apps; free tier available.',
  },
  brave: {
    id: 'brave',
    label: 'Brave Search',
    keyPlaceholder: 'BSA...',
    keyUrl: 'https://api-dashboard.search.brave.com/app/keys',
    note: 'Independent index; free tier available.',
  },
};

function corsHint(providerLabel) {
  return `Could not reach ${providerLabel} from the browser. This is usually the network, or the provider not allowing direct browser calls (CORS) — try the other search provider, or check your connection.`;
}

async function tavilySearch({ apiKey, query, count }) {
  let res;
  try {
    res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query, max_results: count, search_depth: 'basic', include_answer: false }),
    });
  } catch {
    throw new Error(corsHint('Tavily'));
  }
  if (res.status === 401 || res.status === 403) throw new Error('Tavily rejected the API key. Check it in Settings → Research & web search.');
  if (res.status === 429) throw new Error('Tavily rate limit reached. Wait a minute and try again.');
  if (!res.ok) throw new Error(`Tavily error ${res.status}.`);
  const json = await res.json();
  return (json.results || []).map((r) => ({
    title: r.title || r.url,
    url: r.url,
    snippet: (r.content || '').slice(0, 500),
    published: r.published_date || null,
  }));
}

async function braveSearch({ apiKey, query, count }) {
  let res;
  try {
    res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`, {
      headers: { accept: 'application/json', 'X-Subscription-Token': apiKey },
    });
  } catch {
    throw new Error(corsHint('Brave'));
  }
  if (res.status === 401 || res.status === 403) throw new Error('Brave rejected the API key. Check it in Settings → Research & web search.');
  if (res.status === 429) throw new Error('Brave rate limit reached. Wait a minute and try again.');
  if (!res.ok) throw new Error(`Brave error ${res.status}.`);
  const json = await res.json();
  return (json.web?.results || []).map((r) => ({
    title: r.title || r.url,
    url: r.url,
    snippet: (r.description || '').replace(/<[^>]+>/g, '').slice(0, 500),
    published: r.page_age || r.age || null,
  }));
}

/**
 * Run a web search.
 * @param {object} opts {provider:'tavily'|'brave', apiKey, query, count?}
 * @returns {Promise<Array<{title,url,snippet,published}>>}
 */
export async function searchWeb({ provider, apiKey, query, count = 5 }) {
  if (!apiKey) throw new Error(`No API key configured for ${provider}.`);
  if (provider === 'tavily') return tavilySearch({ apiKey, query, count });
  if (provider === 'brave') return braveSearch({ apiKey, query, count });
  throw new Error(`Unknown search provider: ${provider}`);
}

/** Cheap live test used by Settings — must succeed before we say Connected. */
export async function testSearch(provider, apiKey) {
  const results = await searchWeb({ provider, apiKey, query: 'Anthropic Claude', count: 1 });
  if (!results.length) throw new Error('The key works but returned no results — try again.');
  return results[0];
}

/** Pick the search provider to use from settings ({searchKeys, searchProvider}). */
export function pickSearchProvider(settings = {}) {
  const keys = settings.searchKeys || {};
  const preferred = settings.searchProvider;
  if (preferred && keys[preferred]) return { provider: preferred, apiKey: keys[preferred] };
  for (const id of Object.keys(SEARCH_PROVIDERS)) {
    if (keys[id]) return { provider: id, apiKey: keys[id] };
  }
  return null;
}
