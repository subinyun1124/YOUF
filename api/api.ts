import axios from 'axios';
import { Platform } from 'react-native';
import { authStorage } from '../auth/authStorage';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081'
    : 'http://localhost:8081';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

/**
 * 요청 Interceptor
 */
api.interceptors.request.use(
  async (config) => {
    const auth = await authStorage.get();
    if (auth?.tokens?.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
    }

    console.log(
      'API REQUEST',
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 Interceptor
 */
api.interceptors.response.use(
  (response) => {
    console.log(
      'API RESPONSE',
      response.config.url,
      response.data
    );

    return response;
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status
      console.log(
        'API ERROR',
        status,
        error.response.data
      );

      /**
       * 인증 만료 처리
       */
      if (status === 401) {
        await authStorage.clear();

        // 필요하면 navigation reset
        // navigationRef.navigate('Login')

      }

    } else {
      console.log('네트워크 오류', error.message);
    }

    return Promise.reject(error);
  }
)