/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { AuthContext } from './context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Login = ({ setIsLoggedIn, navigation }: any) => {
  const userInfo = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const handleEmail = (e: string) => {
    setEmail(e);
  };

  const handlePwd = (e: string) => {
    setPwd(e);
  };

  const handleClickCreate = () => {
    setIsCreate((prev) => !prev);
    setEmail('');
    setPwd('');
  };

  // 로그아웃 기능 -> 나중에
  const handleLogout = () => {
    auth.signOut();
  };

  const register = async () => {
    // 회원 가입일때
  if (isCreate) {
    createUserWithEmailAndPassword(auth, email, pwd)
      .then(() => {
        Alert.alert('회원가입 성공', '사용자가 성공적으로 생성되었습니다.', [
          { text: '확인', onPress: () => console.log('회원가입 성공')},
        ]);
      })
      .catch((e) => {
        Alert.alert('회원가입 실패', e.message, [
          { text: '확인', onPress: () => console.log('회원가입 실패')},
        ]);
      });
    } else {
      signInWithEmailAndPassword(auth, email, pwd)
        .then(() => {
          setIsLoggedIn(true); // 로그인 상태 변경
          navigation.navigate('Main'); // Main 화면으로 이동
        })
        .catch((e) => {
          Alert.alert('로그인 실패', e.message, [
            { text: '확인', onPress: () => console.log('로그인 실패')},
          ]);
        });
    }
 };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <View style={{ width: '100%' }}>
          <Text>이메일</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '100%', paddingLeft: 10 }}
            value={email}
            onChangeText = {handleEmail}
            placeholder = "이메일을 입력하세요"
            keyboardType = "email-address"
            textContentType="emailAddress"
            autoCapitalize = "none" // 자동으로 대문자 지정 방지
            autoComplete = "off"
            autoCorrect = {false}
            importantForAutofill="no" // 자동 채우기 방지
          />
          <Text>비밀번호</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '100%', paddingLeft: 10 }}
            value={pwd}
            onChangeText = {handlePwd}
            placeholder = "비밀번호를 입력하세요"
            secureTextEntry // 암호화(*)
          />
          <Button
            title = {isCreate ? '계정생성' : '로그인'}
            onPress={register}
          />
          <Button
            title = {isCreate ? '취소' : '회원가입'}
            onPress={handleClickCreate} // 회원가입/로그인 전환
          />
        </View>
    </View>
    </SafeAreaProvider>
  );
};


export default Login;
