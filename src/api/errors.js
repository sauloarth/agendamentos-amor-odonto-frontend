// Normaliza erros da API: { message } ou { message, errors: [{ field, message }] }
export const getApiError = (err, fallback = 'Algo deu errado. Tente novamente.') => {
  if (!err?.response) {
    return { message: 'Não foi possível conectar ao servidor.', fieldErrors: {} };
  }

  const { message, errors } = err.response.data || {};
  const fieldErrors = {};
  (errors || []).forEach(({ field, message: fieldMessage }) => {
    if (field && !fieldErrors[field]) fieldErrors[field] = fieldMessage;
  });

  return { message: message || fallback, fieldErrors };
};
