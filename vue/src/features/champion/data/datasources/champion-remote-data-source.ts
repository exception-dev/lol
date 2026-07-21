import type { AxiosInstance } from 'axios'

import {
  championEnvelopeDtoSchema,
  type ChampionEnvelopeDto,
} from '@/features/champion/data/schemas/champion-dto.schema'

export interface ChampionRemoteDataSource {
  fetchChampionList(patchVersion: string, locale: string): Promise<ChampionEnvelopeDto>
  fetchChampion(
    championId: string,
    patchVersion: string,
    locale: string,
  ): Promise<ChampionEnvelopeDto>
}

export class DataDragonChampionRemoteDataSource implements ChampionRemoteDataSource {
  constructor(private readonly client: AxiosInstance) {}

  async fetchChampionList(patchVersion: string, locale: string): Promise<ChampionEnvelopeDto> {
    const response = await this.client.get<unknown>(
      `/cdn/${patchVersion}/data/${locale}/champion.json`,
    )
    return championEnvelopeDtoSchema.parse(response.data)
  }

  async fetchChampion(
    championId: string,
    patchVersion: string,
    locale: string,
  ): Promise<ChampionEnvelopeDto> {
    const response = await this.client.get<unknown>(
      `/cdn/${patchVersion}/data/${locale}/champion/${encodeURIComponent(championId)}.json`,
    )
    return championEnvelopeDtoSchema.parse(response.data)
  }
}
