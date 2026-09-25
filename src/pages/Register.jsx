import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Field from '../components/form/Field';
import { getApiError } from '../api/errors';
import { homePathFor } from '../utils/roles';

const MIN_PASSWORD_LENGTH = 6;

// O backend rejeita `phone` vazio: só envia o campo quando preenchido.
const toPayload = ({ name, email, password, phone }) => {
  const payload = { name: name.trim(), email: email.trim(), password };
  if (phone.trim()) payload.phone = phone.trim();
  return payload;
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setFieldErrors({ password: `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres` });
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(toPayload(form));
      navigate(homePathFor(user.role));
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível criar a conta.');
      setError(apiError.message);
      setFieldErrors(apiError.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sua primeira consulta começa aqui."
      subtitle="Crie sua conta e escolha o procedimento, o profissional e o melhor horário."
    >
      <h2 className="text-2xl mb-1">Criar conta</h2>
      <p className="text-ink/60 text-sm mb-6">Leva menos de um minuto.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field
          label="Nome"
          name="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />
        <Field
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <Field
          label="Telefone (opcional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
        />
        <Field
          label="Senha"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-pine-600 text-canvas py-2.5 font-medium hover:bg-pine-700 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Já tem conta?{' '}
        <Link to="/login" className="text-pine-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
