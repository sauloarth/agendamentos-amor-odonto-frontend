import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProfessionalHome from './pages/ProfessionalHome';
import AdminHome from './pages/AdminHome';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { ROLES, homePathFor } from './utils/roles';

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
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profissional"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PROFESSIONAL]}>
            <ProfessionalHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}

export default App;
