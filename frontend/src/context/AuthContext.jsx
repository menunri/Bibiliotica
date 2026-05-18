import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => AuthService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => AuthService.isAuthenticated());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    setUser(AuthService.getUser());
    setIsAuthenticated(AuthService.isAuthenticated());
    setLoading(false);

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      setUser(AuthService.getUser());
      setIsAuthenticated(AuthService.isAuthenticated());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await AuthService.login(username, password);
    if (result.error) {
      return result;
    }
    setUser(AuthService.getUser());
    setIsAuthenticated(AuthService.isAuthenticated());
    return result;
  }, []);

  const register = useCallback(async (data) => {
    const result = await AuthService.register(data);
    if (result.error) {
      return result;
    }
    setUser(AuthService.getUser());
    setIsAuthenticated(AuthService.isAuthenticated());
    return result;
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    const result = await AuthService.adminLogin(username, password);
    if (result.error) {
      return result;
    }
    setUser(AuthService.getUser());
    setIsAuthenticated(AuthService.isAuthenticated());
    return result;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    adminLogin,
    logout,
    setUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;