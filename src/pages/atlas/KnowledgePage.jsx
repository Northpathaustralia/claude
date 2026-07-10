// ---------------------------------------------------------------------------
// Knowledge library: upload text-based documents (txt/md/csv/json/html…),
// search them, and Atlas cites them in chat. PDF/Word parsing is Planned and
// clearly says so rather than pretending.
// ---------------------------------------------------------------------------
import { useMemo, useRef, useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { isSupportedFile, SUPPORTED_EXTENSIONS, buildChunkIndex, searchChunks } from '../../atlas/knowledge.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB per file keeps localStorage healthy

export default function KnowledgePage() {
  const { atlas, dispatchAtlas } = useAtlas();
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [projectId, setProjectId] = useState('');
  const fileRef = useRef(null);

  const chunks = useMemo(() => buildChunkIndex(atlas.knowledgeDocs.map((d) => ({ id: d.id, title: d.title, text: d.text }))), [atlas.knowledgeDocs]);
  const results = query.trim() ? searchChunks(chunks, query, 5) : [];

  async function onFiles(e) {
    setError('');
    const files = [...(e.target.files || [])];
    for (const f of files) {
      if (!isSupportedFile(f.name)) {
        setError(`"${f.name}" isn't supported yet. Works today: ${SUPPORTED_EXTENSIONS.join(', ')}. PDF and Word are planned — for now, copy the text into a .txt file.`);
        continue;
      }
      if (f.size > MAX_SIZE) {
        setError(`"${f.name}" is over 2 MB. Split it or trim it first.`);
        continue;
      }
      const text = await f.text();
      dispatchAtlas({ type: 'knowledge/add', payload: { title: f.name, text, projectId: projectId || null } });
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Knowledge</h1>
          <p className="text-xs text-navy-300">
            Upload documents and Atlas will use and cite them in every conversation. Local keyword retrieval <StatusBadge status="working" /> · Semantic (embedding) search <StatusBadge status="planned" />
          </p>
        </div>

        <div className="atlas-card mb-4">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="field-label !text-navy-400">Attach to project (optional)</label>
              <select className="field-dark" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">Whole workspace</option>
                {atlas.projects.filter((p) => !p.archived).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <label className="btn-emerald cursor-pointer">
              Upload files
              <input ref={fileRef} type="file" multiple className="hidden" accept={SUPPORTED_EXTENSIONS.map((x) => '.' + x).join(',')} onChange={onFiles} />
            </label>
            <p className="text-[11px] text-navy-400">Supported today: {SUPPORTED_EXTENSIONS.join(', ')} · up to 2 MB each</p>
          </div>
          {error && <p className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">{error}</p>}
        </div>

        <div className="atlas-card mb-4">
          <label className="field-label !text-navy-400">Test retrieval — what will Atlas find for a question?</label>
          <input className="field-dark" placeholder="e.g. What are the gym floor area requirements?" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query.trim() && (
            <div className="mt-2 space-y-2">
              {results.length === 0 && <p className="text-xs text-navy-400">No matching passages found.</p>}
              {results.map((r, i) => (
                <div key={i} className="rounded-lg border border-navy-700/60 bg-navy-900 p-2.5">
                  <p className="text-[11px] font-semibold text-emerald-400">{r.title} · score {r.score.toFixed(1)}</p>
                  <p className="mt-1 line-clamp-3 text-xs text-navy-300">{r.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="mb-2 text-sm font-semibold text-white">Library ({atlas.knowledgeDocs.length})</h2>
        {atlas.knowledgeDocs.length === 0 && <p className="text-sm text-navy-400">Nothing uploaded yet.</p>}
        <div className="space-y-2">
          {atlas.knowledgeDocs.map((d) => (
            <div key={d.id} className="atlas-card flex items-center gap-3">
              <span className="text-lg">📄</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-100">{d.title}</p>
                <p className="text-[11px] text-navy-400">
                  {(d.size / 1024).toFixed(1)} KB · added {new Date(d.addedAt).toLocaleDateString()}
                  {d.projectId && atlas.projects.find((p) => p.id === d.projectId) ? ` · ${atlas.projects.find((p) => p.id === d.projectId).name}` : ''}
                </p>
              </div>
              <button type="button" className="text-navy-500 hover:text-red-400" onClick={() => dispatchAtlas({ type: 'knowledge/remove', id: d.id })}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
