import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import ko from '@/core/i18n/locales/ko.json';
import { resolveAppLocale } from '@/core/i18n/locale';

const deviceLocale = resolveAppLocale(getLocales()[0]?.languageCode);
const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
  },
  lng: deviceLocale,
  fallbackLng: 'ko',
  supportedLngs: ['ko'],
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export { i18n };
