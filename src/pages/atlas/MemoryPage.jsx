// ---------------------------------------------------------------------------
// Transparent, user-controlled memory: search, add, edit, delete, export,
// clear all. Nothing is ever stored silently — chat "remember" commands and
// this page are the only write paths, and both are explicit.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { MEMORY_CATEGORIES, isSensitiveMemory } from '../../atlas/memory.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

export default function MemoryPage() {
  const { atlas, dispatchAtlas } = useAtlas();
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('general');

  const filtered = atlas.memories.filter(
    (m) => !search || m.text.toLowerCase().includes(search.toLowerCase()) || m.category.includes(search.toLowerCase()),
  );

  function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (isSensitiveMemory(text) && !window.confirm('This looks sensitive (passwords/financial/personal identifiers). Memory is stored unencrypted in this browser. Store anyway?')) {
      return;
    }
    dispatchAtlas({ type: 'memory/add', payload: { text: text.trim(), category } });
    setText('');
  }

  function exportMemories() {
    const blob = new Blob([JSON.stringify(atlas.memories, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `atlas-memories-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Memory</h1>
          <p className="text-xs text-navy-300">
            Everything Atlas remembers about you — fully under your control. In chat, say “Remember that…”, “Forget…”, or “What do you remember about me?” <StatusBadge status="working" />
          </p>
        </div>

        <form onSubmit={add} className="atlas-card mb-4 flex flex-wrap items-end gap-2">
          <div className="min-w-[240px] flex-1">
            <label className="field-label !text-navy-400">New memory</label>
            <input className="field-dark" placeholder="e.g. Preferred meeting times are before 10am" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label className="field-label !text-navy-400">Category</label>
            <select className="field-dark" value={category} onChange={(e) => setCategory(e.target.value)}>
              {MEMORY_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-emerald">Remember</button>
        </form>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input className="field-dark max-w-xs" placeholder="Search memories…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="btn-ghost-dark text-xs" onClick={exportMemories} disabled={!atlas.memories.length}>Export JSON</button>
          <button
            type="button"
            className="btn-ghost-dark text-xs !border-red-500/40 !text-red-400"
            disabled={!atlas.memories.length}
            onClick={() => window.confirm('Delete ALL memories? This cannot be undone.') && dispatchAtlas({ type: 'memory/clearAll' })}
          >
            Clear all
          </button>
          <span className="ml-auto text-xs text-navy-400">{atlas.memories.length} stored</span>
        </div>

        {filtered.length === 0 && (
          <div className="atlas-card text-sm text-navy-400">
            {atlas.memories.length === 0 ? 'No memories yet. Atlas only remembers what you explicitly ask it to.' : 'No matches.'}
          </div>
        )}
        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="atlas-card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">{m.category}</span>
                <input
                  className="mt-0.5 w-full bg-transparent text-sm text-navy-100 focus:outline-none"
                  value={m.text}
                  onChange={(e) => dispatchAtlas({ type: 'memory/update', id: m.id, payload: { text: e.target.value } })}
                />
                <p className="text-[10px] text-navy-500">Added {new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
              <button type="button" className="text-navy-500 hover:text-red-400" title="Forget" onClick={() => dispatchAtlas({ type: 'memory/remove', id: m.id })}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
