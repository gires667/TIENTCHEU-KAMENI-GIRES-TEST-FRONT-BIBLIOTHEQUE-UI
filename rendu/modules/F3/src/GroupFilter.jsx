export default function GroupFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="group-filter" className="text-sm font-medium text-slate-900">
        Groupe
      </label>
      <select
        id="group-filter"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="min-h-11 rounded-md border border-slate-500 bg-white px-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        <option value="all">Tous</option>
        <option value="A">Groupe A</option>
        <option value="B">Groupe B</option>
        <option value="Promotion">Promotion</option>
      </select>
    </div>
  );
}