const Field = ({ label, name, error, hint, ...inputProps }) => (
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      aria-invalid={Boolean(error)}
      aria-describedby={error || hint ? `${name}-help` : undefined}
      className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pine-400 ${
        error ? 'border-danger' : 'border-ink/15'
      }`}
      {...inputProps}
    />
    {(error || hint) && (
      <p id={`${name}-help`} className={`text-xs mt-1 ${error ? 'text-danger' : 'text-ink/50'}`}>
        {error || hint}
      </p>
    )}
  </div>
);

export default Field;
