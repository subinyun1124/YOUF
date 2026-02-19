import React, {useState} from 'react';
import {Platform, SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './Login';
import MainScreen from './MainTab';
import PreferenceScreen from './Assistant/PreferencesScreen';
import ChatScreen from './Chat/ChatRoom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createStackNavigator} from '@react-navigation/stack';
import {UserContextProvider} from '../contexts/UserContext';
import UserSubscriptionList from './User/UserSubscriptionList';
import GPTsListScreen from './User/GPTsListScreen';
import GPTsDetail from './User/GPTsDetail';
import CreateAssistantScreen from './Assistant/CreateAssistant';

const queryClient = new QueryClient();

const Stack = createStackNavigator();
const RootStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
          }}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Login'}>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Preference"
                component={PreferenceScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CreateAssistant"
                component={CreateAssistantScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ChatRoom"
                component={ChatScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="UserSubscription"
                component={UserSubscriptionList}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GPTsList"
                component={GPTsListScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GPTsDetail"
                component={GPTsDetail}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </QueryClientProvider>
    </UserContextProvider>
  );
};

export default RootStack;
