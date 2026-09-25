import api from './axios';

// Admin e profissional. Profissional só enxerga/edita os próprios bloqueios.
// Formatos aceitos em createBlock:
//   { type: 'single', startDateTime, endDateTime, reason?, professional? }
//   { type: 'recurring', daysOfWeek: [0-6], startTime: 'HH:mm', endTime: 'HH:mm',
//     validFrom?, validUntil?, reason?, professional? }
// Sem `professional` (ou `null`, só admin) o bloqueio vale para a clínica inteira.
export const listBlocks = () => api.get('/blocks').then((res) => res.data);

export const getBlock = (id) => api.get(`/blocks/${id}`).then((res) => res.data);

export const createBlock = (block) => api.post('/blocks', block).then((res) => res.data);

export const updateBlock = (id, changes) => api.patch(`/blocks/${id}`, changes).then((res) => res.data);

// Não há DELETE: bloqueios são desativados.
export const setBlockActive = (id, active) => updateBlock(id, { active });
