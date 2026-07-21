import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { NetworkError } from '@/core/errors/app-error'
import { i18n } from '@/core/i18n'
import ErrorState from '@/features/champion/presentation/components/ErrorState.vue'

describe('ErrorState', () => {
  it('shows a localized network message and emits retry', async () => {
    const wrapper = mount(ErrorState, {
      props: { error: new NetworkError() },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('네트워크 연결을 확인한 후 다시 시도해 주세요.')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
