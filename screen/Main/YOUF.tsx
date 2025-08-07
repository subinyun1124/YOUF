import React from 'react';
import {View, StyleSheet} from 'react-native';
import StoryList from './StoryList';
import MainChat from './MainChat';

const YOUF = () => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.storyContainer}>
        <StoryList />
      </View> */}
      <View style={styles.chatContainer}>
        <MainChat />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  storyContainer: {
    paddingTop: 5,
    height: 100,
  },
  chatContainer: {
    flex: 1,
  },
});

export default YOUF;
