import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { championDependencies } from '@/bootstrap/di/container';
import { resolveAppLocale, toDataDragonLocale } from '@/core/i18n/locale';
import { ensurePatchVersion } from '@/features/champion/presentation/queries/patch-version.query';

function useCurrentAppLocale() {
  const { i18n } = useTranslation();
  return resolveAppLocale(i18n.resolvedLanguage?.split('-')[0]);
}

export function useChampionListQuery() {
  const locale = useCurrentAppLocale();

  return useQuery({
    queryKey: ['champions', locale] as const,
    queryFn: async () => {
      const patchVersion = await ensurePatchVersion();
      const champions = await championDependencies.getChampionList.execute(
        patchVersion,
        toDataDragonLocale(locale),
      );
      return { champions, patchVersion };
    },
  });
}

export function useChampionDetailQuery(championId: string) {
  const locale = useCurrentAppLocale();

  return useQuery({
    queryKey: ['champion', locale, championId] as const,
    enabled: championId.trim().length > 0,
    queryFn: async () => {
      const patchVersion = await ensurePatchVersion();
      const champion = await championDependencies.getChampion.execute(
        championId,
        patchVersion,
        toDataDragonLocale(locale),
      );
      return { champion, patchVersion };
    },
  });
}
