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
  Alert,
} from 'react-native';
import useLogin from '../hooks/useLogin';
import useRegister from '../hooks/useRegister';
import {login} from '@react-native-seoul/kakao-login';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {checkUserId} from '../api/authAPI';

GoogleSignin.configure({
  webClientId:
    '1045554672421-lkgu416m04hijbmers2lm7balk38ptep.apps.googleusercontent.com',
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

function Login() {
  // 입력폼
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [isRegister, setIsRegister] = useState(false);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setUserId('');
    setUsername('');
    setIsRegister(false);
  };

  const {mutate: locallogin, isPending: loginLoading} = useLogin();
  const {mutate: localregister, isPending: registerLoading} =
    useRegister(clearInputs);

  const isLoading = loginLoading || registerLoading;

  const handleClickCreate = () => {
    setIsRegister((click: boolean) => !click);
  };

  // 카카오 회원가입
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      console.log('login success ', token);
    } catch (err) {
      console.error('login err', err);
    }
  };

  // 구글 회원가입
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

  // ID 중복 체크 버튼 추가
  const [idCheck, setIdCheck] = useState(false);
  const checkId = async () => {
    if (!userId) {
      Alert.alert('아이디를 입력해주세요');
      return;
    }

    if (userId.length < 4) {
      Alert.alert('아이디는 4자 이상 입력해주세요');
      return;
    }

    try {
      const data = await checkUserId(userId);
      if (data.data === true) {
        Alert.alert('사용 가능한 아이디입니다');
        setIdCheck(true);
      } else {
        Alert.alert('이미 존재하는 아이디입니다');
        setIdCheck(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 회원가입 시 검증 규칙
  const validateRegister = () => {
    if (!userId) {
      Alert.alert('아이디를 입력해주세요');
      return false;
    }

    if (!username) {
      Alert.alert('이름을 입력해주세요');
      return false;
    }

    if (!email) {
      Alert.alert('이메일을 입력해주세요');
      return false;
    }

    if (!password) {
      Alert.alert('패스워드를 입력해주세요');
      return false;
    }

    if (userId.length < 4) {
      Alert.alert('아이디는 4자 이상 입력해주세요');
      return false;
    }

    if (password.length < 4) {
      Alert.alert('패스워드는 4자 이상 입력해주세요');
      return false;
    }

    // 이메일 정규식 검증
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('올바른 이메일 형식이 아닙니다');
      return false;
    }

    return true;
  };

  const onPress = () => {
    if (isLoading) return;

    if (isRegister) {
      if (!idCheck) {
        Alert.alert('아이디 중복 확인을 해주세요');
        return;
      }

      // 유효성 검증
      if (!validateRegister()) return;

      localregister({
        userId,
        username,
        email,
        password,
      });
    } else {
      if (!userId || !password) {
        Alert.alert('아이디와 비밀번호를 입력해주세요');
        return;
      }

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
              placeholder="이름"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={text => {
            setUserId(text);
            setIdCheck(false);
          }}
          autoCapitalize="none"
        />
        {idCheck && (
          <Text style={{color: 'green', marginBottom: 10}}>
            사용 가능한 아이디입니다
          </Text>
        )}
        <TouchableOpacity style={styles.submit} onPress={checkId}>
          <Text style={styles.submitText}>아이디 중복 확인</Text>
        </TouchableOpacity>
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

export default Login;
