// ATLAS ONE application routes. The Atlas shell wraps everything; the
// NorthPath workspace keeps its original URL space (/leads, /tasks, …) so the
// operations engine's deep links keep working unchanged.
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/StoreContext.jsx';
import { AtlasStoreProvider } from '@/store/AtlasStoreContext.jsx';
import AtlasLayout from '@/components/atlas/AtlasLayout.jsx';

// Atlas pages
import Home from '@/pages/atlas/Home.jsx';
import Chat from '@/pages/atlas/Chat.jsx';
import Projects from '@/pages/atlas/Projects.jsx';
import Studio from '@/pages/atlas/Studio.jsx';
import Council from '@/pages/atlas/Council.jsx';
import Business from '@/pages/atlas/Business.jsx';
import Finance from '@/pages/atlas/Finance.jsx';
import KnowledgePage from '@/pages/atlas/KnowledgePage.jsx';
import MemoryPage from '@/pages/atlas/MemoryPage.jsx';
import Integrations from '@/pages/atlas/Integrations.jsx';
import AtlasSettings from '@/pages/atlas/AtlasSettings.jsx';
import NorthPathWorkspace from '@/pages/atlas/NorthPathWorkspace.jsx';

// NorthPath workspace pages (original NPAOS)
import Dashboard from '@/pages/Dashboard.jsx';
import Leads from '@/pages/Leads.jsx';
import LeadDetail from '@/pages/LeadDetail.jsx';
import Content from '@/pages/Content.jsx';
import Referrals from '@/pages/Referrals.jsx';
import Reports from '@/pages/Reports.jsx';
import Tasks from '@/pages/Tasks.jsx';
import Settings from '@/pages/Settings.jsx';

// HashRouter keeps the app deployable to any static host (GitHub Pages,
// Netlify, S3) and the double-clickable single-file build.
export default function App() {
  return (
    <AtlasStoreProvider>
      <StoreProvider>
        <HashRouter>
          <Routes>
            <Route element={<AtlasLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<Projects />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/council" element={<Council />} />
              <Route path="/business" element={<Business />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/memory" element={<MemoryPage />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/settings" element={<AtlasSettings />} />

              <Route element={<NorthPathWorkspace />}>
                <Route path="/northpath" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:id" element={<LeadDetail />} />
                <Route path="/content" element={<Content />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/northpath/data" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </StoreProvider>
    </AtlasStoreProvider>
  );
}
