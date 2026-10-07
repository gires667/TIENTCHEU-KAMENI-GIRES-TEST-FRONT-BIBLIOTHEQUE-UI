export const PERIOD = { am: 'Matin', pm: 'Après-midi' };

export function formatDate(iso) {
  const text = new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}
