import { useState } from 'react';
import { listAppointments } from '../../api/appointments';
import useAsync from '../../hooks/useAsync';
import useProfessionals from '../../hooks/useProfessionals';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Field from '../../components/form/Field';
import AppointmentList from '../../components/appointments/AppointmentList';

const peopleFor = (appointment) => [
  { label: 'Paciente', person: appointment.client },
  { label: 'Profissional', person: appointment.professional },
];

const AdminAppointments = () => {
  const [professional, setProfessional] = useState('');
  const { professionals } = useProfessionals();
  const { data, loading, error, reload } = useAsync(
    () => listAppointments({ professional: professional || undefined }),
    [professional]
  );

  let content;
  if (loading) content = <LoadingState label="Carregando agendamentos..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else
    content = (
      // `key` zera abas e cancelamentos locais ao trocar o filtro.
      <AppointmentList key={professional} appointments={data} peopleFor={peopleFor} />
    );

  return (
    <div className="max-w-3xl">
      <PageHeader title="Agendamentos" subtitle="Todas as consultas da clínica." />
      <div className="mb-6 max-w-xs">
        <Field
          as="select"
          label="Profissional"
          name="professional"
          value={professional}
          onChange={(event) => setProfessional(event.target.value)}
        >
          <option value="">Todos</option>
          {professionals.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Field>
      </div>
      {content}
    </div>
  );
};

export default AdminAppointments;
