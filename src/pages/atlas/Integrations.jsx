// ---------------------------------------------------------------------------
// Universal Integration Centre. Statuses are real: AI providers reflect saved
// keys; manual data paths (CSV/JSON) are marked Beta; everything else is
// Planned. No integration ever claims to work before it's configured and
// tested — that's the quality rule.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { INTEGRATIONS, INTEGRATION_CATEGORIES, integrationStatus } from '../../atlas/integrations.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

export default function Integrations() {
  const { atlas } = useAtlas();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const items = INTEGRATIONS.filter(
    (i) =>
      (filter === 'all' || i.category === filter) &&
      (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())),
  );
  const connectedCount = INTEGRATIONS.filter((i) => integrationStatus(i, atlas.settings.keys).id === 'connected').length;

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Integration Centre</h1>
          <p className="text-xs text-navy-300">
            {connectedCount} connected · statuses are always truthful. AI providers connect in{' '}
            <Link to="/settings" className="text-emerald-400 underline">Settings</Link>; external platform connections roll out on the roadmap.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input className="field-dark max-w-xs" placeholder="Search integrations…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="field-dark !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All categories</option>
            {INTEGRATION_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => {
            const status = integrationStatus(i, atlas.settings.keys);
            return (
              <div key={i.id} className="atlas-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{i.name}</p>
                  <StatusBadge status={status.tone} label={status.label} />
                </div>
                <p className="mt-1 text-[11px] leading-4 text-navy-400">{i.description}</p>
                {i.manualNote && <p className="mt-1 text-[10px] font-medium text-sky-400">{i.manualNote}</p>}
                {i.kind === 'ai-key' && (
                  <Link to="/settings" className="mt-2 inline-block text-[11px] font-medium text-emerald-400 hover:underline">
                    {status.id === 'connected' ? 'Manage key →' : 'Connect →'}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-navy-800 bg-navy-900 p-4 text-[11px] leading-5 text-navy-400">
          <p className="font-semibold text-navy-200">How connections will work (security model)</p>
          <p>
            OAuth with least-privilege scopes wherever the platform supports it, tokens stored locally (Local Edition) or encrypted server-side (Cloud Edition), a permission review screen before install, per-integration
            activity logs, and one-click revocation. An integration is only ever marked Connected after a real, tested call succeeds.
          </p>
        </div>
      </div>
    </div>
  );
}
