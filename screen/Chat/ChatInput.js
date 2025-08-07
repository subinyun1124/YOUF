import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUserState} from '../../contexts/UserContext';

const ChatInput = ({ onSend, disabled }) => {
  const [user] = useUserState();
  const userId = user?.userId;
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend({ sender: userId, content: message });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요..."
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.sendButton,
          (disabled || !message.trim()) && { backgroundColor: '#ccc' },
        ]}
        disabled={disabled || !message.trim()}
      >
        <Ionicons name="send" size={20} color={(disabled || !message.trim()) ? '#888' : '#075E54'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECE5DD',
  },
});

export default ChatInput;
