import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

import { ChampionNotFoundError, DataError, NetworkError } from '@/core/errors/app-error';
import type { DataDragonChampionRemoteDataSource } from '@/features/champion/data/datasources/champion-remote-data-source';
import { toChampion } from '@/features/champion/data/mappers/champion.mapper';
import { championEnvelopeDtoSchema } from '@/features/champion/data/schemas/champion-dto.schema';
import type { Champion } from '@/features/champion/domain/entities/champion';
import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository';

export class DataDragonChampionRepository implements ChampionRepository {
  constructor(private readonly remoteDataSource: DataDragonChampionRemoteDataSource) {}

  async getList(patchVersion: string, locale: string): Promise<readonly Champion[]> {
    try {
      const json = await this.remoteDataSource.getList(patchVersion, locale);
      const envelope = championEnvelopeDtoSchema.parse(json);
      return Object.values(envelope.data)
        .map(toChampion)
        .sort((left, right) => left.name.localeCompare(right.name, 'ko'));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async getById(championId: string, patchVersion: string, locale: string): Promise<Champion> {
    try {
      const json = await this.remoteDataSource.getById(championId, patchVersion, locale);
      const envelope = championEnvelopeDtoSchema.parse(json);
      const dto = envelope.data[championId] ?? Object.values(envelope.data)[0];
      if (!dto) throw new ChampionNotFoundError(championId);
      return toChampion(dto);
    } catch (error) {
      throw this.mapError(error, championId);
    }
  }

  private mapError(error: unknown, championId = 'unknown'): Error {
    if (error instanceof ChampionNotFoundError) return error;
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return new ChampionNotFoundError(championId, { cause: error });
      }
      return new NetworkError('Data Dragon request failed', { cause: error });
    }
    if (error instanceof ZodError) {
      return new DataError('Invalid Data Dragon response', { cause: error });
    }
    return error instanceof Error
      ? new DataError('Unable to load champion data', { cause: error })
      : new DataError('Unable to load champion data');
  }
}
