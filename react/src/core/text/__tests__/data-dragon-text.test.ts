import { describe, expect, it } from 'vitest';

import { normalizeDataDragonText } from '@/core/text/data-dragon-text';

describe('normalizeDataDragonText', () => {
  it('converts Data Dragon markup to readable plain text', () => {
    expect(normalizeDataDragonText('<b>마법 피해</b><br>100 &amp; 20')).toBe('마법 피해\n100 & 20');
  });
});
