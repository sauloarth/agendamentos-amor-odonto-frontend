import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-pine-600 text-canvas hover:bg-pine-700',
  secondary: 'border border-ink/15 bg-surface text-ink hover:bg-ink/5',
  ghost: 'text-ink/70 hover:text-ink hover:bg-ink/5',
  danger: 'bg-danger text-canvas hover:bg-danger/90',
};

const Button = ({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
);

export default Button;
