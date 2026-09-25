import api from './axios';

// Público. Com token de admin a lista inclui os inativos; `professional` filtra por profissional vinculado.
export const listProducts = ({ professional } = {}) =>
  api.get('/products', { params: { professional } }).then((res) => res.data);

export const getProduct = (id) => api.get(`/products/${id}`).then((res) => res.data);

// Admin. `professionals` é uma lista de IDs de usuários com papel `professional`.
export const createProduct = ({ name, durationMinutes, price, professionals }) =>
  api.post('/products', { name, durationMinutes, price, professionals }).then((res) => res.data);

// Admin. `changes` aceita name, durationMinutes, price, active e professionals.
export const updateProduct = (id, changes) =>
  api.patch(`/products/${id}`, changes).then((res) => res.data);

export const setProductActive = (id, active) => updateProduct(id, { active });
