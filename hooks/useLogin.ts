import { useMutation } from '@tanstack/react-query';
import { userAISubscription, login } from '../api/authAPI';
import { useAuth } from '../auth/AuthContext';
import { authStorage } from '../auth/AuthStorage';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screen/type';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

const useLogin = () => {

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const { setAuth } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {

      const auth = {
        user: data.user,
        tokens: {
          accessToken: data.accessToken
        }
      };

      // storage 저장
      await authStorage.set(auth);

      // context 저장
      setAuth(auth.user, auth.tokens);

      try {

        const subData =
          await userAISubscription(data.user.id);

        if ((subData || []).length > 0) {
          navigation.navigate('Main');
        } else {
          navigation.navigate('Preference');
        }

      } catch {

        Alert.alert('구독 정보 불러오기 실패');

      }
    }
  });

  return mutation;
};

export default useLogin;