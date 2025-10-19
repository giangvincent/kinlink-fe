<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('app.login') }}</h2>
      <p class="text-sm text-muted">
        {{ t('auth.needAccount') }}
        <RouterLink class="text-blue-600 hover:underline" :to="{ name: 'Register' }">
          {{ t('app.register') }}
        </RouterLink>
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="email">
          {{ t('auth.email') }}
        </label>
        <input
          id="email"
          v-model="form.email"
          autocomplete="email"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          placeholder="you@email.com"
          required
          type="email"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="password">
          {{ t('auth.password') }}
        </label>
        <input
          id="password"
          v-model="form.password"
          autocomplete="current-password"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="password"
        />
      </div>

      <BaseButton class="w-full" type="submit">
        <span v-if="loading">...</span>
        <span v-else>{{ t('app.login') }}</span>
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import BaseButton from '@/components/Base/BaseButton.vue'
import { useUserStore } from '@/store/userStore'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const userStore = useUserStore()
const { loading } = storeToRefs(userStore)

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    await userStore.login(form)
    toast.success('Welcome back!')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Login failed')
  }
}
</script>
