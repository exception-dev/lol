import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { createQueryClient } from '@/app/query/query-client';
import ko from '@/core/i18n/locales/ko.json';
import { ChampionListPage } from '@/features/champion/presentation/pages/ChampionListPage';
import { championListQueryOptions } from '@/features/champion/presentation/queries/champion.queries';

export const metadata: Metadata = {
  title: ko.champion.listTitle,
  description: ko.app.description,
};

export const revalidate = 3600;

export default async function ChampionsRoute() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery(championListQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChampionListPage />
    </HydrationBoundary>
  );
}
