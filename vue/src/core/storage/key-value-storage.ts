export interface KeyValueStorage {
  get(key: string): string | null
  set(key: string, value: string): void
}

export class BrowserKeyValueStorage implements KeyValueStorage {
  constructor(private readonly storage: Storage) {}

  get(key: string): string | null {
    return this.storage.getItem(key)
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, value)
  }
}
