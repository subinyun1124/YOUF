import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '../api/types';

const key = 'auth';

export const authStorage = {

  async get(): Promise<AuthState | null> {
    const raw = await AsyncStorage.getItem(key);

    if (!raw) return null;

    return JSON.parse(raw);
  },

  async set(auth: AuthState) {
    await AsyncStorage.setItem(key, JSON.stringify(auth));
  },

  async clear() {
    await AsyncStorage.removeItem(key);
  }
}