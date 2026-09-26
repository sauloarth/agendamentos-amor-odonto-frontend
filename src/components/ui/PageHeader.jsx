const PageHeader = ({ title, subtitle, actions }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-3xl">{title}</h1>
      {subtitle && <p className="text-ink/60 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
