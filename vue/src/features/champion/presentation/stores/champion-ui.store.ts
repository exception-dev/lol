import { defineStore } from 'pinia'
import { onScopeDispose, ref } from 'vue'

import { appConfig } from '@/core/config/app-config'

export const useChampionUiStore = defineStore('champion-ui', () => {
  const query = ref('')
  const appliedQuery = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  function updateQuery(value: string): void {
    query.value = value
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      appliedQuery.value = value.trim()
    }, appConfig.searchDebounceMs)
  }

  function clearSearch(): void {
    clearTimeout(debounceTimer)
    query.value = ''
    appliedQuery.value = ''
  }

  onScopeDispose(() => clearTimeout(debounceTimer))

  return { query, appliedQuery, updateQuery, clearSearch }
})
