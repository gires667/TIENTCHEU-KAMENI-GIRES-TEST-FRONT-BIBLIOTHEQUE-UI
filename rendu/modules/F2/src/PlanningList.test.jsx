import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import PlanningList from './PlanningList.jsx';
import { sessions, filterSessions } from './sessions.js';

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test('affiche un chargement tant que la promesse est en attente', () => {
  const loadSessions = vi.fn(() => new Promise(() => {}));

  render(<PlanningList loadSessions={loadSessions} />);

  expect(screen.getByRole('status')).toHaveTextContent('Chargement');
});

test('affiche les titres après résolution et fait disparaître le chargement', async () => {
  const d = deferred();
  const loadSessions = vi.fn(() => d.promise);

  render(<PlanningList loadSessions={loadSessions} />);
  expect(screen.getByRole('status')).toBeInTheDocument();

  d.resolve(sessions);

  expect(await screen.findByText('React composants')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('le filtre A demande le groupe A et affiche A + Promotion sans B', async () => {
  const user = userEvent.setup();
  const loadSessions = vi.fn(({ group }) => Promise.resolve(filterSessions(group)));

  render(<PlanningList loadSessions={loadSessions} />);
  await screen.findByText('React composants');

  const select = screen.getByRole('combobox', { name: 'Groupe' });
  await user.tab();
  expect(select).toHaveFocus();

  await user.selectOptions(select, 'A');

  await waitFor(() =>
    expect(loadSessions).toHaveBeenLastCalledWith({ group: 'A' })
  );
  await screen.findByText('Authentification');

  ['React composants', 'Données et SQL', 'Authentification', 'Travail autonome']
    .forEach(t => expect(screen.getByText(t)).toBeInTheDocument());
  ['React événements', 'Revue de projet']
    .forEach(t => expect(screen.queryByText(t)).not.toBeInTheDocument());
});

test('une réponse vide affiche un message explicite sans ancien résultat', async () => {
  const user = userEvent.setup();
  const loadSessions = vi.fn(({ group }) =>
    Promise.resolve(group === 'B' ? [] : filterSessions(group))
  );

  render(<PlanningList loadSessions={loadSessions} />);
  await screen.findByText('React composants');

  await user.selectOptions(screen.getByLabelText('Groupe'), 'B');

  expect(await screen.findByText(/aucune séance/i)).toBeInTheDocument();
  expect(screen.queryByText('React composants')).not.toBeInTheDocument();
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});

test('une erreur est visible et Réessayer relance la même demande', async () => {
  const user = userEvent.setup();
  const first = deferred();
  const second = deferred();
  const loadSessions = vi.fn()
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise);

  render(<PlanningList loadSessions={loadSessions} />);

  first.reject(new Error('réseau'));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /réessayer/i }));
  expect(loadSessions).toHaveBeenCalledTimes(2);
  expect(loadSessions).toHaveBeenLastCalledWith({ group: 'all' });

  second.resolve(sessions);
  expect(await screen.findByText('Données et SQL')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('la réponse tardive de la 1re demande ne remplace pas la plus récente', async () => {
  const user = userEvent.setup();
  const d1 = deferred();
  const d2 = deferred();
  const loadSessions = vi.fn()
    .mockReturnValueOnce(d1.promise)
    .mockReturnValueOnce(d2.promise);

  render(<PlanningList loadSessions={loadSessions} />);

  await user.selectOptions(screen.getByLabelText('Groupe'), 'Promotion');

  d2.resolve(filterSessions('Promotion'));
  await screen.findByText('Données et SQL');

  d1.resolve(sessions);
  await new Promise(r => setTimeout(r, 20));

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.queryByText('React composants')).not.toBeInTheDocument();
});