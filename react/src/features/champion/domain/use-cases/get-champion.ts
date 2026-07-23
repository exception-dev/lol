import type { Champion } from '@/features/champion/domain/entities/champion';
import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository';

export class GetChampion {
  constructor(private readonly repository: ChampionRepository) {}

  execute(championId: string, patchVersion: string, locale: string): Promise<Champion> {
    return this.repository.getChampion(championId, patchVersion, locale);
  }
}
