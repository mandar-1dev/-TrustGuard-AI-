import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('trustguard_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('trustguard_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('trustguard_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('trustguard_token');
          localStorage.removeItem('trustguard_user');
        }
      }
      setIsLoading(false);
    }
    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('trustguard_token', res.token);
      localStorage.setItem('trustguard_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('trustguard_token', res.token);
      localStorage.setItem('trustguard_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('trustguard_token');
      localStorage.removeItem('trustguard_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
