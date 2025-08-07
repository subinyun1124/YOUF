import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import {RootStackParamList, GPTsParams} from '../type';
import {useUserState} from '../../contexts/UserContext';
import {AISubcription, customAIList} from '../../api/auth';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2;

const AssistantSubscriptionScreen = () => {
  const [user] = useUserState();
  const userId = user?.userId ?? null;
  const userToken = user?.jwtToken?.toString() ?? null;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [GPTsDetail, setGPTsDetail] = useState<GPTsParams[]>([]);
  const [filteredData, setFilteredData] = useState<GPTsParams[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const thumbListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (userToken && userId) {
      const fetchData = async () => {
        try {
          const data = await customAIList(userToken, '', 'Y', 'N');
          const sortedData = [...data].sort((a, b) => a.id - b.id);
          setGPTsDetail(sortedData);
          setFilteredData(sortedData);
        } catch (error) {
          console.error('AI 데이터 로딩 실패:', error);
        }
      };
      fetchData();
    }
  }, [userToken, userId]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredData(GPTsDetail);
      setCurrentIndex(0);
    } else {
      const filtered = GPTsDetail.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
      setCurrentIndex(0);
    }
  };

  const handleMorePress = (item: GPTsParams) => {
    console.log('더보기 클릭됨:', item.name);
    navigation.navigate('GPTsDetail', {item, modify: true});
  };

  const handleSubscribe = async () => {
    if (!(userId && userToken)) {
      Alert.alert('오류', '유저 정보가 없습니다.');
      return;
    }

    Alert.alert('구독하시겠습니까?', '', [
      {text: '아니요'},
      {
        text: '네',
        onPress: async () => {
          try {
            const currentItem = GPTsDetail[currentIndex];
            const customAiId = currentItem?.id;
            await AISubcription({userId, customAiId}, userToken);
            if (Platform.OS === 'ios') {
              Alert.alert('알림', '구독 성공');
            } else {
              ToastAndroid.show('구독 성공', ToastAndroid.SHORT);
            }
            navigation.navigate('Main');
          } catch (error) {
            Alert.alert('오류', '구독 실패');
          }
        },
      },
    ]);
  };

  const scrollToCard = (index: number) => {
    setCurrentIndex(index);
    try {
      flatListRef.current?.scrollToIndex({index, animated: true});
      thumbListRef.current?.scrollToIndex({index, animated: true});
    } catch (err) {
      console.warn('스크롤 오류:', err);
    }
  };

  const renderItem = ({item}: {item: GPTsParams}) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.imageUrl}} style={styles.imageBackground} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradientOverlay}
        />
      </View>
      <View style={styles.textOverlay}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleMorePress(item)}>
            <Text style={styles.moreLink}>더보기</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="검색"
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.assistantTextRow}>
        <Text style={styles.assistantText}>찾고있는게 없나요??</Text>
        <TouchableOpacity
          style={styles.createAssistantButton}
          onPress={() => navigation.navigate('CreateAssistant')}>
          <Text style={styles.createAssistantButtonText}>
            👉 나만의 YOUF 만들기
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={filteredData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 10,
        }}
        onScroll={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={currentIndex}
      />
      {filteredData.length > 0 && (
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>구독</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomBar}>
        <View style={styles.thumbnailRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterText}>
              {filteredData.length === 0
                ? '0 / 0'
                : `${currentIndex + 1} / ${filteredData.length}`}
            </Text>
          </View>

          <FlatList
            ref={thumbListRef}
            data={filteredData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => scrollToCard(index)}>
                <Image
                  source={{uri: item.imageUrl}}
                  style={[
                    styles.thumbnail,
                    index === currentIndex && styles.activeThumb,
                  ]}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{paddingLeft: 8}}
            getItemLayout={(_, index) => ({
              length: 48,
              offset: 48 * index,
              index,
            })}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  searchWrapper: {
    position: 'relative',
    marginHorizontal: CARD_MARGIN,
    marginBottom: 15,
  },
  searchIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 10,
    paddingHorizontal: 40, // 아이콘 오른쪽 공간 확보
    borderRadius: 6,
    fontSize: 16,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#000000',
  },

  assistantTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 5,
    justifyContent: 'center',
  },
  assistantText: {
    fontSize: 14,
    color: '#111111',
    marginRight: 10,
  },
  createAssistantButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  createAssistantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    height: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  moreLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontSize: 14,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subscribeButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 80,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: CARD_MARGIN,
  },
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterBox: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000000',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: '#000000',
    fontWeight: '600',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  activeThumb: {
    borderWidth: 2,
    borderColor: '#000000',
    opacity: 1,
  },
});

export default AssistantSubscriptionScreen;
