import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {customAIList, AISubcription} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '.././type';

interface AIItem {
  id: string;
  name: string;
}

const PreferencesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [list, setList] = useState<AIItem[]>([]);

  const [user] = useUserState();
  const userId = user?.userId.toString();
  const userToken = user?.jwtToken?.toString() ?? null;

  useEffect(() => {
    if (userToken && userId) {
      const getCustomAIList = async () => {
        const customAIListdata: AIItem[] = await customAIList(
          userToken,
          '',
          'Y',
          'N',
        );
        const data = [...customAIListdata].sort(
          (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime(),
        );
        console.log(data);
        setList(data || []);
      };
      getCustomAIList();
    }
  }, [userId, userToken]);

  const toggleSelection = (item: AIItem) => {
    setSelectedPreferences(prev =>
      prev.includes(item.id)
        ? prev.filter(pref => pref !== item.id)
        : [...prev, item.id],
    );
  };

  const handleSubscribe = async () => {
    if (!(userId && userToken)) {
      Alert.alert('오류', '유저 정보가 없습니다.');
      return;
    }

    const selectedNames = list
      .filter(item => selectedPreferences.includes(item.id))
      .map(item => item.name);

    Alert.alert('저장하시겠습니까?', selectedNames.join(', '), [
      {text: '아니요'},
      {
        text: '네',
        onPress: async () => {
          try {
            for (const aiId of selectedPreferences) {
              await AISubcription({userId, customAiId: aiId}, userToken); // 객체 형태로 전달
            }
            Alert.alert('완료', '선호 AI가 저장되었습니다.');
            navigation.navigate('Main');
          } catch (error) {
            Alert.alert('오류', '저장 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>구독하고 싶은 YOUF를 선택해 주세요</Text>
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) => {
          const isSelected = selectedPreferences.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => toggleSelection(item)}>
              <Text
                style={[styles.itemText, isSelected && styles.selectedText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  item: {
    flex: 1,
    paddingVertical: 18,
    margin: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  itemText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#111111',
  },
  selectedItem: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 20, backgroundColor: '#fff'},
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   item: {
//     flex: 1,
//     padding: 15,
//     margin: 5,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#ddd',
//     alignItems: 'center', // 수평 가운데
//     justifyContent: 'center', // 수직 가운데
//     height: 80, // 일정한 높이 지정 (선택사항)
//   },
//   itemText: {
//     fontSize: 16,
//     textAlign: 'center', // 텍스트 자체 수평 정렬
//   },
//   selectedItem: {backgroundColor: '#007bff', borderColor: '#007bff'},
//   selectedText: {color: '#fff'},
//   button: {
//     marginTop: 10,
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#007bff',
//     alignItems: 'center',
//   },
//   buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
// });

export default PreferencesScreen;
