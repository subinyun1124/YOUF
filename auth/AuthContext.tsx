import {createContext, useContext, useState} from 'react';
import {User, AuthState} from '../api/types';

interface AuthContextType {
  user: User | null;

  tokens: AuthState['tokens'] | null;

  setAuth: (user: User, tokens: AuthState['tokens']) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);

  const [tokens, setTokens] = useState<AuthState['tokens'] | null>(null);

  const setAuth = (user: User, tokens: AuthState['tokens']) => {
    setUser(user);

    setTokens(tokens);
  };

  const logout = () => {
    setUser(null);

    setTokens(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        setAuth,
        logout,
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
