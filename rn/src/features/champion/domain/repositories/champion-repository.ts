import type { Champion } from '@/features/champion/domain/entities/champion';

export interface ChampionRepository {
  getList(patchVersion: string, locale: string): Promise<readonly Champion[]>;
  getById(championId: string, patchVersion: string, locale: string): Promise<Champion>;
}
