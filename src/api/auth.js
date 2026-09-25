import api from './axios';

// login/register devolvem { _id, name, email, role, token }; getMe devolve o usuário sem token.
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);

// { name?, phone?, currentPassword?, newPassword? }. `phone: null` remove; trocar senha exige currentPassword.
// Devolve o usuário atualizado (sem token). Senha atual errada → 400.
export const updateProfile = (payload) => api.patch('/auth/me', payload).then((res) => res.data);
