import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Worker, Master } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | Worker | Master | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<User | Worker | Master>;
  signup: (data: SignupData) => Promise<User | Worker | Master>;
  logout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  specialties?: string[];
  age?: number;
  hourlyRate?: number;
  location?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Worker | Master | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
        } catch (error) {
          sessionStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const response = await api.auth.login({ email, password, role });
    sessionStorage.setItem('token', response.access_token);
    const userData = await api.auth.me();
    setUser(userData);
    return userData;
  };

  const signup = async (data: SignupData) => {
    await api.auth.register(data);
    return await login(data.email, data.password, data.role);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
