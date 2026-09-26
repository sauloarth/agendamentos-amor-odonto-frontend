import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, homePathFor, navItemsFor } from '../../utils/roles';

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
    isActive ? 'bg-pine-50 text-pine-700 font-medium' : 'text-ink/70 hover:text-ink hover:bg-ink/5'
  }`;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const items = navItemsFor(user.role);

  const nav = (className) => (
    <nav aria-label="Principal" className={className}>
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center gap-6">
          <Link to={homePathFor(user.role)} className="font-display text-xl text-pine-700 shrink-0">
            Amor Odonto
          </Link>
          {nav('hidden md:flex items-center gap-1 flex-1')}
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-ink/50">{ROLE_LABELS[user.role]}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-ink/60 hover:text-ink underline underline-offset-2"
            >
              Sair
            </button>
          </div>
        </div>
        {nav('md:hidden flex gap-1 overflow-x-auto px-4 pb-3')}
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
