import type { KeyValueStorage } from '@/core/storage/key-value-storage';

const patchVersionStorageKey = 'latest_lol_patch_version';

export interface PatchVersionLocalDataSource {
  readVersion(): string | null;
  writeVersion(version: string): void;
}

export class BrowserPatchVersionLocalDataSource implements PatchVersionLocalDataSource {
  constructor(private readonly storage: KeyValueStorage) {}

  readVersion(): string | null {
    return this.storage.get(patchVersionStorageKey);
  }

  writeVersion(version: string): void {
    this.storage.set(patchVersionStorageKey, version);
  }
}
