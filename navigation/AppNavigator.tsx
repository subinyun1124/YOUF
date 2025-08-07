import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from '../screens/Main';
import SignInScreen from '../screens/SignIn';
import AuthLoadingScreen from '../screens/AuthLoading';

const Stack = createNativeStackNavigator(); // 메인화면
const AuthStack = createStackNavigator(); //
const Tab = createBottomTabNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthStackScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
