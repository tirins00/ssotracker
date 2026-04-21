import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ssotracker.user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('ssotracker.user', JSON.stringify(user));
      } catch {
        // Ignore storage failures
      }
    }
  }, [user]);

  const login = (email, role = 'student') => {
    const nameFromEmail = (emailStr) => {
      const raw = (emailStr || '').trim().toLowerCase();
      const local = raw.split('@')[0] || '';
      const parts = local.split(/[._-]+/).filter(Boolean);
      
      if (parts.length >= 2) {
        const first = parts[0];
        const last = parts[parts.length - 1];
        return {
          firstName: capitalize(first),
          lastName: capitalize(last),
          displayName: `${capitalize(last)} ${capitalize(first)}`,
        };
      }
      
      const s = parts[0] || local;
      return { firstName: capitalize(s), lastName: '', displayName: capitalize(s) };
    };

    const capitalize = (str) => {
      return (str || '').charAt(0).toUpperCase() + (str || '').slice(1).toLowerCase();
    };

    const userInfo = nameFromEmail(email);
    const newUser = {
      email,
      role,
      ...userInfo,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('ssotracker.user');
    } catch {
      // Ignore storage failures
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
