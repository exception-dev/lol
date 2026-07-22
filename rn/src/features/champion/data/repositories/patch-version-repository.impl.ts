import { appConfig } from '@/core/config/app-config';
import type { SecurePatchVersionLocalDataSource } from '@/features/champion/data/datasources/patch-version-local-data-source';
import type { DataDragonPatchVersionRemoteDataSource } from '@/features/champion/data/datasources/patch-version-remote-data-source';
import { patchVersionsDtoSchema } from '@/features/champion/data/schemas/champion-dto.schema';
import type { PatchVersionRepository } from '@/features/champion/domain/repositories/patch-version-repository';

export class ResilientPatchVersionRepository implements PatchVersionRepository {
  constructor(
    private readonly remoteDataSource: DataDragonPatchVersionRemoteDataSource,
    private readonly localDataSource: SecurePatchVersionLocalDataSource,
  ) {}

  async getLatest(): Promise<string> {
    try {
      const versions = patchVersionsDtoSchema.parse(await this.remoteDataSource.getVersions());
      const latest = versions[0]!;
      await this.localDataSource.set(latest).catch(() => undefined);
      return latest;
    } catch {
      const cachedVersion = await this.localDataSource.get().catch(() => null);
      return cachedVersion || appConfig.fallbackPatchVersion;
    }
  }
}
