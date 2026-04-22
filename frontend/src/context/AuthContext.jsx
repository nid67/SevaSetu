import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'volunteer' or 'ngo'

  useEffect(() => {
    const savedRole = localStorage.getItem('seva_role');
    if (savedRole) {
      setRole(savedRole);
      setUser({ name: savedRole === 'volunteer' ? 'Field Volunteer' : 'NGO Coordinator' });
    }
  }, []);

  const login = (selectedRole) => {
    setRole(selectedRole);
    setUser({ name: selectedRole === 'volunteer' ? 'Field Volunteer' : 'NGO Coordinator' });
    localStorage.setItem('seva_role', selectedRole);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('seva_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
