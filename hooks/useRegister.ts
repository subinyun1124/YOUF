import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';
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
      inform({
        title: '오류',
        message: error.message ?? '회원가입 실패',
      });
    },
  });
  return mutation;
}
