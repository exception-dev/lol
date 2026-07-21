<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import {
  championSkinUrl,
  championSplashUrl,
  passiveImageUrl,
  spellImageUrl,
} from '@/core/config/app-config'
import { normalizeDataDragonText } from '@/core/text/data-dragon-text'
import ChampionImage from '@/features/champion/presentation/components/ChampionImage.vue'
import ErrorState from '@/features/champion/presentation/components/ErrorState.vue'
import LoadingState from '@/features/champion/presentation/components/LoadingState.vue'
import { useChampionDetailQuery } from '@/features/champion/presentation/queries/champion.query'

const props = defineProps<{
  championId: string
}>()

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const championId = computed(() => props.championId)
const { data, error, isError, isPending, refetch } = useChampionDetailQuery(championId)

const champion = computed(() => data.value?.champion)
const patchVersion = computed(() => data.value?.patchVersion ?? '')
const visibleSkins = computed(
  () => champion.value?.skins.filter((skin) => skin.parentSkin === null) ?? [],
)
const spellLabels = ['Q', 'W', 'E', 'R'] as const
const skinScroller = ref<HTMLElement | null>(null)
const activeSkinIndex = ref(0)

let skinAnimationFrame: number | null = null
let skinResizeObserver: ResizeObserver | null = null

function goBack(): void {
  if (window.history.state?.back) {
    router.back()
  } else {
    void router.replace({ name: 'champions' })
  }
}

function spellDescription(description: string, tooltip: string): string {
  const normalizedDescription = normalizeDataDragonText(description)

  // Data Dragon 툴팁에는 {{ totaldamage }} 같은 계산식 자리표시자가 남아 있다.
  // 별도의 게임 수치 계산 없이 노출하면 깨진 문장처럼 보이므로,
  // 자리표시자가 없는 툴팁만 보조 설명으로 사용한다.
  if (/{{[^}]+}}/.test(tooltip)) {
    return normalizedDescription
  }

  const normalizedTooltip = normalizeDataDragonText(tooltip)
  return normalizedTooltip
    ? `${normalizedDescription}\n\n${normalizedTooltip}`
    : normalizedDescription
}

function updateSkinCardTransforms(scroller: HTMLElement): void {
  const cards = Array.from(scroller.querySelectorAll<HTMLElement>('.skin-card'))
  const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2
    const distance = Math.abs(viewportCenter - cardCenter)
    const distanceRatio = Math.min(distance / (scroller.clientWidth * 0.72), 1)
    const scale = 1 - distanceRatio * 0.14
    const opacity = 1 - distanceRatio * 0.45

    card.style.setProperty('--skin-scale', scale.toFixed(3))
    card.style.setProperty('--skin-opacity', opacity.toFixed(3))

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  activeSkinIndex.value = nearestIndex
}

function scheduleSkinCardUpdate(scroller = skinScroller.value): void {
  if (!scroller || skinAnimationFrame !== null) return

  skinAnimationFrame = window.requestAnimationFrame(() => {
    updateSkinCardTransforms(scroller)
    skinAnimationFrame = null
  })
}

function observeSkinScroller(scroller: HTMLElement | null): void {
  skinResizeObserver?.disconnect()
  if (!scroller) return

  skinResizeObserver?.observe(scroller)
  scheduleSkinCardUpdate(scroller)
}

watch(visibleSkins, async () => {
  await nextTick()
  scheduleSkinCardUpdate()
})

watch(skinScroller, (scroller) => observeSkinScroller(scroller))

onMounted(() => {
  skinResizeObserver = new ResizeObserver(() => scheduleSkinCardUpdate())
  observeSkinScroller(skinScroller.value)
})

onBeforeUnmount(() => {
  skinResizeObserver?.disconnect()
  if (skinAnimationFrame !== null) {
    window.cancelAnimationFrame(skinAnimationFrame)
  }
})
</script>

<template>
  <section class="detail-page">
    <header class="detail-header">
      <button type="button" :aria-label="t('champion.back')" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </button>
      <h1>{{ t('champion.detailTitle') }}</h1>
      <span aria-hidden="true"></span>
    </header>

    <LoadingState v-if="isPending" />
    <ErrorState v-else-if="isError" :error="error" @retry="refetch" />

    <article v-else-if="champion" class="detail-content">
      <div class="hero-image">
        <ChampionImage :src="championSplashUrl(champion.id)" :alt="champion.name" :eager="true" />
      </div>

      <div class="champion-copy">
        <h2>{{ champion.name }}</h2>
        <div v-if="champion.tags.length" class="role-tags">
          <span v-for="tag in champion.tags" :key="tag">{{ tag }}</span>
        </div>
        <h3 v-if="champion.title">{{ champion.title }}</h3>
        <p v-if="champion.lore" class="lore">
          {{ normalizeDataDragonText(champion.lore) }}
        </p>
      </div>

      <section v-if="champion.passive || champion.spells.length" class="skill-list">
        <article v-if="champion.passive" class="skill-row">
          <div class="skill-row__icon-column">
            <div class="skill-row__image">
              <ChampionImage
                :src="passiveImageUrl(champion.passive.image.full, patchVersion)"
                :alt="champion.passive.name"
              />
            </div>
            <span class="skill-label skill-label--passive">{{ t('champion.passive') }}</span>
          </div>
          <div class="skill-row__copy">
            <h3>{{ champion.passive.name }}</h3>
            <p>{{ normalizeDataDragonText(champion.passive.description) }}</p>
          </div>
        </article>

        <article v-for="(spell, index) in champion.spells" :key="spell.name" class="skill-row">
          <div class="skill-row__icon-column">
            <div class="skill-row__image">
              <ChampionImage
                :src="spellImageUrl(spell.image.full, patchVersion)"
                :alt="spell.name"
              />
            </div>
            <span class="skill-label">{{ spellLabels[index] ?? '' }}</span>
          </div>
          <div class="skill-row__copy">
            <h3>{{ spell.name }}</h3>
            <p>{{ spellDescription(spell.description, spell.tooltip) }}</p>
          </div>
        </article>
      </section>

      <section v-if="visibleSkins.length" class="skin-section">
        <div ref="skinScroller" class="skin-scroller" @scroll.passive="scheduleSkinCardUpdate()">
          <article
            v-for="(skin, index) in visibleSkins"
            :key="skin.id"
            class="skin-card"
            :class="{ 'skin-card--active': index === activeSkinIndex }"
            :aria-current="index === activeSkinIndex ? 'true' : undefined"
          >
            <ChampionImage :src="championSkinUrl(champion.id, skin.number)" :alt="skin.name" />
            <span>{{ skin.name }}</span>
          </article>
        </div>
      </section>
    </article>
  </section>
</template>

<style scoped>
.detail-page {
  min-height: 100dvh;
  padding-bottom: var(--safe-bottom);
}

.detail-header {
  position: sticky;
  z-index: 10;
  top: 0;
  display: grid;
  min-height: calc(56px + var(--safe-top));
  padding: var(--safe-top) var(--safe-right) 0 var(--safe-left);
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: rgb(24 24 24 / 92%);
  backdrop-filter: blur(14px);
}

.detail-header button {
  display: grid;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  place-items: center;
  background: transparent;
  cursor: pointer;
}

.detail-header svg {
  width: 26px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.detail-header h1 {
  margin: 0;
  overflow: hidden;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-image {
  aspect-ratio: 885 / 522;
}

.champion-copy {
  padding: 20px var(--page-padding) 4px;
}

.champion-copy h2 {
  margin: 0;
  font-size: 24px;
}

.role-tags {
  display: flex;
  margin-top: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.role-tags span {
  padding: 5px 11px;
  border-radius: 16px;
  background: var(--color-role);
  font-size: 12px;
  font-weight: 600;
}

.champion-copy > h3 {
  margin: 16px 0 0;
  color: var(--color-text);
  font-size: 17px;
  font-weight: 500;
}

.lore {
  margin: 10px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}

.skill-list {
  padding: 4px var(--page-padding) 0;
}

.skill-row {
  display: grid;
  padding: 14px 0;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 12px;
}

.skill-row + .skill-row {
  border-top: 1px solid var(--color-border);
}

.skill-row__icon-column {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.skill-row__image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 5px;
}

.skill-label {
  display: grid;
  min-width: 22px;
  min-height: 22px;
  padding: 2px 6px;
  margin-top: 8px;
  border-radius: 12px;
  place-items: center;
  background: var(--color-skill);
  font-size: 10px;
  font-weight: 700;
}

.skill-label--passive {
  min-width: 48px;
}

.skill-row__copy h3 {
  margin: 0;
  font-size: 15px;
}

.skill-row__copy p {
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-line;
}

.skin-section {
  padding: 18px 0 28px;
  overflow: hidden;
}

.skin-scroller {
  display: flex;
  padding: 0 14%;
  overflow-x: auto;
  scroll-padding: 14%;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  gap: 12px;
  overscroll-behavior-inline: contain;
}

.skin-scroller::-webkit-scrollbar {
  display: none;
}

.skin-card {
  --skin-scale: 0.86;
  --skin-opacity: 0.55;

  position: relative;
  width: 72%;
  height: min(500px, 118vw);
  border-radius: 12px;
  overflow: hidden;
  flex: 0 0 auto;
  scroll-snap-align: center;
  background: var(--color-card);
  box-shadow: 0 8px 24px rgb(0 0 0 / 35%);
  opacity: var(--skin-opacity);
  transform: scale(var(--skin-scale));
  transform-origin: center;
  transition:
    opacity 100ms linear,
    transform 100ms linear;
  will-change: transform, opacity;
}

.skin-card--active {
  z-index: 1;
}

.skin-card > span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px 8px;
  background: rgb(0 0 0 / 62%);
  font-size: 12px;
  text-align: center;
  backdrop-filter: blur(4px);
}
</style>
