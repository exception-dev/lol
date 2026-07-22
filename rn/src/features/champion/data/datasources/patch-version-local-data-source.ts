import type { KeyValueStorage } from '@/core/storage/key-value-storage';

const patchVersionStorageKey = 'lol.patch-version';

export class SecurePatchVersionLocalDataSource {
  constructor(private readonly storage: KeyValueStorage) {}

  get(): Promise<string | null> {
    return this.storage.get(patchVersionStorageKey);
  }

  set(version: string): Promise<void> {
    return this.storage.set(patchVersionStorageKey, version);
  }
}
