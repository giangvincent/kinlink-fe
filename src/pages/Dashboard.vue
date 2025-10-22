<template>
  <div class="space-y-8">
    <section class="card">
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ t('dashboard.welcome', { name: userName }) }}
          </h2>
          <p class="text-muted">
            Stay in sync with family milestones, upcoming anniversaries, and invitations.
          </p>
        </div>
        <div class="flex gap-4">
          <BaseButton @click="router.push({ name: 'FamilyTree' })">See family tree</BaseButton>
          <BaseButton variant="secondary" @click="router.push({ name: 'Members' })">
            Manage members
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-3">
      <div class="card">
        <p class="text-sm text-muted">{{ t('dashboard.members') }}</p>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {{ stats.totalMembers }}
        </p>
      </div>
      <div class="card">
        <p class="text-sm text-muted">Generations</p>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {{ stats.generations }}
        </p>
      </div>
      <div class="card">
        <p class="text-sm text-muted">{{ t('dashboard.events') }}</p>
        <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li v-for="event in stats.upcomingEvents" :key="event.id" class="flex items-center justify-between">
            <span>{{ event.title }}</span>
            <span>{{ formatDate(event.date) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="card">
      <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {{ t('dashboard.quickActions') }}
      </h3>
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="action in quickActions" :key="action.title" class="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <h4 class="font-semibold text-slate-900 dark:text-slate-100">{{ action.title }}</h4>
          <p class="mt-1 text-sm text-muted">{{ action.description }}</p>
          <BaseButton class="mt-4" variant="ghost" @click="router.push(action.route)">
            {{ action.cta }}
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Family feed</h3>
        <BaseButton variant="ghost" @click="router.push({ name: 'Members' })">Manage albums</BaseButton>
      </div>
      <PostList />
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/Base/BaseButton.vue'
import PostList from '@/components/Posts/PostList.vue'
import dayjs from '@/utils/date'
import { useFamilyStore } from '@/store/familyStore'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const { t } = useI18n()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const { stats, members } = storeToRefs(familyStore)
const { user } = storeToRefs(userStore)

const userName = computed(() => user.value?.name || 'Ancestor')

const quickActions = [
  {
    title: 'Invite relatives',
    description: 'Send access links to family members to join your private tree.',
    cta: 'Invite',
    route: { name: 'Members' }
  },
  {
    title: 'Record an event',
    description: 'Add upcoming weddings, birthdays, or memorials to keep everyone informed.',
    cta: 'Add event',
    route: { name: 'FamilyTree' }
  },
  {
    title: 'Update profiles',
    description: 'Review member information to ensure your family history is accurate.',
    cta: 'Review',
    route: { name: 'Members' }
  }
]

const formatDate = (date: string) => dayjs(date).format('DD MMM')

// gallery removed; replaced by PostList feed

onMounted(() => {
  if (!members.value.length) {
    familyStore.loadFamily()
  }
})
</script>
