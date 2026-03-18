import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

interface Props {
  message: string;
  type: string;
  isTyping?: boolean;
  sender?: string;
  aiName?: string;
  aiImageUrl?: string;
}

const ChatMessage = ({message, type, isTyping, aiName, aiImageUrl}: Props) => {
  const isUser = type === 'USER';

  if (!isUser) {
    // AI 메시지 레이아웃
    return (
      <View style={styles.aiMessageContainer}>
        <Image source={{uri: aiImageUrl}} style={styles.avatar} />
        <View style={styles.aiTextWrapper}>
          <Text style={styles.aiName}>{aiName}</Text>
          <View style={styles.bubble}>
            <Text style={styles.messageText}>{isTyping ? '입력 중...' : message}</Text>
          </View>
        </View>
      </View>
    );
  }

  // 사용자 메시지 레이아웃
  return (
    <View style={styles.userMessageContainer}>
      <View style={styles.userBubble}>
        <Text style={styles.userMessageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aiMessageContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  aiTextWrapper: {
    flexShrink: 1,
    backgroundColor: 'white',
  },
  aiName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  bubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: 'white',
  },
  userBubble: {
    backgroundColor: '#007aff',
    borderRadius: 10,
    padding: 10,
    maxWidth: '90%',
  },
  userMessageText: {
    color: 'white',
    fontSize: 14,
  },
});


export default ChatMessage;
