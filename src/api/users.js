import api from './axios';

// Admin. `role`: 'client' | 'professional'. Rebaixar para client remove o usuário de todos os procedimentos.
export const updateUserRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role }).then((res) => res.data);

// Admin. `params`: { role?: 'client' | 'professional' | 'admin', search?: string } (busca em nome/e-mail).
export const listUsers = (params) => api.get('/users', { params }).then((res) => res.data);
