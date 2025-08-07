import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import { userAISubscription } from '../../api/auth';
import { useUserState } from '../../contexts/UserContext';

const BASE_URL = 'https://cdn.pixabay.com/photo/2025/03/07/13/12/flower-9453063_1280.jpg';

const StoryList = () => {
   const [user] = useUserState();
   const userId = user?.userId?.toString();
   const userToken = user?.jwtToken?.toString() ?? null;
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const getSubscriptions = async () => {
      setLoading(true);
      const data = await userAISubscription(userId, userToken);
      console.log('story : ', data );
      setSubscriptions(data || []);
      setLoading(false);
    };

    getSubscriptions();
  }, [userId, userToken]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.storyContainer}>
      {loading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : subscriptions.length > 0 ? (
  subscriptions.map(({ customAIRespDto }, index) => (
    <ProfileHead key={index} uri={customAIRespDto.imageUrl} />
  ))
) : (
  <Text style={styles.emptyText}>구독된 AI가 없습니다.</Text>
)}

      </View>
    </ScrollView>
  );
};

const ProfileHead = ({ uri }) => {
  return (
    <View style={styles.storyProfile}>
      <Image source={{ uri }} style={styles.storyProfileImage} />
      {/* <Text style={styles.storyName}>{name}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  storyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  storyProfile: {
    width: 80,
    alignItems: 'center',
    marginRight: 10,
  },
  storyProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'black',
  },
  storyName: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    padding: 20,
  },
});

export default StoryList;
