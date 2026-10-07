import { useEffect, useRef, useState } from 'react';
import { filterSessions, sessions } from './data.js';
import GroupFilter from './GroupFilter.jsx';
import SessionCard from './SessionCard.jsx';
import SessionDetail from './SessionDetail.jsx';
import EmptyState from './EmptyState.jsx';

// Démo de l'état vide : ouvrir la page avec ?demo=empty
const demoEmpty = new URLSearchParams(window.location.search).get('demo') === 'empty';

export default function App() {
  const [group, setGroup] = useState('all');
  const [openId, setOpenId] = useState(null);
  const triggerRef = useRef(null); // bouton qui a ouvert le détail

  const visible = demoEmpty ? [] : filterSessions(group);
  const openSession = sessions.find(s => s.id === openId);

  function handleOpen(id, button) {
    triggerRef.current = button;
    setOpenId(id);
  }

  // Détail fermé et retiré de la page : le focus revient au bouton déclencheur.
  useEffect(() => {
    if (openId === null && triggerRef.current) triggerRef.current.focus();
  }, [openId]);

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-bold text-slate-900">Planning</h1>

      {demoEmpty && (
        <p className="mt-3 rounded-md border border-amber-700 bg-amber-50 p-3 text-sm text-amber-950">
          Mode démo : liste vide simulée (<code>?demo=empty</code>). <a className="underline" href={window.location.pathname}>Quitter la démo</a>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <GroupFilter value={group} onChange={setGroup} />
        <p role="status" className="text-sm text-slate-700">
          {visible.length} séance{visible.length > 1 ? 's' : ''}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Aucune séance à afficher">Essayez un autre groupe ou revenez plus tard.</EmptyState>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(s => (
            <SessionCard key={s.id} session={s} isOpen={s.id === openId} onOpen={handleOpen} />
          ))}
        </ul>
      )}

      {openSession && <SessionDetail session={openSession} onClose={() => setOpenId(null)} />}
    </main>
  );
}