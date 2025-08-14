import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type?: 'client' | 'professional' | 'admin') => Promise<void>;
  register: (email: string, password: string, name: string, type: 'client' | 'professional') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock users para demonstração
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@nowlook.com',
      name: 'Admin NowLook',
      type: 'admin'
    },
    {
      id: '2',
      email: 'profissional@example.com',
      name: 'Salão Exemplo',
      type: 'professional',
      subscribed: true,
      subscription_end: '2024-12-31'
    },
    {
      id: '3',
      email: 'cliente@example.com',
      name: 'João Silva',
      type: 'client'
    }
  ];

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('nowlook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, type?: 'client' | 'professional' | 'admin') => {
    setLoading(true);
    try {
      // Simulação de login - em produção, fazer chamada real para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && (type ? foundUser.type === type : true)) {
        setUser(foundUser);
        localStorage.setItem('nowlook_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Credenciais inválidas');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, type: 'client' | 'professional') => {
    setLoading(true);
    try {
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        type,
        subscribed: type === 'professional' ? true : undefined
      };
      
      setUser(newUser);
      localStorage.setItem('nowlook_user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nowlook_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};