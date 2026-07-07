// Compact score + grade display used in tables and cards.
import Badge, { gradeTone } from '@/components/ui/Badge.jsx';

export default function ScoreBadge({ score, grade }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge tone={gradeTone(grade)}>{grade}</Badge>
      <span className="text-xs font-semibold text-slate-600">{score}/100</span>
    </span>
  );
}
