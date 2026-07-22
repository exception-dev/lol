import { create } from 'zustand';

interface ChampionSearchState {
  query: string;
  setQuery(query: string): void;
  clear(): void;
}

export const useChampionSearchStore = create<ChampionSearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clear: () => set({ query: '' }),
}));
