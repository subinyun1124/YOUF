import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
  ToastAndroid,
} from 'react-native';
import {updateAssistant} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../type';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';

const BASE_Photo =
  'https://cdn.pixabay.com/photo/2025/03/07/13/12/flower-9453063_1280.jpg';

type GPTsDetailRouteProp = RouteProp<RootStackParamList, 'GPTsDetail'>;

const GPTsDetail = () => {
  const [user] = useUserState();
  const userId = user?.userId?.toString();
  const userToken = user?.jwtToken;
  const userRole = user?.role;

  const route = useRoute<GPTsDetailRouteProp>();
  const {item, modify} = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseAiId, setBaseAiId] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setId(item.id);
      setUserName(item.createByUsrName);
      setName(item.name);
      setDescription(item.description);
      setBaseAiId(item.basePrompt);
      setCustomPrompt(item.customPrompt || '');
      setImageUrl(item.imageUrl || BASE_Photo);
    }
  }, [item]);

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
          setImageUrl(response.assets[0].uri || null);
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
            await updateAssistant({
              userId,
              userToken,
              id,
              name,
              description,
              baseAiId,
              customPrompt,
              imageUrl,
              hidden: true,
              active: true,
              approved: false,
            });
            if (Platform.OS === 'ios') {
              Alert.alert('완료', '선호 AI가 저장되었습니다.');
            } else {
              ToastAndroid.show('저장 성공', ToastAndroid.SHORT);
            }
            navigation.navigate('UserSubscription');
          } catch (error) {
            console.error('Assistant 변경 오류:', error);
            if (Platform.OS === 'ios') {
              Alert.alert('오류', '저장 중 문제가 발생했습니다.');
            } else {
              ToastAndroid.show(
                '저장 중 문제가 발생했습니다.',
                ToastAndroid.SHORT,
              );
            }
          }
        },
      },
    ]);
  };

  const handleApprove = () => {
    if (!(userId && userToken)) {
      Alert.alert('오류', '유저 정보가 없습니다.');
      return;
    }

    Alert.alert('승인하시겠습니까?', '', [
      {text: '아니요'},
      {
        text: '네',
        onPress: async () => {
          try {
            await updateAssistant({
              userId,
              userToken,
              id,
              name,
              description,
              baseAiId,
              customPrompt,
              imageUrl,
              hidden: false,
              active: true,
              approved: true,
            });
            if (Platform.OS === 'ios') {
              Alert.alert('완료', '승인 완료');
            } else {
              ToastAndroid.show('승인 완료', ToastAndroid.SHORT);
            }
            navigation.goBack();
          } catch (error) {
            console.error('Assistant 승인 오류:', error);
            if (Platform.OS === 'ios') {
              Alert.alert('오류', '저장 중 문제가 발생했습니다.');
            } else {
              ToastAndroid.show(
                '저장 중 문제가 발생했습니다.',
                ToastAndroid.SHORT,
              );
            }
          }
        },
      },
    ]);
  };

  const handleReject = () => {
    Alert.alert('거절 완료', '해당 AI가 거절되었습니다.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>YOUF 상세 내용</Text>

          <Text style={styles.label}>개발자</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            editable={true}
          />

          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={modify}
          />

          <Text style={styles.label}>설명</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            multiline
            onChangeText={setDescription}
            editable={modify}
          />

          <Text style={styles.label}>기초모델</Text>
          <TextInput
            style={styles.input}
            value={baseAiId}
            onChangeText={setBaseAiId}
            editable={modify}
          />

          <Text style={styles.label}>커스텀</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={customPrompt}
            multiline
            onChangeText={setCustomPrompt}
            editable={modify}
          />

          <Text style={styles.label}>이미지</Text>
          <TouchableOpacity
            style={[styles.imageUpload, {opacity: 0.6}]}
            activeOpacity={1}
            onPress={pickImage}>
            {imageUrl ? (
              <Image source={{uri: imageUrl}} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>이미지 없음</Text>
            )}
          </TouchableOpacity>

          {userRole === 'ADMIN' ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.outlineButton, {borderColor: '#EF4444'}]}
                onPress={handleReject}>
                <Text style={[styles.outlineButtonText, {color: '#EF4444'}]}>
                  거절
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, {borderColor: '#3B82F6'}]}
                onPress={handleApprove}>
                <Text style={[styles.outlineButtonText, {color: '#3B82F6'}]}>
                  승인
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.saveButton}>
              <Button
                title={modify ? '저장' : '구독'}
                onPress={handleSave}
                color="#000"
              />
            </View>
          )}
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
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 999,
    textAlign: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    color: '#aaa',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  outlineButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default GPTsDetail;
