import React from 'react';
<<<<<<< HEAD
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
=======
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Button, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native';
import {RootStackNavigationProp} from './RootStack';
import { ScrollView } from 'react-native-gesture-handler';

type MainTabParamList = {
	Assistant: undefined,
	Create: undefined,
};

export type MainTabNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  BottomTabNavigationProp<MainTabParamList>
>;

export type MainTabNavigationScreenParams = NavigatorScreenParams<MainTabParamList>;

const Tab = createBottomTabNavigator<MainTabParamList>();

function HomeScreen() {
  // const navigation = useNavigation<MainTabNavigationProp>();
  // const onPress = () => {
  //   navigation.navigate('Detail', {id: 1});
  // };
  // return (
  //   <View>
  //     <Text>Home</Text>
  //     <Button title="Open Detail" onPress={onPress} />
  //   </View>
  // );
    const Assistants = [
      {
        id: '1',
        uri: "https://cdn.pixabay.com/photo/2024/08/26/23/38/maranhao-sheets-9000410_1280.jpg"
      },
      {
        id: '2',
        uri: "https://cdn.pixabay.com/photo/2025/02/03/21/01/forest-9380292_1280.jpg"
      },
      {
        id: '3',
        uri: "https://cdn.pixabay.com/photo/2024/12/31/10/52/salamanca-9302112_1280.jpg"
      },
      {
        id: '4',
        uri: "https://cdn.pixabay.com/photo/2023/04/24/03/16/camping-7947055_1280.jpg"
      },
      {
        id: '5',
        uri: "https://cdn.pixabay.com/photo/2025/01/23/17/23/cat-9355075_1280.jpg"
      },
      {
        id: '6',
        uri: "https://cdn.pixabay.com/photo/2022/06/23/04/28/child-7279091_1280.jpg"
      },
      {
        id: '7',
        uri: "https://cdn.pixabay.com/photo/2025/02/07/08/46/cat-9389500_1280.jpg"
      },
      {
        id: '8',
        uri: "https://cdn.pixabay.com/photo/2023/06/05/18/59/dachshund-8043109_1280.jpg"
      },
      {
        id: '9',
        uri: "https://cdn.pixabay.com/photo/2023/02/05/17/38/dog-7770069_1280.jpg"
      },
      {
        id: '10',
        uri: "https://cdn.pixabay.com/photo/2024/12/12/09/50/animal-9262352_1280.jpg"
      },
    ];

    const onPress = () => {
      //
    };

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style = {styles.container}>
        <Pressable style = {styles.AssistantContainer} onPress = {onPress} >
          {Assistants.map(({id, uri}) => <ProfileHead key={id} uri={uri} /> )}
        </Pressable>
      </ScrollView>
    );
  }

  const ProfileHead = ({ uri }: { uri: string }) => {
    return (
      <View style={styles.AssistantProfile}>
        <Image
          source={{
            uri,
          }}
          style = {styles.AssistantProfileImage}
        />
    </View>
    );
  };

  const styles = StyleSheet.create({
    AssistantContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    AssistantProfile: {
      width: 55,
      height: 55,
      borderRadius: 55 / 2,
      borderWidth: 3,
      borderColor: 'black',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    AssistantProfileImage: {
      width: '95%',
      height: '95%',
      borderRadius: 55 / 2,
    },
    container: {
      paddingTop: 10,
    },
  });



function AccountScreen() {
  return (
    <View>
      <Text>Account</Text>
    </View>
  );
>>>>>>> cd3ee9b74a7876b405f0ce3ddd06b2b72c561dab
}

function MainTab() {
  return (
<<<<<<< HEAD
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
=======
    <Tab.Navigator>
      <Tab.Screen name="Assistant" component={HomeScreen} />
      <Tab.Screen name="Create" component={AccountScreen} />
>>>>>>> cd3ee9b74a7876b405f0ce3ddd06b2b72c561dab
    </Tab.Navigator>
  );
}

export default MainTab;
