import { createI18n } from 'vue-i18n'

import { BrowserKeyValueStorage } from '@/core/storage/key-value-storage'

import { resolveInitialLocale } from './locale'
import ko from './locales/ko.json'

const localeStorageKey = 'lol_champion_locale'
const storage = new BrowserKeyValueStorage(window.localStorage)
const initialLocale = resolveInitialLocale(storage.get(localeStorageKey), navigator.language)

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'ko',
  messages: { ko },
})

export function persistLocale(locale: string): void {
  storage.set(localeStorageKey, locale)
}
