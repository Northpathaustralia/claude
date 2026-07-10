// ---------------------------------------------------------------------------
// ATLAS ONE home: personalised briefing built from real local data, quick
// actions, and an honest system map of what works today vs what's planned.
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext.jsx';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { buildBriefing } from '../../atlas/briefing.js';
import { voiceSupport, speak } from '../../atlas/voice.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

const QUICK_ACTIONS = [
  { to: '/chat/new', label: 'Ask Atlas', desc: 'Start a conversation', icon: '💬' },
  { to: '/council', label: 'Convene the council', desc: 'Specialist decision brief', icon: '🧠' },
  { to: '/studio', label: 'Create something', desc: 'Documents, decks, sites, models', icon: '🎨' },
  { to: '/leads', label: 'NorthPath leads', desc: 'Open pipeline', icon: '👥' },
];

const SYSTEM_MAP = [
  { name: 'Chat + intelligence modes (Fast → X10)', status: 'working' },
  { name: 'Projects, user-controlled memory, knowledge search', status: 'working' },
  { name: 'Executive Decision Council (18 specialists)', status: 'working' },
  { name: 'AI Studio (documents, decks, sites, spreadsheets, code)', status: 'working' },
  { name: 'NorthPath workspace (leads, scoring, content, reports)', status: 'working' },
  { name: 'Voice push-to-talk and read-aloud', status: 'beta' },
  { name: 'Financial Centre manual tracking', status: 'working' },
  { name: 'Live integrations (HubSpot, Gmail, Xero…)', status: 'planned' },
  { name: 'Computer control agent', status: 'planned' },
  { name: 'Live web research', status: 'planned' },
];

export default function Home() {
  const { state: npaos } = useStore();
  const { atlas } = useAtlas();
  const briefing = buildBriefing({ npaos, atlas });
  const support = voiceSupport();
  const connected = Object.values(atlas.settings.keys || {}).some(Boolean);

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Briefing */}
        <div className="rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-900 to-navy-850 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">{briefing.greeting}</h1>
              <ul className="mt-3 space-y-1.5">
                {briefing.lines.map((l) => (
                  <li key={l} className="text-sm text-navy-200">• {l}</li>
                ))}
              </ul>
            </div>
            {support.tts && (
              <button type="button" className="btn-ghost-dark text-xs" onClick={() => speak(briefing.speech)}>
                🔊 Read briefing <StatusBadge status="beta" className="ml-1" />
              </button>
            )}
          </div>

          {!connected && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
              <strong>Atlas isn't fully awake yet.</strong> Connect an AI provider (about two minutes) to unlock real reasoning:{' '}
              <Link to="/settings" className="font-semibold underline">open Settings → AI Providers</Link>.
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.to} to={a.to} className="atlas-card transition hover:border-emerald-500/50">
              <p className="text-xl">{a.icon}</p>
              <p className="mt-1 text-sm font-semibold text-white">{a.label}</p>
              <p className="text-xs text-navy-300">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* Today's priorities from the real operations engine */}
          <div className="atlas-card">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Today's priorities</h2>
              <StatusBadge status="working" />
            </div>
            {briefing.priorities.length === 0 && <p className="text-xs text-navy-300">Nothing urgent on the list. Nice.</p>}
            <div className="space-y-2">
              {briefing.priorities.map((p) => (
                <Link key={p.id} to={p.link} className="block rounded-lg border border-navy-700/60 bg-navy-900 p-2.5 transition hover:border-emerald-500/40">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${p.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{p.priority}</span>
                    <span className="text-[10px] uppercase tracking-wide text-navy-400">{p.category}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-navy-100">{p.title}</p>
                  <p className="text-xs text-navy-400">{p.detail}</p>
                </Link>
              ))}
            </div>
            <Link to="/tasks" className="mt-2 inline-block text-xs font-medium text-emerald-400 hover:underline">Full task list →</Link>
          </div>

          {/* System map */}
          <div className="atlas-card">
            <h2 className="mb-2 text-sm font-semibold text-white">ATLAS ONE system map — honest status</h2>
            <div className="space-y-1.5">
              {SYSTEM_MAP.map((s) => (
                <div key={s.name} className="flex items-center justify-between gap-2 text-xs text-navy-200">
                  <span>{s.name}</span>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-4 text-navy-400">
              Quality rule: nothing on this platform pretends to work. Demonstration output is always labelled, and planned features say Planned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
