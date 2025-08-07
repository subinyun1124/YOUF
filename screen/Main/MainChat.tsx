import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {userAISubscriptionLastChat} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';

interface ChatMessage {
  id: string;
  customAiName: string;
  content: string;
  imageUrl: string;
}

const MainChat = () => {
  const [user] = useUserState();
  const userId = user?.userId?.toString();
  const userToken = user?.jwtToken?.toString() ?? null;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && userToken) {
      const fetchMessages = async () => {
        try {
          const data = await userAISubscriptionLastChat(userId, userToken);
          console.log('받아온 데이터: ', data);
          setMessages(data);
        } catch (error) {
          console.error('채팅 데이터를 가져오는 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [userId, userToken]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.chatRow}>
              <Image
                source={{
                  uri: item.imageUrl,
                }}
                style={styles.icon}
              />

              {/* 채팅 내용 */}
              <View style={styles.chatBubble}>
                <Text style={styles.sender}>{item.customAiName}</Text>
                <Text style={styles.message}>{item.content}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // 완전 흰색 배경
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderColor: '#000000', // 블랙 테두리
    borderWidth: 1.5,
  },
  chatBubble: {
    flex: 1,
    backgroundColor: '#F8F8F8', // 톤 다운된 회색 흰색
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  sender: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000', // 강한 블랙
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#333333', // 조금 부드러운 블랙
    lineHeight: 20,
  },
});

export default MainChat;
