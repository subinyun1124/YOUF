import {useEffect, useState} from 'react';
import {authStorage} from './AuthStorage';
import {useAuth} from './AuthContext';

export const useAuthLoad = () => {
  const {setAuth, loading, setLoading} = useAuth();

  useEffect(() => {
    if (!loading) return;

    const load = async () => {
      const saved = await authStorage.get();

      if (saved?.user && saved?.tokens) {
        setAuth(saved.user, saved.tokens);
      }
      setLoading(false);
    };

    load();
  }, [setAuth, loading, setLoading]);
};
