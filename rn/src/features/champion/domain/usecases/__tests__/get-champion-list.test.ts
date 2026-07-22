import type { ChampionRepository } from '@/features/champion/domain/repositories/champion-repository';
import { GetChampionList } from '@/features/champion/domain/usecases/get-champion-list';

describe('GetChampionList', () => {
  it('delegates patch and locale to the repository', async () => {
    const getList = jest.fn().mockResolvedValue([]);
    const repository: ChampionRepository = {
      getList,
      getById: jest.fn(),
    };

    await new GetChampionList(repository).execute('16.14.1', 'ko_KR');

    expect(getList).toHaveBeenCalledWith('16.14.1', 'ko_KR');
  });
});
