<<<<<<< HEAD
import React from 'react';
import RootStack from './screen/RootStack';

const App = () => {
  return <RootStack />;
=======
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Login';
import MainScreen from './screen/RootStack';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: false}} >
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
>>>>>>> cd3ee9b74a7876b405f0ce3ddd06b2b72c561dab
};

export default App;

