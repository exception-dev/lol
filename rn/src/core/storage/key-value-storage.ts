import * as SecureStore from 'expo-secure-store';

export interface KeyValueStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class ExpoSecureKeyValueStorage implements KeyValueStorage {
  get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  set(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }
}
