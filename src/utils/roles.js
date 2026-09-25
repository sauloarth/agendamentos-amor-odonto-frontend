export const ROLES = {
  CLIENT: 'client',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin',
};

const HOME_PATHS = {
  [ROLES.CLIENT]: '/',
  [ROLES.PROFESSIONAL]: '/profissional',
  [ROLES.ADMIN]: '/admin',
};

export const homePathFor = (role) => HOME_PATHS[role] || '/login';
