// ---------------------------------------------------------------------------
// Executive Decision Council: pose a question, Atlas selects the relevant
// specialists, each produces a real independent analysis, and Atlas
// synthesises a decision brief (consensus, minority opinions, trade-offs).
// ---------------------------------------------------------------------------
import { useRef, useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { SPECIALISTS, selectSpecialists } from '../../atlas/council.js';
import { runCouncil } from '../../atlas/orchestrator.js';
import { streamChat } from '../../atlas/providers/index.js';
import Markdown from '../../components/atlas/Markdown.jsx';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

export default function Council() {
  const { atlas, dispatchAtlas } = useAtlas();
  const [question, setQuestion] = useState('');
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState('');
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const preview = question.trim() ? selectSpecialists(question).filter((s) => s !== 'ATLAS') : [];

  async function convene() {
    if (!question.trim() || running) return;
    setError('');
    setResult(null);
    setStreamText('');
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      let acc = '';
      const res = await runCouncil(
        {
          question: question.trim(),
          settings: atlas.settings,
          onStage: (s) => setStage(s.label),
          onDelta: (d) => {
            acc += d;
            setStreamText(acc);
          },
          signal: controller.signal,
        },
        { callModel: streamChat },
      );
      setResult(res);
      if (!res.meta.demo) {
        dispatchAtlas({
          type: 'usage/record',
          payload: { model: res.meta.model, mode: 'council', inputTokens: res.usage.inputTokens, outputTokens: res.usage.outputTokens, cost: res.cost },
        });
      }
    } catch (err) {
      if (err?.name !== 'AbortError') setError(err?.message || 'The council could not convene.');
    } finally {
      setRunning(false);
      setStage('');
      abortRef.current = null;
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Executive Decision Council</h1>
          <p className="text-xs text-navy-300">
            18 specialists under Atlas. Only the relevant ones convene for each question. <StatusBadge status="working" label="Working (needs provider)" />
          </p>
        </div>

        <div className="atlas-card mb-4">
          <label className="field-label !text-navy-400">Put a decision to the council</label>
          <textarea
            rows={3}
            className="field-dark"
            placeholder="e.g. Should NorthPath double its advertising budget next quarter, or invest in referral partnerships instead?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {running ? (
              <button type="button" className="rounded-lg bg-red-500 px-3.5 py-2 text-sm font-semibold text-white" onClick={() => abortRef.current?.abort()}>■ Stop</button>
            ) : (
              <button type="button" className="btn-emerald" onClick={convene} disabled={!question.trim()}>Convene council</button>
            )}
            {preview.length > 0 && (
              <span className="text-[11px] text-navy-300">
                Will convene: <span className="text-emerald-400">{preview.join(', ')}</span>
              </span>
            )}
          </div>
          {error && <p className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        </div>

        {(running || result) && (
          <div className="atlas-card mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{running ? stage || 'Convening…' : 'Council decision brief'}</h2>
              {result?.meta?.demo && <StatusBadge status="demo" />}
              {result && !result.meta.demo && (
                <span className="text-[11px] text-navy-400">
                  {result.usage.inputTokens + result.usage.outputTokens} tokens{result.cost != null ? ` · ≈$${result.cost.toFixed(4)}` : ''}
                </span>
              )}
            </div>
            {running && !streamText && <p className="animate-pulse text-sm text-navy-300">⏳ {stage || 'Specialists working…'}</p>}
            <Markdown text={running ? streamText : result?.text || ''} />
            {result?.analyses?.length > 0 && (
              <div className="mt-4 border-t border-navy-800 pt-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Individual specialist analyses</p>
                <div className="space-y-2">
                  {result.analyses.map((a) => (
                    <details key={a.id} className="rounded-lg border border-navy-700/60 bg-navy-900 p-2.5">
                      <summary className="cursor-pointer text-sm font-medium text-emerald-400">{a.id} — {a.role}</summary>
                      <div className="mt-2"><Markdown text={a.text} /></div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Roster */}
        <h2 className="mb-2 text-sm font-semibold text-white">The council</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(SPECIALISTS).map((s) => (
            <div key={s.id} className="atlas-card">
              <p className="text-sm font-bold text-emerald-400">{s.id}</p>
              <p className="text-xs font-medium text-white">{s.role}</p>
              <p className="mt-1 text-[11px] leading-4 text-navy-400">{s.skills}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
