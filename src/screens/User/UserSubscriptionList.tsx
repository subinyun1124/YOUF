import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, GPTsParams} from '../type';
import {
  AIUnSubcription,
  qurtzSchedule,
  userAISubscription,
  userAISubscriptionScheduler,
} from '../../../api/authAPI';
import {useAuth} from '../../auth/AuthContext';
import Scheduler from './Scheduler';

type JobData = {
  prompt: string;
  senderName: string;
  subscriptionId: string;
};

type GPTsWithQuartz = GPTsParams & {
  aiSubscriptionId: string;
  notificationStatus: '알림중' | '알림 없음';
  schedulers: {
    id: number;
    jobName: string;
    jobGroup: string;
    cronExpression: string;
    jobType: string;
    jobData: any;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

const UserSubscriptionList = () => {
  const {user} = useAuth();
  const userId = user?.userId;

  const [GPTsDetail, setGPTsDetail] = useState<GPTsWithQuartz[]>([]);
  const [subscriptionVersion, setSubscriptionVersion] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAI, setSelectedAI] = useState<GPTsWithQuartz | null>(null);
  const [initialTime, setInitialTime] = useState<string | null>(null);
  const [initialDays, setInitialDays] = useState<string[]>([]);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const subscriptionList = await userAISubscription(userId);
          console.log('UserAISubscription: ', subscriptionList);
          const enrichedList: GPTsWithQuartz[] = await Promise.all(
            subscriptionList.map(async (item: any) => {
              const aiSubscriptionId = item.id;
              const aiData: GPTsParams = item.customAIRespDto;

              try {
                const schedulerList = await userAISubscriptionScheduler(
                  userId,
                  aiSubscriptionId,
                );

                // subscriptionId가 일치하는 스케줄만 필터링
                const filteredSchedulers = schedulerList.filter(
                  (s: any) =>
                    s.jobData?.subscriptionId?.toString() ===
                    aiSubscriptionId.toString(),
                );

                // 알림 여부는 필터링된 스케줄 기준으로 판단
                const notificationStatus =
                  filteredSchedulers.length > 0 &&
                  filteredSchedulers.some(
                    (s: {cronExpression: any}) => s.cronExpression,
                  )
                    ? '알림중'
                    : '알림 없음';

                return {
                  ...aiData,
                  aiSubscriptionId,
                  notificationStatus,
                  schedulers: filteredSchedulers, // 필터링된 값만 저장
                };
              } catch (err) {
                return {
                  ...aiData,
                  aiSubscriptionId,
                  notificationStatus: '알림 없음',
                };
              }
            }),
          );

          setGPTsDetail(enrichedList);
        } catch (error) {
          console.error('AI 구독 목록 로딩 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId, subscriptionVersion]);

  const handleCancelSubscription = async (aiSubscriptionId: string) => {
    Alert.alert('구독 해지', '정말로 구독을 해지하시겠습니까?', [
      {text: '아니오', style: 'cancel'},
      {
        text: '네',
        onPress: async () => {
          try {
            await AIUnSubcription(aiSubscriptionId);
            Alert.alert('완료', '구독이 해지되었습니다.');
            setSubscriptionVersion(prev => prev + 1);
          } catch (error) {
            Alert.alert('오류', '구독 해지에 실패했습니다.');
            console.error(error);
          }
        },
      },
    ]);
  };

  const parseCronToTimeAndDays = (cronExpression: string) => {
    const parts = cronExpression.split(' ');
    const hour = parts[2];
    const minute = parts[1];
    const dayOfWeek = parts[5]; // 0~6

    let days: string[] = [];
    if (dayOfWeek !== '?' && dayOfWeek !== '*') {
      const dayMap = ['월', '화', '수', '목', '금', '토', '일'];
      dayOfWeek.split(',').forEach(d => {
        const index = parseInt(d);
        if (!isNaN(index)) days.push(dayMap[index]);
      });
    } else {
      days = ['월', '화', '수', '목', '금'];
    }

    return {
      time: `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`,
      days,
    };
  };

  const handleTimerPress = (ai: GPTsWithQuartz) => {
    setSelectedAI(ai);

    if (
      ai.notificationStatus === '알림중' &&
      ai.schedulers?.[0]?.cronExpression
    ) {
      const {time, days} = parseCronToTimeAndDays(
        ai.schedulers[0].cronExpression,
      );
      setInitialTime(time);
      setInitialDays(days);
    }

    setIsModalVisible(true);
  };

  const handleConfirmTimer = (time: string, days: string[]) => {
    if (!userId) {
      Alert.alert('오류', '유저 정보가 없습니다.');
      return;
    }
    Alert.alert('저장하시겠습니까?', '', [
      {text: '아니요'},
      {
        text: '네',
        onPress: async () => {
          // try {
          //   await qurtzSchedule({
          //     name,
          //     userId,
          //   });
          //   Alert.alert('완료', '선호 AI가 저장되었습니다.');
          //   navigation.navigate('GPTsList');
          // } catch (error) {
          //   console.error('Assistant 생성 오류:', error);
          //   Alert.alert('오류', '저장 중 문제가 발생했습니다.');
          // }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: GPTsWithQuartz}) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.cell}
        onPress={() => navigation.navigate('GPTsDetail', {item, modify: true})}>
        <Text style={styles.cellText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cell}
        onPress={() => handleCancelSubscription(item.aiSubscriptionId)}>
        <Text style={[styles.cellText, styles.link]}>구독중</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cell}
        onPress={() => handleTimerPress(item)}>
        <Text style={styles.cellText}>{item.notificationStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>YOUF</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.cell, styles.headerText]}>구독 여부</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.cell, styles.headerText]}>알림 여부</Text>
      </View>

      <FlatList
        data={GPTsDetail}
        renderItem={renderItem}
        keyExtractor={item => item.aiSubscriptionId.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>구독 중인 AI가 없습니다 🐣</Text>
        }
      />

      {selectedAI && (
        <Scheduler
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={handleConfirmTimer}
          initialTime={initialTime || undefined}
          initialDays={initialDays}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
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
  headerRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
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
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: 15,
    color: '#111111',
    textAlign: 'center',
  },
  link: {
    fontWeight: '600',
    color: '#000000',
    textDecorationLine: 'underline',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#aaa',
    marginHorizontal: 4,
  },
});

export default UserSubscriptionList;
