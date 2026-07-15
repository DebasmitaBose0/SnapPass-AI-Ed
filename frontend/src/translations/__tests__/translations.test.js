import { describe, it, expect } from 'vitest';
import { en } from '../en.js';
import { hi } from '../hi.js';
import { translations } from '../translations.js';

describe('translations structure', () => {
  it('exports en with all expected keys', () => {
    expect(en).toBeDefined();
    expect(typeof en.home).toBe('string');
    expect(en.uploadPhoto).toBe('Upload Your Photo');
  });

  it('exports hi with all expected keys', () => {
    expect(hi).toBeDefined();
    expect(typeof hi.home).toBe('string');
    expect(hi.uploadPhoto).toBe('अपनी फोटो अपलोड करें');
  });

  it('combines en and hi in translations', () => {
    expect(translations.en).toBe(en);
    expect(translations.hi).toBe(hi);
  });

  it('has matching keys across locales', () => {
    const enKeys = Object.keys(en).sort();
    const hiKeys = Object.keys(hi).sort();
    expect(enKeys).toEqual(hiKeys);
  });

  it('has no missing translations', () => {
    const enKeys = Object.keys(en);
    for (const key of enKeys) {
      expect(hi[key]).toBeDefined();
      expect(hi[key]).not.toBe('');
    }
  });
});
