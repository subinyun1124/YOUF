import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './type';
import CHAT from './Chat/ChatList';
import YOUF from './Main/YOUF';
import CREATE from './Assistant/AssistantSubcriptionScreen';
import USER from './User/UserList';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabBarIcon({
  routeName,
  focused,
  color,
  size,
}: {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}) {
  let iconName: string = '';

  switch (routeName) {
    case 'YOUF':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'CHAT':
      iconName = focused ? 'chatbubble' : 'chatbubble-outline';
      break;
    case 'CREATE':
      iconName = focused ? 'person' : 'person-outline';
      break;
    case 'USER':
      iconName = focused ? 'settings-sharp' : 'settings-outline';
      break;
    default:
      iconName = 'ellipse';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="YOUF"
        component={YOUF}
        options={{
          headerShown: true,
          headerTitle: 'YOUF',
        }}
      />
      <Tab.Screen
        name="CHAT"
        component={CHAT}
        options={{
          headerShown: true,
          headerTitle: '채팅방 목록',
        }}
      />
      <Tab.Screen
        name="CREATE"
        component={CREATE}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="USER"
        component={USER}
        options={{
          headerShown: true,
          headerTitle: '사용자 설정',
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTab;
