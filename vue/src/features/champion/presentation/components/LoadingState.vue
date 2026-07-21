<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="loading-state" role="status" aria-live="polite">
    <span class="loading-state__spinner" aria-hidden="true"></span>
    <span class="sr-only">{{ t('common.loading') }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: grid;
  min-height: 240px;
  place-items: center;
}

.loading-state__spinner {
  width: 38px;
  height: 38px;
  border: 3px solid rgb(255 255 255 / 18%);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
