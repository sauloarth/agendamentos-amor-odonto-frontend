import Button from './Button';

const ErrorState = ({ message, onRetry }) => (
  <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center">
    <p className="text-danger mb-4">{message}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Tentar novamente
      </Button>
    )}
  </div>
);

export default ErrorState;
