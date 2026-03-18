import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

type Navigation = StackNavigationProp<RootStackParamList>;

const UserList = () => {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('UserSubscription')}
        style={styles.item}>
        <Text style={styles.text}>구독 Assistant 목록 및 설정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('GPTsList')}
        style={styles.item}>
        <Text style={styles.text}>생성 요청한 Assistant 목록</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
  },
});
