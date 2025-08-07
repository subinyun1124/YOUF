import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';

export interface GPTsParams {
  id: string; // Ai
  name: string; // Ai
  createByUsrId: Number;
  createByUsrName: string;
  createdTime: string;
  description: string;
  basePrompt: string;
  customPrompt: string;
  imageUrl: string;
  active: string;
  hidden: string;
  approved: string;
  updateByUsrId: string;
  updateByUsrName: string;
  updatedTime: Date;
}

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Preference: undefined;
  ChatRoom: { subscriptionId: string, YOUFName: string, YOUFImage: string };
  UserSubscription: undefined;
  GPTsList: undefined;
  GPTsDetail: { item: GPTsParams, modify: boolean };
  CreateAssistant: undefined;
};

// Main 탭
export type MainTabParamList = {
  YOUF: undefined;
  CHAT: undefined;
  CREATE: undefined;
  USER: undefined;
};

export type MainTabNavigationScreenParams = NavigatorScreenParams<MainTabParamList>;
export type MainTabNavigationProp = CompositeNavigationProp<RootStackNavigationProp, BottomTabNavigationProp<MainTabParamList>>;
export type MainTabRouteProp = RouteProp<RootStackParamList, 'Main'>;

export type NavigationProps = StackNavigationProp<RootStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
