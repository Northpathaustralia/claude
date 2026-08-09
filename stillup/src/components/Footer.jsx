import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} StillUp. Built in Australia.</p>
        <nav className="flex flex-wrap gap-4">
          <Link to="/pricing" className="hover:text-ink">Pricing</Link>
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
          <Link to="/app" className="hover:text-ink">Dashboard</Link>
        </nav>
      </div>
    </footer>
  );
}
