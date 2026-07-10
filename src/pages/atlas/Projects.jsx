// ---------------------------------------------------------------------------
// Project workspaces: create/rename/archive projects, set instructions that
// steer every attached conversation, and see linked conversations, knowledge
// and artifacts in one place.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';
import { uid } from '../../utils/format.js';

export default function Projects() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { atlas, dispatchAtlas } = useAtlas();
  const [name, setName] = useState('');

  const selected = atlas.projects.find((p) => p.id === id) || null;

  function createProject(e) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatchAtlas({ type: 'project/add', payload: { name: name.trim() } });
    setName('');
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Projects</h1>
            <p className="text-xs text-navy-300">Each project carries its own instructions, conversations and outputs. <StatusBadge status="working" /></p>
          </div>
        </div>

        <form onSubmit={createProject} className="mb-4 flex gap-2">
          <input className="field-dark max-w-sm" placeholder="New project name (e.g. Hope Island Gym)" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="btn-emerald">Create</button>
        </form>

        <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
          <div className="space-y-2">
            {atlas.projects.length === 0 && <p className="text-sm text-navy-400">No projects yet — create the first one above.</p>}
            {atlas.projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/projects/${p.id}`)}
                className={`w-full rounded-xl border p-3 text-left transition ${p.id === id ? 'border-emerald-500/60 bg-navy-850' : 'border-navy-700/60 bg-navy-900 hover:border-navy-500'} ${p.archived ? 'opacity-50' : ''}`}
              >
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="text-[11px] text-navy-400">
                  {atlas.conversations.filter((c) => c.projectId === p.id).length} conversations ·{' '}
                  {atlas.artifacts.filter((a) => a.projectId === p.id).length} outputs{p.archived ? ' · archived' : ''}
                </p>
              </button>
            ))}
          </div>

          {selected ? (
            <div className="space-y-4">
              <div className="atlas-card">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="field-dark !w-auto flex-1 !bg-transparent !border-transparent !px-0 text-base font-semibold text-white focus:!border-navy-700"
                    value={selected.name}
                    onChange={(e) => dispatchAtlas({ type: 'project/update', id: selected.id, payload: { name: e.target.value } })}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-ghost-dark text-xs"
                      onClick={() => dispatchAtlas({ type: 'project/update', id: selected.id, payload: { archived: !selected.archived } })}
                    >
                      {selected.archived ? 'Unarchive' : 'Archive'}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost-dark text-xs !border-red-500/40 !text-red-400"
                      onClick={() => {
                        if (window.confirm(`Delete project "${selected.name}"? Conversations stay but lose the project link.`)) {
                          dispatchAtlas({ type: 'project/remove', id: selected.id });
                          navigate('/projects');
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <label className="field-label !text-navy-400">Project instructions (Atlas follows these in every attached conversation)</label>
                <textarea
                  rows={4}
                  className="field-dark"
                  placeholder="e.g. This is a commercial gym development at Hope Island. Use AUD, metric units, and assume a 24/7 access model…"
                  value={selected.instructions}
                  onChange={(e) => dispatchAtlas({ type: 'project/update', id: selected.id, payload: { instructions: e.target.value } })}
                />
              </div>

              <div className="atlas-card">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Conversations</h3>
                  <button
                    type="button"
                    className="btn-emerald text-xs"
                    onClick={() => {
                      const newId = uid('conv');
                      dispatchAtlas({ type: 'conversation/create', id: newId, projectId: selected.id });
                      navigate(`/chat/${newId}`);
                    }}
                  >
                    + New in this project
                  </button>
                </div>
                {atlas.conversations.filter((c) => c.projectId === selected.id).length === 0 && (
                  <p className="text-xs text-navy-400">No conversations attached yet.</p>
                )}
                <div className="space-y-1">
                  {atlas.conversations
                    .filter((c) => c.projectId === selected.id)
                    .map((c) => (
                      <Link key={c.id} to={`/chat/${c.id}`} className="block rounded-lg border border-navy-700/60 bg-navy-900 px-3 py-2 text-sm text-navy-100 hover:border-emerald-500/40">
                        {c.title} <span className="text-[10px] text-navy-400">· {c.messages.length} messages</span>
                      </Link>
                    ))}
                </div>
              </div>

              <div className="atlas-card">
                <h3 className="mb-2 text-sm font-semibold text-white">Outputs & documents</h3>
                {atlas.artifacts.filter((a) => a.projectId === selected.id).length === 0 &&
                  atlas.knowledgeDocs.filter((d) => d.projectId === selected.id).length === 0 && (
                    <p className="text-xs text-navy-400">Nothing here yet. Studio outputs and knowledge uploads can be attached to this project.</p>
                  )}
                <div className="space-y-1 text-sm">
                  {atlas.artifacts
                    .filter((a) => a.projectId === selected.id)
                    .map((a) => (
                      <p key={a.id} className="text-navy-200">🎨 {a.title}</p>
                    ))}
                  {atlas.knowledgeDocs
                    .filter((d) => d.projectId === selected.id)
                    .map((d) => (
                      <p key={d.id} className="text-navy-200">📄 {d.title}</p>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="atlas-card flex items-center justify-center text-sm text-navy-400">
              Select a project to see its instructions, conversations and outputs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
