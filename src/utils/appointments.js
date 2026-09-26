export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Agendada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada',
};

// Índices iguais aos de `daysOfWeek` nos bloqueios recorrentes (0 = domingo).
export const WEEKDAYS = [
  { value: 0, short: 'Dom', long: 'Domingo' },
  { value: 1, short: 'Seg', long: 'Segunda-feira' },
  { value: 2, short: 'Ter', long: 'Terça-feira' },
  { value: 3, short: 'Qua', long: 'Quarta-feira' },
  { value: 4, short: 'Qui', long: 'Quinta-feira' },
  { value: 5, short: 'Sex', long: 'Sexta-feira' },
  { value: 6, short: 'Sáb', long: 'Sábado' },
];

const byStart = (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime);

// Separa a lista de GET /appointments (que vem por início desc) em abas:
// próximas em ordem crescente (a mais próxima primeiro), anteriores e canceladas desc.
export const splitAppointments = (list, now = new Date()) => {
  const upcoming = [];
  const past = [];
  const cancelled = [];
  list.forEach((appointment) => {
    if (appointment.status === APPOINTMENT_STATUS.CANCELLED) cancelled.push(appointment);
    else if (new Date(appointment.endDateTime) > now) upcoming.push(appointment);
    else past.push(appointment);
  });
  return {
    upcoming: upcoming.sort(byStart),
    past: past.sort((a, b) => byStart(b, a)),
    cancelled: cancelled.sort((a, b) => byStart(b, a)),
  };
};
