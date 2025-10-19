<template>
  <div class="card" role="button" @click="$emit('select', member.id)">
    <div class="flex items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
        {{ initials }}
      </div>
      <div class="space-y-1">
        <p class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ member.name }}</p>
        <p class="text-sm text-muted">{{ member.relationship }}</p>
        <p class="text-xs text-muted">{{ birthInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from '@/utils/date'

interface Member {
  id: string
  name: string
  birthDate: string
  hometown?: string
  relationship: string
}

const props = defineProps<{ member: Member }>()

const initials = computed(() => props.member.name.split(' ').map((p) => p[0]).join('').slice(0, 2))

const birthInfo = computed(() => {
  if (!props.member.birthDate) return 'Birth date unknown'
  const date = dayjs(props.member.birthDate)
  return `${date.format('DD MMM YYYY')} • ${date.fromNow(true)} old`
})
</script>
