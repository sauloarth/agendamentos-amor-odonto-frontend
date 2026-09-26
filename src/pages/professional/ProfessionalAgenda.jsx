import { listAppointments } from '../../api/appointments';
import useAsync from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import AppointmentList from '../../components/appointments/AppointmentList';

const EMPTY_STATES = {
  upcoming: { description: 'As consultas marcadas com você aparecem aqui.' },
};

const peopleFor = (appointment) => [{ label: 'Paciente', person: appointment.client }];

// O backend devolve só as consultas em que o profissional logado atende.
const ProfessionalAgenda = () => {
  const { data, loading, error, reload } = useAsync(() => listAppointments(), []);

  let content;
  if (loading) content = <LoadingState label="Carregando sua agenda..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else content = <AppointmentList appointments={data} peopleFor={peopleFor} emptyStates={EMPTY_STATES} />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Sua agenda" subtitle="Consultas marcadas com você." />
      {content}
    </div>
  );
};

export default ProfessionalAgenda;
