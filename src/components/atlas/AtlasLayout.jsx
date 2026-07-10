// ---------------------------------------------------------------------------
// ATLAS ONE shell: deep-navy sidebar + soft-white workspace. The NorthPath
// workspace pages render inside this shell with their own sub-navigation.
// ---------------------------------------------------------------------------
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';

const NAV = [
  { to: '/', label: 'Home', icon: '◆', end: true },
  { to: '/chat', label: 'Conversations', icon: '💬' },
  { to: '/projects', label: 'Projects', icon: '🗂️' },
  { to: '/studio', label: 'AI Studio', icon: '🎨' },
  { to: '/council', label: 'Agent Council', icon: '🧠' },
  { to: '/business', label: 'Business Centre', icon: '🏢' },
  { to: '/finance', label: 'Financial Centre', icon: '📊' },
  { to: '/knowledge', label: 'Knowledge', icon: '📚' },
  { to: '/memory', label: 'Memory', icon: '🔖' },
  { to: '/integrations', label: 'Integrations', icon: '🔌' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

function AtlasMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect width="100" height="100" rx="22" fill="#0d1a2f" />
      <path d="M50 16 80 84H66.5L50 45 33.5 84H20Z" fill="#34d399" />
      <circle cx="50" cy="76" r="7" fill="#34d399" />
    </svg>
  );
}

export default function AtlasLayout() {
  const navigate = useNavigate();
  const { atlas } = useAtlas();
  const connected = Object.values(atlas.settings.keys || {}).some(Boolean);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-navy-900 lg:flex">
        <div className="flex items-center gap-3 border-b border-navy-800 px-5 py-4">
          <AtlasMark />
          <div>
            <h1 className="text-base font-bold tracking-wide text-white">ATLAS ONE</h1>
            <p className="text-[10px] leading-3 text-navy-300">Think deeper. Build faster. Run everything.</p>
          </div>
        </div>

        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => navigate('/chat/new')}
            className="btn-emerald w-full"
          >
            + New conversation
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-navy-800 text-emerald-400' : 'text-navy-200 hover:bg-navy-850 hover:text-white'
                }`
              }
            >
              <span aria-hidden className="w-5 text-center text-xs">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-navy-800 p-3">
          <div className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {connected ? 'AI provider connected' : 'No AI provider connected'}
          </div>
          <p className="px-1 text-[10px] leading-4 text-navy-400">
            Local Edition v0.2 — your data and keys stay in this browser. Every feature is labelled Working, Beta, Demonstration or Planned.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-2 overflow-x-auto bg-navy-900 px-3 py-2 lg:hidden">
          <AtlasMark className="h-6 w-6 shrink-0" />
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
                  isActive ? 'bg-navy-800 text-emerald-400' : 'text-navy-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </header>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
