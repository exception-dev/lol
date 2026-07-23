import type { Champion } from '@/features/champion/domain/entities/champion';

export interface ChampionRepository {
  getChampionList(patchVersion: string, locale: string): Promise<readonly Champion[]>;
  getChampion(championId: string, patchVersion: string, locale: string): Promise<Champion>;
}
