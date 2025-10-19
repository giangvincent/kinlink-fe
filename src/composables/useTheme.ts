import { ref, watch } from 'vue'

const storageKey = 'kinlink-theme'
const isClient = typeof window !== 'undefined'
const prefersDark = isClient
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : false
const stored = isClient
  ? (window.localStorage.getItem(storageKey) as 'light' | 'dark' | null)
  : null

export const theme = ref<'light' | 'dark'>(stored || (prefersDark ? 'dark' : 'light'))

export function useTheme() {
  if (isClient) {
    applyTheme(theme.value)
  }

  watch(theme, (value) => {
    if (isClient) {
      applyTheme(value)
      window.localStorage.setItem(storageKey, value)
    }
  })

  return {
    theme,
    toggleTheme: () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    },
    setTheme: (value: 'light' | 'dark') => {
      theme.value = value
    }
  }
}

function applyTheme(value: 'light' | 'dark') {
  const root = document.documentElement
  if (value === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
