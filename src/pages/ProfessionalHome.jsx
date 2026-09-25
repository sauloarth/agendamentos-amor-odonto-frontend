import { useAuth } from '../context/AuthContext';

const ProfessionalHome = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl mb-3">Sua agenda</h1>
      <p className="text-ink/60 max-w-sm mb-2">Logado como {user?.name} (profissional).</p>
      <p className="text-ink/60 max-w-sm mb-6">
        As consultas marcadas com você e os seus bloqueios de agenda entram aqui no próximo passo.
      </p>
      <button
        onClick={logout}
        className="text-sm text-ink/60 hover:text-ink underline underline-offset-2"
      >
        Sair
      </button>
    </div>
  );
};

export default ProfessionalHome;
