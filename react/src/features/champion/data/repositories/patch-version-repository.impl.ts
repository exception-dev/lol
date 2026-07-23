import { appConfig } from '@/core/config/app-config';
import type { PatchVersionLocalDataSource } from '@/features/champion/data/data-sources/patch-version-local-data-source';
import type { PatchVersionRemoteDataSource } from '@/features/champion/data/data-sources/patch-version-remote-data-source';
import type { PatchVersionRepository } from '@/features/champion/domain/repositories/patch-version-repository';

export class ResilientPatchVersionRepository implements PatchVersionRepository {
  constructor(
    private readonly remoteDataSource: PatchVersionRemoteDataSource,
    private readonly localDataSource: PatchVersionLocalDataSource,
  ) {}

  async resolveLatestVersion(): Promise<string> {
    try {
      const version = await withTimeout(
        this.remoteDataSource.fetchLatestVersion(),
        appConfig.startupTimeoutMs,
      );
      try {
        this.localDataSource.writeVersion(version);
      } catch {
        // Browser storage can be unavailable; the fresh version is still valid.
      }
      return version;
    } catch {
      try {
        return this.localDataSource.readVersion() || appConfig.fallbackPatchVersion;
      } catch {
        return appConfig.fallbackPatchVersion;
      }
    }
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Patch version request timed out')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}
