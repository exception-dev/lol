import { useChampionSearchStore } from '@/features/champion/presentation/stores/champion-search.store';

describe('champion search store', () => {
  beforeEach(() => useChampionSearchStore.setState({ query: '' }));

  it('updates and clears the query', () => {
    useChampionSearchStore.getState().setQuery('아리');
    expect(useChampionSearchStore.getState().query).toBe('아리');

    useChampionSearchStore.getState().clear();
    expect(useChampionSearchStore.getState().query).toBe('');
  });
});
