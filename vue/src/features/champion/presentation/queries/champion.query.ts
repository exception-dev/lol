import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useI18n } from 'vue-i18n'

import { championDependencies } from '@/app/di/container'
import { defaultAppLocale, isAppLocale, toDataDragonLocale } from '@/core/i18n/locale'

import { ensurePatchVersion } from './patch-version.query'

export function useChampionListQuery() {
  const { locale } = useI18n({ useScope: 'global' })
  const appLocale = computed(() => (isAppLocale(locale.value) ? locale.value : defaultAppLocale))

  return useQuery({
    queryKey: computed(() => ['champions', appLocale.value]),
    queryFn: async () => {
      const patchVersion = await ensurePatchVersion()
      return championDependencies.getChampionList.execute(
        patchVersion,
        toDataDragonLocale(appLocale.value),
      )
    },
  })
}

export function useChampionDetailQuery(championId: MaybeRefOrGetter<string>) {
  const { locale } = useI18n({ useScope: 'global' })
  const appLocale = computed(() => (isAppLocale(locale.value) ? locale.value : defaultAppLocale))

  return useQuery({
    queryKey: computed(() => ['champion', appLocale.value, toValue(championId)]),
    enabled: computed(() => toValue(championId).trim().length > 0),
    queryFn: async () => {
      const patchVersion = await ensurePatchVersion()
      const champion = await championDependencies.getChampion.execute(
        toValue(championId),
        patchVersion,
        toDataDragonLocale(appLocale.value),
      )
      return { champion, patchVersion }
    },
  })
}
