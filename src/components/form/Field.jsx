const CONTROL_CLASS = 'w-full rounded-lg border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pine-400';

// `as`: 'input' (padrão), 'select' (opções em `children`) ou 'textarea'.
const Field = ({ label, name, error, hint, as: Control = 'input', children, id = name, ...controlProps }) => (
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <Control
      id={id}
      name={name}
      aria-invalid={Boolean(error)}
      aria-describedby={error || hint ? `${id}-help` : undefined}
      className={`${CONTROL_CLASS} ${error ? 'border-danger' : 'border-ink/15'}`}
      {...controlProps}
    >
      {children}
    </Control>
    {(error || hint) && (
      <p id={`${id}-help`} className={`text-xs mt-1 ${error ? 'text-danger' : 'text-ink/50'}`}>
        {error || hint}
      </p>
    )}
  </div>
);

export default Field;
