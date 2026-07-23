import { describe, expect, it } from 'vitest';

import { toChampion } from '@/features/champion/data/mappers/champion.mapper';
import { championDtoSchema } from '@/features/champion/data/schemas/champion-dto.schema';

describe('championDtoSchema', () => {
  it('parses a Data Dragon DTO and preserves unknown public fields', () => {
    const dto = championDtoSchema.parse({
      id: 'Ahri',
      name: '아리',
      image: { full: 'Ahri.png' },
      extraField: 'allowed',
    });

    expect(dto.extraField).toBe('allowed');
    expect(toChampion(dto)).toMatchObject({
      id: 'Ahri',
      name: '아리',
      lore: '',
      spells: [],
      skins: [],
    });
  });

  it('rejects an invalid required field', () => {
    expect(() =>
      championDtoSchema.parse({
        id: 1,
        name: '아리',
        image: { full: 'Ahri.png' },
      }),
    ).toThrow();
  });
});
