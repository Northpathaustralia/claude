// ---------------------------------------------------------------------------
// NorthPath workspace shell inside ATLAS ONE. The original NPAOS pages render
// unchanged on their light surface beneath this sub-navigation.
// ---------------------------------------------------------------------------
import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/northpath', label: 'Dashboard', end: true },
  { to: '/leads', label: 'Leads' },
  { to: '/content', label: 'Content Engine' },
  { to: '/referrals', label: 'Referral Partners' },
  { to: '/reports', label: 'Reports' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/northpath/data', label: 'Data' },
];

export default function NorthPathWorkspace() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-4 pt-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-bold text-brand-800">NorthPath Workspace</h1>
          <p className="hidden text-xs text-slate-500 sm:block">Leads, content, referrals and reporting — your AI team for NorthPath.</p>
        </div>
        <nav className="mt-2 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'border-brand-600 text-brand-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
      <p className="border-t border-slate-200 bg-white px-4 py-2 text-[10px] text-slate-400">
        Educational tool — never promises approvals or financial outcomes. James approves all customer-facing actions.
      </p>
    </div>
  );
}
