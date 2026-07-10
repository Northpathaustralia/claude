// ---------------------------------------------------------------------------
// Settings & Admin: AI provider keys (saved locally, with a real live test),
// router profile, communication style, usage & cost dashboard, full data
// export/import, activity log and danger zone.
// ---------------------------------------------------------------------------
import { useRef, useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { useStore } from '../../store/StoreContext.jsx';
import { PROVIDERS, MODELS, PROVIDER_TIERS } from '../../atlas/models.js';
import { PROFILES } from '../../atlas/router.js';
import { streamChat } from '../../atlas/providers/index.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

const TONES = ['', 'Calm', 'Professional', 'Friendly', 'Executive', 'Energetic', 'Supportive', 'Direct'];

export default function AtlasSettings() {
  const { atlas, dispatchAtlas } = useAtlas();
  const { state: npaos, dispatch: dispatchNpaos } = useStore();
  const [drafts, setDrafts] = useState({});
  const [testing, setTesting] = useState({});
  const [testResult, setTestResult] = useState({});
  const importRef = useRef(null);

  const usage = atlas.usageLog;
  const totals = usage.reduce(
    (acc, u) => ({
      calls: acc.calls + 1,
      tokens: acc.tokens + (u.inputTokens || 0) + (u.outputTokens || 0),
      cost: acc.cost + (u.cost || 0),
    }),
    { calls: 0, tokens: 0, cost: 0 },
  );
  const byModel = Object.values(
    usage.reduce((acc, u) => {
      const key = u.model || 'unknown';
      acc[key] = acc[key] || { model: key, calls: 0, tokens: 0, cost: 0 };
      acc[key].calls += 1;
      acc[key].tokens += (u.inputTokens || 0) + (u.outputTokens || 0);
      acc[key].cost += u.cost || 0;
      return acc;
    }, {}),
  );

  async function testKey(providerId) {
    const key = drafts[providerId] ?? atlas.settings.keys[providerId];
    if (!key) return;
    setTesting({ ...testing, [providerId]: true });
    setTestResult({ ...testResult, [providerId]: null });
    try {
      const modelId = PROVIDER_TIERS[providerId]?.fast || PROVIDER_TIERS[providerId]?.balanced;
      await streamChat({
        model: MODELS[modelId],
        keys: { [providerId]: key },
        system: 'Reply with exactly: OK',
        messages: [{ role: 'user', content: 'Connection test' }],
        maxTokens: 16,
      });
      setTestResult((r) => ({ ...r, [providerId]: { ok: true, msg: 'Connected — the key works.' } }));
    } catch (err) {
      setTestResult((r) => ({ ...r, [providerId]: { ok: false, msg: err?.message || 'Test failed.' } }));
    } finally {
      setTesting((t) => ({ ...t, [providerId]: false }));
    }
  }

  function exportAll() {
    const payload = { exportedAt: new Date().toISOString(), version: 'atlas-one-0.2', atlas, npaos };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `atlas-one-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importAll(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed.atlas && !parsed.npaos) throw new Error('Not an ATLAS ONE backup file.');
      if (!window.confirm('Importing replaces the current data in this browser with the backup. Continue?')) return;
      if (parsed.atlas) dispatchAtlas({ type: 'state/replace', payload: parsed.atlas });
      if (parsed.npaos) dispatchNpaos({ type: 'state/replace', payload: parsed.npaos });
      window.alert('Backup imported.');
    } catch (err) {
      window.alert(`Import failed: ${err.message}`);
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Settings & Admin</h1>
          <p className="text-xs text-navy-300">Providers, intelligence routing, usage, and your data.</p>
        </div>

        {/* AI Providers */}
        <section className="atlas-card">
          <h2 className="text-sm font-semibold text-white">AI Providers</h2>
          <p className="mt-0.5 text-[11px] leading-4 text-navy-400">
            Keys are stored only in this browser on this computer and sent only to the provider you connect. Anyone with access to this computer profile could read them — don't use ATLAS ONE on shared machines.
          </p>
          <div className="mt-3 space-y-3">
            {Object.values(PROVIDERS).map((p) => {
              const saved = atlas.settings.keys[p.id];
              const result = testResult[p.id];
              return (
                <div key={p.id} className="rounded-xl border border-navy-700/60 bg-navy-900 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">{p.label}</p>
                    {p.recommended && <StatusBadge status="good" label="Recommended" />}
                    {saved ? <StatusBadge status="good" label="Key saved" /> : <StatusBadge status="neutral" label="Not connected" />}
                    {p.browserSupport === 'untested' && <StatusBadge status="warn" label="Browser access untested" />}
                    <a href={p.keyUrl} target="_blank" rel="noreferrer" className="ml-auto text-[11px] font-medium text-emerald-400 hover:underline">
                      Get a key ↗
                    </a>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input
                      type="password"
                      className="field-dark max-w-md flex-1"
                      placeholder={saved ? '•••••••• (key saved — paste to replace)' : p.keyPlaceholder}
                      value={drafts[p.id] ?? ''}
                      onChange={(e) => setDrafts({ ...drafts, [p.id]: e.target.value })}
                    />
                    <button
                      type="button"
                      className="btn-emerald text-xs"
                      disabled={!(drafts[p.id] || '').trim()}
                      onClick={() => {
                        dispatchAtlas({ type: 'settings/setKey', provider: p.id, key: drafts[p.id].trim() });
                        setDrafts({ ...drafts, [p.id]: '' });
                        setTestResult((r) => ({ ...r, [p.id]: null }));
                      }}
                    >
                      Save
                    </button>
                    <button type="button" className="btn-ghost-dark text-xs" disabled={testing[p.id] || (!saved && !(drafts[p.id] || '').trim())} onClick={() => testKey(p.id)}>
                      {testing[p.id] ? 'Testing…' : 'Test'}
                    </button>
                    {saved && (
                      <button
                        type="button"
                        className="btn-ghost-dark text-xs !border-red-500/40 !text-red-400"
                        onClick={() => dispatchAtlas({ type: 'settings/setKey', provider: p.id, key: '' })}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {result && (
                    <p className={`mt-2 rounded-lg px-3 py-1.5 text-xs ${result.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-300'}`}>{result.msg}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Intelligence routing */}
        <section className="atlas-card">
          <h2 className="text-sm font-semibold text-white">Intelligence routing</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="field-label !text-navy-400">Router profile</label>
              <select className="field-dark" value={atlas.settings.profile} onChange={(e) => dispatchAtlas({ type: 'settings/update', payload: { profile: e.target.value } })}>
                {Object.values(PROFILES).map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label !text-navy-400">Preferred provider</label>
              <select className="field-dark" value={atlas.settings.provider} onChange={(e) => dispatchAtlas({ type: 'settings/update', payload: { provider: e.target.value } })}>
                {Object.values(PROVIDERS).map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label !text-navy-400">Atlas communication style</label>
              <select className="field-dark" value={atlas.settings.tone} onChange={(e) => dispatchAtlas({ type: 'settings/update', payload: { tone: e.target.value } })}>
                {TONES.map((t) => (
                  <option key={t} value={t}>{t || 'Natural (default)'}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="atlas-card">
          <h2 className="text-sm font-semibold text-white">Usage & cost</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-navy-900 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">AI calls</p>
              <p className="text-lg font-bold text-white">{totals.calls}</p>
            </div>
            <div className="rounded-lg bg-navy-900 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">Tokens</p>
              <p className="text-lg font-bold text-white">{totals.tokens.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-navy-900 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">Est. cost</p>
              <p className="text-lg font-bold text-white">${totals.cost.toFixed(2)}</p>
            </div>
          </div>
          {byModel.length > 0 && (
            <table className="mt-3 w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-navy-400">
                  <th className="py-1">Model</th>
                  <th className="py-1">Calls</th>
                  <th className="py-1">Tokens</th>
                  <th className="py-1">Est. cost</th>
                </tr>
              </thead>
              <tbody>
                {byModel.map((m) => (
                  <tr key={m.model} className="border-t border-navy-800 text-navy-200">
                    <td className="py-1">{m.model}</td>
                    <td className="py-1">{m.calls}</td>
                    <td className="py-1">{m.tokens.toLocaleString()}</td>
                    <td className="py-1">${m.cost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-2 text-[10px] text-navy-500">Costs are estimates from published per-token prices where known; your provider's console is the source of truth for billing.</p>
        </section>

        {/* Data */}
        <section className="atlas-card">
          <h2 className="text-sm font-semibold text-white">Your data</h2>
          <p className="mt-0.5 text-[11px] text-navy-400">Everything lives in this browser. Export a backup weekly — it covers ATLAS and the NorthPath workspace in one file. API keys are included; keep backups private.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-emerald text-xs" onClick={exportAll}>Export full backup</button>
            <label className="btn-ghost-dark cursor-pointer text-xs">
              Import backup
              <input ref={importRef} type="file" accept=".json" className="hidden" onChange={importAll} />
            </label>
          </div>
        </section>

        {/* Activity log */}
        <section className="atlas-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Activity log</h2>
            <button type="button" className="btn-ghost-dark text-xs" disabled={!atlas.activityLog.length} onClick={() => dispatchAtlas({ type: 'activity/clear' })}>Clear log</button>
          </div>
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            {atlas.activityLog.length === 0 && <p className="text-xs text-navy-400">No activity recorded yet.</p>}
            {atlas.activityLog.slice(0, 50).map((a) => (
              <p key={a.id} className="text-[11px] text-navy-300">
                <span className="text-navy-500">{new Date(a.ts).toLocaleString()}</span> · <span className="font-medium text-navy-200">{a.kind}</span> — {a.detail}
              </p>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="atlas-card !border-red-500/30">
          <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost-dark text-xs !border-red-500/40 !text-red-400"
              onClick={() => window.confirm('Delete ALL ATLAS data (conversations, projects, memory, knowledge, artifacts, keys)? The NorthPath workspace is untouched. This cannot be undone.') && dispatchAtlas({ type: 'state/clearAll' })}
            >
              Clear ATLAS data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
