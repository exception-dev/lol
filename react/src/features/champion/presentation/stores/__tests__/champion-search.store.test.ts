import { afterEach, describe, expect, it, vi } from 'vitest';

import { appConfig } from '@/core/config/app-config';
import { useChampionSearchStore } from '@/features/champion/presentation/stores/champion-search.store';

describe('useChampionSearchStore', () => {
  afterEach(() => {
    vi.useRealTimers();
    useChampionSearchStore.getState().clear();
  });

  it('debounces the applied query', () => {
    vi.useFakeTimers();

    useChampionSearchStore.getState().setQuery('아리');
    expect(useChampionSearchStore.getState()).toMatchObject({
      query: '아리',
      appliedQuery: '',
    });

    vi.advanceTimersByTime(appConfig.searchDebounceMs);
    expect(useChampionSearchStore.getState().appliedQuery).toBe('아리');
  });

  it('clears both values before navigating to detail', () => {
    useChampionSearchStore.setState({ query: '아리', appliedQuery: '아리' });
    useChampionSearchStore.getState().clear();

    expect(useChampionSearchStore.getState()).toMatchObject({
      query: '',
      appliedQuery: '',
    });
  });
});
