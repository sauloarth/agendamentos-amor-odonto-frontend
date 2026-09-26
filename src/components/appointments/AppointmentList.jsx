import { useMemo, useState } from 'react';
import { splitAppointments } from '../../utils/appointments';
import Tabs from '../ui/Tabs';
import EmptyState from '../ui/EmptyState';
import AppointmentCard from './AppointmentCard';
import CancelAppointmentForm from './CancelAppointmentForm';

const TABS = [
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Anteriores' },
  { key: 'cancelled', label: 'Canceladas' },
];

const DEFAULT_EMPTY = {
  upcoming: { title: 'Nenhuma consulta marcada' },
  past: { title: 'Nenhuma consulta anterior' },
  cancelled: { title: 'Nenhuma consulta cancelada' },
};

// Lista de GET /appointments nas abas Próximas / Anteriores / Canceladas. Só as próximas podem ser
// canceladas; a consulta cancelada troca de aba sem buscar a lista de novo.
// `peopleFor(appointment)` → [{ label, person }] mostrados em cada cartão.
const AppointmentList = ({ appointments, peopleFor, emptyStates = {} }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  // Consultas alteradas nesta tela, aplicadas sobre a lista recebida.
  const [updates, setUpdates] = useState({});

  const groups = useMemo(
    () => splitAppointments(appointments.map((item) => updates[item._id] ?? item)),
    [appointments, updates]
  );

  const handleCancelled = (updated) => setUpdates((current) => ({ ...current, [updated._id]: updated }));
  const items = groups[activeTab];

  return (
    <Tabs
      label="Filtrar consultas"
      tabs={TABS.map((tab) => ({ ...tab, count: groups[tab.key].length }))}
      active={activeTab}
      onChange={setActiveTab}
    >
      {items.length === 0 ? (
        <EmptyState {...DEFAULT_EMPTY[activeTab]} {...emptyStates[activeTab]} />
      ) : (
        <ul className="space-y-3">
          {items.map((appointment) => (
            <li key={appointment._id}>
              <AppointmentCard
                appointment={appointment}
                people={peopleFor(appointment)}
                actions={
                  activeTab === 'upcoming' && (
                    <CancelAppointmentForm appointmentId={appointment._id} onCancelled={handleCancelled} />
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Tabs>
  );
};

export default AppointmentList;
