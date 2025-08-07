import axios from 'axios';

const uri = 'http://3.39.234.47:8081';

const API = axios.create({
  baseURL: uri,
  withCredentials: true,
});

export function applyToken(jwt: string) {
  API.defaults.headers.Authorization = `${jwt}`;
}

export function clearToken() {
  delete API.defaults.headers.common.Authorization;
}

export default API;
