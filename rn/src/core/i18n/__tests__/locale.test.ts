import { resolveAppLocale, toDataDragonLocale } from '@/core/i18n/locale';

describe('locale mapping', () => {
  it('maps Korean to the Data Dragon locale', () => {
    expect(resolveAppLocale('ko')).toBe('ko');
    expect(toDataDragonLocale('ko')).toBe('ko_KR');
  });

  it('falls back to Korean for unsupported locales', () => {
    expect(resolveAppLocale('en')).toBe('ko');
    expect(resolveAppLocale(null)).toBe('ko');
  });
});
