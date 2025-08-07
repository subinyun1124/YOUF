import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import useLogin from '../hooks/useLogin';
import useRegister from '../hooks/useRegister';
import {login} from '@react-native-seoul/kakao-login';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '1045554672421-lkgu416m04hijbmers2lm7balk38ptep.apps.googleusercontent.com',
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

function Login() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');

  const [isRegister, setIsRegister] = useState(false);

  const {mutate: locallogin, isPending: loginLoading} = useLogin();
  const {mutate: localregister, isPending: registerLoading} = useRegister();
  const isLoading = loginLoading || registerLoading;

  const handleClickCreate = () => {
    setIsRegister((click: boolean) => !click);
  };

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      console.log('login success ', token);
    } catch (err) {
      console.error('login err', err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log('test : ', userInfo);

      //const tokens = await GoogleSignin.getTokens();

      // 백엔드에 ID 토큰 보내기
      // await fetch('https://your-server.com/api/auth/google', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify({token: tokens.idToken}),
      // });

      //Alert.alert('로그인 성공', `환영합니다, ${userInfo.user.name}!`);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const onPress = () => {
    if (isLoading) {
      return;
    }

    if (isRegister) {
      localregister({
        userId,
        fullname,
        email,
        password,
      });
      setEmail('');
      setPassword('');
      setUserId('');
      setFullname('');
      setIsRegister(false);
    } else {
      locallogin({
        userId,
        password,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding'})}>
      <View style={styles.header}>
        <Text style={{fontFamily: 'Danjo-bold-Regular', fontSize: 48}}>
          YOUF
        </Text>
      </View>
      <View style={styles.card}>
        {isRegister && (
          <>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="풀네임"
              placeholderTextColor="#999"
              value={fullname}
              onChangeText={setFullname}
              autoCapitalize="none"
            />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="패스워드"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[
            styles.submit,
            {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000'},
          ]}
          onPress={signInWithGoogle}>
          <Text style={[styles.submitText, {color: '#000'}]}>
            Google로 로그인
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submit,
            {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000'},
          ]}
          onPress={signInWithKakao}>
          <Text style={[styles.submitText, {color: '#191919'}]}>
            Kakao로 로그인
          </Text>
        </TouchableOpacity>

        <Pressable
          style={({pressed}) => [
            styles.submit,
            Platform.OS === 'ios' && pressed && styles.submitPressed,
          ]}
          android_ripple={{color: '#42a5f5'}}
          onPress={onPress}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitText}>
              {isRegister ? '회원가입' : '로그인'}
            </Text>
          )}
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.submit,
            Platform.OS === 'ios' && pressed && styles.submitPressed,
          ]}
          android_ripple={{color: '#42a5f5'}}
          onPress={handleClickCreate}>
          <Text style={styles.submitText}>
            {isRegister ? '취소' : '회원가입'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 15,
    color: '#555555',
    marginTop: 6,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FAFAFA',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 15,
    color: '#111111',
  },
  submit: {
    marginTop: 14,
    backgroundColor: '#000000',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    opacity: 0.85,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  kakaoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#FEE500',
    borderRadius: 6,
    overflow: 'hidden',
    height: 50,
  },
  kakaoImage: {
    width: '100%',
    height: 50,
    resizeMode: 'cover',
  },
  googleButton: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFE3E1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#FF8FAB',
//     fontFamily: 'PoetsenOne-Regular',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#555',
//     marginTop: 4,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 400,
//     backgroundColor: 'rgb(255, 255, 255)',
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: {width: 0, height: 4},
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   submit: {
//     marginTop: 12,
//     backgroundColor: '#2196f3',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submitPressed: {
//     opacity: 0.75,
//   },
//   submitText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   kakaoButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 12,
//   },
//   kakaoImage: {
//     width: '100%',
//     height: 56,
//     borderRadius: 8,
//   },
//   googleButton: {
//     width: '100%',
//     height: 56,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

export default Login;
