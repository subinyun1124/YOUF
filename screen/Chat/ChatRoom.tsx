import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Client, IFrame, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import {userAISubscriptionChat} from '../../api/auth';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../type';
import CustomHeader from '../CustomHeader';
import {useUserState} from '../../contexts/UserContext';

const SOCKET_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081/chat'
    : 'http://localhost:8081/chat';

type ChatRoomRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

interface MessagesType {
  sender: string;
  content: string;
  id: string;
  type: string;
}

// const SOCKET_URL = 'http://3.36.247.178:8081/chat';
const PUB_ENDPOINT = '/app/chat.sendMessage/';
const SUB_ENDPOINT = '/topic/public/';

const ChatRoom = () => {
  const route = useRoute<ChatRoomRouteProp>();
  const {subscriptionId, YOUFName, YOUFImage} = route.params;
  const [user] = useUserState();
  const userId = user?.userId?.toString();
  const userToken = user?.jwtToken?.toString() ?? null;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] =
    useState('연결 중입니다...');
  const [messageId, setMessageId] = useState<number>(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList<MessagesType>>(null);

  const typeMessage = (
    fullText: string,
    sender: string,
    id: string,
    type: string,
  ) => {
    let index = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      setMessages(prevMessages => {
        const last = prevMessages[prevMessages.length - 1];
        if (last && last.id === id) {
          return [
            ...prevMessages.slice(0, -1),
            {...last, content: last.content + fullText.charAt(index)},
          ];
        } else {
          return [
            ...prevMessages,
            {content: fullText.charAt(index), sender, id, type},
          ];
        }
      });

      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
  };

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (conn: IFrame) => {
        setIsConnected(true);
        setConnectionMessage('');

        client.subscribe(SUB_ENDPOINT + userId, (message: IMessage) => {
          const receiveData = JSON.parse(message.body);
          console.log('receiveData:', receiveData);

          if (receiveData.type !== 'USER') {
            setMessages(prev => [
              ...prev,
              {
                content: '',
                sender: receiveData.sender,
                id: receiveData.id,
                type: receiveData.type,
              },
            ]);
            typeMessage(
              receiveData.content,
              receiveData.sender,
              receiveData.id,
              receiveData.type,
            );
          }
        });
      },

      onWebSocketClose: close => {
        console.log('WebSocket 연결 종료됨', close);
        setConnectionMessage('연결이 끊어졌습니다. 재연결 시도 중...');
      },

      onWebSocketError: error => {
        console.error('WebSocket 오류', error);
      },

      onStompError: frame => {
        setConnectionMessage('서버와의 연결에 문제가 발생했습니다.');
        console.error('STOMP 오류: ' + frame.headers.message);
        console.error('추가 정보: ' + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      setIsConnected(false);
      if (client && client.active) {
        client.deactivate().catch(e => console.warn('해제 중 오류:', e));
      }
      setStompClient(null);
    };
  }, [userId]);

  useEffect(() => {
    if (userToken) {
      const loadChatHistory = async () => {
        setLoading(true);
        const response = await userAISubscriptionChat(
          subscriptionId,
          userToken,
        );

        if (Array.isArray(response?.content)) {
          const chatData = response.content.map((msg: any) => ({
            content: msg.content,
            sender: msg.senderName,
            id: String(msg.id),
            type: msg.type,
          }));
          setMessages(chatData);
        } else {
          console.warn('채팅 데이터 형식이 올바르지 않습니다.', response);
          setMessages([]);
        }

        setLoading(false);
        setIsInitialLoad(false);
      };
      loadChatHistory();
    }
  }, [subscriptionId, YOUFName, userToken]);

  useEffect(() => {
    if (!isInitialLoad && !isUserScrolling) {
      flatListRef.current?.scrollToOffset({offset: 0, animated: true});
    }
  }, [messages, isInitialLoad, isUserScrolling]);

  const sendMessage = (newMessage: any) => {
    if (
      isConnected &&
      stompClient &&
      stompClient.connected &&
      newMessage.content.trim() !== ''
    ) {
      const messageWithId = {
        ...newMessage,
        id: messageId,
        type: 'USER',
      };

      stompClient.publish({
        destination: PUB_ENDPOINT + userId,
        body: JSON.stringify(messageWithId),
      });

      console.log('publish:', messageWithId);

      setMessages(prevMessages => [...prevMessages, messageWithId]);
      setMessageId(prevId => prevId + 1);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <CustomHeader title={YOUFName} />
        {connectionMessage !== '' && (
          <View style={styles.connectionBanner}>
            {connectionMessage.includes('연결 중') && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{marginRight: 8}}
              />
            )}
            <Text style={styles.connectionText}>{connectionMessage}</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={Array.isArray(messages) ? [...messages].reverse() : []}
              renderItem={({item}) => (
                <ChatMessage
                  message={item.content}
                  type={item.type}
                  sender={item.sender}
                  isTyping={isTyping && item.type !== 'USER'}
                  aiName={YOUFName}
                  aiImageUrl={YOUFImage}
                />
              )}
              keyExtractor={item => item.id}
              inverted
              onScrollBeginDrag={() => setIsUserScrolling(true)}
              onMomentumScrollEnd={() => setIsUserScrolling(false)}
            />

            {isTyping && (
              <ChatMessage message="입력 중..." type="ASSISTANT" isTyping />
            )}
          </>
        )}
        <ChatInput onSend={sendMessage} disabled={!isConnected} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    padding: 8,
    paddingHorizontal: 16,
  },
  connectionText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ChatRoom;
