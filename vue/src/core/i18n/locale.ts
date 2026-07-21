export const supportedAppLocales = ['ko'] as const

export type AppLocale = (typeof supportedAppLocales)[number]

export const defaultAppLocale: AppLocale = 'ko'

export function isAppLocale(value: string): value is AppLocale {
  return supportedAppLocales.includes(value as AppLocale)
}

export function resolveInitialLocale(
  storedLocale: string | null,
  browserLocale: string,
): AppLocale {
  if (storedLocale && isAppLocale(storedLocale)) {
    return storedLocale
  }

  const language = browserLocale.split('-')[0] ?? ''
  return isAppLocale(language) ? language : defaultAppLocale
}

export function toDataDragonLocale(locale: AppLocale): string {
  const locales: Record<AppLocale, string> = {
    ko: 'ko_KR',
  }
  return locales[locale]
}
