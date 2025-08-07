import { User } from 'firebase/auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';

interface AuthProviderProps {
  children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged(fbUser => {
      setUser(fbUser);
    });
    return subscribe;
  }, []);

  return <AuthContext.Provider value={user} >{children}</AuthContext.Provider>;
};

export default AuthProvider;
