import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import vi from '@/locales/vi.json'

const defaultLocale = 'en'
const storedLocale =
  typeof window !== 'undefined' ? window.localStorage.getItem('kinlink-locale') : null
const locale = storedLocale || defaultLocale

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    vi
  }
})

export function setLocale(newLocale: 'en' | 'vi') {
  i18n.global.locale.value = newLocale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('kinlink-locale', newLocale)
  }
}
