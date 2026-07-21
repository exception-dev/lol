import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'splash',
      component: () => import('@/features/champion/presentation/pages/SplashPage.vue'),
    },
    {
      path: '/champions',
      name: 'champions',
      component: () => import('@/features/champion/presentation/pages/ChampionListPage.vue'),
    },
    {
      path: '/champions/:championId',
      name: 'champion-detail',
      component: () => import('@/features/champion/presentation/pages/ChampionDetailPage.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'champions' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
