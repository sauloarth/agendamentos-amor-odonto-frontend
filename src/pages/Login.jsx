import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Field from '../components/form/Field';
import Button from '../components/ui/Button';
import { getApiError } from '../api/errors';
import { homePathFor } from '../utils/roles';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(homePathFor(user.role));
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível entrar. Confira e-mail e senha.');
      setError(apiError.message);
      setFieldErrors(apiError.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Seu sorriso, no horário certo."
      subtitle="Marque, acompanhe e cancele suas consultas na Amor Odonto em um só lugar."
    >
      <h2 className="text-2xl mb-1">Entrar</h2>
      <p className="text-ink/60 text-sm mb-6">Acesse sua conta para continuar.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Ainda não tem conta?{' '}
        <Link to="/register" className="text-pine-600 font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
