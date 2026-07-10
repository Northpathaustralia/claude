// ---------------------------------------------------------------------------
// AI Studio: one prompt box, multiple real creation engines. Artifacts are
// previewed (HTML in a sandboxed iframe), saved to the library, attachable to
// projects, and downloadable in a format that opens in normal software.
// ---------------------------------------------------------------------------
import { useRef, useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { STUDIO_ENGINES, runStudio, artifactMime } from '../../atlas/studio.js';
import { streamChat } from '../../atlas/providers/index.js';
import Markdown from '../../components/atlas/Markdown.jsx';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

export default function Studio() {
  const { atlas, dispatchAtlas } = useAtlas();
  const [engineId, setEngineId] = useState('document');
  const [brief, setBrief] = useState('');
  const [projectId, setProjectId] = useState('');
  const [running, setRunning] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const engine = STUDIO_ENGINES[engineId];
  const connected = Object.values(atlas.settings.keys || {}).some(Boolean);

  async function run() {
    if (!brief.trim() || running) return;
    setError('');
    setResult(null);
    setRunning(true);
    setStreamText('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      let acc = '';
      const res = await runStudio(
        {
          engineId,
          brief: brief.trim(),
          settings: atlas.settings,
          onDelta: (d) => {
            acc += d;
            setStreamText(acc);
          },
          signal: controller.signal,
        },
        { callModel: streamChat },
      );
      setResult(res);
      if (res.artifact) {
        dispatchAtlas({ type: 'artifact/add', payload: { ...res.artifact, projectId: projectId || null } });
        if (!res.meta.demo) {
          dispatchAtlas({
            type: 'usage/record',
            payload: { model: res.meta.model, mode: 'studio', inputTokens: res.usage.inputTokens, outputTokens: res.usage.outputTokens, cost: res.cost },
          });
        }
      }
    } catch (err) {
      if (err?.name !== 'AbortError') setError(err?.message || 'Generation failed.');
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }

  function download(artifact) {
    const blob = new Blob([artifact.content], { type: artifactMime(artifact.type) });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${artifact.title.replace(/[^a-z0-9 _-]/gi, '').slice(0, 60).trim() || 'atlas-artifact'}.${artifact.ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const latest = result?.artifact;

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">AI Studio</h1>
          <p className="text-xs text-navy-300">
            One brief, many creation engines. Text/code engines <StatusBadge status="working" /> · Image & video generation <StatusBadge status="planned" />
          </p>
        </div>

        {/* Engine picker */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.values(STUDIO_ENGINES).map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEngineId(e.id)}
              className={`rounded-xl border p-3 text-left transition ${engineId === e.id ? 'border-emerald-500/70 bg-navy-850' : 'border-navy-700/60 bg-navy-900 hover:border-navy-500'}`}
            >
              <p className="text-sm font-semibold text-white">{e.label}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-navy-400">{e.hint}</p>
            </button>
          ))}
        </div>

        {/* Brief */}
        <div className="atlas-card mb-4">
          <label className="field-label !text-navy-400">Brief for the {engine.label} engine</label>
          <textarea
            rows={4}
            className="field-dark"
            placeholder="Describe exactly what you want created. The more specific the brief, the better the output."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select className="field-dark !w-auto" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">No project</option>
              {atlas.projects.filter((p) => !p.archived).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {running ? (
              <button type="button" className="rounded-lg bg-red-500 px-3.5 py-2 text-sm font-semibold text-white" onClick={() => abortRef.current?.abort()}>■ Stop</button>
            ) : (
              <button type="button" className="btn-emerald" onClick={run} disabled={!brief.trim()}>Create</button>
            )}
            {!connected && <span className="text-[11px] text-amber-400">No provider connected — output will be a labelled demonstration.</span>}
          </div>
          {error && <p className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        </div>

        {/* Live output */}
        {(running || result) && (
          <div className="atlas-card mb-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-white">{running ? 'Creating…' : latest ? latest.title : 'Result'}</h2>
              <div className="flex items-center gap-2">
                {result?.meta?.demo && <StatusBadge status="demo" />}
                {result && !result.meta.demo && <StatusBadge status="working" label={`${result.usage.inputTokens + result.usage.outputTokens} tokens${result.cost != null ? ` · ≈$${result.cost.toFixed(4)}` : ''}`} />}
                {latest && <button type="button" className="btn-ghost-dark text-xs" onClick={() => download(latest)}>⬇ Download .{latest.ext}</button>}
              </div>
            </div>
            {latest?.type === 'html' && !running ? (
              <iframe title="Artifact preview" sandbox="" srcDoc={latest.content} className="h-96 w-full rounded-lg border border-navy-700 bg-white" />
            ) : latest?.type === 'csv' && !running ? (
              <pre className="max-h-96 overflow-auto rounded-lg bg-navy-900 p-3 text-xs text-navy-200">{latest.content}</pre>
            ) : (
              <div className="max-h-[32rem] overflow-y-auto">
                <Markdown text={running ? streamText || '_Working…_' : result?.text || ''} />
              </div>
            )}
          </div>
        )}

        {/* Library */}
        <h2 className="mb-2 text-sm font-semibold text-white">Saved outputs ({atlas.artifacts.length})</h2>
        {atlas.artifacts.length === 0 && <p className="text-sm text-navy-400">Nothing created yet.</p>}
        <div className="space-y-2">
          {atlas.artifacts.map((a) => (
            <div key={a.id} className="atlas-card flex items-center gap-3">
              <span className="text-lg">{a.type === 'html' ? '🌐' : a.type === 'csv' ? '📊' : '📝'}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-100">{a.title}</p>
                <p className="text-[11px] text-navy-400">{a.type} · {new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <button type="button" className="btn-ghost-dark text-xs" onClick={() => download(a)}>Download</button>
              <button type="button" className="text-navy-500 hover:text-red-400" onClick={() => dispatchAtlas({ type: 'artifact/remove', id: a.id })}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
