import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
