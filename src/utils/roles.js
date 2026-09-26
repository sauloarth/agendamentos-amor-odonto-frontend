export const ROLES = {
  CLIENT: 'client',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.CLIENT]: 'Paciente',
  [ROLES.PROFESSIONAL]: 'Profissional',
  [ROLES.ADMIN]: 'Administrador',
};

const HOME_PATHS = {
  [ROLES.CLIENT]: '/',
  [ROLES.PROFESSIONAL]: '/profissional',
  [ROLES.ADMIN]: '/admin',
};

export const homePathFor = (role) => HOME_PATHS[role] || '/login';

export const PROFILE_PATH = '/perfil';

// Navegação do layout autenticado. `end` marca links que só ficam ativos na rota exata.
export const NAV_ITEMS = {
  [ROLES.CLIENT]: [
    { to: '/', label: 'Agendar', end: true },
    { to: '/consultas', label: 'Minhas consultas' },
  ],
  [ROLES.PROFESSIONAL]: [
    { to: '/profissional', label: 'Agenda', end: true },
    { to: '/profissional/bloqueios', label: 'Bloqueios' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Agendamentos', end: true },
    { to: '/admin/procedimentos', label: 'Procedimentos' },
    { to: '/admin/bloqueios', label: 'Bloqueios' },
    { to: '/admin/equipe', label: 'Equipe' },
  ],
};

export const navItemsFor = (role) => [
  ...(NAV_ITEMS[role] || []),
  { to: PROFILE_PATH, label: 'Meu perfil' },
];
