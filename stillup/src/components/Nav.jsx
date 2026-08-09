import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Btn } from './ui.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scrolls to the #features section on the landing page. Deliberately does
  // NOT use a real "#features" href — this app uses HashRouter, where
  // everything after "#" is a route path, so setting location.hash would be
  // interpreted as navigating to a (nonexistent) "/features" route instead
  // of scrolling. Navigate to "/" first if needed, then scroll manually.
  const goToFeatures = (e) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      requestAnimationFrame(() => {
        setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-up">●</span>
          StillUp
        </Link>
        <nav className="hidden items-center gap-6 font-display text-sm font-medium sm:flex">
          <Link to="/" onClick={goToFeatures}>Features</Link>
          <Link to="/pricing" className="hover:text-accent">Pricing</Link>
          <Link to="/app" className="hover:text-accent">Dashboard</Link>
        </nav>
        <div className="hidden sm:block"><Btn to="/app" variant="accent">Open dashboard</Btn></div>
        <button className="sm:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </div>
      {open && (
        <div className="border-t border-ink/10 bg-paper px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3 font-display text-sm font-medium">
            <Link to="/" onClick={goToFeatures}>Features</Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
            <Link to="/app" onClick={() => setOpen(false)}>Dashboard</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
