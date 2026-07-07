// Small status/label pill. `tone` maps to a colour family.
const TONES = {
  gray: 'bg-slate-100 text-slate-700',
  blue: 'bg-brand-100 text-brand-800',
  green: 'bg-emerald-100 text-emerald-800',
  yellow: 'bg-amber-100 text-amber-800',
  red: 'bg-rose-100 text-rose-800',
  purple: 'bg-violet-100 text-violet-800',
};

export default function Badge({ tone = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone] || TONES.gray} ${className}`}>
      {children}
    </span>
  );
}

/** Tone for a lead grade badge. */
export function gradeTone(grade) {
  if (grade === 'A+') return 'green';
  if (grade === 'A') return 'blue';
  if (grade === 'B') return 'yellow';
  if (grade === 'C') return 'gray';
  return 'red';
}

/** Tone for a lead status badge. */
export function statusTone(status) {
  switch (status) {
    case 'New': return 'blue';
    case 'Contacted':
    case 'Nurturing': return 'yellow';
    case 'Qualified':
    case 'Consultation Booked': return 'purple';
    case 'Consultation Completed':
    case 'Converted': return 'green';
    case 'Lost': return 'red';
    default: return 'gray';
  }
}

/** Tone for High/Medium/Low priorities. */
export function priorityTone(priority) {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'yellow';
  return 'gray';
}
