// App shell: fixed sidebar navigation + scrollable main content area.
import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/leads', label: 'Leads', icon: '👥' },
  { to: '/content', label: 'Content Engine', icon: '📝' },
  { to: '/referrals', label: 'Referral Partners', icon: '🤝' },
  { to: '/reports', label: 'Reports', icon: '📈' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/settings', label: 'Settings & Data', icon: '⚙️' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
        <div className="border-b border-slate-100 px-5 py-4">
          <h1 className="text-lg font-bold text-brand-800">NorthPath AI OS</h1>
          <p className="text-xs text-slate-500">Your AI team, working for you</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="border-t border-slate-100 p-3 text-[10px] leading-4 text-slate-400">
          Educational tool — never promises approvals or financial outcomes. James approves all
          customer-facing actions.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 sm:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
