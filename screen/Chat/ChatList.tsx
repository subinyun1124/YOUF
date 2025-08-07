import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import {userAISubscription} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';

interface ChatParams {
  id: string;
  name: string;
  time: Date;
  imageUrl: string;
  message?: string;
}

export default function ChatList() {
  const [user] = useUserState();
  const userId = user?.userId?.toString();
  const userToken = user?.jwtToken?.toString() ?? null;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [chatRoom, setChatRoom] = useState<ChatParams[]>([]);

  useEffect(() => {
    if (userId && userToken) {
      const getCustomAIList = async () => {
        try {
          const response = await userAISubscription(userId, userToken);
          console.log('AI 목록 원본:', response);

          const formattedData: ChatParams[] = response.map((item: any) => {
            const ai = item.customAIRespDto;

            return {
              id: item.id,
              name: ai.name,
              time: new Date(item.createdAt),
              imageUrl: ai.imageUrl,
              message: '',
            };
          });

          setChatRoom(formattedData);
        } catch (error) {
          console.error('데이터 가져오기 실패:', error);
        }
      };

      getCustomAIList();
    }
  }, [userId, userToken]);

  const renderItem = ({item}: {item: ChatParams}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          subscriptionId: item.id,
          YOUFName: item.name,
          YOUFImage: item.imageUrl,
        })
      }>
      <Image source={{uri: item.imageUrl}} style={styles.avatar} />
      <View style={styles.textArea}>
        <Text style={styles.name}>{item.name}</Text>
        <Text numberOfLines={1} style={styles.message}>
          {item.message || '메시지가 없습니다.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRoom}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textArea: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
});
