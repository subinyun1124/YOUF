import {useEffect} from 'react';
import {authStorage} from '../auth/authStorage';
import {useAuth} from '../auth/AuthContext';

export const useAuthLoad = () => {
  const {setAuth} = useAuth();

  useEffect(() => {
    const load = async () => {
      const saved = await authStorage.get();

      if (!saved) return;
      if (!saved.user || !saved.tokens) return;

      setAuth(saved.user, saved.tokens);
    };

    load();
  }, [setAuth]);
};
