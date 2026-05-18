'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('classora_token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        // Token expired/invalid — clear it
        localStorage.removeItem('classora_token');
        setToken(null);
      }
    } catch {
      localStorage.removeItem('classora_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return false;
      }

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('classora_token', data.data.token);
      toast.success('Welcome back! 👋');
      return true;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, []);

  const signup = useCallback(async (formData: SignupData): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Signup failed');
        return false;
      }

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('classora_token', data.data.token);
      toast.success('Account created! Welcome to Classora 🎉');
      return true;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('classora_token');
    fetch('/api/auth/me', { method: 'POST' }); // clear cookie
    router.push('/login');
    toast.success('Logged out successfully');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
