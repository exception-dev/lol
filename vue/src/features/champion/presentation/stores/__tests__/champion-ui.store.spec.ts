import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { appConfig } from '@/core/config/app-config'
import { useChampionUiStore } from '@/features/champion/presentation/stores/champion-ui.store'

describe('champion UI store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('applies a search query after the debounce duration', () => {
    const store = useChampionUiStore()

    store.updateQuery('아')
    expect(store.query).toBe('아')
    expect(store.appliedQuery).toBe('')

    vi.advanceTimersByTime(appConfig.searchDebounceMs)
    expect(store.appliedQuery).toBe('아')
  })
})
