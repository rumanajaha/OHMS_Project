import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../api/auth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse authUser from localStorage', e);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {  
    setIsLoading(true);
    
    try {
      const data = await loginApi(username, password);

      if (data.status !== 200) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      const loggedInUser = {
        id: data.user?.id?.toString(),  
        role: data.user.role,   
        name: data.user?.fullName || data.user?.username || username,
        email: data.user?.email || '',
        
        departmentId: data.user?.departmentName ? undefined : undefined,         
        employeeId: data.user?.employeeId,
        username: data.user?.username,
        fullName: data.user?.fullName,
        designation: data.user?.designation,
        departmentName: data.user?.departmentName,
      };

      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));

    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const updateUser = async (updates) => {
    if (!user) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const handleLogout = () => logout();

    window.addEventListener("unauthorized", handleLogout);

    return () => {
      window.removeEventListener("unauthorized", handleLogout);
    };
  }, []);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'MANAGER') {
      return ['view_team', 'edit_team', 'view_departments'].includes(permission);
    }
    if (user.role === 'EMPLOYEE') {
      return ['view_self', 'edit_self'].includes(permission);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getAuthToken = () => localStorage.getItem('authToken');