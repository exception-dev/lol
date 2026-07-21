<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { ChampionNotFoundError, DataError, NetworkError } from '@/core/errors/app-error'

const props = defineProps<{
  error: unknown
}>()

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n({ useScope: 'global' })

const message = computed(() => {
  if (props.error instanceof NetworkError) return t('error.network')
  if (props.error instanceof DataError) return t('error.data')
  if (props.error instanceof ChampionNotFoundError) {
    return t('error.notFound', { championId: props.error.championId })
  }
  return t('error.unknown')
})
</script>

<template>
  <section class="error-state" role="alert">
    <svg class="error-state__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 19a4.5 4.5 0 0 1-.7-8.94A6.5 6.5 0 0 1 18.2 8.2 4.8 4.8 0 0 1 18 17.8" />
      <path d="m9 14 6 6m0-6-6 6" />
    </svg>
    <p>{{ message }}</p>
    <button class="primary-button" type="button" @click="emit('retry')">
      {{ t('common.retry') }}
    </button>
  </section>
</template>

<style scoped>
.error-state {
  display: flex;
  min-height: 260px;
  padding: 32px 24px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.error-state__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  fill: none;
  stroke: var(--color-text-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.error-state p {
  max-width: 320px;
  margin: 0 0 20px;
  color: var(--color-text-muted);
  line-height: 1.5;
}
</style>
