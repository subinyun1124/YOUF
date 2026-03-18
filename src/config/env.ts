import Config from 'react-native-config';

export const BASE_URL = __DEV__
  ? Config.API_BASE_URL
  : Config.API_BASE_URL_PROD;

// 채팅방 EndPoint
export const pub_endpoint = '/app/chat.sendMessage/';
export const sub_endpoint = '/topic/public/';