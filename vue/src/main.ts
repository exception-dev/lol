import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { queryClient } from '@/app/query/query-client'
import { i18n } from '@/core/i18n'

import App from './App.vue'
import router from './router'
import './app/styles/tokens.css'
import './app/styles/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(VueQueryPlugin, { queryClient })
app.use(router)

document.title = i18n.global.t('app.name')
app.mount('#app')
