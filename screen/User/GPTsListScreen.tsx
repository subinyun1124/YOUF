import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {customAIList} from '../../api/auth';
import {useUserState} from '../../contexts/UserContext';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, GPTsParams} from '../type';

const GPTsListScreen = () => {
  const [user] = useUserState();
  const userId = user?.userId;
  const userToken = user?.jwtToken?.toString();
  const userRole = user?.role;
  const [GPTsDetail, setGPTsDetail] = useState<GPTsParams[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (userToken && userId && isFocused) {
      const fetchData = async () => {
        let customAiListData: GPTsParams[] = [];
        let filteredData: GPTsParams[] = [];
        let data: GPTsParams[] = [];
        try {
          if (userRole === 'ADMIN') {
            filteredData = await customAIList(userToken, '', 'Y', '');
          } else {
            customAiListData = await customAIList(
              userToken,
              userId.toString(),
              'Y',
              '',
            );
            filteredData = customAiListData.filter(
              (item: GPTsParams) => item.createByUsrId.toString() === userId,
            );
          }
          data = [...filteredData].sort(
            (a, b) =>
              new Date(b.createdTime).getTime() -
              new Date(a.createdTime).getTime(),
          );

          setGPTsDetail(data);
        } catch (error) {
          console.error('AI 데이터 로딩 실패:', error);
        }
      };
      fetchData();
    }
  }, [userToken, userId, userRole, isFocused]);

  const renderItem = ({item}: {item: GPTsParams}) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('GPTsDetail', {item, modify: true})}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.createdTime?.slice(0, 10) || '-'}</Text>
      <Text
        style={[
          styles.cell,
          {
            color: item.approved ? '#111111' : '#888888',
            fontWeight: item.approved ? '600' : '400',
            textAlign: 'center',
          },
        ]}>
        {item.approved ? '✅ 승인' : '⏳ 미승인'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>YOUF</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.cell, styles.headerText]}>생성일자</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.cell, styles.headerText]}>승인 여부</Text>
      </View>

      <FlatList
        data={GPTsDetail}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>생성된 AI가 없습니다 🐣</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#aaa',
    marginHorizontal: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#888888',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
});

export default GPTsListScreen;
