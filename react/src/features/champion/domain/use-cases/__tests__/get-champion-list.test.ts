import { describe, expect, it, vi } from 'vitest';

import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository';
import { GetChampionList } from '@/features/champion/domain/use-cases/get-champion-list';

describe('GetChampionList', () => {
  it('delegates to the repository with version and locale', async () => {
    const getChampionList = vi.fn().mockResolvedValue([]);
    const repository = {
      getChampionList,
      getChampion: vi.fn(),
    } satisfies ChampionRepository;

    await new GetChampionList(repository).execute('16.14.1', 'ko_KR');

    expect(getChampionList).toHaveBeenCalledWith('16.14.1', 'ko_KR');
  });
});
