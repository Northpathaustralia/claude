import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MonitorsProvider } from './context/MonitorsContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Pricing from './pages/Pricing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';
import { Btn } from './components/ui.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50">404</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold">That page doesn't exist.</h1>
      <div className="mt-6"><Btn to="/">Back to home</Btn></div>
    </main>
  );
}

export default function App() {
  return (
    <MonitorsProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-paper"
            onClick={(e) => {
              // This app uses HashRouter, where the fragment after "#" is
              // the route path — letting the browser set location.hash to
              // "#main" would be read as a navigation to a nonexistent
              // "/main" route (→ 404) instead of jumping to the content
              // landmark below. Scroll/focus it manually instead.
              e.preventDefault();
              const el = document.getElementById('main');
              if (el) { el.setAttribute('tabindex', '-1'); el.focus(); el.scrollIntoView(); }
            }}
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/app" element={<Dashboard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </MonitorsProvider>
  );
}
