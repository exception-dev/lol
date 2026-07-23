import { queryOptions } from '@tanstack/react-query';

import { championDependencies } from '@/app/di/container';
import { defaultAppLocale, toDataDragonLocale } from '@/core/i18n/locale';

export const championQueryKeys = {
  patchVersion: ['patch-version'] as const,
  list: (locale: string) => ['champions', locale] as const,
  detail: (locale: string, championId: string) => ['champion', locale, championId] as const,
};

export const patchVersionQueryOptions = queryOptions({
  queryKey: championQueryKeys.patchVersion,
  queryFn: () => championDependencies.initializePatchVersion.execute(),
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
});

export function championListQueryOptions() {
  return queryOptions({
    queryKey: championQueryKeys.list(defaultAppLocale),
    queryFn: async () => {
      const patchVersion = await championDependencies.initializePatchVersion.execute();
      const champions = await championDependencies.getChampionList.execute(
        patchVersion,
        toDataDragonLocale(defaultAppLocale),
      );
      return { champions, patchVersion };
    },
  });
}

export function championDetailQueryOptions(championId: string) {
  return queryOptions({
    queryKey: championQueryKeys.detail(defaultAppLocale, championId),
    queryFn: async () => {
      const patchVersion = await championDependencies.initializePatchVersion.execute();
      const champion = await championDependencies.getChampion.execute(
        championId,
        patchVersion,
        toDataDragonLocale(defaultAppLocale),
      );
      return { champion, patchVersion };
    },
  });
}
