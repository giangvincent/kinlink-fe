<template>
  <div class="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <img alt="KinLink" class="h-8 w-8" src="@/assets/logo.svg" />
          KinLink
        </RouterLink>
        <div class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          <RouterLink class="hover:text-slate-900 dark:hover:text-white" to="/">{{ t('navigation.home') }}</RouterLink>
          <RouterLink class="hover:text-slate-900 dark:hover:text-white" to="/dashboard">{{
            t('navigation.dashboard')
          }}</RouterLink>
          <RouterLink class="hover:text-slate-900 dark:hover:text-white" to="/family-tree">{{
            t('navigation.familyTree')
          }}</RouterLink>
          <RouterLink class="hover:text-slate-900 dark:hover:text-white" to="/members">{{
            t('navigation.members')
          }}</RouterLink>
          <RouterLink class="hover:text-slate-900 dark:hover:text-white" to="/settings">{{
            t('navigation.settings')
          }}</RouterLink>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium uppercase text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="switchLanguage"
          >
            {{ locale === 'en' ? 'VI' : 'EN' }}
          </button>
          <button
            class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="toggleTheme"
          >
            <span class="sr-only">Toggle theme</span>
            <span v-if="theme === 'dark'">🌙</span>
            <span v-else>☀️</span>
          </button>
          <BaseButton v-if="!isAuthenticated" :variant="'primary'" @click="goToLogin">
            {{ t('app.login') }}
          </BaseButton>
          <BaseButton v-else variant="secondary" @click="logout">
            {{ t('navigation.logout') }}
          </BaseButton>
        </div>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <slot />
    </main>

    <footer class="border-t border-slate-200 py-6 text-center text-sm text-muted dark:border-slate-800">
      © {{ new Date().getFullYear() }} KinLink. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/Base/BaseButton.vue'
import { useTheme } from '@/composables/useTheme'
import { setLocale } from '@/plugins/i18n'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const router = useRouter()
const { isAuthenticated } = storeToRefs(userStore)
const { t, locale } = useI18n()
const { theme, toggleTheme } = useTheme()

const switchLanguage = () => {
  const next = locale.value === 'en' ? 'vi' : 'en'
  setLocale(next as 'en' | 'vi')
  locale.value = next
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}

const logout = () => {
  userStore.logout()
  router.push({ name: 'Home' })
}
</script>
