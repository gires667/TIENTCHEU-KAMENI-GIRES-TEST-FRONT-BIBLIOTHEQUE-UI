import { useEffect, useState } from 'react';
// Point de départ F2 volontairement imparfait.
export default function PlanningList({ loadSessions }) {
const [group, setGroup] = useState('all');
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [attempt, setAttempt] = useState(0);
useEffect(() => {
  setLoading(true);
  setError(null);
  loadSessions({ group }).then(
    result => {
      setItems(result);
      setLoading(false);
    },
    err => {
      setError(err);
      setLoading(false);
    }
  );
}, [group, loadSessions, attempt]);
return <section>
<h1>Planning</h1>
<select aria-label="Groupe" value={group} onChange={e => setGroup(e.target.value)}>
<option value="all">Tous</option><option value="A">Groupe A</option>
<option value="B">Groupe B</option><option value="Promotion">Promotion</option>
</select>
{loading
  ? <p role="status">Chargement…</p>
  : error
    ? <div role="alert">
        <p>Erreur : impossible de charger les séances.</p>
        <button type="button" onClick={() => setAttempt(a => a + 1)}>Réessayer</button>
      </div>
    : items.length === 0
      ? <p>Aucune séance pour ce groupe.</p>
      : <ul>{items.map(s => <li key={s.id}>{s.title}</li>)}</ul>}
</section>;
}