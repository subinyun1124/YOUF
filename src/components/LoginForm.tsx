import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import useLogin from '../hooks/useLogin';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function LoginForm({onRegister}: any) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const {mutate: login} = useLogin();

  const signInWithKakao = async () => {
    try {
      const token = await kakaoLogin();
      console.log('카카오 로그인 성공', token);
    } catch (e) {
      console.error('카카오 로그인 실패', e);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log('구글 로그인 성공', userInfo);
    } catch (e) {
      console.error('구글 로그인 실패', e);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{marginTop: 10}}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={signInWithGoogle}>
          <Text style={styles.socialText}>Google로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={signInWithKakao}>
          <Text style={styles.socialText}>Kakao로 로그인</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => login({userId, password})}>
        <Text style={styles.text}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={onRegister}>
        <Text style={styles.textOutline}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },

  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
  },

  text: {
    color: '#fff',
    textAlign: 'center',
  },

  buttonOutline: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
  },

  textOutline: {
    textAlign: 'center',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#fff',
  },

  socialText: {
    textAlign: 'center',
    color: '#000',
  },
});
