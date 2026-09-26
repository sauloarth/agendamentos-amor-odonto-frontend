// Datas trafegam em ISO (UTC) e são exibidas sempre no fuso da clínica,
// independentemente do fuso do navegador.
export const CLINIC_TIME_ZONE = 'America/Sao_Paulo';

// São Paulo não tem horário de verão desde 2019: o offset é fixo.
const CLINIC_UTC_OFFSET = '-03:00';

const toDate = (value) => (value instanceof Date ? value : new Date(value));

const formatter = (options) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: CLINIC_TIME_ZONE, ...options });

const dateFormatter = formatter({ day: '2-digit', month: '2-digit', year: 'numeric' });
const timeFormatter = formatter({ hour: '2-digit', minute: '2-digit' });
const weekdayDateFormatter = formatter({ weekday: 'short', day: 'numeric', month: 'short' });
// en-CA formata como YYYY-MM-DD.
const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: CLINIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDate = (value) => dateFormatter.format(toDate(value)); // 25/09/2026
export const formatTime = (value) => timeFormatter.format(toDate(value)); // 14:30
export const formatDateTime = (value) => `${formatDate(value)} às ${formatTime(value)}`;
export const formatWeekdayDate = (value) => weekdayDateFormatter.format(toDate(value)); // qui., 25 de set.
export const formatTimeRange = (start, end) => `${formatTime(start)}–${formatTime(end)}`;

export const toISO = (value) => toDate(value).toISOString();

// "Dia da clínica" como chave 'YYYY-MM-DD'.
export const clinicDayKey = (value = new Date()) => dayKeyFormatter.format(toDate(value));

export const startOfClinicDay = (dayKey) => new Date(`${dayKey}T00:00:00${CLINIC_UTC_OFFSET}`);

export const addDays = (dayKey, days) => {
  const date = new Date(`${dayKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// Fim exclusivo: início do dia seguinte.
export const endOfClinicDay = (dayKey) => startOfClinicDay(addDays(dayKey, 1));

// Último instante do dia (inclusivo), para limites como `validUntil` dos bloqueios.
export const endOfClinicDayInclusive = (dayKey) => new Date(`${dayKey}T23:59:59.999${CLINIC_UTC_OFFSET}`);

// Data + 'HH:mm' no horário da clínica (ex.: inputs `date` e `time` de um formulário).
export const clinicDateTime = (dayKey, time) => new Date(`${dayKey}T${time}:00${CLINIC_UTC_OFFSET}`);

// 'HH:mm' no fuso da clínica (formato de `input type="time"`).
export const clinicTimeKey = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(toDate(value));

export const MAX_AVAILABILITY_RANGE_DAYS = 90;

// Período pronto para GET /availability, a partir do início de `dayKey`, com `days` dias.
export const availabilityRange = (dayKey, days = 1) => {
  const span = Math.min(Math.max(days, 1), MAX_AVAILABILITY_RANGE_DAYS);
  return {
    dateStart: startOfClinicDay(dayKey),
    dateEnd: startOfClinicDay(addDays(dayKey, span)),
  };
};

export const groupByClinicDay = (items, key = 'startDateTime') => {
  const groups = new Map();
  items.forEach((item) => {
    const day = clinicDayKey(item[key]);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(item);
  });
  return groups;
};
