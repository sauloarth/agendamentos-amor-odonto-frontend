import { WEEKDAYS } from './appointments';
import { clinicDayKey, formatDate, formatDateTime, formatTime, formatWeekdayDate } from './dates';

export const BLOCK_TYPE = {
  SINGLE: 'single',
  RECURRING: 'recurring',
};

// Ordem de exibição (segunda a domingo); os valores continuam 0 = domingo, como em `daysOfWeek`.
export const WEEKDAYS_FROM_MONDAY = [...WEEKDAYS.slice(1), WEEKDAYS[0]];

const WEEKDAYS_ORDER = WEEKDAYS_FROM_MONDAY.map((d) => d.value);

// "Seg, Qua, Sex"; "Seg a Sex" / "Todos os dias" para os casos comuns.
export const formatWeekdays = (daysOfWeek) => {
  const days = [...new Set(daysOfWeek)].sort((a, b) => WEEKDAYS_ORDER.indexOf(a) - WEEKDAYS_ORDER.indexOf(b));
  if (days.length === 7) return 'Todos os dias';
  if (days.join() === '1,2,3,4,5') return 'Seg a Sex';
  return days.map((d) => WEEKDAYS[d].short).join(', ');
};

// Título e linha de vigência de um bloqueio para listagens.
export const describeBlock = (block) => {
  if (block.type === BLOCK_TYPE.SINGLE) {
    const { startDateTime: start, endDateTime: end } = block;
    const sameDay = clinicDayKey(start) === clinicDayKey(end);
    return {
      title: sameDay
        ? `${formatWeekdayDate(start)} · ${formatTime(start)}–${formatTime(end)}`
        : `${formatDateTime(start)} até ${formatDateTime(end)}`,
      period: null,
    };
  }

  const { validFrom, validUntil } = block;
  let period = null;
  if (validFrom && validUntil) period = `De ${formatDate(validFrom)} a ${formatDate(validUntil)}`;
  else if (validFrom) period = `A partir de ${formatDate(validFrom)}`;
  else if (validUntil) period = `Até ${formatDate(validUntil)}`;

  return { title: `${formatWeekdays(block.daysOfWeek)} · ${block.startTime}–${block.endTime}`, period };
};

// Já não afeta nenhum horário futuro.
export const isBlockEnded = (block, now = new Date()) =>
  block.type === BLOCK_TYPE.SINGLE
    ? new Date(block.endDateTime) <= now
    : Boolean(block.validUntil) && new Date(block.validUntil) <= now;
