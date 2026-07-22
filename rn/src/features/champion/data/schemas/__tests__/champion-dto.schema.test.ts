import { toChampion } from '@/features/champion/data/mappers/champion.mapper';
import { championEnvelopeDtoSchema } from '@/features/champion/data/schemas/champion-dto.schema';

describe('champion DTO schema', () => {
  it('validates and maps a Data Dragon champion', () => {
    const envelope = championEnvelopeDtoSchema.parse({
      data: {
        Ahri: {
          id: 'Ahri',
          key: '103',
          name: '아리',
          title: '구미호',
          lore: '룬테라의 마법과 연결된 아리입니다.',
          tags: ['Mage', 'Assassin'],
          image: { full: 'Ahri.png', sprite: 'champion0.png' },
          passive: null,
          spells: [],
          skins: [{ id: '103008', num: 8, name: '스킨', parentSkin: 103008 }],
        },
      },
    });

    expect(envelope.data.Ahri?.image.sprite).toBe('champion0.png');
    const champion = toChampion(envelope.data.Ahri!);
    expect(champion.name).toBe('아리');
    expect(champion.skins[0]?.parentSkin).toBe('103008');
  });

  it('rejects invalid required field types', () => {
    expect(() =>
      championEnvelopeDtoSchema.parse({
        data: { Ahri: { id: 103, name: null, image: { full: false } } },
      }),
    ).toThrow();
  });
});
