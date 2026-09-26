import { useCallback, useEffect, useState } from 'react';
import { getApiError } from '../api/errors';

// Executa `fn` (um serviço de src/api) quando `deps` mudam. `error` já vem normalizado
// por getApiError; respostas de execuções anteriores são descartadas.
const useAsync = (fn, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));

    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: getApiError(err) }));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
};

export default useAsync;
