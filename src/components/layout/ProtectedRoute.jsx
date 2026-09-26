import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homePathFor } from '../../utils/roles';
import LoadingState from '../ui/LoadingState';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState className="h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
