import { useEffect } from 'react';
import {useAuthLoad} from './useAuthLoad';
import { authStorage } from './AuthStorage';

const AuthLoader = () => {
  useEffect(() => {
    authStorage.clear(); // 로컬 테스트 중 로그인 데이터 삭제
  }, []);

  useAuthLoad();
  return null;
};

export default AuthLoader;
