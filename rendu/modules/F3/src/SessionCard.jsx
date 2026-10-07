import DomainBadge from './DomainBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatDate, PERIOD } from './format.js';

export default function SessionCard({ session, isOpen, onOpen }) {
  return (
    <li className="min-w-0 rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
      <h2 className="wrap-break-word text-base font-semibold text-slate-900">{session.title}</h2>
      <p className="mt-1 text-sm text-slate-700">{formatDate(session.date)} · {PERIOD[session.period]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <DomainBadge domain={session.domain} />
        <StatusBadge status={session.status} />
      </div>
      <button
        type="button"
        aria-label={`Détails de ${session.title}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `detail-${session.id}` : undefined}
        onClick={e => onOpen(session.id, e.currentTarget)}
        className="mt-4 min-h-11 rounded-md border border-slate-600 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Détails
      </button>
    </li>
  );
}