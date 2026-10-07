import Badge from './Badge.jsx';

const STATUS = {
  confirmed: { label: 'Confirmée', icon: '✓', className: 'bg-green-100 text-green-900' },
  proposed:  { label: 'Proposée',  icon: '…', className: 'bg-amber-100 text-amber-900' },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status];
  return (
    <Badge className={s.className}>
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </Badge>
  );
}