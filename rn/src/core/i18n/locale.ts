export const supportedAppLocales = ['ko'] as const;

export type AppLocale = (typeof supportedAppLocales)[number];

export const defaultAppLocale: AppLocale = 'ko';

export function resolveAppLocale(languageCode: string | null | undefined): AppLocale {
  return languageCode === 'ko' ? 'ko' : defaultAppLocale;
}

export function toDataDragonLocale(locale: AppLocale): string {
  const localeMap: Record<AppLocale, string> = {
    ko: 'ko_KR',
  };
  return localeMap[locale];
}
