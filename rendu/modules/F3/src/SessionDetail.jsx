import { useEffect, useRef } from 'react';
import DomainBadge from './DomainBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatDate, PERIOD } from './format.js';
import { teachers } from './data.js';

export default function SessionDetail({ session, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d.open) d.showModal(); // le navigateur déplace le focus dans la fenêtre
  }, []);

  const teacher = session.teacherId ? teachers[session.teacherId] : 'Aucun formateur';

  return (
    <dialog
      ref={dialogRef}
      id={`detail-${session.id}`}
      aria-labelledby={`detail-title-${session.id}`}
      onClose={onClose}
      onClick={e => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border border-slate-400 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/60"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 id={`detail-title-${session.id}`} className="min-w-0 wrap-break-word text-lg font-bold">{session.title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current.close()}
            className="min-h-11 shrink-0 rounded-md border border-slate-600 px-3 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Fermer
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <DomainBadge domain={session.domain} />
          <StatusBadge status={session.status} />
        </div>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-medium text-slate-700">Date</dt><dd>{formatDate(session.date)}</dd>
          <dt className="font-medium text-slate-700">Période</dt><dd>{PERIOD[session.period]}</dd>
          <dt className="font-medium text-slate-700">Groupe</dt><dd>{session.group}</dd>
          <dt className="font-medium text-slate-700">Mode</dt><dd>{session.mode}</dd>
          <dt className="font-medium text-slate-700">Formateur</dt><dd>{teacher}</dd>
        </dl>
        {session.mode === 'AUTO' && (
          <p className="mt-4 text-sm text-slate-700">Séance en autonomie : pas de formateur, statut « proposée ».</p>
        )}
      </div>
    </dialog>
  );
}