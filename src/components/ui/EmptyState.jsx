const EmptyState = ({ title, description, action }) => (
  <div className="rounded-xl border border-dashed border-ink/15 bg-surface/60 px-6 py-12 text-center">
    <h3 className="text-lg mb-1">{title}</h3>
    {description && <p className="text-sm text-ink/60 max-w-sm mx-auto">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
