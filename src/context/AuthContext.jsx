import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setUnauthorizedHandler } from '../api/axios';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

// O login/registro devolve { _id, name, email, role, token }; o token fica só no localStorage.
const storeSession = ({ token, ...user }) => {
  localStorage.setItem('token', token);
  return user;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const loggedUser = storeSession(await authApi.login(email, password));
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (payload) => {
    const loggedUser = storeSession(await authApi.register(payload));
    setUser(loggedUser);
    return loggedUser;
  };

  // PATCH /auth/me devolve o usuário completo (com telefone); o contexto guarda só a identidade.
  const updateProfile = async (payload) => {
    const updated = await authApi.updateProfile(payload);
    setUser({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
