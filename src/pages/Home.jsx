import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl mb-3">Olá, {user?.name?.split(' ')[0]}.</h1>
      <p className="text-ink/60 max-w-sm mb-6">
        O agendamento de consultas entra aqui no próximo passo: escolha do procedimento, do
        profissional e do horário disponível, além da lista das suas consultas.
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

export default Home;
