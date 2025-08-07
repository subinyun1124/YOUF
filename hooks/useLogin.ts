import { useMutation } from '@tanstack/react-query';
import { userAISubscription, login } from '../api/auth';
import { AuthError } from '../api/types';
import { useUserState } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { applyToken } from '../api/AxiosInfo';
import authStorage from '../storages/authStorage';
import useInform from './useInform';
import { RootStackParamList } from '../screen/type';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { Alert } from 'react-native';

const useLogin = () => {
  const inform = useInform();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user,setUser] = useUserState();
  const [subscriptions, setSubscriptions] = useState([]);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setUser(data);
      applyToken(data.jwtToken);
      authStorage.set(data);

      try {
        const subData = await userAISubscription(data.userId, data.jwtToken);
        setSubscriptions(subData || []);
        if ((subData || []).length > 0) {
          navigation.navigate('Main');
        } else {
          navigation.navigate('Preference');
        }

      } catch (error) {
        Alert.alert('구독 정보 불러오기 실패');
      }
    },
    onError: (error:AuthError) => {
      const message = error.response?.data?.data?.[0]?.messages[0].message ?? '로그인 실패';
      inform({
        title: '오류',
        message,
      });
    },
  });
  return mutation;
};

export default useLogin;
