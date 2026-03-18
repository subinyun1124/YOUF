import {createContext, useContext, useState} from 'react';
import {User, AuthState} from '../api/types';
import {authStorage} from './AuthStorage';

interface AuthContextType {
  user: User | null;
  tokens: AuthState['tokens'] | null;
  loading: boolean;

  setAuth: (user: User, tokens: AuthState['tokens']) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthState['tokens'] | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = (user: User, tokens: AuthState['tokens']) => {
    setUser(user);
    setTokens(tokens);
    setLoading(false);
  };

  const logout = async () => {
    await authStorage.clear();
    setUser(null);
    setTokens(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        setAuth,
        logout,
        setLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
