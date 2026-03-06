import axios from 'axios';
import { Platform } from 'react-native';
import authStorage from '../storages/authStorage';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081'
    : 'http://localhost:8081';

const api = axios.create({
  baseURL,
  withCredentials: true,
});


// 요청 인터셉터
api.interceptors.request.use(async request => {
  const auth = await authStorage.get();

  console.log('URL:', request.method?.toUpperCase(), request.url);
  console.log('데이터:', request.data);

  if (auth?.accessToken) {
    request.headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  return request;
});


// 응답 인터셉터
api.interceptors.response.use(
  response => {
    console.log('응답:', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.log('에러 응답:', error.response.data);
      console.log('에러 상태코드:', error.response.status);
    } else {
      console.log('네트워크 에러:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;