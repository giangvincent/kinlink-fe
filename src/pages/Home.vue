<template>
  <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-24 text-white shadow-xl">
    <div class="max-w-3xl space-y-6">
      <p class="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-xs uppercase tracking-widest">
        Private beta
      </p>
      <h1 class="text-4xl font-bold md:text-5xl">{{ t('app.tagline') }}</h1>
      <p class="text-lg text-white/90 md:max-w-2xl">
        Safely document your lineage, celebrate family milestones, and invite relatives to collaborate.
      </p>
      <div class="flex flex-wrap gap-4">
        <BaseButton @click="goToApp">{{ t('app.cta') }}</BaseButton>
        <BaseButton variant="secondary" @click="goToLogin">{{ t('app.login') }}</BaseButton>
      </div>
    </div>
    <img
      alt="Decorative family tree"
      class="pointer-events-none absolute -right-10 bottom-0 hidden h-72 drop-shadow-2xl md:block"
      src="https://dummyimage.com/280x320/60a5fa/ffffff&text=Family+Tree"
    />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/Base/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()

const goToApp = () => {
  router.push({ name: 'Dashboard' })
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}
</script>
