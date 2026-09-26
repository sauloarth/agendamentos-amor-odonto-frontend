const Spinner = ({ className = 'h-5 w-5' }) => (
  <span
    aria-hidden="true"
    className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
  />
);

export default Spinner;
