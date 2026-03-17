import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import useLogin from '../hooks/useLogin';

export default function LoginForm({onRegister}: any) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const {mutate: login} = useLogin();

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
});
