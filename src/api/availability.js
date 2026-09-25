import api from './axios';
import { toISO } from '../utils/dates';

export { MAX_AVAILABILITY_RANGE_DAYS } from '../utils/dates';

// Público. Devolve [{ startDateTime, endDateTime }]; período máximo de 90 dias
// (use `availabilityRange` de utils/dates para montar dateStart/dateEnd).
export const getAvailability = ({ professionalId, productId, dateStart, dateEnd }) =>
  api
    .get('/availability', {
      params: { professionalId, productId, dateStart: toISO(dateStart), dateEnd: toISO(dateEnd) },
    })
    .then((res) => res.data);
