import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStorage } from '../api/types';

const key = 'auth';

const authStorage = {

  async get(): Promise<AuthStorage | null> {
    const raw = await AsyncStorage.getItem(key);

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  set(auth: AuthStorage) {
    return AsyncStorage.setItem(key, JSON.stringify(auth));
  },

  clear() {
    return AsyncStorage.removeItem(key);
  }
};

export default authStorage;