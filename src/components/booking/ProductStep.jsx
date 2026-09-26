import { listProducts } from '../../api/products';
import useAsync from '../../hooks/useAsync';
import { formatCurrency, formatDuration } from '../../utils/currency';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';
import OptionCard from './OptionCard';

const ProductStep = ({ selectedId, onSelect }) => {
  const { data, loading, error, reload } = useAsync(() => listProducts(), []);

  if (loading) return <LoadingState label="Carregando procedimentos..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const products = data.filter((p) => p.active);
  if (!products.length) {
    return (
      <EmptyState
        title="Nenhum procedimento disponível"
        description="A clínica ainda não abriu procedimentos para agendamento online."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => {
        const available = product.professionals?.length > 0;
        return (
          <OptionCard
            key={product._id}
            selected={product._id === selectedId}
            disabled={!available}
            onClick={() => onSelect(product)}
          >
            <p className="font-medium">{product.name}</p>
            <p className="mt-1 text-sm text-ink/60">
              {formatDuration(product.durationMinutes)} · {formatCurrency(product.price)}
            </p>
            {!available && <p className="mt-2 text-xs text-ink/50">Sem profissional disponível</p>}
          </OptionCard>
        );
      })}
    </div>
  );
};

export default ProductStep;
