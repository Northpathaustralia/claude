// NPAOS application routes. Every page lives under the shared Layout shell.
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/StoreContext.jsx';
import Layout from '@/components/layout/Layout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import Leads from '@/pages/Leads.jsx';
import LeadDetail from '@/pages/LeadDetail.jsx';
import Content from '@/pages/Content.jsx';
import Referrals from '@/pages/Referrals.jsx';
import Reports from '@/pages/Reports.jsx';
import Tasks from '@/pages/Tasks.jsx';
import Settings from '@/pages/Settings.jsx';

// HashRouter keeps the app deployable to any static host (GitHub Pages,
// Netlify, S3) with zero server-side route configuration.
export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/content" element={<Content />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
