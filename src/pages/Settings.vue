<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <p class="text-sm text-muted">Manage profile, language, and notification preferences.</p>
    </header>

    <div class="grid gap-6 md:grid-cols-[240px,1fr]">
      <div class="card">
        <nav class="space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'w-full rounded-lg px-3 py-2 text-left text-sm font-medium',
              currentTab === tab.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            @click="currentTab = tab.id"
          >
            {{ tab.title }}
          </button>
        </nav>
      </div>

      <div class="card" v-if="currentTab === 'profile'">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
        <p class="text-sm text-muted">Coming soon: Update name, avatar, and contact details.</p>
      </div>

      <div class="card" v-else-if="currentTab === 'preferences'">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
        <div class="mt-4 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Language</span>
            <select
              v-model="selectedLocale"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              @change="updateLocale"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</span>
            <BaseButton variant="secondary" @click="toggleTheme">
              {{ theme === 'dark' ? 'Switch to light' : 'Switch to dark' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="card" v-else-if="currentTab === 'notifications'">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
        <p class="text-sm text-muted">Control reminders for birthdays, anniversaries, and reunion plans.</p>
      </div>

      <div class="card" v-else>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Privacy</h2>
        <p class="text-sm text-muted">Review how your family data is secured and shared.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/Base/BaseButton.vue'
import { useTheme } from '@/composables/useTheme'
import { setLocale } from '@/plugins/i18n'

type TabId = 'profile' | 'preferences' | 'notifications' | 'privacy'

const tabs: Array<{ id: TabId; title: string }> = [
  { id: 'profile', title: 'Profile' },
  { id: 'preferences', title: 'Preferences' },
  { id: 'notifications', title: 'Notifications' },
  { id: 'privacy', title: 'Privacy' }
]

const currentTab = ref<TabId>('profile')

const { locale } = useI18n()
const selectedLocale = ref(locale.value as 'en' | 'vi')
const { theme, toggleTheme } = useTheme()

const updateLocale = () => {
  setLocale(selectedLocale.value)
  locale.value = selectedLocale.value
}
</script>
