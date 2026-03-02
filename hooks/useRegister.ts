import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';
import { AuthError } from '../api/types';
import useInform from './useInform';
import { Alert } from 'react-native';

export default function useRegister() {
  const inform = useInform();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      Alert.alert('회원가입이 완료되었습니다.');
      console.log(data);
    },
    onError: (error: any) => {
      console.log('🔥 회원가입 에러 전체:', error);
      console.log('🔥 response:', error.response);
      console.log('🔥 message:', error.message);

      inform({
        title: '오류',
        message: error.message ?? '회원가입 실패',
      });
    },
  });
  return mutation;
}
