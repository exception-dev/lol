import { describe, expect, it } from 'vitest'

import { resolveInitialLocale, toDataDragonLocale } from '@/core/i18n/locale'

describe('locale mapping', () => {
  it('maps the application locale to Data Dragon locale', () => {
    expect(toDataDragonLocale('ko')).toBe('ko_KR')
  })

  it('falls back to Korean for an unsupported browser locale', () => {
    expect(resolveInitialLocale(null, 'fr-FR')).toBe('ko')
  })
})
