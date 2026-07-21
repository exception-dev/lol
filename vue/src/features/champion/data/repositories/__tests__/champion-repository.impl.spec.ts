import { describe, expect, it } from 'vitest'

import { ChampionNotFoundError } from '@/core/errors/app-error'
import type { ChampionRemoteDataSource } from '@/features/champion/data/datasources/champion-remote-data-source'
import { DataDragonChampionRepository } from '@/features/champion/data/repositories/champion-repository.impl'
import { championEnvelopeDtoSchema } from '@/features/champion/data/schemas/champion-dto.schema'

function champion(id: string, name: string) {
  return {
    id,
    name,
    image: { full: `${id}.png` },
  }
}

describe('DataDragonChampionRepository', () => {
  it('sorts champions by Korean name', async () => {
    const dataSource: ChampionRemoteDataSource = {
      fetchChampionList: async () =>
        championEnvelopeDtoSchema.parse({
          data: {
            Zed: champion('Zed', '제드'),
            Ahri: champion('Ahri', '아리'),
          },
        }),
      fetchChampion: async () => championEnvelopeDtoSchema.parse({ data: {} }),
    }
    const repository = new DataDragonChampionRepository(dataSource)

    const champions = await repository.getChampionList('16.14.1', 'ko_KR')

    expect(champions.map((item) => item.name)).toEqual(['아리', '제드'])
  })

  it('throws a domain error when detail data is empty', async () => {
    const dataSource: ChampionRemoteDataSource = {
      fetchChampionList: async () => championEnvelopeDtoSchema.parse({ data: {} }),
      fetchChampion: async () => championEnvelopeDtoSchema.parse({ data: {} }),
    }
    const repository = new DataDragonChampionRepository(dataSource)

    await expect(repository.getChampion('Ahri', '16.14.1', 'ko_KR')).rejects.toBeInstanceOf(
      ChampionNotFoundError,
    )
  })
})
