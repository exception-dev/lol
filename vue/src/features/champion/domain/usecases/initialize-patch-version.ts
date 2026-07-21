import type { PatchVersionRepository } from '@/features/champion/domain/repositories/patch-version-repository'

export class InitializePatchVersion {
  constructor(private readonly repository: PatchVersionRepository) {}

  execute(): Promise<string> {
    return this.repository.resolveLatestVersion()
  }
}
