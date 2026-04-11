import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'Admin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: Role) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  'admin@demo.com': { id: 'u1', name: 'Admin User', email: 'admin@demo.com', role: 'Admin' },
  'manager@demo.com': { id: 'u2', name: 'Manager User', email: 'manager@demo.com', role: 'Manager', departmentId: 'd1' },
  'employee@demo.com': { id: 'u3', name: 'Employee User', email: 'employee@demo.com', role: 'Employee', departmentId: 'd1' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse authUser from local storage', e);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: Role) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // For demo purposes, we allow any login but match the role if email matches mock users
    const mockUser = MOCK_USERS[email] || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };

    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const updateUser = async (updates: Partial<User>) => {
    if(!user) return;
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
  };

  // Simple RBAC check
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    if (user.role === 'Admin') return true; // Admin has all permissions
    
    if (user.role === 'Manager') {
      const managerPermissions = ['view_team', 'edit_team', 'view_departments'];
      return managerPermissions.includes(permission);
    }
    
    if (user.role === 'Employee') {
      const employeePermissions = ['view_self', 'edit_self'];
      return employeePermissions.includes(permission);
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser, hasPermission }}>
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
