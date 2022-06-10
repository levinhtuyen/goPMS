import { useI18n as useVueI18n } from 'vue-i18n';
import type { TLocale, TMessageSchema } from '~/plugins/i18n';

/**
 * This extends `useI18n` of the `vue-i18n`. This provides the following.
 * - Type of the messages and the locales.
 * - Function `toggleLocale`
 */
export const useI18n = () => {
  const i18n = useVueI18n<[TMessageSchema], TLocale>();
  const toggleLocale = () => {
    (i18n.locale as any).value = localStorage.getItem('language') ?? 'en-US';
  };

  return { ...i18n, toggleLocale };
};
