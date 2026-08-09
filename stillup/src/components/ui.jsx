import React from 'react';
import { Link } from 'react-router-dom';

export const Btn = ({ to, href, onClick, children, variant = 'ink', className = '', type = 'button', disabled, ...rest }) => {
  const styles = {
    ink: 'bg-ink text-paper hover:bg-accent',
    paper: 'bg-paper text-ink border border-ink/15 hover:border-ink/40',
    outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
    accent: 'bg-accent text-paper hover:bg-ink',
    danger: 'bg-transparent text-down hover:bg-down/10',
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-display text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} onClick={onClick} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} onClick={onClick} {...rest}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>{children}</button>;
};

export const Kicker = ({ children }) => (
  <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">{children}</p>
);

export const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-ink/10 bg-white/60 p-6 shadow-sm ${className}`}>{children}</div>
);

export const StatusDot = ({ status }) => {
  const styles = {
    up: 'bg-up',
    down: 'bg-down animate-pulse2',
    unknown: 'bg-mist',
  };
  const label = { up: 'Up', down: 'Down', unknown: 'Not checked yet' }[status] || 'Unknown';
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${styles[status] || styles.unknown}`} aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </span>
  );
};

export const Section = ({ children, className = '', id }) => (
  <section id={id} className={className}>
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">{children}</div>
  </section>
);
