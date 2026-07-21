<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { appConfig } from '@/core/config/app-config'
import { ensurePatchVersion } from '@/features/champion/presentation/queries/patch-version.query'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const visibleTitle = ref('')
let cancelled = false

async function animateTitle(): Promise<void> {
  const title = t('app.splashTitle')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visibleTitle.value = title
    return
  }

  for (const character of title) {
    if (cancelled) return
    visibleTitle.value += character
    await new Promise((resolve) => setTimeout(resolve, appConfig.splashCharacterDelayMs))
  }
}

async function initialize(): Promise<void> {
  await Promise.all([animateTitle(), ensurePatchVersion()])
  if (!cancelled) {
    await router.replace({ name: 'champions' })
  }
}

onMounted(() => void initialize())
onBeforeUnmount(() => {
  cancelled = true
})
</script>

<template>
  <section class="splash-page" :aria-label="t('app.splashTitle')">
    <h1>{{ visibleTitle }}</h1>
  </section>
</template>

<style scoped>
.splash-page {
  display: grid;
  min-height: 100dvh;
  padding: calc(24px + var(--safe-top)) calc(24px + var(--safe-right))
    calc(24px + var(--safe-bottom)) calc(24px + var(--safe-left));
  place-items: center;
  background:
    radial-gradient(circle at 50% 42%, rgb(22 115 126 / 18%), transparent 38%), var(--color-surface);
}

h1 {
  margin: 0;
  color: var(--color-text);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(24px, 7vw, 34px);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
}
</style>
