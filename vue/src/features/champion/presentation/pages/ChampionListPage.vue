<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { championSplashUrl } from '@/core/config/app-config'
import ChampionImage from '@/features/champion/presentation/components/ChampionImage.vue'
import ErrorState from '@/features/champion/presentation/components/ErrorState.vue'
import LoadingState from '@/features/champion/presentation/components/LoadingState.vue'
import { useChampionListQuery } from '@/features/champion/presentation/queries/champion.query'
import { useChampionUiStore } from '@/features/champion/presentation/stores/champion-ui.store'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const uiStore = useChampionUiStore()
const { data, error, isError, isPending, refetch } = useChampionListQuery()

const isSearching = computed(() => uiStore.query.trim().length > 0)
const filteredChampions = computed(() => {
  const champions = data.value ?? []
  const query = uiStore.appliedQuery.toLocaleLowerCase('ko')
  if (!query) return champions
  return champions.filter((champion) => champion.name.toLocaleLowerCase('ko').includes(query))
})

function onSearchInput(event: Event): void {
  uiStore.updateQuery((event.target as HTMLInputElement).value)
}

async function openChampion(championId: string): Promise<void> {
  uiStore.clearSearch()
  await router.push({ name: 'champion-detail', params: { championId } })
}
</script>

<template>
  <section class="champion-list-page">
    <header class="search-header">
      <label class="search-field">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <span class="sr-only">{{ t('champion.searchHint') }}</span>
        <input
          :value="uiStore.query"
          type="search"
          inputmode="search"
          autocomplete="off"
          :placeholder="t('champion.searchHint')"
          @input="onSearchInput"
        />
        <button
          v-if="uiStore.query"
          type="button"
          class="search-field__clear"
          :aria-label="t('champion.clearSearch')"
          @click="uiStore.clearSearch"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 7 10 10M17 7 7 17" />
          </svg>
        </button>
      </label>
    </header>

    <LoadingState v-if="isPending" />
    <ErrorState v-else-if="isError" :error="error" @retry="refetch" />

    <div v-else-if="filteredChampions.length === 0" class="empty-state">
      {{ t(isSearching ? 'champion.emptySearch' : 'champion.emptyList') }}
    </div>

    <div v-else-if="!isSearching" class="champion-grid">
      <button
        v-for="champion in filteredChampions"
        :key="champion.id"
        type="button"
        class="champion-card"
        @click="openChampion(champion.id)"
      >
        <div class="champion-card__image">
          <ChampionImage :src="championSplashUrl(champion.id)" :alt="champion.name" />
        </div>
        <span>{{ champion.name }}</span>
      </button>
    </div>

    <div v-else class="search-results">
      <button
        v-for="champion in filteredChampions"
        :key="champion.id"
        type="button"
        class="search-result"
        @click="openChampion(champion.id)"
      >
        <div class="search-result__image">
          <ChampionImage :src="championSplashUrl(champion.id)" :alt="champion.name" />
        </div>
        <span>{{ champion.name }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.champion-list-page {
  min-height: 100dvh;
  padding-bottom: calc(20px + var(--safe-bottom));
}

.search-header {
  position: sticky;
  z-index: 10;
  top: 0;
  padding: calc(12px + var(--safe-top)) calc(var(--page-padding) + var(--safe-right)) 12px
    calc(var(--page-padding) + var(--safe-left));
  background: rgb(24 24 24 / 94%);
  backdrop-filter: blur(14px);
}

.search-field {
  display: flex;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  align-items: center;
  background: var(--color-card);
}

.search-field > svg {
  width: 22px;
  margin-left: 14px;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--color-text-muted);
  stroke-linecap: round;
  stroke-width: 1.8;
}

.search-field input {
  min-width: 0;
  height: 100%;
  padding: 0 12px;
  border: 0;
  outline: 0;
  flex: 1;
  background: transparent;
  color: var(--color-text);
  font-size: 16px;
}

.search-field input::-webkit-search-cancel-button {
  display: none;
}

.search-field input::placeholder {
  color: var(--color-text-subtle);
}

.search-field__clear {
  display: grid;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  place-items: center;
  background: transparent;
  cursor: pointer;
}

.search-field__clear svg {
  width: 22px;
  fill: none;
  stroke: var(--color-text-muted);
  stroke-linecap: round;
  stroke-width: 1.8;
}

.champion-grid {
  display: grid;
  padding: 4px var(--page-padding) 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.champion-card,
.search-result {
  padding: 0;
  border: 0;
  overflow: hidden;
  background: var(--color-card);
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
}

.champion-card {
  border-radius: 10px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 20%);
}

.champion-card:active,
.search-result:active {
  background: var(--color-card-hover);
  transform: scale(0.99);
}

.champion-card__image {
  aspect-ratio: 1.55;
}

.champion-card > span {
  display: block;
  padding: 9px 10px 10px;
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-results {
  display: grid;
  padding: 0 var(--page-padding) 16px;
  gap: 8px;
}

.search-result {
  display: flex;
  min-height: 70px;
  border-radius: 10px;
  align-items: center;
}

.search-result__image {
  width: 118px;
  align-self: stretch;
  flex: 0 0 auto;
}

.search-result > span {
  padding: 0 16px;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  display: grid;
  min-height: 260px;
  padding: 24px;
  place-items: center;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
