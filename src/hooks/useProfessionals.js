import { useMemo } from 'react';
import { listUsers } from '../api/users';
import { ROLES } from '../utils/roles';
import useAsync from './useAsync';

// Admin. Profissionais da clínica para selects e para mapear IDs (ex.: `professional` dos bloqueios) em nomes.
const useProfessionals = ({ enabled = true } = {}) => {
  const { data, loading, error, reload } = useAsync(
    () => (enabled ? listUsers({ role: ROLES.PROFESSIONAL }) : Promise.resolve([])),
    [enabled]
  );
  const professionals = useMemo(() => data || [], [data]);
  const nameById = useMemo(() => new Map(professionals.map((p) => [p._id, p.name])), [professionals]);

  return { professionals, nameById, loading, error, reload };
};

export default useProfessionals;
