import { describe, expect, it } from 'vitest'

import { toChampion } from '@/features/champion/data/mappers/champion.mapper'
import {
  championEnvelopeDtoSchema,
  championImageDtoSchema,
} from '@/features/champion/data/schemas/champion-dto.schema'

describe('champion DTO schema', () => {
  it('keeps unrecognized server fields in loose objects', () => {
    const image = championImageDtoSchema.parse({
      full: 'Ahri.png',
      sprite: 'champion0.png',
    })

    expect(image.sprite).toBe('champion0.png')
  })

  it('validates JSON and maps it into a domain entity', () => {
    const envelope = championEnvelopeDtoSchema.parse({
      data: {
        Ahri: {
          id: 'Ahri',
          key: '103',
          name: '아리',
          title: '구미호',
          lore: '룬테라의 마법과 연결된 아리입니다.',
          tags: ['Mage', 'Assassin'],
          image: { full: 'Ahri.png' },
          passive: {
            name: '정기 흡수',
            description: '스킬 적중 시 체력을 회복합니다.',
            image: { full: 'Ahri_Passive.png' },
          },
          spells: [
            {
              name: '현혹의 구슬',
              description: '구슬을 던집니다.',
              tooltip: '마법 피해를 입힙니다.',
              image: { full: 'AhriQ.png' },
            },
          ],
          skins: [
            { id: '103000', num: 0, name: 'default', chromas: false },
            { id: '103008', num: 8, name: '크로마', chromas: true, parentSkin: 103008 },
          ],
        },
      },
    })

    const champion = toChampion(envelope.data.Ahri!)
    expect(champion.name).toBe('아리')
    expect(champion.spells[0]?.name).toBe('현혹의 구슬')
    expect(champion.skins[0]?.number).toBe(0)
    expect(champion.skins[1]?.parentSkin).toBe('103008')
  })

  it('rejects invalid server field types', () => {
    expect(() =>
      championEnvelopeDtoSchema.parse({
        data: { Ahri: { id: 103, name: null, image: { full: false } } },
      }),
    ).toThrow(/Invalid input/)
  })
})
