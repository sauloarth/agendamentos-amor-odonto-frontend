// Cartão selecionável usado nas etapas de procedimento e profissional.
const OptionCard = ({ selected, disabled, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={`w-full rounded-xl border bg-surface p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
      selected ? 'border-pine-600 ring-2 ring-pine-600/20' : 'border-ink/10 hover:border-pine-400'
    }`}
  >
    {children}
  </button>
);

export default OptionCard;
