export const defaultAppLocale = 'ko' as const;
export type AppLocale = typeof defaultAppLocale;

export function toDataDragonLocale(locale: AppLocale): string {
  return locale === 'ko' ? 'ko_KR' : 'ko_KR';
}
