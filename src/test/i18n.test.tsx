import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '@/i18n/config';

describe('i18n Configuration', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('loads English translations', () => {
    expect(i18n.language).toBe('en');
    expect(i18n.t('common.loading')).toBe('Loading...');
  });

  it('switches to Spanish', async () => {
    await i18n.changeLanguage('es');
    expect(i18n.language).toBe('es');
  });

  it('switches to Italian', async () => {
    await i18n.changeLanguage('it');
    expect(i18n.language).toBe('it');
  });

  it('switches to Russian', async () => {
    await i18n.changeLanguage('ru');
    expect(i18n.language).toBe('ru');
  });

  it('switches to French', async () => {
    await i18n.changeLanguage('fr');
    expect(i18n.language).toBe('fr');
  });

  it('falls back to English for missing keys', () => {
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('has all required translation namespaces', () => {
    const resources = i18n.options.resources;
    expect(resources).toHaveProperty('en');
    expect(resources).toHaveProperty('es');
    expect(resources).toHaveProperty('it');
    expect(resources).toHaveProperty('ru');
    expect(resources).toHaveProperty('fr');
  });
});
