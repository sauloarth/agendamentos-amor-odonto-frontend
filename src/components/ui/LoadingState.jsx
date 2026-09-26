import Spinner from './Spinner';

const LoadingState = ({ label = 'Carregando...', className = 'py-16' }) => (
  <div role="status" className={`flex items-center justify-center gap-3 text-ink/60 ${className}`}>
    <Spinner />
    <span>{label}</span>
  </div>
);

export default LoadingState;
