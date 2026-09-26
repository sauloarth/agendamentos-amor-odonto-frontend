import { useMemo, useState } from 'react';
import { listBlocks, setBlockActive } from '../api/blocks';
import { getApiError } from '../api/errors';
import { useToast } from '../context/ToastContext';
import useAsync from '../hooks/useAsync';
import useProfessionals from '../hooks/useProfessionals';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import BlockCard from '../components/blocks/BlockCard';
import BlockForm from '../components/blocks/BlockForm';

const NEW = 'new';

const COPY = {
  admin: {
    title: 'Bloqueios',
    subtitle: 'Períodos sem atendimento, da clínica inteira ou de um profissional.',
    empty: 'Cadastre, por exemplo, o horário de almoço ou os dias fora do expediente.',
  },
  professional: {
    title: 'Meus bloqueios',
    subtitle: 'Períodos em que você não atende. Pacientes não veem esses horários.',
    empty: 'Cadastre folgas, compromissos ou pausas recorrentes.',
  },
};

// Tela compartilhada: o profissional vê e edita só os próprios bloqueios (o backend garante);
// o admin vê todos e escolhe a quem cada um se aplica.
const BlocksPage = ({ isAdmin = false }) => {
  const toast = useToast();
  const copy = isAdmin ? COPY.admin : COPY.professional;
  const { data, loading, error, reload } = useAsync(() => listBlocks(), []);
  const { professionals, nameById } = useProfessionals({ enabled: isAdmin });
  const [saved, setSaved] = useState({}); // criados/alterados nesta tela, por _id
  const [editing, setEditing] = useState(null); // NEW, um _id ou null
  const [toggling, setToggling] = useState(null);
  const [tab, setTab] = useState('active');

  const blocks = useMemo(() => {
    const byId = new Map((data || []).map((b) => [b._id, b]));
    Object.values(saved).forEach((b) => byId.set(b._id, b));
    return [...byId.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, saved]);

  const groups = useMemo(
    () => ({ active: blocks.filter((b) => b.active), inactive: blocks.filter((b) => !b.active) }),
    [blocks]
  );

  const store = (block) => setSaved((current) => ({ ...current, [block._id]: block }));

  const handleSaved = (block) => {
    store(block);
    setEditing(null);
    setTab(block.active ? 'active' : 'inactive');
  };

  const toggleActive = async (block) => {
    setToggling(block._id);
    try {
      store(await setBlockActive(block._id, !block.active));
      toast.success(block.active ? 'Bloqueio desativado.' : 'Bloqueio reativado.');
    } catch (err) {
      toast.error(getApiError(err, 'Não foi possível alterar o bloqueio.').message);
    } finally {
      setToggling(null);
    }
  };

  const scopeOf = (block) => {
    if (!isAdmin) return null;
    if (!block.professional) return 'Clínica inteira';
    return nameById.get(block.professional) ?? 'Profissional';
  };

  const form = (block) => (
    <BlockForm
      block={block}
      isAdmin={isAdmin}
      professionals={professionals}
      onSaved={handleSaved}
      onCancel={() => setEditing(null)}
    />
  );

  let content;
  if (loading) content = <LoadingState label="Carregando bloqueios..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else {
    const items = groups[tab];
    content = (
      <Tabs
        label="Filtrar bloqueios"
        tabs={[
          { key: 'active', label: 'Ativos', count: groups.active.length },
          { key: 'inactive', label: 'Inativos', count: groups.inactive.length },
        ]}
        active={tab}
        onChange={setTab}
      >
        {items.length === 0 ? (
          <EmptyState
            title={tab === 'active' ? 'Nenhum bloqueio ativo' : 'Nenhum bloqueio inativo'}
            description={tab === 'active' ? copy.empty : 'Bloqueios desativados aparecem aqui e podem ser reativados.'}
          />
        ) : (
          <ul className="space-y-3">
            {items.map((block) => (
              <li key={block._id}>
                {editing === block._id ? (
                  form(block)
                ) : (
                  <BlockCard
                    block={block}
                    scope={scopeOf(block)}
                    actions={
                      <>
                        <Button variant="secondary" onClick={() => setEditing(block._id)} disabled={Boolean(editing)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => toggleActive(block)}
                          loading={toggling === block._id}
                          disabled={Boolean(editing)}
                        >
                          {block.active ? 'Desativar' : 'Reativar'}
                        </Button>
                      </>
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Tabs>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          !loading &&
          !error && (
            <Button onClick={() => setEditing(NEW)} disabled={Boolean(editing)}>
              Novo bloqueio
            </Button>
          )
        }
      />
      {editing === NEW && <div className="mb-6">{form(null)}</div>}
      {content}
    </div>
  );
};

export default BlocksPage;
