import Badge from './Badge.jsx';

const DOMAIN = {
  web:    'bg-blue-100 text-blue-900',
  data:   'bg-purple-100 text-purple-900',
  cyber:  'bg-rose-100 text-rose-900',
  projet: 'bg-slate-200 text-slate-900',
};

export default function DomainBadge({ domain }) {
  return <Badge className={DOMAIN[domain]}>{domain}</Badge>;
}