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

  const login = (authResponse) => {
    if (!authResponse) return;
    
    // Store the complete auth response from the backend
    const newUser = {
      userId: authResponse.userId,
      email: authResponse.email,
      role: authResponse.role,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      displayName: authResponse.displayName,
      position: authResponse.position,
      active: authResponse.active,
      mustChangePassword: authResponse.mustChangePassword,
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

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn }}>
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
