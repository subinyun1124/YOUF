import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>YOUF</Text>

      {isRegister ? (
        <RegisterForm onCancel={() => setIsRegister(false)} />
      ) : (
        <LoginForm onRegister={() => setIsRegister(true)} />
      )}
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Danjo-bold-Regular',
  },
});
