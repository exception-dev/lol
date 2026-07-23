import type { Champion } from '@/features/champion/domain/entities/champion';
import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository';

export class GetChampionList {
  constructor(private readonly repository: ChampionRepository) {}

  execute(patchVersion: string, locale: string): Promise<readonly Champion[]> {
    return this.repository.getChampionList(patchVersion, locale);
  }
}
