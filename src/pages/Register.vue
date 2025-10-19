<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('app.register') }}</h2>
      <p class="text-sm text-muted">
        {{ t('auth.haveAccount') }}
        <RouterLink class="text-blue-600 hover:underline" :to="{ name: 'Login' }">
          {{ t('app.login') }}
        </RouterLink>
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="name">
          Name
        </label>
        <input
          id="name"
          v-model="form.name"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          placeholder="Jane Doe"
          required
          type="text"
        />
      </div>

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
          autocomplete="new-password"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="password"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="confirm">
          {{ t('auth.confirmPassword') }}
        </label>
        <input
          id="confirm"
          v-model="form.confirmPassword"
          autocomplete="new-password"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="password"
        />
      </div>

      <BaseButton class="w-full" type="submit">
        <span v-if="loading">...</span>
        <span v-else>{{ t('app.register') }}</span>
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import BaseButton from '@/components/Base/BaseButton.vue'
import { useUserStore } from '@/store/userStore'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()
const { loading } = storeToRefs(userStore)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  try {
    await userStore.register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    toast.success('Account ready!')
    router.push({ name: 'Dashboard' })
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Registration failed')
  }
}
</script>
