import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cache } from 'react';

import { createQueryClient } from '@/app/query/query-client';
import ko from '@/core/i18n/locales/ko.json';
import { ChampionDetailPage } from '@/features/champion/presentation/pages/ChampionDetailPage';
import { championDetailQueryOptions } from '@/features/champion/presentation/queries/champion.queries';

interface ChampionRouteProps {
  params: Promise<{ championId: string }>;
}

export const revalidate = 3600;

const loadChampion = cache(async (championId: string) => {
  const queryClient = createQueryClient();
  return queryClient.fetchQuery(championDetailQueryOptions(championId));
});

export async function generateMetadata({ params }: ChampionRouteProps): Promise<Metadata> {
  const { championId } = await params;
  try {
    const { champion } = await loadChampion(championId);
    return {
      title: champion.name,
      description: champion.title || champion.lore,
    };
  } catch {
    return {
      title: ko.champion.detailTitle,
    };
  }
}

export default async function ChampionDetailRoute({ params }: ChampionRouteProps) {
  const { championId } = await params;
  const queryClient = createQueryClient();
  const options = championDetailQueryOptions(championId);

  try {
    const data = await loadChampion(championId);
    queryClient.setQueryData(options.queryKey, data);
  } catch {
    // The client query displays the retryable error state.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChampionDetailPage championId={championId} />
    </HydrationBoundary>
  );
}
