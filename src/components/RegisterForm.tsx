import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import useRegister from '../hooks/useRegister';
import {checkUserId} from '../api/authAPI';

export default function RegisterForm({onCancel}: any) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [idCheck, setIdCheck] = useState(false);

  const {mutate: register} = useRegister(onCancel);

  const checkId = async () => {
    const data = await checkUserId(userId);

    if (data.data) {
      Alert.alert('사용 가능한 아이디');
      setIdCheck(true);
    } else {
      Alert.alert('이미 존재하는 아이디');
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="이름"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.idRow}>
        <TextInput
          style={styles.idInput}
          placeholder="ID"
          value={userId}
          onChangeText={text => {
            setUserId(text);
            setIdCheck(false);
          }}
        />

        <TouchableOpacity style={styles.checkButton} onPress={checkId}>
          <Text style={{color: '#fff'}}>✓</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => register({userId, username, email, password})}>
        <Text style={styles.text}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={onCancel}>
        <Text style={styles.textOutline}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },

  idRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  idInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 6,
  },

  checkButton: {
    width: 45,
    marginLeft: 6,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
