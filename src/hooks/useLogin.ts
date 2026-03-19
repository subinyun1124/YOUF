import { useMutation } from '@tanstack/react-query';
import { userAISubscription, login } from '../api/authAPI';
import { useAuth } from '../auth/AuthContext';
import { authStorage } from '../auth/AuthStorage';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../src/screens/type';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

const useLogin = () => {

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const { setAuth } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log(data);
      const auth = {
        user: {
          userId: data.userId,
          email: data.email,
          role: data.role,
          loginAt: data.loginAt,
        },
        tokens: {
          accessToken: data.jwtToken,
        },
      };

      await authStorage.set(auth);

      setAuth(auth.user, auth.tokens);

      try {

        const subData =
          await userAISubscription(data.userId);

        if ((subData || []).length > 0) {
          navigation.navigate('Main');
        } else {
          navigation.navigate('Preference');
        }

      } catch(e) {
        console.log('구독 정보 에러', e);
        Alert.alert('구독 정보 불러오기 실패');
      }
    }
  });

  return mutation;
};

export default useLogin;