// Etapas já concluídas (índice < `current`) são clicáveis para voltar.
const StepIndicator = ({ steps, current, onSelect }) => (
  <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
    {steps.map((label, index) => {
      const done = index < current;
      const active = index === current;
      const badge = (
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
            active ? 'bg-pine-600 text-canvas' : done ? 'bg-pine-100 text-pine-700' : 'bg-ink/10 text-ink/50'
          }`}
        >
          {done ? '✓' : index + 1}
        </span>
      );

      return (
        <li key={label} aria-current={active ? 'step' : undefined}>
          {done ? (
            <button
              onClick={() => onSelect(index)}
              className="flex items-center gap-2 text-ink/70 hover:text-ink"
            >
              {badge}
              <span className="underline-offset-2 hover:underline">{label}</span>
            </button>
          ) : (
            <span className={`flex items-center gap-2 ${active ? 'text-ink font-medium' : 'text-ink/40'}`}>
              {badge}
              {label}
            </span>
          )}
        </li>
      );
    })}
  </ol>
);

export default StepIndicator;
