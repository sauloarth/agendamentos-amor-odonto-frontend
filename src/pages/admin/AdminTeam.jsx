import { useEffect, useState } from 'react';
import { listUsers, updateUserRole } from '../../api/users';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import useAsync from '../../hooks/useAsync';
import { ROLES, ROLE_LABELS } from '../../utils/roles';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Field from '../../components/form/Field';

const SEARCH_DELAY_MS = 300;

const ROLE_TABS = [
  { key: 'all', label: 'Todos' },
  { key: ROLES.CLIENT, label: 'Pacientes' },
  { key: ROLES.PROFESSIONAL, label: 'Profissionais' },
  { key: ROLES.ADMIN, label: 'Administradores' },
];

const ROLE_TONES = {
  [ROLES.CLIENT]: 'neutral',
  [ROLES.PROFESSIONAL]: 'pine',
  [ROLES.ADMIN]: 'ochre',
};

const useDebounced = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// Promover a profissional é direto; rebaixar pede confirmação porque tira a pessoa de todos os procedimentos.
// Admins não têm ação: o backend só aceita os papéis client/professional.
const RoleAction = ({ user, onChanged }) => {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user.role === ROLES.ADMIN) return null;

  const change = async (role) => {
    setSubmitting(true);
    try {
      const updated = await updateUserRole(user._id, role);
      toast.success(`${updated.name} agora é ${ROLE_LABELS[role].toLowerCase()}.`);
      setConfirming(false);
      onChanged(updated);
    } catch (err) {
      toast.error(getApiError(err, 'Não foi possível alterar o papel.').message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user.role === ROLES.CLIENT) {
    return (
      <Button variant="secondary" onClick={() => change(ROLES.PROFESSIONAL)} loading={submitting}>
        Tornar profissional
      </Button>
    );
  }

  if (!confirming) {
    return (
      <Button variant="ghost" onClick={() => setConfirming(true)}>
        Tornar paciente
      </Button>
    );
  }

  return (
    <div className="w-full rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm">
      <p className="mb-3">
        {user.name} deixará de atender e será removido de todos os procedimentos. Consultas já marcadas continuam.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="danger" onClick={() => change(ROLES.CLIENT)} loading={submitting}>
          Confirmar
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)} disabled={submitting}>
          Voltar
        </Button>
      </div>
    </div>
  );
};

const AdminTeam = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [updates, setUpdates] = useState({});
  const term = useDebounced(search.trim(), SEARCH_DELAY_MS);

  const { data, loading, error, reload } = useAsync(
    () => listUsers({ role: role === 'all' ? undefined : role, search: term || undefined }),
    [role, term]
  );

  const users = (data || []).map((u) => updates[u._id] ?? u);
  const handleChanged = (user) => setUpdates((current) => ({ ...current, [user._id]: user }));

  let content;
  if (loading) content = <LoadingState label="Buscando usuários..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else if (users.length === 0)
    content = (
      <EmptyState
        title="Nenhum usuário encontrado"
        description={term ? 'Tente outro nome ou e-mail.' : 'Ninguém com esse papel ainda.'}
      />
    );
  else
    content = (
      <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-surface">
        {users.map((user) => (
          <li key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{user.name}</p>
                <Badge tone={ROLE_TONES[user.role]}>{ROLE_LABELS[user.role]}</Badge>
              </div>
              <p className="text-sm text-ink/60 break-all">
                {[user.email, user.phone].filter(Boolean).join(' · ')}
              </p>
            </div>
            <RoleAction user={user} onChanged={handleChanged} />
          </li>
        ))}
      </ul>
    );

  return (
    <div className="max-w-3xl">
      <PageHeader title="Equipe" subtitle="Encontre usuários e defina quem atende na clínica." />
      <div className="mb-5 max-w-md">
        <Field
          label="Buscar"
          name="search"
          type="search"
          placeholder="Nome ou e-mail"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <Tabs label="Filtrar por papel" tabs={ROLE_TABS} active={role} onChange={setRole}>
        {content}
      </Tabs>
    </div>
  );
};

export default AdminTeam;
