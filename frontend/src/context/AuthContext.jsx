import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'volunteer' or 'ngo'

  useEffect(() => {
    const savedRole = localStorage.getItem('seva_role');
    const savedUser = localStorage.getItem('seva_user');
    if (savedRole && savedUser) {
      setRole(savedRole);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (selectedRole, userData) => {
    setRole(selectedRole);
    setUser(userData);
    localStorage.setItem('seva_role', selectedRole);
    localStorage.setItem('seva_user', JSON.stringify(userData));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('seva_role');
    localStorage.removeItem('seva_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
