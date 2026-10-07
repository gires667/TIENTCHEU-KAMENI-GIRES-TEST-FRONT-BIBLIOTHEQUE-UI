export default function EmptyState({ title, children }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-slate-500 bg-white p-6 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {children && <p className="mt-1 text-sm text-slate-700">{children}</p>}
    </div>
  );
}