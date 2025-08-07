import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
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

const GoogleLoginComponent = () => {
  const handleSignIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log('test : ', userInfo);

      const tokens = await GoogleSignin.getTokens();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google 로그인</Text>
      <GoogleSigninButton onPress={handleSignIn} />
    </View>
  );
};

export default GoogleLoginComponent;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, marginBottom: 24},
});
