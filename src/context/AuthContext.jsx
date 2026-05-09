import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bame_user');
    return saved ? JSON.parse(saved) : null;
  });

  const ADMIN_EMAIL = 'bame@gmail.com';

  useEffect(() => {
    if (user) {
      localStorage.setItem('bame_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bame_user');
    }
  }, [user]);

  const register = (name, email) => {
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    const newUser = { name, email, role };
    setUser(newUser);
    return newUser;
  };

  const login = (email) => {
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    const existingUser = { name: email.split('@')[0], email, role };
    setUser(existingUser);
    return existingUser;
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
