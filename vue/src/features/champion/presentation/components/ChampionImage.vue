<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    eager?: boolean
  }>(),
  { eager: false },
)

const { t } = useI18n({ useScope: 'global' })
const loaded = ref(false)
const failed = ref(false)

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
  },
)
</script>

<template>
  <div class="champion-image" :class="{ 'champion-image--loaded': loaded }">
    <div v-if="!loaded && !failed" class="champion-image__placeholder" aria-hidden="true"></div>
    <div v-if="failed" class="champion-image__error" role="img" :aria-label="t('error.image')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4zM4 16l4.5-4.5 3 3 2-2L20 19M15.5 9h.01" />
      </svg>
    </div>
    <img
      v-show="!failed"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>

<style scoped>
.champion-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-image-placeholder);
}

.champion-image img {
  width: 100%;
  height: 100%;
  opacity: 0;
  object-fit: cover;
  transition: opacity 180ms ease;
}

.champion-image--loaded img {
  opacity: 1;
}

.champion-image__placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    var(--color-image-placeholder) 20%,
    rgb(255 255 255 / 9%) 40%,
    var(--color-image-placeholder) 60%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.champion-image__error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.champion-image__error svg {
  width: 30px;
  fill: none;
  stroke: var(--color-text-subtle);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
</style>
