import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PRODUCTS, fmt } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';
import GarmentArt from './GarmentArt.jsx';

const NAV = [
  { to: '/shop', label: 'Shop All' },
  { to: '/drop/first-light', label: 'Drop 001' },
  { to: '/riviera', label: 'The Riviera Set' },
  { to: '/uniform', label: 'Build Your State' },
  { to: '/mens', label: 'Men' },
  { to: '/womens', label: 'Women' },
  { to: '/construction', label: 'Coastform' },
  { to: '/journal', label: 'Journal' },
];

export default function Header() {
  const { cartCount, setCartOpen, searchOpen, setSearchOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* mobile menu button */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          data-testid="mobile-menu-button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>

        <Link to="/" className="flex items-center gap-2" aria-label="TIDESTATE home" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
            <rect width="64" height="64" rx="12" fill="#090909" />
            <rect x="12" y="16" width="10" height="32" fill="#F1EEE6" />
            <rect x="27" y="26" width="10" height="22" fill="#F1EEE6" />
            <rect x="42" y="36" width="10" height="12" fill="#FF4A1F" />
            <rect x="12" y="50" width="40" height="3" fill="#1747FF" />
          </svg>
          <span className="font-display text-lg font-extrabold tracking-[0.15em]">TIDESTATE</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to} to={n.to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-cobalt ${isActive ? 'text-cobalt' : 'text-ink'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2" aria-label="Search" data-testid="search-button" onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <Link to="/account" className="hidden p-2 sm:block" aria-label="Account">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
          </Link>
          <button className="relative p-2" aria-label={`Cart, ${cartCount} items`} data-testid="cart-button" onClick={() => setCartOpen(true)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h12l1.5 13h-15L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
            {cartCount > 0 && (
              <span data-testid="cart-count" className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 font-mono text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

      {/* mobile nav drawer — rendered outside <header> because backdrop-blur on
          header creates a containing block for fixed descendants, which would
          collapse this drawer's fixed positioning to the header's own box */}
      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink lg:hidden" data-testid="mobile-nav">
          <nav className="flex flex-col px-6 py-8" aria-label="Mobile">
            {NAV.map((n, i) => (
              <NavLink
                key={n.to} to={n.to} onClick={() => setMenuOpen(false)}
                className="border-b border-bone/10 py-4 font-display text-2xl font-extrabold uppercase tracking-wide text-bone hover:text-cobalt"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-6 flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.2em] text-concrete">
              <Link to="/fit-guide" onClick={() => setMenuOpen(false)} className="hover:text-bone">Fit Guide</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-bone">About</Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="hover:text-bone">Account</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-bone">Contact</Link>
            </div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-concrete/60">
              28.0167°S / 153.4000°E — Gold Coast QLD
            </p>
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = q.trim()
    ? PRODUCTS.filter((p) =>
        [p.name, p.kind, p.tagline, p.short].join(' ').toLowerCase().includes(q.trim().toLowerCase()),
      )
    : PRODUCTS;

  return (
    <div className="fixed inset-0 z-50 bg-ink/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Search" data-testid="search-overlay">
      <div className="mx-auto max-w-2xl pt-10">
        <div className="flex items-center gap-3 border-b-2 border-bone/30 pb-3">
          <input
            ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search the range…" aria-label="Search products"
            data-testid="search-input"
            className="min-w-0 flex-1 bg-transparent font-display text-2xl font-bold text-bone outline-none placeholder:text-concrete/50"
          />
          <button onClick={onClose} aria-label="Close search" className="p-2 text-bone hover:text-signal" data-testid="search-close">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <ul className="mt-6 divide-y divide-bone/10">
          {results.map((p) => (
            <li key={p.id}>
              <button
                className="flex w-full items-center gap-4 py-3 text-left hover:bg-bone/5"
                data-testid={`search-result-${p.id}`}
                onClick={() => { onClose(); navigate(`/product/${p.id}`); }}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden"><GarmentArt kind={p.kind} colour={p.colours[0]} className="h-full w-full" /></div>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-bone">{p.name}</p>
                  <p className="font-mono text-xs text-concrete">{p.tagline}</p>
                </div>
                <span className="ml-auto font-mono text-sm text-bone">{fmt(p.price)}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="py-8 font-mono text-sm text-concrete">No matches. Try “tee”, “hoodie”, “cap”…</li>
          )}
        </ul>
      </div>
    </div>
  );
}
