import axios from 'axios';
import { Platform } from 'react-native';

const url =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081'
    : 'http://localhost:8081';
// const url = 'http://3.36.247.178:8081';

const API = axios.create({
  baseURL: url,
  withCredentials: true,
});

export function applyToken(jwt: string) {
  API.defaults.headers.Authorization = `${jwt}`;
}

export function clearToken() {
  delete API.defaults.headers.common.Authorization;
}

export default API;
