import api from './axios';
import { toISO } from '../utils/dates';

// Cliente vê as próprias, profissional as em que atende, admin todas.
// Filtros opcionais: `professional` (ID) e `status` ('scheduled' | 'cancelled').
export const listAppointments = ({ professional, status } = {}) =>
  api.get('/appointments', { params: { professional, status } }).then((res) => res.data);

export const getAppointment = (id) => api.get(`/appointments/${id}`).then((res) => res.data);

// Só clientes. O fim é calculado pelo backend a partir da duração do procedimento; 409 = horário indisponível.
export const createAppointment = ({ productId, professionalId, startDateTime }) =>
  api
    .post('/appointments', { productId, professionalId, startDateTime: toISO(startDateTime) })
    .then((res) => res.data);

// O backend rejeita `cancelReason` vazio: só envia quando preenchido.
export const cancelAppointment = (id, cancelReason) => {
  const reason = cancelReason?.trim();
  return api
    .patch(`/appointments/${id}/cancel`, reason ? { cancelReason: reason } : {})
    .then((res) => res.data);
};
