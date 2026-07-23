'use client';

import { create } from 'zustand';

import { appConfig } from '@/core/config/app-config';

interface ChampionSearchState {
  query: string;
  appliedQuery: string;
  setQuery(value: string): void;
  clear(): void;
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

export const useChampionSearchStore = create<ChampionSearchState>((set) => ({
  query: '',
  appliedQuery: '',
  setQuery(value) {
    clearTimeout(debounceTimer);
    set({ query: value });
    debounceTimer = setTimeout(
      () => set({ appliedQuery: value.trim() }),
      appConfig.searchDebounceMs,
    );
  },
  clear() {
    clearTimeout(debounceTimer);
    set({ query: '', appliedQuery: '' });
  },
}));
