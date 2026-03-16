import { useMutation } from '@tanstack/react-query';
import { register } from '../api/authAPI';
import useInform from './useInform';
import { Alert } from 'react-native';

export default function useRegister(onSuccessCallback?: () => void) {
  const inform = useInform();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      Alert.alert('회원가입이 완료되었습니다.');
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.msg ||
        error?.message ||
        '회원가입 실패';

      inform({
        title: '회원가입 실패',
        message: message,
      });
    },
  });
  return mutation;
}
