// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
//   TextInput,
//   Alert,
//   ToastAndroid,
//   Platform,
// } from 'react-native';
// import {RootStackParamList, GPTsParams} from '../type';
// import {useUserState} from '../../contexts/UserContext';
// import {AISubcription, CustomAIList} from '../../api/auth';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';

// const {width} = Dimensions.get('window');
// const CARD_WIDTH = width * 0.8;

// const AssistantSubscriptionScreen = () => {
//   const [user] = useUserState();
//   const userId = user?.userId ?? null;
//   const userToken = user?.jwtToken?.toString() ?? null;
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const [GPTsDetail, setGPTsDetail] = useState<GPTsParams[]>([]);
//   const [filteredData, setFilteredData] = useState<GPTsParams[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const flatListRef = useRef<FlatList>(null);
//   const thumbListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     if (userToken && userId) {
//       const fetchData = async () => {
//         try {
//           const data = await CustomAIList(userToken, '', 'Y', 'N');
//           const sortedData = [...data].sort((a, b) => a.id - b.id);
//           setGPTsDetail(sortedData);
//           setFilteredData(sortedData);
//         } catch (error) {
//           console.error('AI 데이터 로딩 실패:', error);
//         }
//       };
//       fetchData();
//     }
//   }, [userToken, userId]);

//   const handleSearch = (text: string) => {
//     setSearchText(text);
//     if (text.trim() === '') {
//       setFilteredData(GPTsDetail);
//       setCurrentIndex(0);
//     } else {
//       const filtered = GPTsDetail.filter(item =>
//         item.name.toLowerCase().includes(text.toLowerCase()),
//       );
//       setFilteredData(filtered);
//       setCurrentIndex(0);
//     }
//   };

//   const handleMorePress = (item: GPTsParams) => {
//     console.log('더보기 클릭됨:', item.name);
//     navigation.navigate('GPTsDetail', {item, modify: true});
//   };

//   const handleSubscribe = async () => {
//     if (!(userId && userToken)) {
//       Alert.alert('오류', '유저 정보가 없습니다.');
//       return;
//     }

//     Alert.alert('구독하시겠습니까?', '', [
//       {text: '아니요'},
//       {
//         text: '네',
//         onPress: async () => {
//           try {
//             const currentItem = GPTsDetail[currentIndex];
//             const customAiId = currentItem?.id;
//             await AISubcription({userId, customAiId}, userToken);
//             if (Platform.OS === 'ios') {
//               Alert.alert('알림', '구독 성공');
//             } else {
//               ToastAndroid.show('구독 성공', ToastAndroid.SHORT);
//             }
//             navigation.navigate('Main');
//           } catch (error) {
//             Alert.alert('오류', '구독 실패');
//           }
//         },
//       },
//     ]);
//   };

//   const scrollToCard = (index: number) => {
//     setCurrentIndex(index);
//     try {
//       flatListRef.current?.scrollToIndex({index, animated: true});
//       thumbListRef.current?.scrollToIndex({index, animated: true});
//     } catch (err) {
//       console.warn('스크롤 오류:', err);
//     }
//   };

//   const renderItem = ({item}: {item: GPTsParams}) => (
//     <View style={styles.card}>
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.description}>{item.description}</Text>
//       <Image source={{uri: item.imageUrl}} style={styles.image} />
//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={styles.moreButton}
//           onPress={() => handleMorePress(item)}>
//           <Text style={styles.moreButtonText}>더보기</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.subscribeButton}
//           onPress={() => handleSubscribe()}>
//           <Text style={styles.subscribeButtonText}>구독</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="이름으로 검색"
//         value={searchText}
//         onChangeText={handleSearch}
//         placeholderTextColor="#999"
//       />

//       <View style={styles.assistantTextRow}>
//         <Text style={styles.assistantText}>찾고있는게 없나요??</Text>
//         <TouchableOpacity
//           style={styles.createAssistantButton}
//           onPress={() => navigation.navigate('CreateAssistant')}>
//           <Text style={styles.createAssistantButtonText}>
//             👉 나만의 YOUF 만들기
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 카드 리스트 */}
//       <FlatList
//         ref={flatListRef}
//         data={filteredData}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={{
//           alignItems: 'center',
//           paddingTop: 10,
//           paddingBottom: 100,
//         }}
//         onScroll={e => {
//           const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
//           setCurrentIndex(newIndex);
//         }}
//         scrollEventThrottle={16}
//         getItemLayout={(_, index) => ({
//           length: width,
//           offset: width * index,
//           index,
//         })}
//         initialScrollIndex={currentIndex}
//       />

//       <View style={styles.bottomBar}>
//         <View style={styles.thumbnailRow}>
//           <View style={styles.counterBox}>
//             <Text style={styles.counterText}>
//               {filteredData.length === 0
//                 ? '0 / 0'
//                 : ${currentIndex + 1} / ${filteredData.length}}
//             </Text>
//           </View>

//           <FlatList
//             ref={thumbListRef}
//             data={filteredData}
//             keyExtractor={item => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             renderItem={({item, index}) => (
//               <TouchableOpacity onPress={() => scrollToCard(index)}>
//                 <Image
//                   source={{uri: item.imageUrl}}
//                   style={[
//                     styles.thumbnail,
//                     index === currentIndex && styles.activeThumb,
//                   ]}
//                 />
//               </TouchableOpacity>
//             )}
//             contentContainerStyle={{paddingLeft: 8}}
//             getItemLayout={(_, index) => ({
//               length: 48,
//               offset: 48 * index,
//               index,
//             })}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingTop: 30,
//   },
//   searchInput: {
//     backgroundColor: '#FAFAFA',
//     marginHorizontal: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     fontSize: 16,
//     color: '#111111',
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#000000',
//   },
//   assistantTextRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     marginTop: 5,
//     justifyContent: 'center',
//   },
//   assistantText: {
//     fontSize: 14,
//     color: '#111111',
//     marginRight: 10,
//   },
//   createAssistantButton: {
//     backgroundColor: '#000000',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   createAssistantButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   card: {
//     width: CARD_WIDTH,
//     height: 380,
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#000000',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: width * 0.1,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#000000',
//   },
//   description: {
//     fontSize: 15,
//     color: '#111111',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   image: {
//     width: 200,
//     height: 180,
//     borderRadius: 8,
//     resizeMode: 'cover',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     width: '100%',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   thumbnailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   counterBox: {
//     backgroundColor: '#FAFAFA',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: '#000000',
//     minWidth: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   counterText: {
//     color: '#000000',
//     fontWeight: '600',
//   },
//   thumbnail: {
//     width: 40,
//     height: 40,
//     borderRadius: 6,
//     marginHorizontal: 4,
//     opacity: 0.4,
//   },
//   activeThumb: {
//     borderWidth: 2,
//     borderColor: '#000000',
//     opacity: 1,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//     gap: 10,
//   },
//   moreButton: {
//     backgroundColor: '#000000',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   moreButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   subscribeButton: {
//     backgroundColor: '#000000',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   subscribeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });
