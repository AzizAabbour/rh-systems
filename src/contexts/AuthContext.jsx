import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const defaultUser = {
  id: 1,
  firstName: 'Aziz',
  lastName: 'Benali',
  email: 'aziz.benali@rhtech.io',
  role: 'admin',
  position: 'Lead Frontend Developer',
  department: 'Frontend',
  avatar: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = useCallback(async (email, password) => {
    setUser(defaultUser);
    setIsAuthenticated(true);
    return defaultUser;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
