import { useState } from 'react';
import { createProduct, updateProduct } from '../../api/products';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, parseCurrency } from '../../utils/currency';
import Field from '../form/Field';
import Button from '../ui/Button';

const toForm = (product) => ({
  name: product?.name ?? '',
  durationMinutes: product ? String(product.durationMinutes) : '',
  price: product ? formatCurrency(product.price).replace(/^R\$\s*/, '') : '',
  professionals: product ? product.professionals.map((p) => p._id) : [],
});

const validate = ({ name, durationMinutes, price }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Informe o nome.';
  const minutes = Number(durationMinutes);
  if (!Number.isInteger(minutes) || minutes <= 0) errors.durationMinutes = 'Informe a duração em minutos (número inteiro).';
  if (Number.isNaN(parseCurrency(price))) errors.price = 'Informe um valor como 150 ou 150,00.';
  return errors;
};

// Cria (sem `product`) ou edita um procedimento. `onSaved` recebe o procedimento devolvido pela API.
const ProductForm = ({ product, professionals, onSaved, onCancel }) => {
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(product));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const toggleProfessional = (id) =>
    setForm((current) => ({
      ...current,
      professionals: current.professionals.includes(id)
        ? current.professionals.filter((p) => p !== id)
        : [...current.professionals, id],
    }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    const payload = {
      name: form.name.trim(),
      durationMinutes: Number(form.durationMinutes),
      price: parseCurrency(form.price),
      professionals: form.professionals,
    };

    setSubmitting(true);
    try {
      const saved = product ? await updateProduct(product._id, payload) : await createProduct(payload);
      toast.success(product ? 'Procedimento atualizado.' : 'Procedimento criado.');
      onSaved(saved);
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível salvar o procedimento.');
      setFieldErrors(apiError.fieldErrors);
      toast.error(apiError.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-pine-400/40 bg-surface p-5 space-y-4">
      <h2 className="text-xl">{product ? `Editar ${product.name}` : 'Novo procedimento'}</h2>
      <Field label="Nome" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Duração (minutos)"
          name="durationMinutes"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={form.durationMinutes}
          onChange={handleChange}
          error={fieldErrors.durationMinutes}
        />
        <Field
          label="Preço (R$)"
          name="price"
          inputMode="decimal"
          placeholder="150,00"
          value={form.price}
          onChange={handleChange}
          error={fieldErrors.price}
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">Profissionais que realizam</legend>
        {professionals.length === 0 ? (
          <p className="text-sm text-ink/50">
            Nenhum profissional cadastrado. Promova um usuário em Equipe para vinculá-lo.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {professionals.map((p) => (
              <label key={p._id} className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-pine-600"
                  checked={form.professionals.includes(p._id)}
                  onChange={() => toggleProfessional(p._id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        )}
        {fieldErrors.professionals && <p className="text-xs mt-1 text-danger">{fieldErrors.professionals}</p>}
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting}>
          {product ? 'Salvar alterações' : 'Criar procedimento'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
