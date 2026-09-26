// Normaliza erros da API: { message } ou { message, errors: [{ field, message }] }.
// `status` é o código HTTP (null sem resposta), para telas que tratam casos como 409.
export const getApiError = (err, fallback = 'Algo deu errado. Tente novamente.') => {
  if (!err?.response) {
    return { message: 'Não foi possível conectar ao servidor.', fieldErrors: {}, status: null };
  }

  const { message, errors } = err.response.data || {};
  const fieldErrors = {};
  (errors || []).forEach(({ field, message: fieldMessage }) => {
    if (field && !fieldErrors[field]) fieldErrors[field] = fieldMessage;
  });

  return { message: message || fallback, fieldErrors, status: err.response.status };
};
