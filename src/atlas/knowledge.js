// ---------------------------------------------------------------------------
// Knowledge engine: chunking + lexical (TF-style) retrieval over uploaded
// documents. Real, local, and dependable — no fake "semantic" claims.
// Embedding-based retrieval is a Planned upgrade once a provider key is
// dedicated to it; the interface here won't need to change.
// ---------------------------------------------------------------------------

const CHUNK_SIZE = 1200; // characters
const CHUNK_OVERLAP = 150;

/** Split document text into overlapping chunks on paragraph boundaries where possible. */
export function chunkText(text) {
  const clean = (text || '').replace(/\r\n/g, '\n').trim();
  if (!clean) return [];
  if (clean.length <= CHUNK_SIZE) return [clean];

  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(start + CHUNK_SIZE, clean.length);
    if (end < clean.length) {
      const para = clean.lastIndexOf('\n\n', end);
      const sentence = clean.lastIndexOf('. ', end);
      const cut = Math.max(para, sentence);
      if (cut > start + CHUNK_SIZE / 2) end = cut + 1;
    }
    chunks.push(clean.slice(start, end).trim());
    if (end >= clean.length) break;
    start = end - CHUNK_OVERLAP;
  }
  return chunks.filter(Boolean);
}

const STOPWORDS = new Set(
  'the a an and or but of to in on for with at by from as is are was were be been it its this that these those i you he she we they what which who how when where why not no yes do does did can could should would will just about into over under more most very'.split(' '),
);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .split(/[^a-z0-9$%.]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Score chunks against a query. Term-frequency scoring with a rarity boost
 * (terms appearing in fewer chunks weigh more) and a phrase bonus.
 * @param {Array<{id:string, docId:string, title:string, text:string}>} chunks
 * @param {string} query
 * @param {number} [topK]
 * @returns {Array<{docId:string, title:string, excerpt:string, score:number}>}
 */
export function searchChunks(chunks, query, topK = 4) {
  const qTokens = [...new Set(tokenize(query))];
  if (!qTokens.length || !chunks?.length) return [];

  // Document frequency per query token
  const df = {};
  for (const t of qTokens) df[t] = 0;
  const tokenCache = chunks.map((c) => tokenize(c.text));
  tokenCache.forEach((toks) => {
    const set = new Set(toks);
    for (const t of qTokens) if (set.has(t)) df[t] += 1;
  });

  const N = chunks.length;
  const phrase = query.trim().toLowerCase();
  const results = chunks.map((c, i) => {
    const toks = tokenCache[i];
    let score = 0;
    for (const t of qTokens) {
      const tf = toks.filter((x) => x === t).length;
      if (tf > 0) score += (1 + Math.log(tf)) * Math.log(1 + N / (df[t] || 1));
    }
    if (phrase.length > 8 && c.text.toLowerCase().includes(phrase)) score += 5;
    return { docId: c.docId, title: c.title, excerpt: c.text, score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** File types the Local Edition can genuinely read today. */
export const SUPPORTED_EXTENSIONS = ['txt', 'md', 'markdown', 'csv', 'json', 'html', 'log', 'yaml', 'yml'];

export function isSupportedFile(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/** Build the chunk index for a set of docs: [{id, title, text}] -> chunk list. */
export function buildChunkIndex(docs) {
  const out = [];
  for (const d of docs || []) {
    const parts = chunkText(d.text);
    parts.forEach((p, i) => out.push({ id: `${d.id}:${i}`, docId: d.id, title: d.title, text: p }));
  }
  return out;
}
