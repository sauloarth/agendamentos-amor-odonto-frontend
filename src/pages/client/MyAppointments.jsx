import { Link } from 'react-router-dom';
import { listAppointments } from '../../api/appointments';
import useAsync from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import AppointmentList from '../../components/appointments/AppointmentList';

const bookLink = (
  <Link
    to="/"
    className="inline-flex items-center rounded-lg bg-pine-600 px-4 py-2.5 font-medium text-canvas hover:bg-pine-700"
  >
    Agendar consulta
  </Link>
);

const EMPTY_STATES = {
  upcoming: { title: 'Nenhuma consulta marcada', description: 'Que tal agendar a próxima?', action: bookLink },
  past: { description: 'Suas consultas realizadas aparecem aqui.' },
};

const peopleFor = (appointment) => [{ label: 'Profissional', person: appointment.professional }];

const MyAppointments = () => {
  const { data, loading, error, reload } = useAsync(() => listAppointments(), []);

  let content;
  if (loading) content = <LoadingState label="Carregando suas consultas..." />;
  else if (error) content = <ErrorState message={error.message} onRetry={reload} />;
  else content = <AppointmentList appointments={data} peopleFor={peopleFor} emptyStates={EMPTY_STATES} />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Minhas consultas" subtitle="Acompanhe e gerencie seus agendamentos." actions={bookLink} />
      {content}
    </div>
  );
};

export default MyAppointments;
