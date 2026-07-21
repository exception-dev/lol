import { queryOptions, useQuery } from '@tanstack/vue-query'

import { championDependencies } from '@/app/di/container'
import { queryClient } from '@/app/query/query-client'

export const patchVersionQueryOptions = queryOptions({
  queryKey: ['patch-version'] as const,
  queryFn: () => championDependencies.initializePatchVersion.execute(),
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})

export function usePatchVersionQuery() {
  return useQuery(patchVersionQueryOptions)
}

export function ensurePatchVersion(): Promise<string> {
  return queryClient.ensureQueryData(patchVersionQueryOptions)
}
