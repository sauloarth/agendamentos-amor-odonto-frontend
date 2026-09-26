import { useState } from 'react';
import { getMe } from '../api/auth';
import { getApiError } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useAsync from '../hooks/useAsync';
import { ROLE_LABELS } from '../utils/roles';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import Field from '../components/form/Field';

const MIN_PASSWORD_LENGTH = 6;

const Section = ({ title, description, children }) => (
  <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
    <h2 className="text-xl">{title}</h2>
    {description && <p className="text-sm text-ink/60 mt-1">{description}</p>}
    <div className="mt-5">{children}</div>
  </section>
);

// Envia só o que mudou. Telefone apagado vira `null` (o backend rejeita "").
const detailsPayload = (form, profile) => {
  const payload = {};
  const name = form.name.trim();
  const phone = form.phone.trim();
  if (name !== profile.name) payload.name = name;
  if (phone !== (profile.phone ?? '')) payload.phone = phone || null;
  return payload;
};

const DetailsForm = ({ profile, onSaved }) => {
  const { updateProfile } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: profile.name, phone: profile.phone ?? '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const payload = detailsPayload(form, profile);
  const dirty = Object.keys(payload).length > 0;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setFieldErrors({ name: 'Informe seu nome.' });
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      onSaved(await updateProfile(payload));
      toast.success('Dados atualizados.');
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível salvar seus dados.');
      setFieldErrors(apiError.fieldErrors);
      toast.error(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        label="Nome"
        name="name"
        autoComplete="name"
        value={form.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />
      <Field
        label="Telefone (opcional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={handleChange}
        error={fieldErrors.phone}
        hint="Deixe em branco para remover."
      />
      <Button type="submit" loading={submitting} disabled={!dirty}>
        Salvar dados
      </Button>
    </form>
  );
};

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordForm = () => {
  const { updateProfile } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.currentPassword) errors.currentPassword = 'Informe a senha atual.';
    if (form.newPassword.length < MIN_PASSWORD_LENGTH)
      errors.newPassword = `A nova senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
    else if (form.newPassword !== form.confirmPassword) errors.confirmPassword = 'As senhas não conferem.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await updateProfile({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm(EMPTY_PASSWORDS);
      toast.success('Senha alterada.');
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível trocar a senha.');
      // Senha atual errada volta 400 (não 401, que encerraria a sessão).
      if (apiError.status === 400 && !Object.keys(apiError.fieldErrors).length) {
        setFieldErrors({ currentPassword: apiError.message });
      } else {
        setFieldErrors(apiError.fieldErrors);
        toast.error(apiError.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        label="Senha atual"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={handleChange}
        error={fieldErrors.currentPassword}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nova senha"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          error={fieldErrors.newPassword}
          hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        />
        <Field
          label="Confirmar nova senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
        />
      </div>
      <Button type="submit" variant="secondary" loading={submitting}>
        Trocar senha
      </Button>
    </form>
  );
};

const Profile = () => {
  // O usuário do contexto não traz o telefone: busca o perfil completo.
  const { data, loading, error, reload } = useAsync(() => getMe(), []);
  const [saved, setSaved] = useState(null);
  const profile = saved ?? data;

  let content;
  if (loading) content = <LoadingState label="Carregando seu perfil..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else
    content = (
      <div className="space-y-6">
        <Section title="Seus dados" description={`${profile.email} · ${ROLE_LABELS[profile.role]}`}>
          {/* `key` recria o formulário com os valores salvos, zerando o estado "alterado". */}
          <DetailsForm key={profile.updatedAt ?? profile.name} profile={profile} onSaved={setSaved} />
        </Section>
        <Section title="Senha" description="Para trocar, confirme a senha atual.">
          <PasswordForm />
        </Section>
      </div>
    );

  return (
    <div className="max-w-2xl">
      <PageHeader title="Meu perfil" subtitle="Seus dados de contato e acesso." />
      {content}
    </div>
  );
};

export default Profile;
