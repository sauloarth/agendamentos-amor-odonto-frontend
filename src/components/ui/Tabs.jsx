import { useId } from 'react';

// Abas controladas. `tabs`: [{ key, label, count? }]; o conteúdo da aba ativa vem em `children`.
const Tabs = ({ tabs, active, onChange, label, children }) => {
  const baseId = useId();
  const tabId = (key) => `${baseId}-tab-${key}`;

  return (
    <>
      <div role="tablist" aria-label={label} className="mb-5 flex flex-wrap gap-2">
        {tabs.map(({ key, label: tabLabel, count }) => {
          const selected = key === active;
          return (
            <button
              key={key}
              id={tabId(key)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              onClick={() => onChange(key)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors ${
                selected ? 'border-pine-600 bg-pine-600 text-canvas' : 'border-ink/10 bg-surface hover:border-pine-400'
              }`}
            >
              {tabLabel}
              {count !== undefined && (
                <span className={`ml-1 ${selected ? 'text-canvas/70' : 'text-ink/50'}`}>({count})</span>
              )}
            </button>
          );
        })}
      </div>
      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={tabId(active)}>
        {children}
      </div>
    </>
  );
};

export default Tabs;
