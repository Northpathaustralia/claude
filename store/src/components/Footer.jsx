import React from 'react';
import { Link } from 'react-router-dom';
import { EmailSignup, TideBars } from './ui.jsx';

const COLS = [
  {
    h: 'Shop',
    links: [
      ['Shop All', '/shop'], ['Drop 001: First Light', '/drop/first-light'],
      ['Build Your State', '/uniform'], ["Men's Styling", '/mens'], ["Women's Styling", '/womens'],
    ],
  },
  {
    h: 'Company',
    links: [
      ['About', '/about'], ['Coastform Construction', '/construction'],
      ['Journal', '/journal'], ['State Crew (Creators)', '/creators'], ['Contact', '/contact'],
    ],
  },
  {
    h: 'Help',
    links: [
      ['Fit Guide', '/fit-guide'], ['FAQ', '/faq'], ['Shipping', '/shipping'],
      ['Returns & Exchanges', '/returns'], ['Account', '/account'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <TideBars className="h-10 w-20" />
            <h3 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide">First access, no noise.</h3>
            <p className="mt-2 max-w-sm font-mono text-xs leading-relaxed text-concrete">
              Every drop opens to the list 48 hours early. Real timelines, real stock, the build as it happens.
            </p>
            <div className="mt-5"><EmailSignup dark sms id="footer-email" /></div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((c) => (
              <nav key={c.h} aria-label={c.h}>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-concrete">{c.h}</p>
                <ul className="mt-3 space-y-2">
                  {c.links.map(([label, to]) => (
                    <li key={to + label}>
                      <Link to={to} className="text-sm text-bone/80 transition-colors hover:text-cobalt">{label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-concrete/70">
            © TIDESTATE {new Date().getFullYear()} · 28.0167°S / 153.4000°E — Gold Coast QLD · ABN pending
          </p>
          <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-concrete/70">
            <Link to="/privacy" className="hover:text-bone">Privacy</Link>
            <Link to="/terms" className="hover:text-bone">Terms</Link>
            <a href="https://instagram.com" rel="noreferrer noopener" target="_blank" className="hover:text-bone">Instagram</a>
            <a href="https://tiktok.com" rel="noreferrer noopener" target="_blank" className="hover:text-bone">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
