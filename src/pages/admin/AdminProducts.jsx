import { useMemo, useState } from 'react';
import { listProducts, setProductActive } from '../../api/products';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import useAsync from '../../hooks/useAsync';
import useProfessionals from '../../hooks/useProfessionals';
import { formatCurrency, formatDuration } from '../../utils/currency';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProductForm from '../../components/admin/ProductForm';

const NEW = 'new';

const AdminProducts = () => {
  const toast = useToast();
  // Com token de admin a lista inclui os procedimentos inativos.
  const { data, loading, error, reload } = useAsync(() => listProducts(), []);
  const { professionals } = useProfessionals();
  const [updates, setUpdates] = useState({});
  const [created, setCreated] = useState([]);
  const [editing, setEditing] = useState(null); // NEW, um _id ou null
  const [toggling, setToggling] = useState(null);

  const products = useMemo(
    () =>
      [...new Map([...(data || []), ...created].map((p) => [p._id, updates[p._id] ?? p])).values()].sort(
        (a, b) => a.name.localeCompare(b.name, 'pt-BR')
      ),
    [data, created, updates]
  );

  const applyUpdate = (product) => setUpdates((current) => ({ ...current, [product._id]: product }));

  const handleSaved = (product) => {
    if (editing === NEW) setCreated((current) => [product, ...current]);
    else applyUpdate(product);
    setEditing(null);
  };

  const toggleActive = async (product) => {
    setToggling(product._id);
    try {
      applyUpdate(await setProductActive(product._id, !product.active));
      toast.success(product.active ? 'Procedimento desativado.' : 'Procedimento reativado.');
    } catch (err) {
      toast.error(getApiError(err, 'Não foi possível alterar o procedimento.').message);
    } finally {
      setToggling(null);
    }
  };

  const form = (product) => (
    <ProductForm
      product={product}
      professionals={professionals}
      onSaved={handleSaved}
      onCancel={() => setEditing(null)}
    />
  );

  let content;
  if (loading) content = <LoadingState label="Carregando procedimentos..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else if (products.length === 0 && editing !== NEW)
    content = (
      <EmptyState
        title="Nenhum procedimento cadastrado"
        description="Cadastre o primeiro para os pacientes poderem agendar."
        action={<Button onClick={() => setEditing(NEW)}>Novo procedimento</Button>}
      />
    );
  else
    content = (
      <ul className="space-y-3">
        {products.map((product) =>
          editing === product._id ? (
            <li key={product._id}>{form(product)}</li>
          ) : (
            <li
              key={product._id}
              className={`rounded-xl border border-ink/10 bg-surface px-5 py-4 ${product.active ? '' : 'opacity-70'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg">{product.name}</h3>
                    <Badge tone={product.active ? 'pine' : 'neutral'}>{product.active ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
                  <p className="text-sm text-ink/60 mt-0.5">
                    {formatDuration(product.durationMinutes)} · {formatCurrency(product.price)}
                  </p>
                  <p className="text-sm text-ink/70 mt-1">
                    {product.professionals.length
                      ? product.professionals.map((p) => p.name).join(', ')
                      : 'Sem profissionais vinculados — pacientes não conseguem agendar.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing(product._id)} disabled={Boolean(editing)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => toggleActive(product)}
                    loading={toggling === product._id}
                    disabled={Boolean(editing)}
                  >
                    {product.active ? 'Desativar' : 'Reativar'}
                  </Button>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    );

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Procedimentos"
        subtitle="O que a clínica oferece, com duração, preço e quem atende."
        actions={
          !loading &&
          !error && (
            <Button onClick={() => setEditing(NEW)} disabled={Boolean(editing)}>
              Novo procedimento
            </Button>
          )
        }
      />
      {editing === NEW && <div className="mb-6">{form(null)}</div>}
      {content}
    </div>
  );
};

export default AdminProducts;
