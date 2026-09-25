import api from './axios';

// login/register devolvem { _id, name, email, role, token }; getMe devolve o usuário sem token.
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);
