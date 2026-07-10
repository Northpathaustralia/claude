import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DROP } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';

/* Shared small components: buttons, headings, tide motif, countdown, email capture. */

export const Btn = ({ to, onClick, children, variant = 'ink', className = '', type = 'button', disabled, ...rest }) => {
  const styles = {
    ink: 'bg-ink text-bone hover:bg-cobalt',
    bone: 'bg-bone text-ink hover:bg-concrete/60',
    outline: 'border-2 border-current text-current hover:bg-ink hover:text-bone hover:border-ink',
    cobalt: 'bg-cobalt text-bone hover:bg-ink',
  };
  const cls = `inline-flex items-center justify-center gap-2 px-6 py-3.5 font-display font-bold uppercase tracking-widest2 text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} onClick={onClick} {...rest}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>{children}</button>;
};

export const Kicker = ({ children, light }) => (
  <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${light ? 'text-concrete' : 'text-ink/60'}`}>{children}</p>
);

export const H2 = ({ children, light, className = '' }) => (
  <h2 className={`font-display font-extrabold uppercase leading-[0.95] tracking-tight text-3xl sm:text-5xl ${light ? 'text-bone' : 'text-ink'} ${className}`}>
    {children}
  </h2>
);

export const TideBars = ({ className = '', tone = '#F1EEE6' }) => (
  <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
    <rect x="0" y="10" width="18" height="40" fill={tone} />
    <rect x="26" y="22" width="18" height="28" fill={tone} />
    <rect x="52" y="34" width="18" height="16" fill="#FF4A1F" />
    <rect x="78" y="18" width="18" height="32" fill="#1747FF" />
    <rect x="0" y="52" width="96" height="3" fill={tone} />
  </svg>
);

export const StateLine = ({ className = '' }) => (
  <div className={`flex items-center gap-0 ${className}`} aria-hidden="true">
    <div className="h-[3px] flex-1 bg-concrete" />
    <div className="h-[9px] w-24 bg-cobalt" />
    <div className="h-[9px] w-4 bg-signal" />
  </div>
);

export const useCountdown = (iso) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
};

/** Countdown to a real, configured event only. Renders nothing when disabled or passed. */
export const CountdownBanner = () => {
  const t = useCountdown(DROP.launchesAt);
  if (!DROP.countdownEnabled || !t) return null;
  return (
    <Link to="/drop/first-light" className="block bg-cobalt text-bone" data-testid="countdown-banner">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">
        <span className="hidden sm:inline">{DROP.name} — public release</span>
        <span className="sm:hidden">{DROP.name}</span>
        <span className="font-bold tabular-nums">{t.d}d {t.h}h {t.m}m {t.s}s</span>
        <span className="rounded-sm bg-signal px-1.5 py-0.5 text-[9px] font-bold text-ink">REAL TIMER</span>
      </div>
    </Link>
  );
};

export const EmailSignup = ({ dark, sms = false, id = 'email-signup' }) => {
  const { vip, setVip } = useStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  if (vip || done) {
    return (
      <div className={`font-mono text-sm ${dark ? 'text-bone' : 'text-ink'}`} data-testid="vip-confirmed">
        ✓ You're on the list{(vip?.email || email) ? ` — ${vip?.email || email}` : ''}. First access at first light.
      </div>
    );
  }
  return (
    <form
      className="flex w-full max-w-md flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes('@')) return;
        setVip({ email, sms: phone || null });
        setDone(true);
      }}
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={id}>Email address</label>
        <input
          id={id} type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email — first access to every drop"
          className={`min-w-0 flex-1 border-2 bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:opacity-60 focus:border-cobalt ${dark ? 'border-concrete/40 text-bone' : 'border-ink/30 text-ink'}`}
        />
        <Btn type="submit" variant={dark ? 'bone' : 'ink'}>Join</Btn>
      </div>
      {sms && (
        <input
          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile (optional) — drop alerts only, 2–4/mo"
          aria-label="Mobile number (optional)"
          className={`border-2 bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:opacity-60 focus:border-cobalt ${dark ? 'border-concrete/40 text-bone' : 'border-ink/30 text-ink'}`}
        />
      )}
      <p className={`font-mono text-[10px] ${dark ? 'text-concrete' : 'text-ink/50'}`}>
        No spam. Unsubscribe anytime. We email when there's a reason.
      </p>
    </form>
  );
};

export const Section = ({ children, dark, className = '', id }) => (
  <section id={id} className={`${dark ? 'bg-ink text-bone' : 'bg-bone text-ink'} ${className}`}>
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">{children}</div>
  </section>
);
