'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { championSplashUrl } from '@/core/config/app-config';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';
import { ErrorState } from '@/features/champion/presentation/components/ErrorState';
import { LoadingState } from '@/features/champion/presentation/components/LoadingState';
import { SearchBar } from '@/features/champion/presentation/components/SearchBar';
import { championListQueryOptions } from '@/features/champion/presentation/queries/champion.queries';
import { useChampionSearchStore } from '@/features/champion/presentation/stores/champion-search.store';

import styles from './ChampionListPage.module.css';

export function ChampionListPage() {
  const { t } = useTranslation();
  const championQuery = useQuery(championListQueryOptions());
  const query = useChampionSearchStore((state) => state.query);
  const appliedQuery = useChampionSearchStore((state) => state.appliedQuery);
  const setQuery = useChampionSearchStore((state) => state.setQuery);
  const clearQuery = useChampionSearchStore((state) => state.clear);
  const normalizedQuery = appliedQuery.toLocaleLowerCase('ko');
  const searching = query.trim().length > 0;

  const champions = useMemo(() => {
    const allChampions = championQuery.data?.champions ?? [];
    if (!normalizedQuery) return allChampions;
    return allChampions.filter((champion) =>
      champion.name.toLocaleLowerCase('ko').includes(normalizedQuery),
    );
  }, [championQuery.data?.champions, normalizedQuery]);

  return (
    <section className={styles.page}>
      <header className={styles.searchHeader}>
        <SearchBar value={query} onChange={setQuery} onClear={clearQuery} />
      </header>

      {championQuery.isPending ? (
        <LoadingState />
      ) : championQuery.isError ? (
        <ErrorState error={championQuery.error} onRetry={() => void championQuery.refetch()} />
      ) : champions.length === 0 ? (
        <div className={styles.empty}>
          {t(searching ? 'champion.emptySearch' : 'champion.emptyList')}
        </div>
      ) : searching ? (
        <div className={styles.searchResults}>
          {champions.map((champion) => (
            <Link
              key={champion.id}
              href={`/champions/${champion.id}`}
              className={styles.searchResult}
            >
              <div className={styles.searchImage}>
                <ChampionImage
                  src={championSplashUrl(champion.id)}
                  alt={champion.name}
                  sizes="118px"
                  fit="contain"
                />
              </div>
              <span>
                <strong>{champion.name}</strong>
                {champion.title && <small>{champion.title}</small>}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {champions.map((champion) => (
            <Link key={champion.id} href={`/champions/${champion.id}`} className={styles.card}>
              <div className={styles.cardImage}>
                <ChampionImage
                  src={championSplashUrl(champion.id)}
                  alt={champion.name}
                  sizes="(max-width: 600px) 50vw, 284px"
                  fit="contain"
                />
              </div>
              <span>{champion.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
