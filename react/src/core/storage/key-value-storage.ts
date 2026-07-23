export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export class BrowserKeyValueStorage implements KeyValueStorage {
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  }
}
