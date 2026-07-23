import { createInstance } from 'i18next';

import ko from '@/core/i18n/locales/ko.json';

export const i18n = createInstance();

void i18n.init({
  resources: {
    ko: { translation: ko },
  },
  lng: 'ko',
  fallbackLng: 'ko',
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
});
