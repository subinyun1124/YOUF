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
    onError: (error:AuthError) => {
      const message = error.response?.data?.data?.[0]?.messages[0].message ?? '회원가입 실패';
      inform({
        title: '오류',
        message,
      });
    },
  });
  return mutation;
}
