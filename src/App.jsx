import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/client/BookAppointment';
import MyAppointments from './pages/client/MyAppointments';
import ProfessionalAgenda from './pages/professional/ProfessionalAgenda';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminProducts from './pages/admin/AdminProducts';
import AdminTeam from './pages/admin/AdminTeam';
import BlocksPage from './pages/BlocksPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { ROLES, PROFILE_PATH, homePathFor } from './utils/roles';

// Login/registro não fazem sentido para quem já está logado.
const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={homePathFor(user.role)} replace /> : children;
};

const FallbackRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? homePathFor(user.role) : '/login'} replace />;
};

// Rotas filhas herdam o layout autenticado e o controle de papel.
const Area = ({ roles }) => (
  <ProtectedRoute allowedRoles={roles}>
    <AppLayout />
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />

      <Route element={<Area roles={[ROLES.CLIENT]} />}>
        <Route path="/" element={<BookAppointment />} />
        <Route path="/consultas" element={<MyAppointments />} />
      </Route>

      <Route element={<Area roles={[ROLES.PROFESSIONAL]} />}>
        <Route path="/profissional" element={<ProfessionalAgenda />} />
        <Route path="/profissional/bloqueios" element={<BlocksPage />} />
      </Route>

      <Route element={<Area roles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<AdminAppointments />} />
        <Route path="/admin/procedimentos" element={<AdminProducts />} />
        <Route path="/admin/bloqueios" element={<BlocksPage isAdmin />} />
        <Route path="/admin/equipe" element={<AdminTeam />} />
      </Route>

      <Route element={<Area />}>
        <Route path={PROFILE_PATH} element={<Profile />} />
      </Route>

      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}

export default App;
