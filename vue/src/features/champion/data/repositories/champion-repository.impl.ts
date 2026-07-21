import axios from 'axios'
import { ZodError } from 'zod'

import { AppError, ChampionNotFoundError, DataError, NetworkError } from '@/core/errors/app-error'
import type { ChampionRemoteDataSource } from '@/features/champion/data/datasources/champion-remote-data-source'
import { toChampion } from '@/features/champion/data/mappers/champion.mapper'
import type { Champion } from '@/features/champion/domain/entities/champion'
import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository'

export class DataDragonChampionRepository implements ChampionRepository {
  constructor(private readonly remoteDataSource: ChampionRemoteDataSource) {}

  async getChampionList(patchVersion: string, locale: string): Promise<readonly Champion[]> {
    try {
      const envelope = await this.remoteDataSource.fetchChampionList(patchVersion, locale)
      return Object.values(envelope.data)
        .map(toChampion)
        .sort((first, second) => first.name.localeCompare(second.name, 'ko'))
    } catch (error) {
      throw mapDataError(error)
    }
  }

  async getChampion(championId: string, patchVersion: string, locale: string): Promise<Champion> {
    try {
      const envelope = await this.remoteDataSource.fetchChampion(championId, patchVersion, locale)
      const dto = envelope.data[championId] ?? Object.values(envelope.data)[0]
      if (!dto) {
        throw new ChampionNotFoundError(championId)
      }
      return toChampion(dto)
    } catch (error) {
      throw mapDataError(error)
    }
  }
}

function mapDataError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  if (axios.isAxiosError(error)) {
    return new NetworkError(error)
  }
  if (error instanceof ZodError) {
    return new DataError(error)
  }
  return new DataError(error)
}
