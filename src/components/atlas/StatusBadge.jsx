// Honesty labels required by the ATLAS ONE quality rule: every feature is
// visibly Working, Beta, Demonstration, or Planned — never silently fake.
const TONES = {
  working: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  beta: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  demo: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  planned: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  // Integration statuses
  good: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  neutral: 'bg-slate-500/15 text-slate-500 border-slate-400/30',
  warn: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  info: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
  muted: 'bg-slate-500/10 text-slate-400 border-slate-400/20',
};

const LABELS = { working: 'Working', beta: 'Beta', demo: 'Demonstration', planned: 'Planned' };

export default function StatusBadge({ status, label, className = '' }) {
  const tone = TONES[status] || TONES.neutral;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone} ${className}`}>
      {label || LABELS[status] || status}
    </span>
  );
}
