const TONES = {
  pine: 'bg-pine-50 text-pine-700',
  danger: 'bg-danger/10 text-danger',
  ochre: 'bg-ochre-400/15 text-ochre-600',
  neutral: 'bg-ink/5 text-ink/60',
};

const Badge = ({ tone = 'neutral', children }) => (
  <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>{children}</span>
);

export default Badge;
