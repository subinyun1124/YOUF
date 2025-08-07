import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {baseAIList, createAssistant} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';
import {RootStackParamList} from '../type';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

interface BaseAIItem {
  id: string;
  name: string;
}

const CreateAssistantScreen = () => {
  const [user] = useUserState();
  const userId = user?.userId.toString();
  const userToken = user?.jwtToken?.toString() ?? null;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseAiId, setBaseAiId] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageUrl, setImageUri] = useState<string | null>(null);
  const [baseAIlist, setBaseAIList] = useState<BaseAIItem[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (userToken) {
      const getBaseAIList = async () => {
        const data: BaseAIItem[] = await baseAIList(userToken);
        console.log('Base AI 목록:', data);
        setBaseAIList(data || []);
      };

      getBaseAIList();
    }
  }, [userToken]);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('사용자가 이미지 선택 취소');
        } else if (response.errorMessage) {
          Alert.alert('이미지 선택 오류', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || null);
        }
      },
    );
  };

  const handleSave = async () => {
    if (!(userId && userToken)) {
      Alert.alert('오류', '유저 정보가 없습니다.');
      return;
    }

    Alert.alert('저장하시겠습니까?', '', [
      {text: '아니요'},
      {
        text: '네',
        onPress: async () => {
          try {
            await createAssistant({
              userId,
              userToken,
              name,
              description,
              baseAiId,
              customPrompt,
              imageUrl,
              hidden: true,
            });
            Alert.alert('완료', '선호 AI가 저장되었습니다.');
            navigation.navigate('GPTsList');
          } catch (error) {
            console.error('Assistant 생성 오류:', error);
            Alert.alert('오류', '저장 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>YOUF 생성</Text>

          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름 입력"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>설명</Text>
          <TextInput
            style={[styles.input, styles.describetextArea]}
            placeholder="사용자들에게 보여줄 YOUF에 대한 설명을 입력해주세요"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>기초모델</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={baseAiId}
              onValueChange={itemValue => setBaseAiId(itemValue || '')}
              style={styles.picker}
              mode="dropdown">
              <Picker.Item label="베이스 AI 모델을 선택해주세요" value={''} />
              {baseAIlist.map(model => (
                <Picker.Item
                  key={model.id}
                  label={model.name}
                  value={model.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>커스텀</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="예시) 너는 미국 주식 시장을 잘 아는 투자 코치야.
- 어떤 회사인지 (한 줄 요약)
- 주가 흐름 (상승/하락 요인 간단 설명)
- 현재 시장에서 이 종목이 주목받는 이유를 알려줘.
전문 용어는 초보 투자자도 이해할 수 있게 쉽게 설명해 줘."
            value={customPrompt}
            onChangeText={setCustomPrompt}
            multiline
          />

          <Text style={styles.label}>이미지</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{uri: imageUrl}} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>이미지 선택</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.blackButton} onPress={handleSave}>
            <Text style={styles.blackButtonText}>저 장</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 999,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    color: '#111111',
    backgroundColor: '#FAFAFA',
  },
  describetextArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  textArea: {
    height: 130,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    marginTop: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#111111',
    backgroundColor: '#FAFAFA',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#FAFAFA',
  },
  imagePlaceholder: {
    color: '#888888',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#000000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  blackButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  blackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default CreateAssistantScreen;
