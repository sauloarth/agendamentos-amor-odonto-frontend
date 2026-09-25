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
